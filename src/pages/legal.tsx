import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
export default function Legal() {
    return (
        <>
            <Navbar />
            <div className='max-w-7xl'>
                <div className="text-center flex flex-col justify-center items-center py-20 md:py-28 space-y-8 md:space-y-10">
                    <h1 className="font-semibold text-3xl sm:text-4xl md:text-6xl leading-110 font-bold">Legal{' '}
                        <span className='text-blue-400'>
                            Notice
                        </span> </h1>
                    <span className='text-gray-500 max-w-3xl'>
                        Do not post any information or other material protected by copyright
                        without permission. By posting material, the posting party warrants
                        and represents that they own the copyright with respect to such material
                        or has received permission from the copyright owner. In addition, the posting
                        party grants the Chakula Bora Network and users of this site the nonexclusive
                        right and license to display, copy, publish, distribute, transmit,
                        print, and use such information or other material.
                    </span>
                    <span className='text-gray-500 max-w-3xl'>
                        Chakula Bora Network provides communication tools as a
                        service for its members. Chakula Bora Network is not
                        responsible for opinions and information posted on this
                        site or list. We monitor but do not moderate postings on
                        this site or list, but if any inappropriate posting is
                        brought to our attention, we reserve the right to take
                        appropriate action, including, without limitation, terminating
                        access to any user who does not abide by these guidelines.
                    </span>
                </div>
                <div className="text-center flex flex-col justify-center items-center py-20 md:py-28 space-y-8 md:space-y-10">
                    <h1 className="font-semibold text-3xl sm:text-4xl md:text-6xl leading-110 font-bold">Limitations of {' '}
                        <span className='text-blue-400'>
                            Liability
                        </span> </h1>
                    <span className='text-gray-500 max-w-3xl'>
                        To the extent allowed under law, Chakula Bora Network
                        (a) disclaim all implied warranties and representations (e.g. warranties of merchantability, fitness for a particular purpose, accuracy of data, and noninfringement);
                        (b) does not guarantee that the communications tools will function without interruption or errors, and
                        (c) provide the communication tools (including content and information) on an “as is” and “as available” basis.
                        To the extent permitted under law
                        (and unless Chakula Bora Network has entered into a separate written agreement that overrides this contract),
                        Chakula Bora Network shall not be liable to you or others for any indirect, incidental, special, consequential,
                        or punitive damages, or any loss of data, opportunities, reputation, profits, or revenues, related to the communications
                        tools (e.g., offensive or defamatory statements, downtime or loss, use of, or changes to, your information or content).
                    </span>
                    <span className='text-gray-500 max-w-3xl'>
                        In no event shall the liability of the Chakula Bora Network exceed,
                        in the aggregate for all claims, $1,000. This limitation of liability
                        is part of the basis of the bargain between you and Chakula Bora Network
                        and shall apply to all claims of liability (e.g., warranty, tort, negligence,
                        contract, law) and even if Chakula Bora Network has been told of the possibility
                        of any such damage, and even if these remedies fail their essential purpose.
                    </span>
                </div>
            </div >
            <Footer />
        </>
    )

}