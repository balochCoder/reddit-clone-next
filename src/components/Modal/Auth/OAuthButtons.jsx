import React, {useEffect} from 'react';
import {Button, Flex, Image, Text} from "@chakra-ui/react";
import {useSignInWithGoogle} from "react-firebase-hooks/auth";
import {doc,setDoc} from "firebase/firestore";
import {auth, firestore} from "@/firebase/clientApp";


const OAuthButtons = () => {
    const [signInWithGoogle, userCred, loading, error] = useSignInWithGoogle(auth);

    const createUserDocument = async (user)=>{
        const userDocRef= doc(firestore,'users',user.uid);
        await setDoc(userDocRef,JSON.parse(JSON.stringify(user)))
    };

    useEffect( ()=>{
        if (userCred){
             createUserDocument(userCred.user)
        }
    },[userCred])

    return (
        <Flex direction='column' width='100%' mb={4}>
            <Button variant='oauth' mb={2} isLoading={loading} onClick={()=>signInWithGoogle()}>
                <Image src='/images/googlelogo.png' height="20px" mr={3}/>
                Continue with Google
            </Button>
            <Button variant='oauth'>Some other provider</Button>
            {
                error &&(
                    <Text>{error.message}</Text>
                )
            }
        </Flex>
    );
};

export default OAuthButtons;
