import React, {useEffect, useState} from 'react';
import {Box, Flex} from "@chakra-ui/react";
import CommentInput from "@/components/Posts/Comments/CommentInput";
import {useAuthState} from "react-firebase-hooks/auth";
import {collection, doc, increment, serverTimestamp, writeBatch} from "firebase/firestore";
import {firestore} from "@/firebase/clientApp";
import {useSetRecoilState} from "recoil";
import {postState} from "@/atoms/postsAtom";

const Comments = ({user, selectedPost, communityId}) => {


    const [commentText, setCommentText] = useState('');
    const [comments, setComments] = useState([]);

    const [fetchLoading, setFetchLoading] = useState(false);
    const [createLoading, setCreateLoading] = useState(false);

 const setPostState = useSetRecoilState(postState)
    const onCreateComment = async (commentText) => {
        setCreateLoading(true);
        try {
            const batch = writeBatch(firestore);

            const commentDocRef = doc(collection(firestore, 'comments'));

            const newComment = {
                id: commentDocRef.id,
                creatorId: user.uid,
                creatorDisplayText: user.email.split('@')[0],
                communityId: selectedPost?.id,
                postTitle: selectedPost?.title,
                text: commentText,
                createdAt: serverTimestamp()
            };

            batch.set(commentDocRef, newComment);

            const postDocRef = doc(firestore, 'posts', selectedPost?.id);

            batch.update(postDocRef, {
                numberOfComments: increment(1)
            })

            await batch.commit();

            setCommentText('');

            setComments(prev => [newComment, ...prev]);

            setPostState(prev=>({
                ...prev,
                selectedPost: {
                    ...prev.selectedPost,
                    numberOfComments: prev.selectedPost?.numberOfComments + 1
                }
            }))

        } catch (error) {
            console.log('onCreateComment error', error)
        }
        setCreateLoading(false);
    };

    const onDeleteComment = async (comment) => {
    };

    const getPostComments = async () => {
    };

    useEffect(() => {
        getPostComments();
    }, []);
    return (
        <Box bg='white' borderRadius='0 0 4px 4px' p={2}>
            <Flex
                direction='column'
                pl={10}
                pr={4}
                mb={6}
                fontSize='10pt'
                width='100%'
            >
                <CommentInput
                    commentText={commentText}
                    setCommentText={setCommentText}
                    createLoading={createLoading}
                    onCreateComment={onCreateComment}
                    user={user}
                />
            </Flex>
        </Box>
    );
};

export default Comments;