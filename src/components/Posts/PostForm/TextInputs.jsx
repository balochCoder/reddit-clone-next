import React from 'react';
import {Button, Flex, Input, Stack, Textarea} from "@chakra-ui/react";

const TextInputs = ({textInputs, onChange, handleCreatePost, loading}) => {
    return (
        <Stack spacing={3} width="100%">
            <Input
                name="title"
                value={textInputs.title}
                onChange={onChange}
                fontSize="10pt"
                borderRadius={4}
                placeholder="Title"
                _placeholder={{color: 'gray.500'}}
                _focus={{outline: 'none', border: '1px solid black'}}

            />
            <Textarea
                name="body"
                value={textInputs.body}
                onChange={onChange}
                fontSize="10pt"
                height='100px'
                borderRadius={4}
                placeholder="Text (optional)"
                _placeholder={{color: 'gray.500'}}
                _focus={{outline: 'none', border: '1px solid black'}}
            />
            <Flex justify='flex-end'>
                <Button
                    height='34px'
                    padding='0 30px'
                    isDisabled={!textInputs.title}
                    isLoading={loading}
                    onClick={handleCreatePost}
                >
                    Post
                </Button>
            </Flex>
        </Stack>
    );
};

export default TextInputs;