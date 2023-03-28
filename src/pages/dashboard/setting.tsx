import { useSession } from 'next-auth/react';
import {  Heading } from '@chakra-ui/react';
import { useEffect } from 'react'
import { useRouter } from 'next/router';
import Sidebar from '@/components/Sidebar';
import { useSelector } from 'react-redux';
export default function Index() {
    const user = useSelector((state: any) => state.user);
    const Router = useRouter();
    const { status } = useSession();
    useEffect(() => {
        if (status === "unauthenticated") {
            Router.replace("/")
        }
    }, [status, Router]);

    return (
        <Sidebar>
            <Heading>Settings: {user.country}</Heading>
        </Sidebar>
    )
}