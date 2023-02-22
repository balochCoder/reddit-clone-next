import React, {useEffect} from 'react';
import PageContent from "@/components/Layout/PageContent";
import PostItem from "@/components/Posts/PostItem";
import usePosts from "@/hooks/usePosts";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth, firestore} from "@/firebase/clientApp";
import {useRouter} from "next/router";
import {doc, getDoc} from "firebase/firestore";
import About from "@/components/Community/About";
import useCommunityData from "@/hooks/useCommunityData";

const PostPage = () => {
    const [user] = useAuthState(auth);
    const {postStateValue, setPostStateValue, onDeletePost, onVote} = usePosts();
    const router = useRouter();

    const {communityStateValue} = useCommunityData();
    const fetchPost = async (postId) => {
            try {
                const postDocRef = doc(firestore,'posts',postId);

                const postDoc = await getDoc(postDocRef);

                setPostStateValue(prev=>({
                    ...prev,
                    selectedPost: {id:postDoc.id,...postDoc.data()}
                }))
            }catch (error){
                console.log('fetchPost error', error)
            }
    };

    useEffect(() => {
        const {pid} = router.query;
          if (pid && !postStateValue.selectedPost){
              fetchPost(pid)
          }
    }, [router.query,postStateValue.selectedPost]);
    return (
        <PageContent>
            <>
                {
                    postStateValue.selectedPost && (
                        <PostItem
                            post={postStateValue.selectedPost}
                            onVote={onVote}
                            onDeletePost={onDeletePost}
                            userVoteValue={postStateValue.postVotes.find(vote => vote.postId === postStateValue.selectedPost?.id)?.voteValue}
                            userIsCreator={user?.uid === postStateValue.selectedPost?.creatorId}
                        />
                    )
                }
            </>
            <>
                {
                    communityStateValue.currentCommunity && (
                        <About communityData={communityStateValue.currentCommunity}/>
                    )
                }
            </>
        </PageContent>
    );
};

export default PostPage;