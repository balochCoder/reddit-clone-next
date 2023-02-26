import {atom} from "recoil";

export const communityState = atom({
    key: "communitiesState",
    default: {
        mySnippets:[],
        currentCommunity: null,
        snippetsFetched: false
    }
})
