export default function Contact() {
    return (
        <div className='flex flex-col md:flex-row gap-3 items-center justify-center my-[7%] mx-[7%] px-[3%]' >
            <div className='flex-1 md:text-2xl lg:text-4xl'>
                Get in touch with us
            </div>
            <div className='flex-1 border rounded-md px-3 py-7 bg-gray-900 text-white'>
                <form className='flex flex-col gap-4'>
                    <div className='form-group'>
                        <label>Your Name</label>
                        <input type='text' name='name' className='form-control' placeholder='Enter Your Name' />
                    </div>
                    <div className='form-group'>
                        <label>Your Email</label>
                        <input type='email' name='name' className='form-control' placeholder='Enter Your Email' />
                    </div>
                    <div className='form-group'>
                        <label>Message</label>
                        <textarea className='form-control' placeholder='Message goes here'></textarea>
                    </div>
                    <button type='button' className='btn rounded-lg btn-primary hover:bg-blue-300 active:bg-blue-300 text-white btn-block'>Send</button>
                </form>
            </div>
        </div>
    )
}