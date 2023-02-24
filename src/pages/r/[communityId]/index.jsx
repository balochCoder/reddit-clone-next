import React, {useEffect} from 'react';
import {doc, getDoc} from "firebase/firestore";
import {firestore} from "@/firebase/clientApp";
import safeJsonStringify from 'safe-json-stringify'
import NotFound from "@/components/Community/NotFound";
import Header from "@/components/Community/Header";
import PageContent from "@/components/Layout/PageContent";
import CreatePostLink from "@/components/Community/CreatePostLink";
import Posts from "@/components/Posts/Posts";
import {useSetRecoilState} from "recoil";
import {communityState} from "@/atoms/communitiesAtom";
import About from "@/components/Community/About";


const CommunityPage = ({communityData}) => {
    const setCommunityStateValue = useSetRecoilState(communityState);
    if (!communityData) {
        return <NotFound/>
    }

    useEffect(()=>{
        setCommunityStateValue(prev=>({
            ...prev,
            currentCommunity: communityData
        }))
    },[communityData]);
    return (
        <>
            <Header communityData={communityData}/>
            <PageContent>
                <>
                    <CreatePostLink/>
                    <Posts communityData={communityData}/>
                </>
                <>
                    <About communityData={communityData}/>
                </>
            </PageContent>
        </>
    );
};

export async function getServerSideProps(context) {
// Get community data and pass it to client

    try {
        const communityDocRef = doc(firestore, 'communities', context.query.communityId);
        const communityDoc = await getDoc(communityDocRef)

        return {
            props: {
                communityData: communityDoc.exists() ? JSON.parse(safeJsonStringify({
                    id: communityDoc.id,
                    ...communityDoc.data()
                })) : ''
            }
        }
    } catch (error) {
        console.log('getServerSideProps', error)
    }
}


export default CommunityPage;