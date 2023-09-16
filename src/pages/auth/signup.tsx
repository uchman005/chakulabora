import { useState } from "react";
import { signIn } from "next-auth/react";
import { useToast } from "@chakra-ui/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import axios from "axios";
import { useRouter } from "next/router";
import countriesList from "../../../utils/countries";
import { FaEye, FaEyeSlash, FaSpinner } from "react-icons/fa";

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
    phone: "",
    country: "",
    bio: "",
    password: "",
    repassword: "",
    street_address: "",
    city: "",
    state: "",
    postal_code: "",
    website: "",
  });
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
      password: user.password,
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
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    let { value, name } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  return (
    <>
      <Navbar />
      <form onSubmit={handleSubmit} className="lg:m-8 shadow rounded-lg p-8">
        <h1 className='text-center text-3xl mb-6'>User Registration</h1>
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="first-name">
              First Name: <span className='text-red-400 italics'>*</span>
            </label>
            <input required className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="first-name" type="text" placeholder={formData.fname} name='fname' value={formData.fname} onChange={handleChange} />
          </div>
          <div className="w-full md:w-1/2 px-3">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="last-name">
              Last Name: <span className='text-red-400 italics'>*</span>
            </label>
            <input required className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="last-name" type="text" placeholder={formData.lname} name='lname' value={formData.lname} onChange={handleChange} />
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 mb-6">

          <div className="w-full md:w-1/2 px-3">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="email">
              Email: <span className='text-red-400 italics'>*</span>
            </label>
            <input required className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="email" type="email" placeholder={formData.email} name='email' value={formData.email} onChange={handleChange} />
          </div>

          <div className="w-full md:w-1/2 px-3">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="website">
              Phone: <span className='text-red-400 italics'>*</span>
            </label>
            <input required className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="phone" type="text" placeholder={formData.phone} name='phone' value={formData.phone} onChange={handleChange} />
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full md:w-1/2 px-3">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="email">
              Website
            </label>
            <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="website" type="text" placeholder={formData.website} name='website' value={formData.website} onChange={handleChange} />
          </div>
        </div>

        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full px-3">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="password">
              Bio
            </label>

            <textarea className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" name='bio' value={formData.bio} placeholder='Write a short bio' onChange={handleChange}>

            </textarea>
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 mb-6">

          <div className="w-full md:w-1/2 px-3">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="street_address">
              Street
            </label>
            <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="street_address" name='street_address' type="text" placeholder="Your street or close Landmark" value={formData.street_address} onChange={handleChange} />
          </div>

          <div className="w-full md:w-1/2 px-3">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="website">
              Country / Region
            </label>

            <input
              list="country"
              required
              placeholder="Select Your country"
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              name="country"
              value={formData.country}
              onChange={handleChange}
            />
            <datalist id="country">
              {countriesList.map((item) => (
                <option value={item.name} key={item.code} />
              ))}
            </datalist>
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 mb-2">
          <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="city">
              City
            </label>
            <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="city" type="text" placeholder="Your city" name='city' value={formData.city} onChange={handleChange} />
          </div>
          <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="state">
              State
            </label>
            <div className="relative">
              <input className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="state" type='text' placeholder='Your state' name='state' onChange={handleChange} value={formData.state} />
            </div>
          </div>
          <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="postal_code">
              Zip
            </label>
            <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="postal_code" type="text" placeholder="480" value={formData.postal_code} name='postal_code' onChange={handleChange} />
          </div>

        </div>
        <div className="flex flex-wrap -mx-3 mb-4 mt-4">
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="password">
              Password: <span className='text-red-400 italics'>*</span>
            </label>
            <input required className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="password" type={show ? "text" : "password"} placeholder="* * * * " name='password' value={formData.password} onChange={handleChange} />
          </div>
          <div className="flex gap-3 w-full md:w-1/2 px-3 mb-6 md:mb-0 items-center justify-center">
            <div className="w-full">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="Re-password">
                Re-password: <span className='text-red-400 italics'>*</span>
              </label>
              <input required className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="re-password" type={show ? "text" : "password"} placeholder="* * * *" value={formData.repassword} name='repassword' onChange={handleChange} />
            </div>
            <div className='md:w-1/6 my-6 justify-center items-center'>
              <button type="button" className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-1 rounded" onClick={handleClick}>
                {show ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center mt-3">
          {
            busy ?
              <button type="button" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded min-w-[100px] text-center">
                <FaSpinner className="animate-spin text-3xl" />
              </button>
              :
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded min-w-[100px]">
                CREATE ACCOUNT
              </button>
          }
        </div>
      </form>
      <Footer />
    </>
  );
}
