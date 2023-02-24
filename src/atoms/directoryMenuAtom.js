import {atom} from 'recoil'
import {TiHome} from "react-icons/ti";


export const defaultMenuItem = {
    displayText: "Home",
    link: "/",
    icon: TiHome,
    iconColor: 'black'
}

export const directoryMenuState = atom({
    key: 'directoryMenuState',
    default: {
        isOpen: false,
        selectedMenuItem: {
            displayText: "Home",
            link: "/",
            icon: TiHome,
            iconColor: 'black'
        }
    }
})