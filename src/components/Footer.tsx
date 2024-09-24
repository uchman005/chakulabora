import {
    chakra,
    VisuallyHidden,
    useColorModeValue,
    useToast,
} from '@chakra-ui/react';
import { ReactNode, useState, ChangeEvent, FormEvent } from 'react';
import { FaFacebook, FaLinkedin } from 'react-icons/fa';
import { BiMailSend } from 'react-icons/bi';
import Link from 'next/link'
const Logo = (props: any) => {
    return (
        <h1 className='bold text-3xl'>Chakula Bora Network</h1>
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
            target={href ? '_blank' : '_self'}
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
    const bg = useColorModeValue('gray-100', 'gray-900');
    const text = useColorModeValue('gray-700', 'gray-200')
    const [email, setEmail] = useState('');
    const toast = useToast();
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        fetch('/api/users/subscribe-email', {
            method: 'POST',
            body: JSON.stringify({ email })
        })
            .then((res) => res.json())
            .then((data) => {
                if (data === null) {
                    toast({
                        title: 'Subscription Failed',
                        description: 'Email subscription failed, you\'ve subscribed before',
                        status: 'warning',
                        duration: 5000,
                        isClosable: true,
                        position: "top",
                        size: { width: '300', height: '200' },
                        variant: 'top-accent'
                    });
                    setEmail('');
                    return;
                }
                const { message } = data;
                toast({
                    title: 'Subscribed successfully',
                    description: 'Thanks for subscribing, we\'ll keep in touch',
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                    position: "top",
                    size: { width: '300', height: '200' },
                    variant: 'top-accent'
                })
                setEmail('');
            })
            .catch((error) => {
                toast({
                    title: 'Subscription Failed',
                    description: 'Email subscription failed, check network connectivity' + error.message,
                    status: 'warning',
                    duration: 5000,
                    isClosable: true,
                    position: "top",
                    size: { width: '300', height: '200' },
                    variant: 'top-accent'
                });
                setEmail('');
            })
    }
    return (
        <footer className={`bg-${bg} text-${text} bottom-0 left-0 right-0`}>
            <div className='flex py-10 px-10' >
                <div className='grid md:grid-cols-4 gap-8'>
                    <div className='space-y-6'>
                        <div>
                            <Logo color={useColorModeValue('gray.700', 'white')} />
                        </div>
                        <span className='text-sm'>
                            © 2021 - {new Date().getFullYear()} Chakula Bora. All rights reserved
                        </span>
                        <div className='flex gap-4'>

                            <SocialButton label={'Instagram'} href={'https://web.facebook.com/groups/675166221332788'}>
                                <FaFacebook />
                            </SocialButton>
                            <SocialButton label={'Instagram'} href={'https://www.linkedin.com/company/passionofhopeinternational/'}>
                                <FaLinkedin />
                            </SocialButton>
                        </div>
                    </div>
                    <div className='flex flex-col gap-2'>
                        <ListHeader>Company</ListHeader>
                        <Link href={'/about'}>About us</Link>
                        <Link href={'/contact'}>Contact us</Link>
                        <Link href={'https://www.paypal.com/donate/?hosted_button_id=TRAK8ZMG52U6S'}>Donate</Link>
                    </div>
                    <div className='flex flex-col gap-2'>
                        <ListHeader>Support</ListHeader>
                        <Link href={'/contact'}>Help Center</Link>
                        <Link href={'/coc'}>Terms of Service</Link>
                        <Link href={'/legal'}>Legal</Link>
                        <Link href={'/privacy'}>Privacy Policy</Link>
                    </div>
                    <div className='flex flex-col gap-2'>
                        <ListHeader>Stay up to date</ListHeader>
                        <form className='flex flex-row' onSubmit={handleSubmit}>
                            <input
                                type="email"
                                name='email'
                                placeholder="Your email address"
                                className="bg-black-100 form-control text-black focus:bg-white-300"
                                value={email}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                    setEmail(e.target.value)
                                }}
                            />
                            <button
                                type='submit'
                                className="bg-blue-400 hover:bg-blue-600 text-white hover:text-white py-2 px-4 rounded"
                                aria-label="Subscribe"
                            ><BiMailSend /></button>
                        </form>
                    </div>
                </div>
            </div>
        </footer>
    );
}