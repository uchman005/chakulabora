import { useState, useEffect } from 'react';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { signIn, useSession } from 'next-auth/react';
import Router from 'next/router'
import { useColorModeValue, useToast } from '@chakra-ui/react';
import Link from 'next/link';
import Image from 'next/image'
import { FaEyeSlash, FaEye, FaGoogle } from 'react-icons/fa';
import Required from '@/components/Required';
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
  const [show, setShow] = useState(false);
  const type = show ? 'text' : 'password';
  return (
    <>
      <Navbar />
      <div className="bg-[url('/background.jpg')] bg-cover bg-fixed text-xl text-gray-900">
        <div className={`pt-6 flex flex-col items-center justify-center min-h-screen bg-${bgColor}`}>
          <h1 className='text-center text-4xl md:text-5xl lg:text-6xl mt-6 mb-3'>Welcome back </h1>
          <form onSubmit={handleClick} className="lg:m-8 bg-white rounded-lg p-8 shadow-xl shadow-black">
            <h1 className="text-center text-3xl mb-6">User Login</h1>
            <div className="flex flex-wrap -mx-3 mb-2">
              <div className="w-full px-3">
                <label className="block uppercase tracking-wide font-bold mb-2" htmlFor="email">
                  Email: <Required />
                </label>
                <input
                  className="appearance-none block w-full bg-gray-200 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="email"
                  type="email"
                  placeholder="Enter Your email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="flex flex-wrap -mx-3 mb-2">
              <div className="w-full px-3">
                <label className="block uppercase tracking-wide font-bold mb-2" htmlFor="password">
                  Password: <Required />
                </label>
                <div className="flex gap-3 items-center">
                  <input
                    className="appearance-none block w-full bg-gray-200 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="password"
                    type={show ? "text" : "password"}
                    placeholder="* * * * *"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-1 rounded shadow-black shadow-md hover:shadow-sm active:shadow-lg"
                    onClick={() => setShow(!show)}
                  >
                    {show ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap -mx-3">
              <div className="w-full px-3">
                <div className="flex flex-col sm:flex-row items-start justify-between mb-4">
                  <div>
                    <input type="checkbox" id="rememberMe" name="rememberMe" />
                    <label className="text-sm" htmlFor="rememberMe">
                      Remember me
                    </label>
                  </div>
                  <Link className="text-blue-600" href="/auth/forgotpassword">
                    Forgot password?
                  </Link>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center mt-3 gap-4">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded min-w-[100px] shadow-black shadow-md hover:shadow-sm active:shadow-lg"
                type="submit"
              >
                Sign in
              </button>
              <button
                className="bg-white border border-gray-300 text-blue-600 hover:bg-gray-100 rounded py-2 px-2 flex items-center space-x-2 shadow-black shadow-md hover:shadow-sm active:shadow-lg h-11"
                type="button"
                onClick={() => signIn("google", { redirect: false })}
              >
                <Image
                  className="h-10 w-10 rounded-full"
                  src="/google.jpg"
                  width={24}
                  height={24}
                  alt="Google"
                />
                <span className="text-sm">Google</span>
              </button>
            </div>
            <div className="flex justify-between mt-4 px-3">
              <p>{"Don't "}have an account?</p>
              <Link className="text-blue-600" href="/auth/signup">
                Signup
              </Link>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}