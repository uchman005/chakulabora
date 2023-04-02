import React, { ReactNode, useEffect, useState } from 'react';
import { MdClose } from 'react-icons/md';
import {
    Box,
    Icon,
    useColorModeValue,
    useToast,
    Drawer,
    useDisclosure,
    BoxProps,
    FlexProps,
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
import Link from 'next/link';
import Image from 'next/image';
import { useSelector } from 'react-redux';
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
    // { name: 'Settings', icon: FiSettings, link: '/dashboard/setting' },
];
const authLinkItems: Array<LinkItemProps> = [
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
    const user = useSelector((state: any) => state.user);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { data: session, status } = useSession();
    const dispatch = useDispatch();
    useEffect(() => {
        if (user.role == '') {
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
        } else {
            dispatch(setUser(user));
        }
    }, [session, dispatch, user]);
    return (
        <div className='min-h-[100vh] bg-gray-100 '>
            <SidebarContent
                onClose={() => onClose}
                user={user}
                display={{ base: 'none', md: 'block' }}
                status={status}
            />
            <Drawer
                autoFocus={false}
                isOpen={isOpen}
                placement="left"
                onClose={onClose}
                returnFocusOnClose={false}
                onOverlayClick={onClose}
            >
                <div
                    className={`fixed inset-0 bg-gray-800 bg-opacity-75 z-50 transition-opacity duration-500 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                        }`}
                >
                    <SidebarContent onClose={onClose} user={user} status={status} />
                </div>
            </Drawer>
            {/* mobilenav */}
            <MobileNav onOpen={onOpen} user={user} />
            <div className='ml-0 md:ml-60 p-4'>
                {children}
            </div>
        </div>
    );
}

interface SidebarProps extends BoxProps {
    onClose: () => void;
    user: IUser | null;
    status: 'authenticated' | 'loading' | 'unauthenticated';
}

const SidebarContent = ({ user, status, onClose, ...rest }: SidebarProps) => {
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
            <div className='h-20 flex justify-between mx-8 items-center'>
                <h1 className="flex text-2xl font-mono font-bold">
                    Chakulabora
                </h1>
                <button className="block md:hidden" onClick={onClose}>
                    <MdClose className="h-6 w-6" aria-hidden="true" />
                </button>
            </div>
            {status === 'unauthenticated' && LinkItems.map((link) => (
                <NavItem key={link.name} link={link.link} icon={link.icon}>
                    {link.name}
                </NavItem>
            ))}
            {status === 'authenticated' && authLinkItems.map((link) => (
                <NavItem key={link.name} link={link.link} icon={link.icon}>
                    {link.name}
                </NavItem>
            ))}
            {status === 'loading' && <NavItem icon={FiCompass} link='#'>Loading...</NavItem>}
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
        <Link href={link} style={{ textDecoration: 'none' }}>
            <div className="flex items-center p-4 mx-4 rounded-lg group cursor-pointer hover:bg-cyan-400 hover:text-white">
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
            </div>
        </Link>
    );
};

interface MobileProps extends FlexProps {
    onOpen: () => void;
    user: IUser | null;
}
const MobileNav = ({ user, onOpen, ...rest }: MobileProps) => {
    const toast = useToast();
    const [dropdown, setDropdown] = useState(false);
    return (
        <div className='flex md:ml-2 ml-0 px-1 py-3 align-center justify-between md:justify-end bg-white h-20 border-b-1 border-b-gray-200'
        >
            <button className="flex md:hidden border-hidden mr-1 outline-none py-2" onClick={onOpen} aria-label="open menu">
                <FiMenu className='text-2xl' />
            </button>
            <h1 className="flex text-2xl font-mono py-1 font-bold md:hidden">
                Chakulabora
            </h1>


            {user?.role != '' ? <div className='flex flex-col items-center '>
                <div>
                    <div className='py-2 transition duration-300 focus:outline-none focus:shadow-none'>
                        <div className='flex md:items-center md:justify-center'>
                            <div className='flex flex-row'>
                                <button className="p-2 rounded-lg hover:bg-gray-200">
                                    <FiBell className="h-6 w-6" aria-hidden="true" />
                                </button>
                                <Image
                                    className="h-8 w-8 rounded-full object-cover"
                                    src={
                                        '/placeholder.png'
                                    }
                                    alt="User Avatar"
                                    width={8}
                                    height={8}
                                />

                            </div>
                            <div className='flex' onClick={() => {
                                setDropdown(!dropdown);
                            }}>
                                <div className='hidden md:flex md:flex-col md:items-start md:ml-2'>
                                    <span className='text-sm'>{user?.fname} {user?.lname}</span>
                                    <span className='text-xs text-gray-600'>
                                        {user?.role}
                                    </span>
                                </div>
                                <div className="md:flex ml-1 py-2">
                                    <FiChevronDown />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {dropdown && <ul className={'z-100 ease-in-out duration-500 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 px-3'}>
                    <li className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'><Link href='/dashboard/profile'>Profile</Link></li>
                    <li className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'><Link href='/dashboard/setting'>Settings</Link></li>
                    <hr className='border-gray-200 my-1' />
                    <li className='flex items-center cursor-pointer px-4 py-2 mb-2 text-sm text-gray-700 hover:bg-gray-100'
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
                    </li>
                </ul>}
            </div> : <button className="btn btn-success btn-xs"><Link href="/auth/signin" className='nounderline text-white hover:text-gray-200 duration-300'>Login</Link></button>}
        </div>
    );
};