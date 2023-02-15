import React, {useState} from 'react';
import {Button, Flex, Input, Text} from "@chakra-ui/react";
import {useSetRecoilState} from "recoil";
import {useSignInWithEmailAndPassword} from "react-firebase-hooks/auth";
import {authModalState} from "@/atoms/authModalAtom";
import {auth} from "@/firebase/clientApp";
import {FIREBASE_ERRORS} from "@/firebase/errors";

const Login = () => {
    const setAuthModalState = useSetRecoilState(authModalState)
    const [loginForm, setLoginForm] = useState({
        email: '',
        password: ''
    });
    const [
        signInWithEmailAndPassword,
        user,
        loading,
        error,
    ] = useSignInWithEmailAndPassword(auth);
    // Firebase Authentication
    const onSubmit = async (e) => {
        e.preventDefault();
        await signInWithEmailAndPassword(loginForm.email, loginForm.password)
    }

    const onChange = (e) => {
        setLoginForm(prevState => ({
            ...prevState,
            [e.target.name]: e.target.value
        }))
    }
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
            <Text textAlign='center' color='red' fontSize='10pt'>{
                FIREBASE_ERRORS[error?.message]
            }</Text>
            <Button
                type="submit"
                width='100%'
                height='36px'
                mb={2}
                isLoading={loading}
            >
                Login
            </Button>
            <Flex justifyContent="center" mb={2}>
                <Text fontSize="9pt" mr={1}>
                    Forgot your password?
                </Text>
                <Text
                    fontSize="9pt"
                    color="blue.500"
                    cursor="pointer"
                    onClick={() => setAuthModalState((prev) => ({
                        ...prev,
                        view: 'resetPassword'
                    }))}
                >
                    Reset
                </Text>
            </Flex>
            <Flex
                fontSize='9pt'
                justifyContent='center'
            >
                <Text mr={1}>New here?</Text>
                <Text
                    color="blue.500"
                    cursor='pointer'
                    fontWeight={700}
                    onClick={() => setAuthModalState((prev) => ({
                        ...prev,
                        view: 'signup'
                    }))}
                >SIGN UP</Text>
            </Flex>
        </form>
    );
};

export default Login;
