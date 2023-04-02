import { useSession } from 'next-auth/react';
import { useEffect } from 'react'
import Sidebar from '@/components/Sidebar';
import Script from 'next/script';
import { useSelector } from 'react-redux';

export default function Index() {
    const user = useSelector((state: any) => state.user);
    const { status } = useSession();
    return (
        <>
            <Sidebar>
                <div className='flex gap-4 md:flex-col bg-gray-300 min-h-[100vh]'>
                    <div className=""></div>
                    <div className=""></div>
                </div>
            </Sidebar>
            <Script id='quill' strategy='lazyOnload'> </Script>
        </>
    )
}