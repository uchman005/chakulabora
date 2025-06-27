import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Head from 'next/head'
import { Icon } from '@chakra-ui/react';
import { CheckIcon } from '@chakra-ui/icons';

export default function Privacy() {
    return (
        <>
            <Head>
                <title>Chakula Bora | Privacy Policy</title>
                <meta name="keywords" content="Chakulabora, Chakula-bora, Healthy food, Organic Agriculture, Agricultural Best practices" />
                <meta name="description" content="Chakulabora is a community that celebrates best practices around Agriculture, with emphasis on people generated contents." />
                <meta name="title" content="Chakulabora - Digital Platform" />
                <meta property="og:url" content="https://chakulabora.net/privacy" />
                <meta property="og:type" content="website" />
                <meta name="og:locale" content={'{"locale": "en_us"}'} />
                <meta name="og:description" content="Chakulabora is a community that celebrates best practices around Agriculture, with emphasis on people generated contents." />
                <meta name="description" content="Chakulabora is the digital community of farmers celebrating the best practices around Agriculture and the Environment" />
                <meta property="og:title" content="Chakulabora - Digital Platform" />
                <meta name='viewport' content='width=device-width, initial-scale=1.0' />
                <meta property="og:description" content="Chakulabora is the digital community of farmers celebrating the best practices around Agriculture and the Environment" />
                <meta property="og:image" content="/hero.png" />
                <meta property="twitter:card" content="summary_large_image" />
                <meta property="twitter:url" content="https://chakulabora.net/privacy" />
                <meta property="twitter:title" content="Chakulabora - Digital Platform" />
                <meta property="twitter:description" content="Chakulabora is the digital community of farmers celebrating the best practices around Agriculture and the Environment" />
                <meta property="twitter:image" content="/hero.png" />
                <meta name="msapplication-TileColor" content="#ffffff" />
            </Head>
            <Navbar />
      <div className="bg-[url('/background.jpg')] bg-cover bg-fixed text-xl text-gray-900">

            <main className='max-w-4xl mx-auto'>
                <div className="text-center flex flex-col justify-center items-center py-20 md:py-28 space-y-8 md:space-y-10 text-lg">
                    <h1 className="font-semibold text-3xl sm:text-4xl md:text-6xl leading-110 font-bold" >Privacy <span className='text-blue-400'>Policy</span></h1>
                    <section>
                        <h2 className="font-semibold text-2xl sm:text-4xl md:text-4xl">Introduction</h2>
                        <p>
                            Chakula Bora Network (&quot;us,&quot; &quot;we,&quot; or &quot;our&quot;) is committed to protecting your privacy and
                            ensuring the security of your personal information. This Privacy Policy describes how we
                            collect, use, disclose, and safeguard your personal information when you access and use our
                            website, <a href="https://www.chakulabora.net">www.chakulabora.net</a> (the &quot;Website&quot;). By using the Website, you consent to the
                            practices described in this Privacy Policy.
                        </p>
                    </section>
                    <section>
                        <h2 className="font-semibold text-2xl sm:text-4xl md:text-4xl">Information We Collect</h2>
                        <p>
                            Personal Information: We may collect personal information that you provide voluntarily,
                            including but not limited to your name, email address, postal address, and phone
                            number. The phone numbers collected for SMS consent will not be shared with third
                            parties or affiliates for marketing purposes.
                        </p>
                        <p>
                            Log Data: Like many websites, we collect information that your browser sends whenever
                            you visit our Website (&quot;Log Data&quot;). This Log Data may include information such as your
                            computer&#39;s Internet Protocol (&quot;IP&quot;) address, browser type, browser version, the pages of
                            our Website that you visit, the time and date of your visit, and other statistics.
                        </p>
                        <p>
                            Cookies: We may use cookies to collect information and improve your experience on our
                            Website. You can instruct your browser to refuse all cookies or to indicate when a
                            cookie is being sent.
                        </p>
                    </section>
                    <section>
                        <h2 className="font-semibold text-2xl sm:text-4xl md:text-4xl">How We Use Your Information</h2>
                        <p>
                            We may use your personal information for the following purposes:
                        </p>
                        <ul className="p-0">
                            <li className="px-2 text-green-400 flex items-center justify-start gap-2">
                                <Icon as={CheckIcon} />
                                <p className="m-0 text-gray-900">
                                    To provide and maintain our Website.
                                </p>
                            </li>
                            <li className="px-2 text-green-400 flex items-center justify-start gap-2">
                                <Icon as={CheckIcon} />
                                <p className="m-0 text-gray-900">
                                    To notify you about changes to our Website.
                                </p>
                            </li>
                            <li className="px-2 text-green-400 flex items-center justify-start gap-2">
                                <Icon as={CheckIcon} />
                                <p className="m-0 text-gray-900">
                                    To respond to your requests and inquiries.
                                </p>
                            </li>
                            <li className="px-2 text-green-400 flex items-center justify-start gap-2">
                                <Icon as={CheckIcon} />
                                <p className="m-0 text-gray-900">
                                    To improve our Website and services.
                                </p>
                            </li>
                            <li className="px-2 text-green-400 flex items-center justify-start gap-2">
                                <Icon as={CheckIcon} />
                                <p className="m-0 text-gray-900">
                                    To analyze usage patterns and trends.
                                </p>
                            </li>
                        </ul>
                    </section>
                    <section>
                        <h2 className="font-semibold text-2xl sm:text-4xl md:text-4xl">Disclosure of Your Information</h2>
                        <p>
                            We may disclose your personal information in the following situations:
                        </p>
                        <ul>
                            <li className="px-2 text-green-400 flex items-center justify-start gap-2">
                                <Icon as={CheckIcon} />
                                <p className="m-0 text-gray-900">
                                    To comply with legal obligations.
                                </p>
                            </li>
                            <li className="px-2 text-green-400 flex items-center justify-start gap-2">
                                <Icon as={CheckIcon} />
                                <p className="m-0 text-gray-900">
                                    To protect and defend our rights or property.
                                </p>
                            </li>
                            <li className="px-2 text-green-400 flex items-center justify-start gap-2">
                                <Icon as={CheckIcon} />
                                <p className="m-0 text-gray-900">
                                    With your consent.
                                </p>
                            </li>
                        </ul>
                    </section>
                    <section>
                        <h2 className="font-semibold text-2xl sm:text-4xl md:text-4xl">
                            Security
                        </h2>
                        <p>
                            We take reasonable steps to protect your personal information. However, please be aware
                            that no method of transmission over the internet or electronic storage is completely secure,
                            and we cannot guarantee absolute security.
                        </p>
                    </section>
                    <section>
                        <h2 className="font-semibold text-2xl sm:text-4xl md:text-4xl">Links to Other Sites</h2>
                        <p>
                            Our Website may contain links to other websites not operated by us. If you click on a third-
                            party link, you will be directed to that third party&#39;s site. We strongly advise you to review
                            the Privacy Policy of every site you visit.
                        </p>
                    </section>
                    <section>
                        <h2 className="font-semibold text-2xl sm:text-4xl md:text-4xl">
                            Changes to This Privacy Policy
                        </h2>
                        <p>
                            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
                            You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
                        </p>
                    </section>
                    <article>
                        <h2 className="font-semibold text-2xl sm:text-4xl md:text-4xl">
                            Contact Us
                        </h2>
                        <p className='text-gray-500 max-w-3xl'>
                            If you have any questions about this Privacy Policy, please contact us:
                            admin@passionofhope.org
                        </p>
                    </article>
                </div>
            </main>
            </div>
            <Footer />
        </>
    )

}