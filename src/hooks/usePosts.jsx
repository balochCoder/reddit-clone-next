import React from 'react';
import {useRecoilState} from "recoil";
import {postState} from "@/atoms/postsAtom";
import {firestore, storage} from "@/firebase/clientApp";
import {ref, deleteObject} from "firebase/storage";
import {doc,deleteDoc} from "firebase/firestore";


const UsePosts = () => {

    const [postStateValue, setPostStateValue] = useRecoilState(postState);

    const onVote = async () => {
    }
    const onSelectPost = () => {
    }
    const onDeletePost = async (post) => {
        try {

            if (post.imageURL) {
                const imageRef = ref(storage, `posts/${post.id}/image`);

                await deleteObject(imageRef)
            }

            const postDocRef = doc(firestore,'posts',post.id);

            await deleteDoc(postDocRef)

            setPostStateValue(prev=>({
                ...prev,
                posts: prev.posts.filter(item=>item.id !== post.id)
            }));

            return true;

        } catch (error) {
            console.log('onDeletePost error', error.message)
            return false;
        }

    }
    return {
        postStateValue,
        setPostStateValue,
        onVote,
        onSelectPost,
        onDeletePost
    };
};

export default UsePosts;