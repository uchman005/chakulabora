import PageBackground from "@/components/PageBackground";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Lost Donor",
  description: "We are sorry to see you go. Contact the Chakula Bora Network team with any questions.",
  path: "/lostdonor",
  noIndex: true,
});

export default function LostDonorPage() {
  return (
    <>
      <PageBackground src="/background.jpg" />
      <div className="flex max-w-7xl flex-col items-center justify-between px-4">
        <div className="flex flex-col items-center justify-center space-y-8 py-20 text-center md:space-y-10 md:py-28">
          <h1 className="text-3xl text-blue-700 sm:text-3xl md:text-4xl lg:text-6xl">Lost Donor</h1>
          <p>We are sorry to see you go.</p>
          <p>
            If you have any questions or concerns, please feel free to contact us at{" "}
            <a href="mailto:admin@passionofhope.org" className="text-blue-700 underline">
              admin@passionofhope.org
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
