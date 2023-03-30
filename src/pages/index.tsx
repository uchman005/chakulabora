import Features from "@/components/Features";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Testimonials from "@/components/Testimonials";

export default function Index(){
  return (
  <>
  <Navbar />
  {/* <Carousel /> */}
  <Hero />
  <Features />
  <Testimonials />
  <Footer />
  </>
  )
}