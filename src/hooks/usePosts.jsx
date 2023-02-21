import React, {useEffect} from 'react';
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {postState} from "@/atoms/postsAtom";
import {auth, firestore, storage} from "@/firebase/clientApp";
import {ref, deleteObject} from "firebase/storage";
import {
    doc,
    deleteDoc,
    writeBatch,
    collection,
    query,
    where,
    getDocs
} from "firebase/firestore";
import {useAuthState} from "react-firebase-hooks/auth";
import communityId from "@/pages/r/[communityId]";
import {communityState} from "@/atoms/communitiesAtom";
import {authModalState} from "@/atoms/authModalAtom";
import {useRouter} from "next/router";


const UsePosts = () => {
    const [user] = useAuthState(auth);
    const [postStateValue, setPostStateValue] = useRecoilState(postState);
    const currentCommunity = useRecoilValue(communityState).currentCommunity;
    const setAuthModalState = useSetRecoilState(authModalState);

    const router = useRouter();
    const onVote = async (event,post, vote, communityId) => {
        //check for user => open model
        event.stopPropagation();
        if (!user?.uid) {
            setAuthModalState({open: true, view: 'login'});
            return;
        }
        try {
            const {voteStatus} = post;

            const existingVote = postStateValue.postVotes.find(vote => vote.postId === post.id);

            const batch = writeBatch(firestore);

            const updatedPost = {...post};
            const updatedPosts = [...postStateValue.posts];
            let updatedPostVotes = [...postStateValue.postVotes];
            let voteChange = vote;


            if (!existingVote) {

                //    Crete new post vote document
                const postVoteRef = doc(collection(firestore, `users/${user?.uid}/postVotes`))
                const newVote = {
                    id: postVoteRef.id,
                    postId: post.id,
                    communityId,
                    voteValue: vote
                };

                batch.set(postVoteRef, newVote);
                //    add/subtract to/from vote status

                updatedPost.voteStatus = voteStatus + vote;
                updatedPostVotes = [...updatedPostVotes, newVote];
            }
            //    Existing Vote - they voted the post before
            else {

                const postVoteRef = doc(firestore, `users/${user?.uid}/postVotes/${existingVote.id}`)
                //    Removing their vote (up=>neutral OR down => neutral)
                if (existingVote.voteValue === vote) {
                    // add/subtract to/from vote status

                    updatedPost.voteStatus = voteStatus - vote;
                    updatedPostVotes = updatedPostVotes.filter(vote => vote.id !== existingVote.id);

                    // deleting the postVote document
                    batch.delete(postVoteRef);

                    voteChange *= -1;
                }
                //    Flipping their vote (up to down OR down to up)
                else {
                    // add/subtract 2 to/from vote status
                    updatedPost.voteStatus = voteStatus + 2 * vote;

                    const voteIndex = postStateValue.postVotes.findIndex(vote => vote.id === existingVote.id);

                    updatedPostVotes[voteIndex] = {
                        ...existingVote,
                        voteValue: vote
                    };
                    // updating the existing postVote document

                    batch.update(postVoteRef, {
                        voteValue: vote
                    });
                    voteChange = 2 * vote;
                }
            }
            const postIndex = postStateValue.posts.findIndex(item => item.id === post.id);
            updatedPosts[postIndex] = updatedPost;
            setPostStateValue(prev => ({
                ...prev,
                posts: updatedPosts,
                postVotes: updatedPostVotes
            }));

            if (postStateValue.selectedPost){
                setPostStateValue(prev => ({
                    ...prev,
                   selectedPost: updatedPost
                }));
            }

            const postRef = doc(firestore, 'posts', post.id);

            batch.update(postRef, {
                voteStatus: voteStatus + voteChange
            });
            await batch.commit();
        } catch (error) {
            console.log('onVote error', error)
        }

    }
    const onSelectPost = (post) => {
        setPostStateValue(prev=>({
            ...prev,
            selectedPost: post
        }));
        router.push(`/r/${post.communityId}/comments/${post.id}`)
    }
    const onDeletePost = async (post) => {
        try {

            if (post.imageURL) {
                const imageRef = ref(storage, `posts/${post.id}/image`);

                await deleteObject(imageRef)
            }

            const postDocRef = doc(firestore, 'posts', post.id);

            await deleteDoc(postDocRef)

            setPostStateValue(prev => ({
                ...prev,
                posts: prev.posts.filter(item => item.id !== post.id)
            }));

            return true;

        } catch (error) {
            console.log('onDeletePost error', error.message)
            return false;
        }

    }

    const getCommunityPostVotes = async (communityId) => {
        const postVotesQuery = query(collection(firestore, 'users', `${user?.uid}/postVotes`), where('communityId', "==", communityId));

        const postVoteDocs = await getDocs(postVotesQuery);

        const postVotes = postVoteDocs.docs.map(doc => ({id: doc.id, ...doc.data()}));
        setPostStateValue(prev => ({
            ...prev,
            postVotes: postVotes
        }));

    }

    useEffect(() => {
        if (!user || !currentCommunity?.id) return;
        getCommunityPostVotes(currentCommunity?.id)
    }, [user, currentCommunity]);

    useEffect(() => {
        if (!user) {
            setPostStateValue(prev => ({
                ...prev,
                postVotes: []
            }));
        }
    }, [user]);
    return {
        postStateValue,
        setPostStateValue,
        onVote,
        onSelectPost,
        onDeletePost
    };
};

export default UsePosts;