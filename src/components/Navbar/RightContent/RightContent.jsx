import React from 'react';
import {Button, Flex} from "@chakra-ui/react";
import {useSignOut} from "react-firebase-hooks/auth";
import {auth} from "@/firebase/clientApp";
import AuthModal from "@/components/Modal/Auth/AuthModal";
import Icons from "@/components/Navbar/RightContent/Icons";
import AuthButtons from "@/components/Navbar/RightContent/AuthButtons";
import UserMenu from "@/components/Navbar/RightContent/UserMenu";

const RightContent = ({user}) => {
    const [signOut, loading, error] = useSignOut(auth);

    return (
        <>
            <AuthModal/>
            <Flex justify='center' align='center'>
                {
                    user ? <Icons/> : <AuthButtons/>
                }
                <UserMenu user={user}/>
            </Flex>
        </>
    );
};

export default RightContent;
