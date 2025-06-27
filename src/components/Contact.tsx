import { ChangeEvent, FormEvent, useState } from "react"
import { useToast } from "@chakra-ui/react"
export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
        subject: '',
    });
    const toast = useToast();
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData((prev) => {
            const { name, value } = e.target;
            return { ...prev, [name]: value }
        })
    }
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        fetch('/api/users/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        })
            .then(res => res.json())
            .then(data => {
                if (data) {
                    toast({
                        title: 'Message Sent',
                        description: "Your messagge was sent successfully, we'll reply to you soon",
                        status: 'success',
                        duration: 5000,
                        isClosable: true,
                        position: "top",
                        size: { width: '300', height: '200' },
                        variant: 'top-accent'
                    })
                    setFormData({
                        name: '',
                        email: '',
                        subject: '',
                        message: ''
                    })
                } else {
                    toast({
                        title: 'Message failed to send',
                        description: 'Something went wrong on our end, retry in a few minutes',
                        status: 'warning',
                        duration: 5000,
                        isClosable: true,
                        position: "top",
                        size: { width: '300', height: '200' },
                        variant: 'top-accent'
                    })
                    setFormData({
                        name: '',
                        email: '',
                        subject: '',
                        message: ''
                    })
                }
            }).catch((error) =>{
                toast({
                    title: 'Message failed to send',
                    description: 'Something went wrong on our end'+ error.message,
                    status: 'warning',
                    duration: 5000,
                    isClosable: true,
                    position: "top",
                    size: { width: '300', height: '200' },
                    variant: 'top-accent'
                })
                setFormData({
                    name: '',
                    email: '',
                    subject: '',
                    message: ''
                })

            })
    }
    return (
        <div className='flex flex-col md:flex-row gap-3 items-center justify-center py-[12%] mx-[7%] px-[3%]' >
            <div className='flex-1 md:text-2xl lg:text-4xl'>
                Get in touch with us
            </div>
            <div className='flex-1 border rounded-md px-3 py-7 bg-gray-900 text-white'>
                <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
                    <div className='form-group'>
                        <label>Your Name</label>
                        <input type='text' name='name' className='form-control' placeholder='Enter Your Name' onChange={handleChange} value={formData.name} required />
                    </div>
                    <div className='form-group'>
                        <label>Your Email</label>
                        <input type='email' name='email' className='form-control' placeholder='Enter Your Email' onChange={handleChange} value={formData.email} required />
                    </div>
                    <div className='form-group'>
                        <label>Subject</label>
                        <input type='text' name='subject' className='form-control' placeholder='Subject' onChange={handleChange} value={formData.subject} required />
                    </div>
                    <div className='form-group'>
                        <label>Message</label>
                        <textarea className='form-control' name="message" placeholder='Message goes here' onChange={handleChange} value={formData.message} required></textarea>
                    </div>
                    <button type='submit' className='btn rounded-lg btn-primary hover:bg-blue-300 active:bg-blue-300 text-white btn-block'>Send</button>
                </form>
            </div>
        </div>
    )
}