import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { useSelector } from 'react-redux';
import countriesList from '../../../utils/countries'
import axios from 'axios'
import { useToast } from '@chakra-ui/react';
import Head from 'next/head';
export default function Index() {
    const user = useSelector((state: any) => state.user);
    const { status } = useSession();
    const toast = useToast();
    useEffect(() => {
        if (user.email != '') {
            setUserData(user)
        }
    }, [user])
    const [password, setPassword] = useState('');
    const [repassword, setrepassword] = useState('');
    const [userData, setUserData] = useState(user);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
        let { value, name } = e.target;
        setUserData((prev: any) => ({ ...prev, [name]: value }));
    };
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const response = await axios.post(`/api/${user.id}/update`, userData);
        const updated = response.data;
        if (updated === null) {
            toast({
                title: "Account Update failed.",
                description: "Account updated failed unexpectedly, check your network connection",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top",
                size: { width: "300", height: "200" },
                variant: "top-accent",
            });
        } else {
            toast({
                title: "Account Update successful",
                description: "Account update was successful",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "top",
                size: { width: "300", height: "200" },
                variant: "top-accent",
            });
        }

    }
    if (status === "unauthenticated") return <Sidebar><h1>You must Login to view Settings </h1></Sidebar>
    if (status === "loading") return <Sidebar><h1>Loading...</h1></Sidebar>
    return (
        <Sidebar>
            <Head>
                <title>Chakula-bora | Settings</title>
                <meta name="description" content="Chakula-bora | Settings" />
            </Head>
            <form onSubmit={handleSubmit} className="lg:ml-8 shadow rounded-lg p-8 w-full max-w-lg">
                <p className='text-center text-3xl mb-6'>Edit Profile</p>
                <div className="flex flex-wrap -mx-3 mb-6">
                    <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="first-name">
                            First Name: <span className='text-red-400 italics'>*</span>
                        </label>
                        <input required className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="first-name" type="text" placeholder={userData.fname} name='fname' value={userData.fname} onChange={handleChange} />
                    </div>
                    <div className="w-full md:w-1/2 px-3">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="last-name">
                            Last Name: <span className='text-red-400 italics'>*</span>
                        </label>
                        <input required className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="last-name" type="text" placeholder={userData.lname} name='lname' value={userData.lname} onChange={handleChange} />
                    </div>
                </div>
                <div className="flex flex-wrap -mx-3 mb-6">

                    <div className="w-full md:w-1/2 px-3">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="email">
                            Email: <span className='text-red-400 italics'>*</span>
                        </label>
                        <input required className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="email" type="email" placeholder={userData.email} name='email' value={userData.email} onChange={handleChange} />
                    </div>

                    <div className="w-full md:w-1/2 px-3">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="website">
                            Website
                        </label>
                        <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="website" type="text" placeholder={userData.website} name='website' value={userData.website} onChange={handleChange} />
                    </div>
                </div>

                <div className="flex flex-wrap -mx-3 mb-6">
                    <div className="w-full px-3">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="password">
                            Bio
                        </label>

                        <textarea className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" name='bio' value={userData.bio} placeholder='Write a short bio' onChange={handleChange}>

                        </textarea>
                    </div>
                </div>
                <div className="flex flex-wrap -mx-3 mb-6">

                    <div className="w-full md:w-1/2 px-3">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="street_address">
                            Street
                        </label>
                        <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="street_address" name='street_address' type="text" placeholder="Your street or close Landmark" value={userData.street_address} onChange={handleChange} />
                    </div>

                    <div className="w-full md:w-1/2 px-3">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="website">
                            Country / Region
                        </label>

                        <input
                            list="country"
                            required
                            placeholder="Select Your country"
                            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                            name="country"
                            value={userData.country}
                            onChange={handleChange}
                        />
                        <datalist id="country">
                            {countriesList.map((item) => (
                                <option value={item.name} key={item.code} />
                            ))}
                        </datalist>
                    </div>
                </div>
                <div className="flex flex-wrap -mx-3 mb-2">
                    <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="city">
                            City
                        </label>
                        <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="city" type="text" placeholder="Your city" name='city' value={userData.city} onChange={handleChange} />
                    </div>
                    <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="state">
                            State
                        </label>
                        <div className="relative">
                            <input className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="state" type='text' placeholder='Your state' name='state' onChange={handleChange} value={userData.state} />
                        </div>
                    </div>
                    <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="postal_code">
                            Zip
                        </label>
                        <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="postal_code" type="text" placeholder="480" value={userData.postal_code} name='postal_code' onChange={handleChange} />
                    </div>
                    <div className='w-full my-6 flex items-center justify-center'>
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            UPDATE
                        </button>
                    </div>
                </div>
            </form>

            <form onSubmit={async (e) => {
                e.preventDefault();
                if (password === repassword) {
                    const response = await axios.post('/api/users/updatepassword', { password: password, id: user?.id });
                    const updated = response.data;
                    if (updated) {
                        toast({
                            title: "Password Update successful",
                            description: "Password update was successful",
                            status: "success",
                            duration: 5000,
                            isClosable: true,
                            position: "top",
                            size: { width: "300", height: "200" },
                            variant: "top-accent",
                        });
                    } else {
                        toast({
                            title: "Password Update failed.",
                            description: "Password updated failed unexpectedly, check your network connection",
                            status: "warning",
                            duration: 5000,
                            isClosable: true,
                            position: "top",
                            size: { width: "300", height: "200" },
                            variant: "top-accent",
                        });
                    }

                } else {
                    toast({
                        title: "Paswword Update failed.",
                        description: "Passwords did not match",
                        status: "warning",
                        duration: 5000,
                        isClosable: true,
                        position: "top",
                        size: { width: "300", height: "200" },
                        variant: "top-accent",
                    });
                }
            }} className="lg:ml-8 shadow rounded-lg p-8 w-full max-w-lg my-10">
                <p className='text-center text-3xl mb-6'>Edit Password</p>
                <div className="flex flex-wrap -mx-3 mb-6">
                    <div className="w-full  px-3 mb-6 md:mb-0">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="password">
                            New Password: <span className='text-red-400 italics'>*</span>
                        </label>
                        <input required className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="password" name='password' value={password} onChange={(e) => { setPassword(e.target.value) }} type="password" placeholder='* * * * * ' />
                    </div>
                    <div className="w-full  px-3 mb-6 md:mb-0">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="re_password">
                            Retype Password: <span className='text-red-400 italics'>*</span>
                        </label>
                        <input required className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="re_password" name='repassword' value={repassword} onChange={(e) => { setrepassword(e.target.value) }} type="password" placeholder='* * * * * ' />
                    </div>

                </div>
                <div className='w-full my-6 flex items-center justify-center'>
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        UPDATE PASSWORD
                    </button>
                </div>
            </form>

        </Sidebar>
    )
}