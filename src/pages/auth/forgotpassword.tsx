import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { useSession } from 'next-auth/react';
import Router from 'next/router'
import { useColorModeValue, useToast } from '@chakra-ui/react';
import Link from 'next/link';
export default function Page() {
  const { status } = useSession();
  useEffect(() => {
    if (status === "authenticated") {
      Router.replace("/dashboard")
    }
  }, [status]);
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const toast = useToast();
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const res = await fetch('/api/users/forgotpassword', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    })
    if (!res.ok) {
      toast({
        title: 'Error',
        description: 'Something went wrong',
        status: 'error',
      });
      setLoading(false)
      return
    }
    const data = await res.json()
    if (data.success) {
      toast({
        title: 'Success',
        description: data.message,
        status: 'success',
      })
    }
    setLoading(false)
  }
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    let { value } = e.target;
    setEmail(value)
  }
  const bgColor = useColorModeValue("gray.50", "gray.800");
  const bgColor1 = useColorModeValue("white", "gray.700");
  return (
    <>
      <Navbar />
      <div className={`flex flex-col items-center justify-center min-h-screen bg-${bgColor}`}>
        <h1 className='text-center text-4xl md:text-5xl lg:text-6xl mb-3'>Forgot your password?</h1>
        <form onSubmit={handleSubmit}>
          <div className={`rounded-lg bg-${bgColor1} shadow-lg p-8 md:min-w-[50vw] lg:min-w-[50vw]`}>
            <div className='space-4'>
              <div className="form-froup mb-4">
                <label className="block text-gray-700 font-bold mb-2" htmlFor="email">
                  Email address
                </label>
                <input
                  className="form-control shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="email"
                  type="email"
                  placeholder="Enter Your email"
                  name="email"
                  value={email}
                  onChange={handleChange}
                />
              </div>

              <div className=''>
                <button
                  className='text-white bg-blue-400 rounded p-2 hover:bg-blue-500'
                  disabled={loading}>
                  {loading ? "Loading..." :"Reset"}
                </button>
                <div className='flex justify-between mt-2'>
                  <p>{"Don't have an account"}</p>
                  <Link className='text-blue-700' href="/auth/signup">Signup</Link>
                </div>
              </div>
            </div>
          </div>
        </form>

      </div>
      <Footer />
    </>
  );
}