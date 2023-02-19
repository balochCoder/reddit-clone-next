import React, {useRef} from 'react';
import {Button, Flex, Image, Stack} from "@chakra-ui/react";

const ImageUpload = ({onSelectImage, selectedFile, setSelectedTab, setSelectedFile}) => {
    const selectedFileRef = useRef(null);
    return (
        <Flex direction='column' justify='center' align='center' width='100%'>
            {selectedFile ? (
                <>
                    <Image src={selectedFile} maxWidth="400px" maxHeight='400px'/>
                    <Stack
                        direction='row'
                        mt={4}
                    >
                        <Button
                            height='28px'
                            onClick={() => setSelectedTab('Post')}
                        >
                            Back to Post
                        </Button>
                        <Button
                            height='28px'
                            variant='outline'
                            onClick={() => setSelectedFile('')}
                        >
                            Remove
                        </Button>
                    </Stack>
                </>
            ) : (
                <Flex
                    justify='center'
                    align='center'
                    p={20}
                    border='1px dashed'
                    borderColor='gray.200'
                    width='100%'
                    borderRadius={4}
                >
                    <Button variant='outline' height='28px' onClick={() => selectedFileRef.current?.click()}>
                        Upload
                    </Button>
                    <input type="file" ref={selectedFileRef} hidden onChange={onSelectImage}/>
                </Flex>
            )}
        </Flex>
    );
};

export default ImageUpload;