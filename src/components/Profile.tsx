import Link from 'next/link'
import Image from 'next/image'
export default function Profile({ user }: any) {
    return (
        <div className='flex py-6 w-[70%]'>
            <div className="max-w-270 w-full bg-white shadow-2xl rounded-md overflow-hidden">

                <div className='justify-center mt-12'>
                    <div className="relative rounded-full overflow-hidden w-40 h-40 mx-auto mb-5">
                        <Image
                            width={1}
                            height={1}
                            className="w-full h-full object-cover"
                            src="/placeholder.png"
                            alt="Profile avatar"
                        />
                        <div className="absolute inset-0 bg-black opacity-40"></div>
                    </div>
                </div>

                <div className='p-6'>
                    <div className="flex flex-col justify-center items-center mb-5">
                        <h2 className="md:text-xl lg:text-2xl font-medium text-nowrap">{user?.fname} {user?.lname}</h2>
                        <span className="text-gray-500">{user?.role}</span>
                    </div>


                    <div className='flex justify-center space-6 gap-4'>
                        <div className='flex flex-col space-0 items-center'>
                            <span className='font-semibold'>{120}</span>
                            <p className='font-sm text-gray-500'>
                                Questions
                            </p>
                        </div>
                        <div className='flex flex-col space-0 items-center justify-center'>
                            <span className='font-semibold'>{12}</span>
                            <p className='font-sm text-gray-500'>
                                Answers
                            </p>
                        </div>

                    </div>

                    <button
                        className="w-full mt-8 bg-blue-800 text-white rounded-md py-2 px-4 hover:bg-blue-700 transition-all duration-200"
                    >
                        <Link href='/dashboard/settings'>Settings</Link>
                    </button>

                </div>
            </div>
        </div>
    );
}