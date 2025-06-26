import Link from 'next/link';
import Image from 'next/image';
import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css'; 

export default function Hero() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true, 
    });
  }, []);

  return (
    <div className="max-w-full mt-5 border-5">
      <div className="text-center flex flex-col justify-center w-full items-center py-20 md:py-28 space-y-8 md:space-y-10">
        <h1
          className="font-semibold text-3xl md:text-6xl leading-110 font-bold max-w-4xl"
          data-aos="fade-up" // Animation for the heading
          data-aos-delay="100"
        >
          <Link href="/auth/signup" className="underline text-gray-950">
            New here?
          </Link>{' '}
          Welcome to Chakulabora Digital Network
        </h1>

        <p
          className="text-gray-900 text-2xl max-w-4xl tracking-wider leading-relaxed"
          data-aos="fade-up" // Animation for the paragraph
          data-aos-delay="200"
        >
          Chakula Bora means {'"Healthy Food,"'} and we’re thrilled to have you join our growing community!
          This platform brings together farmers, entrepreneurs, experts, and institutions to build a sustainable,
          resilient, and healthy food system for all.
        </p>

        <div
          className="flex flex-row space-x-6 text-xl"
          data-aos="fade-up" // Animation for the buttons
          data-aos-delay="300"
        >
          <Link
            href="/auth/signup"
            className="bg-blue-500 hover:bg-blue-400 text-white rounded-full px-6 py-2 font-semibold transition duration-300 ease-in-out"
          >
            Register Here
          </Link>
          <Link
            href="/contact"
            className="rounded-full px-6 hover:bg-gray-200 py-2 text-black bg-gray-100 font-semibold duration-300 ease-in-out"
          >
            Learn more
          </Link>
        </div>

        <Image
          src="/hero.jpg"
          alt="A community instruction for rural farmers outreach"
          width={3000}
          height={3000}
          loading="lazy"
          className="w-[90%] mx-auto rounded-[25px]"
          data-aos="fade-up" // Animation for the image
          data-aos-delay="400"
        />
      </div>
    </div>
  );
}