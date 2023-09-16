import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
export default function Coc() {
  return (
    <>
      <Navbar />
      <div className='max-w-7xl'>
        <div className="text-center flex flex-col justify-center items-center py-20 md:py-28 space-y-8 md:space-y-10">

          <h1>Chakula Bora Network Engagement & Community{' '}
            <span className='text-blue-400'>
              Rules
            </span>
          </h1>
          <ul>
            <li>Treat all users and colleagues fairly and equally. Stimulate conversation, be respectful of {"others'"} views, and refrain from personal attacks.</li>
            <li>Respect legitimate intellectual property rights, do not plagiarize work, and give credit to the originators of ideas.</li>
            <li>{"Don't"} share the posts of others without permission.</li>
          </ul>
        </div>
      </div>
      <Footer />
    </>
  )

}