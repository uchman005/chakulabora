import React, { ReactNode, useEffect } from 'react';
import {
    IconButton,
    Avatar,
    Box,
    CloseButton,
    Flex,
    HStack,
    VStack,
    Icon,
    useColorModeValue,
    Link,
    useToast,
    Drawer,
    DrawerContent,
    Text,
    useDisclosure,
    BoxProps,
    FlexProps,
    Menu,
    MenuButton,
    MenuDivider,
    MenuItem,
    MenuList,
} from '@chakra-ui/react';
import {
    FiHome,
    FiTrendingUp,
    FiCompass,
    FiStar,
    FiSettings,
    FiMenu,
    FiBell,
    FiChevronDown,
} from 'react-icons/fi';
import { IconType } from 'react-icons';
import { ReactText } from 'react';
import { signOut } from 'next-auth/react';
import { FaSignOutAlt } from 'react-icons/fa';
import { useSession } from 'next-auth/react';
import { useDispatch } from 'react-redux';
import { setUser } from '../../store/user';
import { IUser } from '../../interface';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { PayloadAction } from '@reduxjs/toolkit';
interface LinkItemProps {
    name: string;
    icon: IconType;
    link: string;
}
const LinkItems: Array<LinkItemProps> = [
    { name: 'Home', icon: FiHome, link: '/dashboard' },
    { name: 'Questions', icon: FiTrendingUp, link: '/dashboard/questions' },
    // { name: 'Explore', icon: FiCompass, link: '' },
    // { name: 'Favourites', icon: FiStar, link: '' },
    { name: 'Settings', icon: FiSettings, link: '/dashboard/setting' },
];

export default function Sidebar({
    children
}: {
    children: ReactNode;
}) {
    const user = useSelector((state:any) => state.user);    
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { data: session } = useSession();
    const dispatch = useDispatch();
    useEffect(() => {
        if(user.role == ''){
            const getUser = async () => {
                if (session) {
                    const response = await axios.get(`/api/${session?.user?.email}/user`, {
                        responseType: 'json',
                        headers: {
                            "Content-Type": "application/json",
                            Accept: "application/json"
                        }
                    });
                    const user = await response.data;
                    dispatch(setUser(user));
                }
            }
            getUser();
        }else{
            dispatch(setUser(user));
        }
    }, [session, dispatch, user]);
    return (
        <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
            <SidebarContent
                onClose={() => onClose}
                display={{ base: 'none', md: 'block' }}
            />
            <Drawer
                autoFocus={false}
                isOpen={isOpen}
                placement="left"
                onClose={onClose}
                returnFocusOnClose={false}
                onOverlayClick={onClose}
                size="full">
                <DrawerContent>
                    <SidebarContent onClose={onClose} />
                </DrawerContent>
            </Drawer>
            {/* mobilenav */}
            <MobileNav onOpen={onOpen} user={user}/>
            <Box ml={{ base: 0, md: 60 }} p="4">
                {children}
            </Box>
        </Box>
    );
}

interface SidebarProps extends BoxProps {
    onClose: () => void;
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
    return (
        <Box
            transition="3s ease"
            bg={useColorModeValue('white', 'gray.900')}
            borderRight="1px"
            borderRightColor={useColorModeValue('gray.200', 'gray.700')}
            w={{ base: 'full', md: 60 }}
            pos="fixed"
            h="full"
            {...rest}>
            <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
                <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
                    Chakulabora
                </Text>
                <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
            </Flex>
            {LinkItems.map((link) => (
                <NavItem key={link.name} link={link.link} icon={link.icon}>
                    {link.name}
                </NavItem>
            ))}
        </Box>
    );
};

interface NavItemProps extends FlexProps {
    icon: IconType;
    link: string;
    children: ReactText;
}
const NavItem = ({ link, icon, children, ...rest }: NavItemProps) => {
    return (
        <Link href={link} style={{ textDecoration: 'none' }} _focus={{ boxShadow: 'none' }}>
            <Flex
                align="center"
                p="4"
                mx="4"
                borderRadius="lg"
                role="group"
                cursor="pointer"
                _hover={{
                    bg: 'cyan.400',
                    color: 'white',
                }}
                {...rest}>
                {icon && (
                    <Icon
                        mr="4"
                        fontSize="16"
                        _groupHover={{
                            color: 'white',
                        }}
                        as={icon}
                    />
                )}
                {children}
            </Flex>
        </Link>
    );
};

interface MobileProps extends FlexProps {
    onOpen: () => void;
    user: IUser;
}
const MobileNav = ({ user, onOpen, ...rest }: MobileProps) => {
    const toast = useToast();
    return (
        <Flex
            ml={{ base: 0, md: 60 }}
            px={{ base: 4, md: 4 }}
            height="20"
            alignItems="center"
            bg={useColorModeValue('white', 'gray.900')}
            borderBottomWidth="1px"
            borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
            justifyContent={{ base: 'space-between', md: 'flex-end' }}
            {...rest}>
            <IconButton
                display={{ base: 'flex', md: 'none' }}
                onClick={onOpen}
                variant="outline"
                aria-label="open menu"
                icon={<FiMenu />}
            />

            <Text
                display={{ base: 'flex', md: 'none' }}
                fontSize="2xl"
                fontFamily="monospace"
                fontWeight="bold">
                Logo
            </Text>

            <HStack spacing={{ base: '0', md: '6' }}>
                <IconButton
                    size="lg"
                    variant="ghost"
                    aria-label="open menu"
                    icon={<FiBell />}
                />
                <Flex alignItems={'center'}>
                    <Menu>
                        <MenuButton
                            py={2}
                            transition="all 0.3s"
                            _focus={{ boxShadow: 'none' }}>
                            <HStack>
                                <Avatar
                                    size={'sm'}
                                    src={
                                        'https://www.bing.com/ck/a?!&&p=63c22b71630dce50JmltdHM9MTY3OTYxNjAwMCZpZ3VpZD0zNDRjZTc4OC1mNGJmLTYyYWMtMjZjMi1mNWIzZjVkNDYzYTYmaW5zaWQ9NTQ3OA&ptn=3&hsh=3&fclid=344ce788-f4bf-62ac-26c2-f5b3f5d463a6&u=a1L2ltYWdlcy9zZWFyY2g_cT1JbWFnZSUyMFBsYWNlaG9sZGVyJTIwUG5nJkZPUk09SVFGUkJBJmlkPTk2QkYyQkEzODZGMTE1MkFEMTk5NUI0Mjg3RTBFMzcwMUFDMzlFQTI&ntb=1'
                                    }
                                />
                                <VStack
                                    display={{ base: 'none', md: 'flex' }}
                                    alignItems="flex-start"
                                    spacing="1px"
                                    ml="2">
                                    <Text fontSize="sm">{user?.fname} {user?.lname}</Text>
                                    <Text fontSize="xs" color="gray.600">
                                        {user?.role}
                                    </Text>
                                </VStack>
                                <Box display={{ base: 'none', md: 'flex' }}>
                                    <FiChevronDown />
                                </Box>
                            </HStack>
                        </MenuButton>
                        <MenuList
                            bg={useColorModeValue('white', 'gray.900')}
                            borderColor={useColorModeValue('gray.200', 'gray.700')}>
                            <MenuItem><Link href='/dashboard/profile'>Profile</Link></MenuItem>
                            <MenuItem><Link href='/dashboard/setting'>Settings</Link></MenuItem>
                            <MenuDivider />
                            <MenuItem
                                onClick={() => signOut().then(() => {
                                    toast({
                                        title: 'SignOut Success',
                                        description: "You have been signed out successfully",
                                        status: 'success',
                                        duration: 5000,
                                        isClosable: true,
                                        position: "top",
                                        size: { width: '300', height: '200' },
                                        variant: 'top-accent'
                                    })
                                })}>
                                <FaSignOutAlt style={{ color: 'red' }} /> Sign Out
                            </MenuItem>
                        </MenuList>
                    </Menu>
                </Flex>
            </HStack>
        </Flex>
    );
};