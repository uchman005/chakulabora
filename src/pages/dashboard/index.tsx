import { useSession } from 'next-auth/react';
import { Heading } from '@chakra-ui/react';
import { useEffect } from 'react'
import { useRouter } from 'next/router';
import Sidebar from '@/components/Sidebar';
// import RichTextEditor from '@/components/RichTextEditor';
import Script from 'next/script';
import { useSelector } from 'react-redux';
export default function Index() {
    const Router = useRouter();
    const user = useSelector((state: any) => state.user);
    const { status } = useSession();
    useEffect(() => {
        if (status === "unauthenticated") {
            Router.replace("/")
        }
    }, [status, Router]);


    return (
        <>
            <Sidebar>
                <Heading> DashBoard </Heading>
                <Heading>User Data: {JSON.stringify(user)}</Heading>
            </Sidebar>
            <Script id='quill' strategy='lazyOnload'> </Script>
        </>
    )
}