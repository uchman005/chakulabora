import { useSession } from 'next-auth/react';
import { Heading } from '@chakra-ui/react';
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router';
import Sidebar from '@/components/Sidebar';
import { useSelector } from 'react-redux';


export default function Index() {
    const Router = useRouter();
    const { status} = useSession();
    const user = useSelector((state: any) => state.user);

    useEffect(() => {
        if (status === "unauthenticated") {
            Router.replace("/")
        }
    }, [status, Router]);

    return (
        <Sidebar>
            <h2 className='font-semibold'>Questions from : {user.fname} {user.lname}</h2>
        </Sidebar>
    )
}