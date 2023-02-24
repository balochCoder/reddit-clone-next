import React from 'react';
import {Flex, Icon, Image, MenuItem} from "@chakra-ui/react";
import useDirectory from "@/hooks/useDirectory";

const MenuListItem = ({displayText, link, icon, iconColor, imageURL}) => {
    const {onSelectMenuItem} = useDirectory();
    return (
        <MenuItem
            width='100%'
            fontSize='10pt'
            _hover={{bg: 'gray.100'}}
            onClick={() => onSelectMenuItem({displayText,link,icon,iconColor,imageURL})}
        >
            <Flex align='center'>
                {
                    imageURL ? (
                        <Image src={imageURL} borderRadius='full' boxSize='18px' mr={2}/>
                    ) : (
                        <Icon as={icon} color={iconColor} fontSize={20} mr={2}/>
                    )
                }
                {displayText}
            </Flex>
        </MenuItem>
    );
};

export default MenuListItem;