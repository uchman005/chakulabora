import { FiCheck } from "react-icons/fi";
import PageBackground from "@/components/PageBackground";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description:
    "How the Chakula Bora Network collects, uses, discloses and safeguards your personal information.",
  path: "/privacy",
});

const CheckList = ({ items }: { items: string[] }) => (
  <ul className="m-0 list-none p-0">
    {items.map((item) => (
      <li key={item} className="flex items-center justify-start gap-2 px-2">
        <FiCheck className="shrink-0 text-green-700" aria-hidden />
        <p className="m-0 text-gray-900">{item}</p>
      </li>
    ))}
  </ul>
);

const h2 = "text-2xl font-semibold sm:text-4xl";

export default function PrivacyPage() {
  return (
    <>
      <PageBackground src="/background.jpg" />
      <div className="mx-auto max-w-4xl px-4">
        <div className="flex flex-col items-center justify-center space-y-8 py-20 text-center text-lg md:space-y-10 md:py-28">
          <h1 className="text-3xl font-bold sm:text-4xl md:text-6xl">
            Privacy <span className="text-blue-700">Policy</span>
          </h1>
          <section>
            <h2 className={h2}>Introduction</h2>
            <p>
              Chakula Bora Network (&quot;us,&quot; &quot;we,&quot; or &quot;our&quot;) is committed
              to protecting your privacy and ensuring the security of your personal information.
              This Privacy Policy describes how we collect, use, disclose, and safeguard your
              personal information when you access and use our website,{" "}
              <a href="https://www.chakulabora.net" className="text-blue-700 underline">
                www.chakulabora.net
              </a>{" "}
              (the &quot;Website&quot;). By using the Website, you consent to the practices
              described in this Privacy Policy.
            </p>
          </section>
          <section>
            <h2 className={h2}>Information We Collect</h2>
            <p>
              Personal Information: We may collect personal information that you provide
              voluntarily, including but not limited to your name, email address, postal address,
              and phone number. The phone numbers collected for SMS consent will not be shared with
              third parties or affiliates for marketing purposes.
            </p>
            <p>
              Log Data: Like many websites, we collect information that your browser sends whenever
              you visit our Website (&quot;Log Data&quot;). This Log Data may include information
              such as your computer&apos;s Internet Protocol (&quot;IP&quot;) address, browser
              type, browser version, the pages of our Website that you visit, the time and date of
              your visit, and other statistics.
            </p>
            <p>
              Cookies: We may use cookies to collect information and improve your experience on our
              Website. You can instruct your browser to refuse all cookies or to indicate when a
              cookie is being sent.
            </p>
          </section>
          <section>
            <h2 className={h2}>How We Use Your Information</h2>
            <p>We may use your personal information for the following purposes:</p>
            <CheckList
              items={[
                "To provide and maintain our Website.",
                "To notify you about changes to our Website.",
                "To respond to your requests and inquiries.",
                "To improve our Website and services.",
                "To analyze usage patterns and trends.",
              ]}
            />
          </section>
          <section>
            <h2 className={h2}>Disclosure of Your Information</h2>
            <p>We may disclose your personal information in the following situations:</p>
            <CheckList
              items={[
                "To comply with legal obligations.",
                "To protect and defend our rights or property.",
                "With your consent.",
              ]}
            />
          </section>
          <section>
            <h2 className={h2}>Security</h2>
            <p>
              We take reasonable steps to protect your personal information. However, please be
              aware that no method of transmission over the internet or electronic storage is
              completely secure, and we cannot guarantee absolute security.
            </p>
          </section>
          <section>
            <h2 className={h2}>Links to Other Sites</h2>
            <p>
              Our Website may contain links to other websites not operated by us. If you click on a
              third-party link, you will be directed to that third party&apos;s site. We strongly
              advise you to review the Privacy Policy of every site you visit.
            </p>
          </section>
          <section>
            <h2 className={h2}>Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes
              by posting the new Privacy Policy on this page. You are advised to review this
              Privacy Policy periodically for any changes. Changes to this Privacy Policy are
              effective when they are posted on this page.
            </p>
          </section>
          <section>
            <h2 className={h2}>Contact Us</h2>
            <p className="max-w-3xl text-gray-700">
              If you have any questions about this Privacy Policy, please contact us:{" "}
              <a href="mailto:admin@passionofhope.org" className="text-blue-700 underline">
                admin@passionofhope.org
              </a>
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
