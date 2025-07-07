import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Cards from './Cards';

export default function Hero() {
  const visionRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
    });
  }, []);
  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <main className="max-w-full mt-5 border-5">
      <div className="text-center flex flex-col justify-center w-full items-center py-20 md:py-28 space-y-8 md:space-y-10">
        <h1
          className="font-semibold text-3xl md:text-6xl leading-110 font-bold max-w-4xl"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          <button onClick={() => scrollToSection(visionRef)} className="underline text-blue-500  font-bold">
            New here?
          </button>{' '}
          Welcome to Chakulabora<span className="text-blue-500"> Digital Network</span>
        </h1>

        <p
          className="text-gray-900 text-2xl max-w-4xl tracking-wider leading-relaxed"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          Chakula Bora means {'"Healthy Food,"'} and we’re thrilled to have you join our growing community!
          This platform brings together farmers, entrepreneurs, experts, and institutions to build a sustainable,
          resilient, and healthy food system for all.
        </p>

        <nav
          className="flex flex-row space-x-6 text-xl"
          data-aos="fade-up"
          data-aos-delay="300"
        >
          <Link
            href="/auth/signup"
            className="bg-blue-500 hover:bg-blue-400 text-white rounded-full px-6 py-2 font-semibold transition duration-300 ease-in-out shadow-black shadow-md hover:shadow-sm active:shadow-lg"
          >
            Register Here
          </Link>
          <Link
            href="/about"
            className="rounded-full px-6 hover:bg-gray-200 py-2 text-black bg-gray-100 font-semibold duration-300 ease-in-out shadow-black shadow-md hover:shadow-sm active:shadow-lg"
          >
            Learn more
          </Link>
        </nav>

        <Image
          src="/hero.jpg"
          alt="A community instruction for rural farmers outreach"
          width={3000}
          height={3000}
          loading="lazy"
          className="w-[95%] mx-auto rounded-[25px] hidden md:block shadow-xl shadow-black"
          data-aos="fade-up"
          data-aos-delay="400"
        />
        <Image
          src="/hero-mobile.jpg"
          alt="A community instruction for rural farmers outreach"
          width={1500}
          height={1500}
          loading="lazy"
          className="w-[95%] mx-auto rounded-[25px] md:hidden shadow-xl shadow-black cover"
          data-aos="fade-up"
          data-aos-delay="400"
        />
      </div>
      <div
        className="mx-auto max-w-4xl my-8 text-center pt-12"
        ref={visionRef}
      >
        <section
          className="text-gray-900 text-2xl tracking-wider leading-relaxed my-6 pt-6"
          data-aos="fade-up"
        >
          <h2>
            Our Mission & Vision:
          </h2>
          <ol className="text-left">
            <li>
              Empowering Communities – Strengthening smallholder farmers and agribusinesses through collaboration.
            </li>
            <li>
              Innovating for Sustainability – Leading climate-smart, regenerative food systems.
            </li>
            <li>
              Building Resilience – Improving food sovereignty, nutrition, and biodiversity.
            </li>
            <li>
              Access to Finance – Bridging funding gaps for micro, small, and medium agribusinesses.
            </li>
            <li>
              Market Linkages – Connecting farmers to fair and sustainable markets.
            </li>
          </ol>
        </section>
        <section
          className="text-gray-900 text-2xl tracking-wider leading-relaxed pb-6"
          data-aos="fade-up"
        >
          <h2>
            Purpose of User Groups
          </h2>
          <p>
            To foster meaningful connections and collaborations, we invite you to self-identify under a user group that aligns with your role. Here’s how each group contributes:
          </p>
          <ol className="text-left">
            <li>
              Organic Farmers – Share knowledge, access markets, and adopt sustainable farming practices.
            </li>
            <li>
              Agro-Ecological Experts – Provide guidance on regenerative farming and climate resilience.
            </li>
            <li>
              Academics & Researchers – Drive innovation through data, studies, and policy insights.
            </li>
            <li>
              Agri Value-Chain Suppliers & Distributors – Strengthen logistics, processing, and fair trade linkages.
            </li>
            <li>
              Community Support Groups – Mobilize local action, education, and food security initiatives.
            </li>
            <li>
              School Educators in Agriculture – Inspire the next generation of sustainable farmers and food leaders.
            </li>
            <li>
              Consumers & Bulk Buyers – Support local farmers by sourcing ethically and promoting healthy diets.
            </li>
            <li>
              Banks & Financial Institutions – Enable growth through accessible funding and investment.
            </li>
          </ol>

          <p>
            Join the network and connect with like-minded members, access tailored resources, and collaborate for greater impact. Together, we’ll cultivate a healthier, fairer, and more sustainable food future.
          </p>
        </section>

        <section className="flex flex-col md:flex-row w-full gap-4 pb-4">
          <Image
            src="/library.jpg"
            alt="A community instruction for rural farmers outreach"
            width={300}
            height={300}
            loading="lazy"
            className="mx-auto rounded-[25px] shadow-xl shadow-black cover"
            data-aos="fade-up"
          />
          <Image
            src="/carrot-tomato.jpg"
            alt="A community instruction for rural farmers outreach"
            width={300}
            height={300}
            loading="lazy"
            className="mx-auto rounded-[25px] shadow-xl shadow-black cover"
            data-aos="fade-up"
          />
        </section>
        <section className="py-6">
          <h2>Quick Links</h2>
          <Cards />
        </section>
      </div>
    </main>
  );
}