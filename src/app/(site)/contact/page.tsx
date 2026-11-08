import Contact from "@/components/Contact";
import PageBackground from "@/components/PageBackground";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Contact",
  description: "Get in touch with the Chakula Bora Network team — questions, partnerships and support.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <PageBackground src="/background.jpg" />
      <Contact />
    </>
  );
}
