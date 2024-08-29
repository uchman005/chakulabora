import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { useColorModeValue } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { ChangeEvent, FormEvent, useState } from "react";
import Link from "next/link";

export default function ResetPassword() {
    const router = useRouter();
    const { token } = router.query;
    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: ""
    });
    const [loading, setLoading] = useState(false)
    const handleSubmit = (e: FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        setLoading(true);
    }
    const handleChange = (e: ChangeEvent<HTMLInputElement>)=>{
        const {name, value} = e.target
        setFormData((prev)=>({...prev, [name]: value}))
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
                  <label className="block text-gray-700 font-bold mb-2" htmlFor="password">
                    Password
                  </label>
                  <input
                    className="form-control shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="password"
                    type="password"
                    placeholder="Enter Your New password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-froup mb-4">
                  <label className="block text-gray-700 font-bold mb-2" htmlFor="confirmPassword">
                    Confirm Password
                  </label>
                  <input
                    className="form-control shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="confirmPassword"
                    type="confirmPassword"
                    placeholder="Confirm Your New Password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </div>
  
                <div className=''>
                  <button
                    className='text-white bg-blue-400 rounded p-2 hover:bg-blue-500'
                    disabled={loading}>
                    {loading ? "Saving..." :"Save"}
                  </button>
                  <div className='flex justify-between mt-2'>
                    <p>{"Don't have an account"}</p>
                    <Link className='text-blue-700' href="/auth/signup">Sign up</Link>
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