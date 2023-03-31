import { useSession } from 'next-auth/react';
import { useToast } from '@chakra-ui/react';
import { useEffect } from 'react'
import { useRouter } from 'next/router';
import Sidebar from '@/components/Sidebar';
import Profile from '@/components/Profile';
import { useSelector } from 'react-redux';
export default function Index() {
    const toast = useToast();
    const user = useSelector((state: any) => state.user);
    const Router = useRouter();
    const { status } = useSession();
    useEffect(() => {
        if (status === "unauthenticated") {
            Router.replace("/")
        }
    }, [status, Router]);


    return (
        <>
            <Sidebar>
                <div className='flex items-center lg:justify-center z-0'>
                <Profile user={user} />
                </div>
            </Sidebar>
        </>
    )
}