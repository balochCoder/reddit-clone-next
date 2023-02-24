import React, {useEffect, useState} from 'react';
import {useAuthState} from "react-firebase-hooks/auth";
import {auth, firestore} from "@/firebase/clientApp";
import {query, collection, where, orderBy, getDocs} from "firebase/firestore";
import usePosts from "@/hooks/usePosts";
import PostItem from "@/components/Posts/PostItem";
import {Stack} from "@chakra-ui/react";
import PostLoader from "@/components/Posts/PostLoader";

const Posts = ({communityData}) => {

    const [user] = useAuthState(auth);
    const [loading, setLoading] = useState(false);

    const {postStateValue, setPostStateValue, onVote, onSelectPost, onDeletePost} = usePosts();
    const getPosts = async () => {
        try {
            setLoading(true)
            const postsQuery = query(
                collection(firestore, 'posts'),
                where('communityId', '==', communityData.id),
                orderBy('createdAt', 'desc')
            );

            const postDocs = await getDocs(postsQuery);
            const posts = postDocs.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setPostStateValue(prev => ({
                ...prev,
                posts: posts
            }))
            setLoading(false)
            console.log('posts', posts)
        } catch (err) {
            console.log('getPosts error', err.message);
        }
    }

    useEffect(() => {
        getPosts();
    }, [communityData])
    return (
        <>
            {
                loading ? (
                    <PostLoader/>
                ) : (
                    <Stack>
                        {
                            postStateValue.posts.map(post => (
                                <PostItem
                                    key={post.id}
                                    post={post}
                                    userIsCreator={user?.uid === post.creatorId}
                                    userVoteValue={postStateValue.postVotes.find(vote => vote.postId === post.id)?.voteValue}
                                    onVote={onVote}
                                    onSelectedPost={onSelectPost}
                                    onDeletePost={onDeletePost}
                                />
                            ))
                        }
                    </Stack>
                )
            }
        </>
    );
};

export default Posts;