import React, {useEffect, useState} from 'react';
import {addDoc,collection} from "firebase/firestore";
import {useSetRecoilState} from "recoil";
import {Button, Flex, Input, Text} from "@chakra-ui/react";
import {useCreateUserWithEmailAndPassword} from "react-firebase-hooks/auth";
import {firestore} from "@/firebase/clientApp";
import {FIREBASE_ERRORS} from "@/firebase/errors";
import {authModalState} from "@/atoms/authModalAtom";


const SignUp = () => {
    const setAuthModalState = useSetRecoilState(authModalState);

    const [signUpForm, setSignUpForm] = useState({
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [error, setError] = useState('');
    // Firebase Authentication
    const [
        createUserWithEmailAndPassword,
        userCred,
        loading,
        userError,
    ] = useCreateUserWithEmailAndPassword(auth);


    const onSubmit = async (e) => {
        e.preventDefault();
        if (error) setError('')
        if (signUpForm.password !== signUpForm.confirmPassword) {
            setError('Password does not match');
            return;
        }
        await createUserWithEmailAndPassword(signUpForm.email, signUpForm.password)
    };

    const onChange = (e) => {
        setSignUpForm(prevState => ({
            ...prevState,
            [e.target.name]: e.target.value
        }))
    };

    const createUserDocument = async (user) => {
        await addDoc(collection(firestore,'users'), JSON.parse(JSON.stringify(user)));
    };

    useEffect( ()=>{
            if (userCred){
                 createUserDocument(userCred.user)
            }
    },[userCred])
    return (
        <form onSubmit={onSubmit}>
            <Input
                required
                name="email"
                placeholder="email"
                type="email"
                mb={2}
                onChange={onChange}
                fontSize='10pt'
                _placeholder={{color: 'gray.500'}}
                _hover={{
                    bg: 'white',
                    border: '1px solid',
                    borderColor: 'blue.500'
                }}
                _focus={{
                    outline: 'none',
                    bg: 'white',
                    border: '1px solid',
                    borderColor: 'blue.500'
                }}
            />
            <Input
                required
                name="password"
                placeholder="password"
                type="password"
                mb={2}
                onChange={onChange}
                fontSize='10pt'
                _placeholder={{color: 'gray.500'}}
                _hover={{
                    bg: 'white',
                    border: '1px solid',
                    borderColor: 'blue.500'
                }}
                _focus={{
                    outline: 'none',
                    bg: 'white',
                    border: '1px solid',
                    borderColor: 'blue.500'
                }}
            />

            <Input
                required
                name="confirmPassword"
                placeholder="confirm password"
                type="password"
                mb={2}
                onChange={onChange}
                fontSize='10pt'
                _placeholder={{color: 'gray.500'}}
                _hover={{
                    bg: 'white',
                    border: '1px solid',
                    borderColor: 'blue.500'
                }}
                _focus={{
                    outline: 'none',
                    bg: 'white',
                    border: '1px solid',
                    borderColor: 'blue.500'
                }}
            />

            <Text textAlign='center' color='red' fontSize='10pt'>{error || FIREBASE_ERRORS[userError?.message]}</Text>

            <Button
                type="submit"
                width='100%'
                height='36px'
                mb={2}
                isLoading={loading}
            >
                Sign Up
            </Button>
            <Flex
                fontSize='9pt'
                justifyContent='center'
            >
                <Text mr={1}>Already a redditor?</Text>
                <Text
                    color="blue.500"
                    cursor='pointer'
                    fontWeight={700}
                    onClick={() => setAuthModalState((prev) => ({
                        ...prev,
                        view: 'login'
                    }))}
                >LOG IN</Text>
            </Flex>
        </form>
    );
};

export default SignUp;
