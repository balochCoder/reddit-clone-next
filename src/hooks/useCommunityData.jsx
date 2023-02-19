import React, {useEffect, useState} from 'react';
import {useRecoilState, useSetRecoilState} from "recoil";
import {communityState} from "@/atoms/communitiesAtom";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth, firestore} from "@/firebase/clientApp";

import {collection, getDocs, writeBatch, doc, increment} from "firebase/firestore";
import {authModalState} from "@/atoms/authModalAtom";


const UseCommunityData = () => {
    const [user] = useAuthState(auth);
    const [communityStateValue, setCommunityStateValue] = useRecoilState(communityState);
    const setAuthModalState = useSetRecoilState(authModalState);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const onJoinOrLeaveCommunity = async (communityData, isJoined) => {
        //     is user joined in?
        //     if not open auth model
        if (!user) {
            setAuthModalState({open: true, view: 'login'});
            return;
        }
        if (isJoined) {
            await leaveCommunity(communityData.id);
            return;
        }
        await joinCommunity(communityData);
    }

    const getMySnippets = async () => {
        setLoading(true);
        try {
            //     get user snippets
            const snippetsDocs = await getDocs(collection(firestore, `users/${user?.uid}/communitySnippets`));

            const snippets = snippetsDocs.docs.map(doc => ({...doc.data()}));

            setCommunityStateValue(prev => ({
                ...prev,
                mySnippets: snippets
            }))

        } catch (e) {
            console.log('getMySnippets error', e)
            setError(e.message)
        }
        setLoading(false)
    }
    const joinCommunity = async (communityData) => {
        //     creating a new community snippet
        //     updating the number of members on this community
        setLoading(true);

        try {
            const batch = writeBatch(firestore);

            const newSnippet = {
                communityId: communityData.id,
                imageUrl: communityData.imageUrl || ''
            }


            batch.set(doc(firestore, `users/${user?.uid}/communitySnippets`, communityData.id), newSnippet);

            batch.update(doc(firestore, 'communities', communityData.id), {
                numberOfMembers: increment(1)
            });

            await batch.commit();
            //     update recoil state - communityState.mySnippets

            setCommunityStateValue(prev => ({
                ...prev,
                mySnippets: [...prev.mySnippets, newSnippet]
            }))
        } catch (e) {
            console.log('joinCommunity', e);
            setError(e.message)
        }

        setLoading(false);

    }

    const leaveCommunity = async (communityId) => {
        setLoading(true);

        try {
            const batch = writeBatch(firestore);

            batch.delete(doc(firestore, `users/${user?.uid}/communitySnippets`, communityId))


            batch.update(doc(firestore, 'communities', communityId), {
                numberOfMembers: increment(-1)
            });

            await batch.commit();

            setCommunityStateValue(prev => ({
                ...prev,
                mySnippets: prev.mySnippets.filter(item => item.communityId !== communityId)
            }))
        } catch (e) {
            console.log('leaveCommunity error', e)
            setError(e.message)
        }

        setLoading(false)
    }

    useEffect(() => {
        if (!user) return
        getMySnippets()
    }, [user])
    return {
        communityStateValue,
        onJoinOrLeaveCommunity,
        loading
    }
};

export default UseCommunityData;