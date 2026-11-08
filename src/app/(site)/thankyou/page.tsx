import Link from "next/link";
import PageBackground from "@/components/PageBackground";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Thank you",
  description: "Thank you for your donation to the Chakula Bora Network.",
  path: "/thankyou",
  noIndex: true,
});

export default function ThankYouPage() {
  return (
    <>
      <PageBackground src="/background.jpg" />
      <div className="mx-auto max-w-5xl px-4">
        {/* PayPal donation thank-you page */}
        <div className="flex flex-col items-center justify-center space-y-8 py-20 text-center md:space-y-10 md:py-28">
          <h1 className="text-4xl lg:text-6xl">
            Thank you for your <span className="font-bold text-blue-700">donation!</span>
          </h1>
          <p className="text-xl lg:text-2xl">
            Your support is helping us to continue providing valuable resources and services to our
            community of farmers.
          </p>
          <p className="text-xl lg:text-2xl">
            We appreciate your generosity and look forward to continuing to provide value to you in
            the future.
          </p>
          <p className="text-xl lg:text-2xl">
            If you have any questions or concerns, please don&apos;t hesitate to{" "}
            <Link href="/contact" className="text-blue-700 underline hover:text-blue-900">
              contact us
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
