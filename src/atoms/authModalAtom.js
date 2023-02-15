import {atom} from "recoil";

export const authModalState = atom({
    key: 'AuthModalState',
    default: {
        open: false,
        view: 'login'
    }
})


