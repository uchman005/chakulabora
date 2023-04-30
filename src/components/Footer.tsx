import {
    Box,
    chakra,
    VisuallyHidden,
    Input,
    IconButton,
    useColorModeValue,
} from '@chakra-ui/react';
import { ReactNode } from 'react';
import { FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';
import { BiMailSend } from 'react-icons/bi';
import Link from 'next/link'
const Logo = (props: any) => {
    return (
        <h1 className='bold text-3xl'>Chakula-bora</h1>
    );
};

const SocialButton = ({
    children,
    label,
    href,
}: {
    children: ReactNode;
    label: string;
    href: string;
}) => {
    return (
        <chakra.button
            bg={useColorModeValue('blackAlpha.100', 'whiteAlpha.100')}
            rounded={'full'}
            w={8}
            h={8}
            cursor={'pointer'}
            as={'a'}
            href={href}
            display={'inline-flex'}
            alignItems={'center'}
            justifyContent={'center'}
            transition={'background 0.3s ease'}
            _hover={{
                bg: useColorModeValue('blackAlpha.200', 'whiteAlpha.200'),
            }}>
            <VisuallyHidden>{label}</VisuallyHidden>
            {children}
        </chakra.button>
    );
};

const ListHeader = ({ children }: { children: ReactNode }) => {
    return (
        <p className='text-base text-lg mb-2'>
            {children}
        </p>
    );
};

export default function Footer() {
    return (
        <Box
            bg={useColorModeValue('gray.50', 'gray.900')}
            color={useColorModeValue('gray.700', 'gray.200')}>
            <div className='container flex max-w-6xl py-10' >
                <div className='grid sm:grid-cols-12 md:grid-cols-5 gap-8'>
                    <div className='space-y-6'>
                        <Box>
                            <Logo color={useColorModeValue('gray.700', 'white')} />
                        </Box>
                        <span className='text-sm'>
                            © 2022 - {new Date().getFullYear()} Chakula-bora. All rights reserved
                        </span>
                        <div className='flex gap-4'>
                            <SocialButton label={'Twitter'} href={'#'}>
                                <FaTwitter />
                            </SocialButton>
                            <SocialButton label={'YouTube'} href={'#'}>
                                <FaYoutube />
                            </SocialButton>
                            <SocialButton label={'Instagram'} href={'#'}>
                                <FaInstagram />
                            </SocialButton>
                        </div>
                    </div>
                    <div className='flex flex-col gap-2'>
                        <ListHeader>Company</ListHeader>
                        <Link href={'#'}>About us</Link>
                        <Link href={'#'}>Blog</Link>
                        <Link href={'#'}>Contact us</Link>
                        <Link href={'#'}>Testimonials</Link>
                    </div>
                    <div className='flex flex-col gap-2'>
                        <ListHeader>Support</ListHeader>
                        <Link href={'#'}>Help Center</Link>
                        <Link href={'#'}>Terms of Service</Link>
                        <Link href={'#'}>Legal</Link>
                        <Link href={'#'}>Privacy Policy</Link>
                    </div>
                    <div className='flex flex-col gap-2'>
                        <ListHeader>Stay up to date</ListHeader>
                        <div className='flex flex-row '>
                            <input
                                type="email"
                                placeholder="Your email address"
                                className="bg-black-100 form-control text-black focus:bg-white-300"
                            />
                            <button
                                className="bg-blue-400 hover:bg-blue-600 text-white hover:text-white py-2 px-4 rounded"
                                aria-label="Subscribe"
                            ><BiMailSend /></button>
                        </div>
                    </div>
                </div>
            </div>
        </Box>
    );
}