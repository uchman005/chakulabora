import { IconProps } from '@chakra-ui/react';
// import Image from 'next/image';
import Link from 'next/link';
import Image from 'next/image';
export default function Hero() {
  return (
    <div className='max-w-7xl'>
      <div className="text-center flex flex-col justify-center items-center py-20 md:py-28 space-y-8 md:space-y-10">

        <h1 className="font-semibold text-3xl sm:text-4xl md:text-6xl leading-110 font-bold">
          Community Interaction{' '}
          <span className='text-blue-400'>
            made easy
          </span>
        </h1>
        <span className='text-gray-500 max-w-3xl'>
          Stay upto date with best practices in Sustainable Agricuture and
          environmental care. Contribute your quota, own the community.
          A community for farmers developed by farmers.
        </span>
        <div className='flex flex-row space-x-6'>
          <Link href="/auth/signup" className="bg-blue-400 hover:bg-blue-500 text-white rounded-full px-6 py-2 font-semibold transition duration-300 ease-in-out">
            Get started
          </Link>
          <Link href={'/contact'} className='rounded-full px-6 hover:bg-gray-200 py-2 text-black bg-gray-100 font-semibold duration-300 ease-in-out'>
            Learn more
          </Link>
        </div>
        <div className="flex w-full">

          {/* <Image alt={'Hero Image'} src={'/placeholder.png'} width={320} height={320} className='mt-12 sm:mt-16' /> */}
          <Illustration
            height={{ sm: '24rem', lg: '38rem' }}
            mt={{ base: 12, sm: 16 }}
          />
        </div>
      </div>
    </div>
  );
}

export const Illustration = (props: IconProps) => {
  return (
    <Image
      src={'/hero.png'}
      alt='Hero Illustration Image'
      width={3000}
      height={3000}
    />
  );
};