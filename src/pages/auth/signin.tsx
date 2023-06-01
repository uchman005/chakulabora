import { useState, useEffect } from 'react';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { signIn, useSession } from 'next-auth/react';
import Router from 'next/router'
import { useColorModeValue, useToast } from '@chakra-ui/react';
import Link from 'next/link';
import { FaEyeSlash, FaEye } from 'react-icons/fa';
export default function SignIn() {
  const { status } = useSession();
  useEffect(() => {
    if (status === "authenticated") {
      Router.replace("/dashboard")
    }
  }, [status]);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const toast = useToast();
  const handleClick = async (e: any) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      email: formData.email,
      password: formData.password,
      redirect: false
    });
    if (res != undefined) {
      if (res.ok === true && res.status === 200) {
        toast({
          title: 'Sign in Success',
          description: "You have been signed in successfully",
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: "top",
          size: { width: '300', height: '200' },
          variant: 'top-accent'
        });
        Router.push("/dashboard");
      } else if (res.ok === false && res.status === 401) {
        toast({
          title: 'Sign in Error',
          description: res.error,
          status: 'warning',
          duration: 5000,
          isClosable: true,
          position: "top",
          size: { width: '300', height: '200' },
          variant: 'top-accent'
        });
      }
    }
  }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { value, name } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }))
  }
  const bgColor = useColorModeValue("gray.50", "gray.800");
  const bgColor1 = useColorModeValue("white", "gray.700");
  const [show, setShow] = useState(true);
  const type = show ? 'text' : 'password';
  return (
    <>
      <Navbar />
      <div className={`flex items-center justify-center min-h-screen bg-${bgColor}`}>
        <div className="mx-auto max-w-lg py-12 px-6 space-y-8">
          <div className='items-center'>
            <h1 className='text-center text-4xl md:text-5xl lg:text-6xl'>Welcome back </h1>
          </div>
          <form onSubmit={handleClick}>
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
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group mb-4">
                  <label className="block text-gray-700 font-bold mb-2" htmlFor="password">
                    Password
                  </label>
                  <div className='flex gap-2'>

                    <input
                      className="form-control shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="password"
                      type={type}
                      placeholder="* * * * *"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                    />
                    <button type='button' onClick={(e) => setShow(!show)}>{show ? <FaEyeSlash /> : <FaEye />}</button>
                  </div>
                </div>
                <div className=''>
                  <div className='flex flex-col sm:flex-row items-start justify-between mb-4'>
                    <div>

                      <input
                        type="checkbox"
                        id="rememberMe"
                        name="rememberMe"
                      />
                      <label className="text-sm" htmlFor="rememberMe">
                        Remember me
                      </label>
                    </div>

                    <Link className='text-blue-400' href={'#'}>Forgot password?</Link>
                  </div>
                  <button
                    className='text-white bg-blue-400 rounded p-2 hover:bg-blue-500'>
                    Sign in
                  </button>
                  <div className='flex justify-between mt-2'>
                    <p>{"Don't have an account"}</p>
                    <Link className='text-blue-400' href="/auth/signup">Signup</Link>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}