import { useSession } from 'next-auth/react';
import Sidebar from '@/components/Sidebar';
import Profile from '@/components/Profile';
import { useSelector } from 'react-redux';
export default function Index() {
    const user = useSelector((state: any) => state.user);
    const { status } = useSession();
    if (status === 'loading') return <Sidebar><h1>Loading...</h1></Sidebar>
    if (status === 'unauthenticated') return <Sidebar><h1>You must login to view Profile</h1></Sidebar>

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