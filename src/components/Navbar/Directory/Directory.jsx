import React from 'react';
import {Flex, Icon, Image, Menu, MenuButton, MenuList, Text} from '@chakra-ui/react'
import {ChevronDownIcon} from "@chakra-ui/icons";
import {TiHome} from "react-icons/ti";
import Communities from "@/components/Navbar/Directory/Communities";
import useDirectory from "@/hooks/useDirectory";


const Directory = () => {
    const {directoryState,toggleMenuOpen} = useDirectory();
    return (
        <Menu isOpen={directoryState.isOpen}>
            <MenuButton
                cursor='pointer'
                padding='0px 6px'
                borderRadius={4}
                _hover={{outline: '1px solid', outlineColor: 'gray.200'}}
                mr={2}
                ml={{base:0, md:2}}
                onClick={toggleMenuOpen}
            >
                <Flex align='center' justify='space-between' width={{base:'auto',lg:'200px'}}>
                    <Flex align='center'>
                        {
                            directoryState.selectedMenuItem.imageURL ?(
                                <Image src={directoryState.selectedMenuItem.imageURL} borderRadius='full' boxSize='24px' mr={2}/>
                            ) :(
                                <Icon as={directoryState.selectedMenuItem.icon} color={directoryState.selectedMenuItem.iconColor} fontSize={24} mr={{base:1, md:2}}/>

                            )
                        }
                        <Flex display={{base:'none', lg:'flex'}}>
                            <Text fontWeight={600} fontSize='10pt'>{directoryState.selectedMenuItem.displayText}</Text>
                        </Flex>
                    </Flex>
                    <ChevronDownIcon/>

                </Flex>
            </MenuButton>
            <MenuList>
                <Communities/>
            </MenuList>
        </Menu>
    );
};

export default Directory;
