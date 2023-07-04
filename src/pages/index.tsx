import Features from "@/components/Features";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Testimonials from "@/components/Testimonials";
import Head from "next/head";
export default function Index(){
  return (
  <>
  <Head>
    <title>Chakulabora</title>
    <meta name="keywords" content="Chakulabora, Chakula-bora, Healthy food, Organic Agriculture, Agricultural Best practices"/>
    <meta name="description" content="Chakulabora is a community that celebrates best practices around Agriculture, with emphasis on people generated contents."/>
    <meta name="og:title" content="Chakulabora digital platform"/>
    <meta name="og:type" content="Web Page"/>
    <meta name="og:description" content="Chakulabora is a community that celebrates best practices around Agriculture, with emphasis on people generated contents."/>
  </Head>
  <Navbar />
  <Hero />
  <Features />
  <Testimonials />
  <Footer />
  </>
  )
}