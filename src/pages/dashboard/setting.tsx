import { useSession } from 'next-auth/react';
import Sidebar from '@/components/Sidebar';
import { useSelector } from 'react-redux';
import countriesList from '../../../utils/countries'
export default function Index() {
    const user = useSelector((state: any) => state.user);
    const { status } = useSession();
    if (status === "unauthenticated") return <Sidebar><h1>You must Login to view Settings </h1></Sidebar>
    if (status === "loading") return <Sidebar><h1>Loading...</h1></Sidebar>
    return (
        <Sidebar>
          
                <form className="lg:ml-8 shadow rounded-lg p-8 w-full max-w-lg">
            <p className='text-center text-3xl mb-6'>Edit Profile</p>
                    <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="first-name">
                                First Name: <span className='text-red-400 italics'>*</span>
                            </label>
                            <input required className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="first-name" type="text" placeholder={user.fname} name='fname' value={user.fname} />
                        </div>
                        <div className="w-full md:w-1/2 px-3">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="last-name">
                                Last Name: <span className='text-red-400 italics'>*</span>
                            </label>
                            <input required className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="last-name" type="text" placeholder={user.lname} name='lname' value={user.lname} />
                        </div>
                    </div>
                    <div className="flex flex-wrap -mx-3 mb-6">

                        <div className="w-full md:w-1/2 px-3">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="email">
                                Email: <span className='text-red-400 italics'>*</span>
                            </label>
                            <input required className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="email" type="email" placeholder="user@example.com" value={user.email} />
                        </div>

                        <div className="w-full md:w-1/2 px-3">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="website">
                                Website
                            </label>
                            <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="website" type="text" placeholder={user.website} name='website' value={user.website} />
                        </div>
                    </div>

                    <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full px-3">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="password">
                                Bio
                            </label>
                            
                            <textarea className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" name='bio' value={user.bio} placeholder='Write a short bio'>
                                
                            </textarea>
                        </div>
                    </div>
                    <div className="flex flex-wrap -mx-3 mb-6">

                        <div className="w-full md:w-1/2 px-3">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="street_address">
                                Street 
                            </label>
                            <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="street_address" type="text" placeholder="Your street or close Landmark" value={user.street_address} />
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
          value={user.country}
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
                            <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="city" type="text" placeholder="Your city" value={user.city} />
                        </div>
                        <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="state">
                                State
                            </label>
                            <div className="relative">
                                <input className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="state" type='text' placeholder='Your state' value={user.state} />
                            </div>
                        </div>
                        <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="postal_code">
                                Zip
                            </label>
                            <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="postal_code" type="text" placeholder="480" value={user.postal_code} />
                        </div>
                        <div className='w-full my-6 flex items-center justify-center'>
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
  UPDATE
</button>
</div>
                    </div>
                </form>

                <form className="lg:ml-8 shadow rounded-lg p-8 w-full max-w-lg my-10">
            <p className='text-center text-3xl mb-6'>Edit Password</p>
                    <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full  px-3 mb-6 md:mb-0">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="password">
                                New Password: <span className='text-red-400 italics'>*</span>
                            </label>
                            <input required className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="password" type="password" placeholder='* * * * * ' name='password' />
                        </div>
                        <div className="w-full  px-3 mb-6 md:mb-0">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="re_password">
                                Retype Password: <span className='text-red-400 italics'>*</span>
                            </label>
                            <input required className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="re_password" type="password" placeholder='* * * * * ' name='re_password' />
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