import React, {useRef, useState} from 'react';
import {Box, Button, Divider, Flex, Icon, Image, Spinner, Stack, Text} from "@chakra-ui/react";
import {HiOutlineDotsHorizontal} from "react-icons/hi";
import {RiCakeLine} from "react-icons/ri";
import moment from "moment";
import Link from "next/link";
import {useRouter} from "next/router";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth, firestore, storage} from "@/firebase/clientApp";
import useSelectFile from "@/hooks/useSelectFile";
import {FaReddit} from "react-icons/fa";
import {getDownloadURL, ref, uploadString} from "firebase/storage";
import {doc, updateDoc} from "firebase/firestore";
import {useSetRecoilState} from "recoil";
import {communityState} from "@/atoms/communitiesAtom";


const About = ({communityData}) => {
    const [user] = useAuthState(auth);
    const selectedFileRef = useRef(null);
    const {selectedFile, setSelectedFile, onSelectFile} = useSelectFile();

    const [uploadingImage, setUploadingImage] = useState(false);
    const setCommunityStateValue = useSetRecoilState(communityState);

    const onUpdateImage = async () => {
        if (!selectedFile) return;
        setUploadingImage(true);
        try {
            const imageRef = ref(storage,`communities/${communityData.id}/image`);

            await uploadString(imageRef,selectedFile,'data_url');

            const downloadURL = await getDownloadURL(imageRef);

            await updateDoc(doc(firestore,'communities',communityData.id),{
                imageURL:downloadURL
            });

            setCommunityStateValue(prev=>({
                ...prev,
                currentCommunity:{
                    ...prev.currentCommunity,
                    imageURL: downloadURL
                }

            }))

            setUploadingImage(false);
        } catch (error) {
            console.log('onUpdateImage error', error);
        }



    };
    return (
        <Box posittion='sticky' top='14px'>
            <Flex
                justify='space-between'
                align='center'
                bg='blue.400'
                color='white'
                p={3}
                borderRadius='4px 4px 0 0'
            >
                <Text fontSize='10pt' fontWeight={700}>About Community</Text>
                <Icon as={HiOutlineDotsHorizontal} cursor='pointer'/>
            </Flex>
            <Flex
                direction='column'
                p={3}
                bg='white'
                border='0 0 4px 4px'
            >
                <Stack spacing={2}>
                    <Flex
                        width='100%'
                        p={2}
                        fontSize='10pt'
                        fontWeight={600}
                    >
                        <Flex direction='column' flexGrow={1}>
                            <Text>{communityData?.numberOfMembers?.toLocaleString()}</Text>
                            <Text>Members</Text>
                        </Flex>
                        <Flex direction='column' flexGrow={1}>
                            <Text>1</Text>
                            <Text>Online</Text>
                        </Flex>
                    </Flex>
                    <Divider/>
                    <Flex
                        width='100%'
                        align='center'
                        fontSize='10pt'
                        p={1}
                        fontWeight={500}
                    >
                        <Icon as={RiCakeLine} fontSize={18} mr={2}/>
                        {
                            communityData.createdAt && (
                                <Text>Created{" "}{moment(new Date(communityData.createdAt.seconds * 1000)).format('MMM DD, YYYY')}</Text>

                            )
                        }
                    </Flex>

                    <Link href={`/r/${communityData.id}/submit`}>
                        <Button mt={3} height='30px' width='100%'>Create Post</Button>
                    </Link>
                    {
                        user?.uid === communityData.creatorId && (
                            <>
                                <Divider/>
                                <Stack spacing={1} fontSize='10pt'>
                                    <Text fontWeight={600}>Admin</Text>
                                    <Flex align='center' justify='space-between'>
                                        <Text
                                            cursor='pointer'
                                            color='blue.500'
                                            _hover={{textDecoration: 'underline'}}
                                            onClick={() => selectedFileRef.current?.click()}
                                        >
                                            Change Image
                                        </Text>
                                        {
                                            communityData.imageURL || selectedFile ? (
                                                <Image
                                                    src={selectedFile || communityData.imageURL}
                                                    alt='Community Image'
                                                    borderRadius="full"
                                                    boxSize="40px"
                                                />
                                            ) : (
                                                <Icon as={FaReddit} fontSize={40} color='brand.100' mr={2}/>
                                            )
                                        }
                                    </Flex>
                                    {selectedFile && (

                                        uploadingImage ? (
                                            <Spinner/>
                                        ) : (
                                            <Text
                                                cursor='pointer'
                                                onClick={onUpdateImage}
                                            >
                                                Save Changes
                                            </Text>
                                        )

                                    )}
                                    <input
                                        id='file-upload'
                                        accept='image/x-png,image/gif,image/jpeg'
                                        type="file"
                                        ref={selectedFileRef}
                                        hidden
                                        onChange={onSelectFile}
                                    />

                                </Stack>
                            </>
                        )
                    }
                </Stack>

            </Flex>
        </Box>
    );
};

export default About;