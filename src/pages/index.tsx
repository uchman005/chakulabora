import Features from "@/components/Features";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Head from "next/head";
import Image from "next/image"
export default function Index() {
  return (
    <>
      <Head>
        <title>Chakulabora | Home</title>
        <meta name="keywords" content="Chakulabora, Chakula-bora, Healthy food, Organic Agriculture, Agricultural Best practices" />
        <meta name="description" content="Chakulabora is a community that celebrates best practices around Agriculture, with emphasis on people generated contents." />


        <meta name="title" content="Chakulabora - Digital Platform" />
        <meta property="og:url" content="https://chakulabora.net" />
        <meta property="og:type" content="website" />
        <meta name="og:locale" content={'{"locale": "en_us"}'} />
        <meta name="og:description" content="Chakulabora is a community that celebrates best practices around Agriculture, with emphasis on people generated contents." />

        <meta name="description" content="Chakulabora is the digital community of farmers celebrating the best practices around Agriculture and the Environment" />


        <meta property="og:title" content="Chakulabora - Digital Platform" />
        <meta property="og:description" content="Chakulabora is the digital community of farmers celebrating the best practices around Agriculture and the Environment" />
        <meta property="og:image" content="/hero.png" />


        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://chakulabora.net" />
        <meta property="twitter:title" content="Chakulabora - Digital Platform" />
        <meta property="twitter:description" content="Chakulabora is the digital community of farmers celebrating the best practices around Agriculture and the Environment" />
        <meta property="twitter:image" content="/hero.png" />

      </Head>
      <Navbar />
      <Hero />
      <Features />
      <section className="container my-4 max-w-3xl text-center">
        <h2 className="text-3xl mb-3">WHO WE ARE</h2>
        <p>
          We are a community committed to Healthy Food, from farm to fork for all Africans.  Healthy food is nature created. Healthy Food strengthens the human immune system and is the first line of attack against disease. We focus on Africa because the continent is in a battle for its food sovereignty.  It is inconceivable    that the continent with the most arable land cannot feed itself.  Solutions abound to address {"Africa's"} food security challenges but most come from those with an agenda of dependency economics and resource extraction. Nature has already perfectly provided what is needed to feed the {"world's"} expanding population.  Food security comes with a responsibility to align with its principles and be stewards of our environment.
        </p>
        <p>
          The Chakula Bora community includes: farmers, agricultural students, agricultural extensionists, researchers, economists, ecologists, pastoralists, value addition players, policy influencers, and concerned global citizens.
        </p>
      </section>
      <div className="flex my-5 justify-center w-full">
        <div className="flex flex-col lg:flex-row justify-center w-[85%] gap-4">
          <section className="flex flex-col items-center justify-center gap-3 p-4">
            <Image src="/chak1.jpeg" className="w-full" width={420} height={250} alt="Young African man on his corn field" loading={"lazy"} title="Organic agriculture" />
            <h2>Chakula Bora</h2>
            <p>
              The Chakula Bora Digital Network is an integrated learning management system designed to grow a knowledge ecosystem through a collaborative pedagogical model and with participatory learning. The platform combines professional and academic content with medium and small-holder {"farmer's"} local, experiential knowledge in multiple formats and languages.
            </p>
            <p>
              The network allows for peer-to-peer interaction through knowledge sharing engagements, making the best use of technology such as smartphones and tablets to disseminate information. An SMS technology interface invites collaboration with the simplest of telecom devices. Content is tailored to each user segment.
            </p>
            <p>
              The digital network intends to be a single source for indigenous knowledge, a central repository for learning, containing publications, instructional videos, guidance notes on best practices, and internet forums
            </p>
          </section>
          <section className="flex flex-col items-center gap-3 p-4">
            <Image src="/chak2.jpeg" className="w-full" width={465} height={235} alt="Women working on a vegetable field" loading={"lazy"} title="Organic agriculture" />
            <h2>Triple P</h2>
            <p>
              We are grounded in the 3Ps: Planet + People = Productivity.  We anticipate our collaborations with you will give rise to innovations, actions, resources, and policies which affirm the principles of food sovereignty, agroecological balance, restored biodiversity and strengthened economies for the {"world's"} most impoverished of communities, both rural and urban.
            </p>
          </section>
        </div>
      </div>
      {/* <section className="text-center">
        <h2>
        Goals of the Network
        </h2>

      </section> */}
      <Footer />
    </>
  )
}