import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Head from 'next/head'
import Link from 'next/link'
export default function Coc() {
  return (
    <>
      <Head>
        <title>Chakula Bora | Lost Donor</title>
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
      <div className='max-w-7xl flex flex-col justify-between items-center h-[92vh]'>
        <div className="text-center flex flex-col justify-center items-center py-20 md:py-28 space-y-8 md:space-y-10">

          <h1 className="text-blue-400 text-3xl md:text-4xl sm:text-3xl lg:text-6xl">
            Lost Donor
          </h1>
          <p>
            We are sorry to see you go.
          </p>
          <p>
            If you have any questions or concerns, please feel free to contact us at <Link href="mailto:admin@passionofhope.org">admin@passionofhope.org</Link>.
          </p>
        </div>
        <Footer />
      </div>
    </>
  )

}