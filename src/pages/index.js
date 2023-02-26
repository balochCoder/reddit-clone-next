import PageContent from "@/components/Layout/PageContent";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth, firestore} from "@/firebase/clientApp";
import {useEffect, useState} from "react";
import {collection, orderBy, query, limit, getDocs, where} from "firebase/firestore";
import {useRecoilValue} from "recoil";
import {communityState} from "@/atoms/communitiesAtom";
import usePosts from "@/hooks/usePosts";
import PostLoader from "@/components/Posts/PostLoader";
import {Stack} from "@chakra-ui/react";
import PostItem from "@/components/Posts/PostItem";
import CreatePostLink from "@/components/Community/CreatePostLink";
import useCommunityData from "@/hooks/useCommunityData";
import Recommendations from "@/components/Community/Recommendations";
import Premium from "@/components/Community/Premium";
import PersonalHome from "@/components/Community/PersonalHome";


export default function Home() {
    const [user, loadingUser] = useAuthState(auth);
    const [loading, setLoading] = useState(false);

    const {postStateValue, setPostStateValue, onSelectPost, onVote, onDeletePost} = usePosts();

    const {communityStateValue} = useCommunityData();
    const buildUserHomeFeed = async () => {
        setLoading(true);
        try {
            if (communityStateValue.mySnippets.length) {
                const myCommunityIds = communityStateValue.mySnippets.map(snippet => snippet.communityId);

                const postQuery = query(
                    collection(firestore, 'posts'),
                    where('communityId', 'in', myCommunityIds),
                    limit(10)
                );

                const postDocs = await getDocs(postQuery);

                const posts = postDocs.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                setPostStateValue(prev => ({
                    ...prev,
                    posts: posts
                }));

            } else {
                buildNoUserHomeFeed();
            }
        } catch (error) {
            console.log('buildUserHomeFeed error', error);
        }
        setLoading(false);
    }
    const buildNoUserHomeFeed = async () => {
        setLoading(true);
        try {
            const postQuery = query(
                collection(firestore, 'posts'),
                orderBy('voteStatus', 'desc'),
                limit(10)
            );

            const postDocs = await getDocs(postQuery);

            const posts = postDocs.docs.map(doc => ({id: doc.id, ...doc.data()}));

            setPostStateValue(prev => ({
                ...prev,
                posts: posts
            }));
        } catch (error) {
            console.log('buildNoUserHomeFeed error', error);
        }
        setLoading(false);
    }
    const getUserPostVotes = async () => {
        try {
            const postIds = postStateValue.posts.map(post => post.id)
            const postVotesQuery = query(
                collection(firestore, `users/${user?.uid}/postVotes`),
                where('postId', 'in', postIds)
            );

            const postVotesDocs = await getDocs(postVotesQuery);
            const postVotes = postVotesDocs.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            setPostStateValue(prev => ({
                ...prev,
                postVotes: postVotes
            }));


        } catch (error) {
            console.log('getUserPostVotes error', error);
        }
    }

    useEffect(() => {
        if (communityStateValue.snippetsFetched) buildUserHomeFeed();

    }, [communityStateValue.snippetsFetched]);
    useEffect(() => {
        if (!user && !loadingUser) buildNoUserHomeFeed();
    }, [user, loadingUser])
    useEffect(() => {
        if (user && postStateValue.posts.length) getUserPostVotes();
        return () => {
            setPostStateValue(prev => ({
                ...prev,
                postVotes: []
            }))
        }
    }, [user, postStateValue.posts])

    return (
        <PageContent>
            <>
                <CreatePostLink/>
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
                                        onDeletePost={onDeletePost}
                                        onSelectedPost={onSelectPost}
                                        onVote={onVote}
                                        userVoteValue={postStateValue.postVotes.find(item => item.postId === post.id)?.voteValue}
                                        userIsCreator={user?.uid === post.creatorId}
                                        homePage
                                    />
                                ))
                            }
                        </Stack>
                    )
                }
            </>
            <Stack spacing={5}>
                <Recommendations/>
                <Premium/>
                <PersonalHome/>
            </Stack>
        </PageContent>
    )
}
