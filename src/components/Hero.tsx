import Link from "next/link";
import Image, { getImageProps } from "next/image";
import Cards from "./Cards";

const heroAlt = "A community instruction for rural farmers outreach";

/** Art-directed hero: one <picture>, so only the matching image is downloaded. */
function HeroPicture() {
  const common = { alt: heroAlt, sizes: "95vw", priority: true } as const;
  const {
    props: { srcSet: desktop },
  } = getImageProps({ ...common, src: "/hero.jpg", width: 1280, height: 576 });
  const {
    props: { srcSet: mobile, ...rest },
  } = getImageProps({ ...common, src: "/hero-mobile.jpg", width: 720, height: 1021 });

  return (
    <picture>
      <source media="(min-width: 768px)" srcSet={desktop} width={1280} height={576} />
      <source media="(max-width: 767px)" srcSet={mobile} width={720} height={1021} />
      {/* eslint-disable-next-line jsx-a11y/alt-text -- alt is in `rest` */}
      <img {...rest} className="mx-auto h-auto w-[95%] rounded-[25px] shadow-xl shadow-black" />
    </picture>
  );
}

export default function Hero() {
  return (
    <div className="mt-5 max-w-full">
      <section className="flex w-full flex-col items-center justify-center space-y-8 py-20 text-center md:space-y-10 md:py-28">
        <h1 className="max-w-4xl text-2xl font-bold md:text-4xl">
          Connecting Food and Agricultural Practitioners across Geographies
        </h1>

        <p className="max-w-4xl text-2xl leading-relaxed tracking-wider text-gray-900">
          We’re thrilled to have you join our growing community! This platform brings together
          farmers, entrepreneurs, experts, and institutions to build a sustainable, resilient, and
          healthy food system for all.
        </p>

        <div className="flex flex-row space-x-6 text-xl">
          <Link
            href="/auth/signup"
            className="rounded-full bg-blue-600 px-6 py-2 font-semibold text-white shadow-md shadow-black transition duration-300 ease-in-out hover:bg-blue-700 hover:shadow-xs active:shadow-lg"
          >
            Register Here
          </Link>
          <Link
            href="/about"
            className="rounded-full bg-gray-100 px-6 py-2 font-semibold text-black shadow-md shadow-black duration-300 ease-in-out hover:bg-gray-200 hover:shadow-xs active:shadow-lg"
          >
            Learn more
          </Link>
        </div>

        <HeroPicture />
      </section>

      <div className="mx-auto my-8 max-w-4xl px-4 pt-12 text-center">
        <section
          aria-labelledby="mission-heading"
          className="my-6 pt-6 text-2xl leading-relaxed tracking-wider text-gray-900"
          data-aos="fade-up"
        >
          <h2 id="mission-heading">Our Mission &amp; Vision:</h2>
          <ol className="list-decimal text-left">
            <li>Empowering Communities – Strengthening smallholder farmers and agribusinesses through collaboration.</li>
            <li>Innovating for Sustainability – Leading climate-smart, regenerative food systems.</li>
            <li>Building Resilience – Improving food sovereignty, nutrition, and biodiversity.</li>
            <li>Access to Finance – Bridging funding gaps for micro, small, and medium agribusinesses.</li>
            <li>Market Linkages – Connecting farmers to fair and sustainable markets.</li>
          </ol>
        </section>

        <section
          aria-labelledby="user-groups-purpose"
          className="pb-6 text-2xl leading-relaxed tracking-wider text-gray-900"
          data-aos="fade-up"
        >
          <h2 id="user-groups-purpose">Purpose of User Groups</h2>
          <p>
            To foster meaningful connections and collaborations, we invite you to self-identify
            under a user group that aligns with your role. Here’s how each group contributes:
          </p>
          <ol className="list-decimal text-left">
            <li>Organic Farmers – Share knowledge, access markets, and adopt sustainable farming practices.</li>
            <li>Agro-Ecological Experts – Provide guidance on regenerative farming and climate resilience.</li>
            <li>Academics &amp; Researchers – Drive innovation through data, studies, and policy insights.</li>
            <li>Agri Value-Chain Suppliers &amp; Distributors – Strengthen logistics, processing, and fair trade linkages.</li>
            <li>Community Support Groups – Mobilize local action, education, and food security initiatives.</li>
            <li>School Educators in Agriculture – Inspire the next generation of sustainable farmers and food leaders.</li>
            <li>Consumers &amp; Bulk Buyers – Support local farmers by sourcing ethically and promoting healthy diets.</li>
            <li>Banks &amp; Financial Institutions – Enable growth through accessible funding and investment.</li>
          </ol>
          <p>
            Join the network and connect with like-minded members, access tailored resources, and
            collaborate for greater impact. Together, we’ll cultivate a healthier, fairer, and more
            sustainable food future.
          </p>
        </section>

        <div className="flex w-full flex-col gap-4 pb-4 md:flex-row">
          <Image
            src="/library.jpg"
            alt="Farmers gathered at a community library session"
            width={300}
            height={300}
            sizes="(min-width: 768px) 300px, 100vw"
            className="mx-auto rounded-[25px] object-cover shadow-xl shadow-black"
            data-aos="fade-up"
          />
          <Image
            src="/carrot-tomato.jpg"
            alt="Freshly harvested carrots and tomatoes"
            width={300}
            height={300}
            sizes="(min-width: 768px) 300px, 100vw"
            className="mx-auto rounded-[25px] object-cover shadow-xl shadow-black"
            data-aos="fade-up"
          />
        </div>

        <section aria-labelledby="user-groups-heading" className="py-6">
          <h2 id="user-groups-heading">User Groups</h2>
          <Cards />
        </section>
      </div>
    </div>
  );
}
