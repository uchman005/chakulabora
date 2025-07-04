import { useState, FormEvent, ChangeEvent } from "react";
import { signIn } from "next-auth/react";
import { useToast } from "@chakra-ui/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import axios from "axios";
import { useRouter } from "next/router";
import countriesList from "../../../utils/countries";
import Image from "next/image";
import { FaEye, FaEyeSlash, FaSpinner } from "react-icons/fa";
import Required from "@/components/Required";

export default function Form() {
  const Router = useRouter();
  const toast = useToast();
  const [show, setShow] = useState<boolean>(false);
  const [busy, setBusy] = useState<boolean>(false);
  const handleClick = () => setShow(!show);
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    email: "",
    password: "",
    repassword: ""
  });
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    if (formData.password != formData.repassword) {
      toast({
        title: "Password Error",
        description: "Passwords do not match, check your passwords and try again",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
        size: { width: "300", height: "200" },
        variant: "top-accent",
      });
      setBusy(false);
      return;
    }
    const response = await axios.post("/api/users/create", { ...formData });
    const user = response.data;
    if (user === null) {
      toast({
        title: "Account creation failed.",
        description:
          "Account creation wasn't successful, if you've created an account before, login instead",
        status: "warning",
        duration: 7000,
        isClosable: true,
        position: "top",
        size: { width: "300", height: "200" },
        variant: "top-accent",
      });
      setBusy(false);
      return;
    }
    toast({
      title: "Account created.",
      description: "We've created your account for you.",
      status: "success",
      duration: 5000,
      isClosable: true,
      position: "top",
      size: { width: "300", height: "200" },
      variant: "top-accent",
    });
    const res = await signIn("credentials", {
      email: user.email,
      password: formData.password,
      redirect: false,
    });

    if (res != undefined) {
      if (res.ok === true && res.status === 200) {
        toast({
          title: "Sign in Success",
          description: "You have been signed in successfully",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top",
          size: { width: "300", height: "200" },
          variant: "top-accent",
        });
        Router.push("/dashboard");
      } else if (res.ok === false && res.status === 401) {
        toast({
          title: "Sign in Error",
          description: res.error,
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "top",
          size: { width: "300", height: "200" },
          variant: "top-accent",
        });
      }
    }
    setBusy(false);
    return;
  };
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    let { value, name } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  return (
    <>
      <Navbar />
      <div className="bg-[url('/background.jpg')] bg-cover bg-fixed text-xl text-gray-900 py-12">
        <div className={`rounded-lg mt-5 mb-8 max-w-[50vw] mx-auto`}>
          <form onSubmit={handleSubmit} className="lg:m-8 bg-white rounded-lg p-8 shadow-xl shadow-black">
            <h1 className='text-center text-3xl mb-6'>User Registration</h1>
            <div className="flex flex-wrap -mx-3 mb-2">
              <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                <label className="block uppercase tracking-wide font-bold mb-2" htmlFor="first-name">
                  First Name: <Required />
                </label>
                <input required className="appearance-none block w-full bg-gray-200 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="first-name" type="text" placeholder={formData.fname} name='fname' value={formData.fname} onChange={handleChange} />
              </div>
              <div className="w-full md:w-1/2 px-3">
                <label className="block uppercase tracking-wide font-bold mb-2" htmlFor="last-name">
                  Last Name: <Required />
                </label>
                <input required className="appearance-none block w-full bg-gray-200 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="last-name" type="text" placeholder={formData.lname} name='lname' value={formData.lname} onChange={handleChange} />
              </div>
            </div>
            <div className="flex flex-wrap -mx-3 mb-2">

              <div className="w-full md:w-1/2 px-3">
                <label className="block uppercase tracking-wide font-bold mb-2" htmlFor="email">
                  Email: <Required />
                </label>
                <input required className="appearance-none block w-full bg-gray-200 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="email" type="email" placeholder={formData.email} name='email' value={formData.email} onChange={handleChange} />
              </div>

            </div>
            <div className="flex flex-wrap -mx-3 mb-2 mt-2">
              <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                <label className="block uppercase tracking-wide font-bold mb-2" htmlFor="password">
                  Password: <Required />
                </label>
                <input required className="appearance-none block w-full bg-gray-200 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="password" type={show ? "text" : "password"} placeholder="* * * * " name='password' value={formData.password} onChange={handleChange} />
              </div>
              <div className="flex gap-3 w-full md:w-1/2 px-3 mb-6 md:mb-0 items-center justify-center">
                <div className="w-full">
                  <label className="block uppercase tracking-wide font-bold mb-2" htmlFor="Re-password">
                    Re-password: <Required />
                  </label>
                  <input required className="appearance-none block w-full bg-gray-200 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="re-password" type={show ? "text" : "password"} placeholder="* * * *" value={formData.repassword} name='repassword' onChange={handleChange} />
                </div>
                <div className='md:w-1/6 my-6 justify-center items-center'>
                  <button type="button" className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-1 rounded shadow-black shadow-md hover:shadow-sm active:shadow-lg" onClick={handleClick}>
                    {show ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center mt-3 gap-4">

              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded min-w-[100px]  shadow-black shadow-md hover:shadow-sm active:shadow-lg" disabled={busy}>
                {busy ? <FaSpinner className="animate-spin text-2xl" /> : "Create Account"}
              </button>
                <button
                    className="bg-white border border-gray-300 text-blue-600 hover:bg-gray-100 rounded py-2 px-2 flex items-center space-x-2 shadow-black shadow-md hover:shadow-sm active:shadow-lg h-11"
                    type="button"
                    onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
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
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}
