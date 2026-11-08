import PageBackground from "@/components/PageBackground";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Code of Conduct",
  description: "The Chakula Bora Network engagement and community code of conduct.",
  path: "/coc",
});

export default function CocPage() {
  return (
    <>
      <PageBackground src="/background.jpg" />
      <div className="mx-auto mt-5 max-w-5xl px-2">
        <div className="flex flex-col items-center justify-center space-y-8 py-20 text-center md:space-y-10 md:py-28">
          <h1>
            Chakula Bora Network Engagement &amp; Community{" "}
            <span className="text-blue-700">Code of Conduct</span>
          </h1>
          <ul className="max-w-3xl list-disc text-left text-xl leading-relaxed tracking-wider">
            <li>
              Treat all users and colleagues fairly and equally. Stimulate conversation, be
              respectful of others&apos; views, and refrain from personal attacks.
            </li>
            <li>
              Respect legitimate intellectual property rights, do not plagiarize work, and give
              credit to the originators of ideas.
            </li>
            <li>Don&apos;t share the posts of others without permission.</li>
          </ul>
        </div>
      </div>
    </>
  );
}
