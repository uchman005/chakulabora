import Link from 'next/link';
export default function About() {
  return (
    <div className='max-w-7xl'>
      <div className="text-center flex flex-col justify-center items-center py-20 md:py-28 space-y-8 md:space-y-10">

        <h1 className="font-semibold text-3xl sm:text-4xl md:text-6xl leading-110 font-bold">
          About{' '}
          <span className='text-blue-400'>
            Chakula Bora Network
          </span>
        </h1>
        <span className='text-gray-500 max-w-3xl'>
          Our mission is to create a digital platform
          for stakeholders in the agriculture space to
          network, engage and share ideas, knowledge
          and information on regenerative agriculture.
          While we encourage a lively exchange of ideas
          and opinions, we ask that you read and respect
          the <Link href={'/coc'} className='underline font-bold'>code of conduct</Link>. We reserve the
          right to suspend membership to anyone who
          violates this code of conduct.
        </span>
        <div className='flex flex-row space-x-6'>
          <Link href="/auth/signup" className="bg-blue-400 hover:bg-blue-500 text-white rounded-full px-6 py-2 font-semibold transition duration-300 ease-in-out">
            Get started
          </Link>
          <Link href={'/contact'} className='rounded-full px-6 hover:bg-gray-200 py-2 text-black bg-gray-100 font-semibold duration-300 ease-in-out'>
            Learn more
          </Link>
        </div>
      </div>
    </div>
  );
}

