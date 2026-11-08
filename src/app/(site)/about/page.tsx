import About from "@/components/About";
import Features from "@/components/Features";
import PageBackground from "@/components/PageBackground";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "About",
  description:
    "Chakula Bora is a digital platform for stakeholders in agriculture to network, engage and share knowledge on regenerative agriculture, food sovereignty and healthy food.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <PageBackground src="/background.jpg" />
      <About />
      <Features />
    </>
  );
}
