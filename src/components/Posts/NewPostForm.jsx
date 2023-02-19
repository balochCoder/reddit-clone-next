import React, {useState} from 'react';
import {Alert, Text, AlertIcon, Flex} from "@chakra-ui/react";
import {BiPoll} from "react-icons/bi";
import {BsLink45Deg, BsMic} from "react-icons/bs";
import {AiFillCloseCircle} from "react-icons/ai";
import {IoDocumentText, IoImageOutline} from "react-icons/io5";
import TabItem from "@/components/Posts/TabItem";
import TextInputs from "@/components/Posts/PostForm/TextInputs";
import ImageUpload from "@/components/Posts/PostForm/ImageUpload";
import {useRouter} from "next/router";
import {addDoc, collection, serverTimestamp, updateDoc} from "firebase/firestore";
import {ref, uploadString, getDownloadURL} from 'firebase/storage'
import {firestore, storage} from "@/firebase/clientApp";


const formTabs = [
    {
        title: "Post",
        icon: IoDocumentText
    },
    {
        title: "Images & Video",
        icon: IoImageOutline
    },
    {
        title: "Link",
        icon: BsLink45Deg
    },
    {
        title: "Poll",
        icon: BiPoll
    },
    {
        title: "Talk",
        icon: BsMic
    }
]

const NewPostForm = ({user}) => {
    const router = useRouter();
    const [selectedTab, setSelectedTab] = useState(formTabs[0].title);
    const [textInputs, setTextInputs] = useState({
        title: "",
        body: ""
    });

    const [selectedFile, setSelectedFile] = useState("");
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)

    const handleCreatePost = async () => {
        const {communityId} = router.query;
        const newPost = {
            communityId,
            creatorId: user?.uid,
            creatorDisplayName: user.email.split('@')[0],
            title: textInputs.title,
            body: textInputs.body,
            numberOfComments: 0,
            voteStatus: 0,
            createdAt: serverTimestamp()
        };
        setLoading(true)
        try {
            const postDocRef = await addDoc(collection(firestore, 'posts'), newPost);
            if (selectedFile) {
                const imageRef = ref(storage, `posts/${postDocRef.id}/image`);
                await uploadString(imageRef, selectedFile, 'data_url');

                const downloadURL = await getDownloadURL(imageRef);

                await updateDoc(postDocRef, {
                    imageURL: downloadURL
                })

            }

            router.back();

        } catch (error) {
            console.log("handleCreatePost error", error.message);
            setError(true)
        }

        setLoading(false);

    }

    const onSelectImage = (e) => {
        const reader = new FileReader();
        if (e.target.files?.[0]) {
            reader.readAsDataURL(e.target.files[0]);
        }

        reader.onload = (readerEvent) => {
            if (readerEvent.target?.result) {
                setSelectedFile(readerEvent.target?.result);
            }
        }
    }
    const onTextChange = (e) => {
        const {target: {name, value}} = e;
        setTextInputs(prev => ({
            ...prev,
            [name]: value
        }))
    }
    return (
        <Flex
            direction='column'
            bg='white'
            borderRadius={4}
            mt={2}
        >
            <Flex
                width='100%'
            >
                {
                    formTabs.map((item) => (
                        <TabItem
                            key={item.title}
                            item={item}
                            selected={item.title === selectedTab}
                            setSelectedTab={setSelectedTab}
                        />
                    ))
                }

            </Flex>

            <Flex p={4}>
                {
                    selectedTab === "Post" && (
                        <TextInputs
                            textInputs={textInputs}
                            handleCreatePost={handleCreatePost}
                            onChange={onTextChange}
                            loading={loading}
                        />
                    )
                }
                {
                    selectedTab === "Images & Video" && (
                        <ImageUpload
                            selectedFile={selectedFile}
                            setSelectedFile={setSelectedFile}
                            setSelectedTab={setSelectedTab}
                            onSelectImage={onSelectImage}
                        />
                    )
                }
            </Flex>
            {
                error && (
                    <Alert status='error'>
                        <AlertIcon/>
                        <Text>
                            Your Chakra experience may be degraded.
                        </Text>
                    </Alert>
                )
            }
        </Flex>
    );
};

export default NewPostForm;