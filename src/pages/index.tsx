import Features from "@/components/Features";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Head from "next/head";
export default function Index() {
  return (
    <>
      <Head>
        <title>Chakula bora | Home</title>
        <meta name="keywords" content="Chakulabora, Chakula-bora,chakula bora, Healthy food, Organic Agriculture, Agricultural Best practices" />
        <meta name="description" content="Chakula bora is a community that celebrates best practices around Agriculture, with emphasis on people generated contents." />


        <meta name="title" content="Chakula bora - Digital Platform" />
        <meta property="og:url" content="https://chakulabora.net" />
        <meta property="og:type" content="website" />
        <meta name="og:locale" content={'{"locale": "en_us"}'} />
        <meta name="og:description" content="Chakula bora is a community that celebrates best practices around Agriculture, with emphasis on people generated contents." />

        <meta name="description" content="Chakula bora is the digital community of farmers celebrating the best practices around Agriculture and the Environment" />


        <meta property="og:title" content="Chakula bora - Digital Platform" />
        <meta property="og:description" content="Chakula bora is the digital community of farmers celebrating the best practices around Agriculture and the Environment" />
        <meta property="og:image" content="/hero.png" />


        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://chakulabora.net" />
        <meta property="twitter:title" content="Chakula bora - Digital Platform" />
        <meta property="twitter:description" content="Chakula bora is the digital community of farmers celebrating the best practices around Agriculture and the Environment" />
        <meta property="twitter:image" content="/hero.png" />

      </Head>
      <div className="bg-[url('/background.jpg')] bg-cover bg-fixed ">
      <Navbar />
      <Hero />
      {/* <Features /> */}
      <Footer />
      </div>
    
    </>
  )
}