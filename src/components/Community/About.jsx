import React from 'react';
import {Box, Button, Divider, Flex, Icon, Stack, Text} from "@chakra-ui/react";
import {HiOutlineDotsHorizontal} from "react-icons/hi";
import {RiCakeLine} from "react-icons/ri";
import moment from "moment";
import Link from "next/link";
import {useRouter} from "next/router";


const About = ({communityData}) => {
    const router = useRouter();
    return (
        <Box posittion='sticky' top='14px'>
            <Flex
                justify='space-between'
                align='center'
                bg='blue.400'
                color='white'
                p={3}
                borderRadius='4px 4px 0 0'
            >
                <Text fontSize='10pt' fontWeight={700}>About Community</Text>
                <Icon as={HiOutlineDotsHorizontal} cursor='pointer'/>
            </Flex>
            <Flex
                direction='column'
                p={3}
                bg='white'
                border='0 0 4px 4px'
            >
                <Stack spacing={2}>
                    <Flex
                        width='100%'
                        p={2}
                        fontSize='10pt'
                        fontWeight={600}
                    >
                        <Flex direction='column' flexGrow={1}>
                            <Text>{communityData?.numberOfMembers?.toLocaleString()}</Text>
                            <Text>Members</Text>
                        </Flex>
                        <Flex direction='column' flexGrow={1}>
                            <Text>1</Text>
                            <Text>Online</Text>
                        </Flex>
                    </Flex>
                    <Divider/>
                    <Flex
                        width='100%'
                        align='center'
                        fontSize='10pt'
                        p={1}
                        fontWeight={500}
                    >
                        <Icon as={RiCakeLine} fontSize={18} mr={2}/>
                        {
                            communityData.createdAt && (
                                <Text>Created{" "}{moment(new Date(communityData.createdAt.seconds * 1000)).format('MMM DD, YYYY')}</Text>

                            )
                        }
                    </Flex>

                    <Link href={`/r/${router.query.communityId}/submit`}>
                        <Button mt={3} height='30px' width='100%'>Crete Post</Button>
                    </Link>
                </Stack>

            </Flex>
        </Box>
    );
};

export default About;