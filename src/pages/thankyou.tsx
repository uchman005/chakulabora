import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Head from 'next/head'
import Link from 'next/link'
export default function Coc() {
    return (
        <>
            <Head>
                <title>Chakula Bora | Thank you</title>
                <meta name="keywords" content="Chakulabora, Chakula-bora, Healthy food, Organic Agriculture, Agricultural Best practices" />
                <meta name="description" content="Chakulabora is a community that celebrates best practices around Agriculture, with emphasis on people generated contents." />
                <meta name="author" content="Chakulabora" />
                <meta name="title" content="Chakulabora - Digital Platform" />
                <meta property="og:url" content="https://chakulabora.net/coc" />
                <meta property="og:type" content="website" />
                <meta name="og:locale" content={'{"locale": "en_us"}'} />
                <meta name="og:description" content="Chakulabora is a community that celebrates best practices around Agriculture, with emphasis on people generated contents." />
                <meta name="description" content="Chakulabora is the digital community of farmers celebrating the best practices around Agriculture and the Environment" />
                <meta property="og:title" content="Chakulabora - Digital Platform" />
                <meta name='viewport' content='width=device-width, initial-scale=1.0' />
                <meta property="og:description" content="Chakulabora is the digital community of farmers celebrating the best practices around Agriculture and the Environment" />
                <meta property="og:image" content="/hero.png" />
                <meta property="twitter:card" content="summary_large_image" />
                <meta property="twitter:url" content="https://chakulabora.net/coc" />
                <meta property="twitter:title" content="Chakulabora - Digital Platform" />
                <meta property="twitter:description" content="Chakulabora is the digital community of farmers celebrating the best practices around Agriculture and the Environment" />
                <meta property="twitter:image" content="/hero.png" />
                <meta name="msapplication-TileColor" content="#ffffff" />
                <meta name="msapplication-TileImage" content="/ms-icon-144x144.png" />
            </Head>

            <Navbar />
      <div className="bg-[url('/background.jpg')] bg-cover bg-fixed text-xl text-gray-900">
            <main className='max-w-5xl mx-auto'>
                <div className="text-center flex flex-col justify-center items-center py-20 md:py-28 space-y-8 md:space-y-10">
                    {/* This is a paypal donation thank you page */}
                    <h1 className='text-6xl md:text-4xl sm:text-4xl lg:text-6xl'>
                        Thank you for your <span className='text-blue-400 font-bold'>donation!</span>
                    </h1>

                    <p className='text-2xl md:text-xl sm:text-xl lg:text-2xl'>
                        Your support is helping us to continue providing valuable resources and services to our community of farmers.
                    </p>
                    <p className='text-2xl md:text-xl sm:text-xl lg:text-2xl'>
                        We appreciate your generosity and look forward to continuing to prodive value to you in the future.
                    </p>
                    <p className='text-2xl md:text-xl sm:text-xl lg:text-2xl'>
                        If you have any questions or concerns, please {"don't"} hesitate to <Link href="/contact" className="text-blue-600 hover:text-blue-800">contact us</Link>
                    </p>
                </div>
            </main>
            </div>
            <Footer />
        </>
    )

}