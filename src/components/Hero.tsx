import Link from 'next/link';
import Image from 'next/image';
export default function Hero() {
  return (
    <div className='max-w-full mt-5'>
      <div className="text-center flex flex-col justify-center w-full items-center py-20 md:py-28 space-y-8 md:space-y-10">
        <h1 className="font-semibold text-3xl md:text-6xl leading-110 font-bold max-w-4xl">
          <Link href='/auth/signup' className="underline text-gray-950">New here?</Link> Welcome to Chakulabora Digital Network
        </h1>

        <p className='text-gray-900 text-2xl max-w-4xl tracking-wider leading-relaxed'>
          Chakula Bora means &quot;Healthy Food,&quot; and we’re thrilled to have you join our growing community!
          This platform brings together farmers, entrepreneurs, experts, and institutions to build a sustainable,
          resilient, and healthy food system for all.
        </p>
        <div className='flex flex-row space-x-6 text-xl'>
          <Link href="/auth/signup" className="bg-blue-500 hover:bg-blue-400 text-white rounded-full px-6 py-2 font-semibold transition duration-300 ease-in-out">
            Register Here
          </Link>
          <Link href={'/contact'} className='rounded-full px-6 hover:bg-gray-200 py-2 text-black bg-gray-100 font-semibold duration-300 ease-in-out'>
            Learn more
          </Link>
        </div>
        <Image
          src={'/hero.webp'}
          alt='A community instruction for rural farmers outreach'
          width={3000}
          height={3000}
          loading='lazy'
          className='w-[80%] mx-auto rounded-[25px]'
        />
      </div>
    </div>
  );
}
