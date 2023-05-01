import { useState } from "react";
import { signIn } from "next-auth/react";
import { useToast } from "@chakra-ui/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import axios from "axios";
import { useRouter } from "next/router";
import countriesList from "../../../utils/countries";
const Form1 = (props: any) => {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  return (
    <>
      <h1 className="flex justify-center w-full font-xl mb-[2%]">
        User Registration
      </h1>
      <div className="flex flex-col">
        <div className="">
          <label htmlFor="first-name" className="form-label">
            First name
          </label>
          <input
            type="text"
            name="fname"
            id="first-name"
            className="form-control shadow-sm focus:ring-brand-400 focus:border-brand-400 border-gray-300 rounded-md"
            placeholder="First name"
            value={props.Data.name}
            onChange={props.setFormData}
          />
        </div>
        <div className="">
          <label htmlFor="last-name" className="form-label">
            Last name
          </label>
          <input
            type="text"
            name="lname"
            id="last-name"
            className="form-control shadow-sm focus:ring-brand-400 focus:border-brand-400 border-gray-300 rounded-md"
            placeholder="Last name"
            value={props.Data.lname}
            onChange={props.setFormData}
          />
        </div>
      </div>
      <div className="mt-4">
        <label htmlFor="email" className="block font-medium text-gray-700">
          Email address
        </label>
        <div className="mt-1">
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-400 focus:border-brand-400 focus:placeholder-gray-500 sm:text-sm"
            value={props.Data.email}
            onChange={props.setFormData}
          />
        </div>
        <p className="mt-2 text-sm text-gray-500">
          {"We'll never share your email with anyone else."}
        </p>
      </div>

      <div className="mt-4">
        <label htmlFor="tel" className="block font-medium text-gray-700">
          Phone
        </label>
        <input
          id="tel"
          type="tel"
          name="phone"
          value={props.Data.phone}
          onChange={props.setFormData}
          className="mt-1 focus:ring-brand-400 focus:border-brand-400 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
        />
      </div>

      <div className="mt-4">
        <label htmlFor="password" className="block font-medium text-gray-700">
          Password
        </label>
        <div>
          <input
            type={show ? "text" : "password"}
            placeholder="Enter password"
            name="password"
            value={props.Data.password}
            onChange={props.setFormData}
          />
          <button type="button" onClick={handleClick}>
            {show ? "Hide" : "Show"}
          </button>
        </div>
      </div>
    </>
  );
};

const Form2 = (props: any) => {
  return (
    <>
      <h1 className="flex justify-center w-full font-xl mb-[2%]">
        User Details
      </h1>
      <div className="form-group">
        <label htmlFor="category">Country / Region </label>

        <input
          list="country"
          required
          placeholder="Select Your country"
          className="form-control"
          name="country"
          value={props.Data.country}
          onChange={props.setFormData}
        />
        <datalist id="country">
          {countriesList.map((item) => (
            <option value={item.name} key={item.code} />
          ))}
        </datalist>
      </div>

      <div className="col-span-6">
        <label
          htmlFor="street_address"
          className="block text-sm text-base font-medium  mt-2"
        >
          Street address
        </label>
        <input
          type="text"
          name="street_address"
          id="street_address"
          autoComplete="street-address"
          className="form-control mt-1 rounded-md"
          value={props.Data.street_address}
          onChange={props.setFormData}
        />
      </div>

      <div className="flex flex-col">
        <label
          htmlFor="city"
          className="block text-sm font-medium text-gray-700 mt-2 col-span-2"
        >
          City
        </label>
        <input
          type="text"
          name="city"
          id="city"
          autoComplete="city"
          className="form-control mt-2 focus:border-brand-400 shadow-sm sm:text-sm rounded-md col-span-6 sm:col-span-4"
          value={props.Data.city}
          onChange={props.setFormData}
        />
      </div>

      <div className="col-span-6 sm:col-span-3 lg:col-span-2">
        <label
          htmlFor="state"
          className="block text-sm font-medium text-gray-700  my-2"
        >
          State / Province
        </label>
        <input
          type="text"
          name="state"
          id="state"
          autoComplete="state"
          className="form-control mt-1 focus:ring-brand-400 focus:border-brand-400 block w-full sm:text-sm border-gray-300 rounded-md shadow-sm"
          value={props.Data.state}
          onChange={props.setFormData}
        />
      </div>

      <div className="col-span-6 sm:col-span-3 lg:col-span-2">
        <label
          htmlFor="postal_code"
          className="block text-sm font-medium text-gray-700 mt-2"
        >
          ZIP / Postal
        </label>
        <input
          type="text"
          name="postal_code"
          id="postal_code"
          autoComplete="postal-code"
          className="form-control mt-1 focus:ring-brand-400 focus:border-brand-400 block w-full sm:text-sm border-gray-300 rounded-md shadow-sm"
          value={props.Data.postal_code}
          onChange={props.setFormData}
        />
      </div>
    </>
  );
};

const Form3 = (props: any) => {
  return (
    <>
      <h1 className="flex justify-center w-full font-xl mb-[2%]">
        Social Handles
      </h1>
      <div className="flex flex-col space-6">
        <div className="col-span-3 sm:col-span-2">
          <label
            htmlFor="website"
            className="block text-sm font-medium text-gray-700 dark:text-gray-50"
          >
            Website
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-100 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 sm:text-sm">
              http://
            </span>
            <input
              type="url"
              name="website"
              id="website"
              value={props.Data.website}
              onChange={props.setFormData}
              className="form-control focus:ring-brand-400 focus:border-brand-400 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300 dark:border-gray-700 dark:text-gray-50"
              placeholder="www.example.com"
            />
          </div>
        </div>

        <div className="mt-2">
          <label
            htmlFor="about"
            className="block text-sm font-medium text-gray-700"
          >
            About
          </label>
          <div className="mt-2">
            <textarea
              id="about"
              name="bio"
              rows={3}
              className="form-control shadow-sm focus:ring-brand-400 focus:border-brand-400 block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="About you"
              value={props.Data.bio}
              onChange={props.setFormData}
            />
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Brief description for your profile. URLs are hyperlinked.
          </p>
        </div>
      </div>
    </>
  );
};

export default function Form() {
  const Router = useRouter();
  const toast = useToast();
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(33.33);
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    email: "",
    phone: "",
    country: "",
    bio: "",
    password: "",
    street_address: "",
    city: "",
    state: "",
    postal_code: "",
    website: "",
  });
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const response = await axios.post("/api/users/create", { ...formData });
    const user = response.data.user;
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
      Router.push("/auth/signin");
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
    return;
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { value, name } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  return (
    <>
      <Navbar />
      <form className="border border-gray-300 rounded-lg shadow-md max-w-lg p-6 mx-auto my-10">
        <div className="w-full bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-3 bg-green-400"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        {step === 1 ? (
          <Form1 Data={formData} setFormData={handleChange} />
        ) : step === 2 ? (
          <Form2 Data={formData} setFormData={handleChange} />
        ) : (
          <Form3 Data={formData} setFormData={handleChange} />
        )}
        <div className="w-full mt-[5%]">
          <div className="flex w-full justify-between">
            <div className="flex">
              <button
                type="button"
                onClick={() => {
                  setStep(step - 1);
                  setProgress(progress - 33.33);
                }}
                className={`'hover:bg-teal-300 disabled:opacity-30'`}
                disabled={step === 1}
                style={{
                  backgroundColor: "teal",
                  color: "white",
                  width: "7rem",
                  marginRight: "5%",
                }}
              >
                Back
              </button>

              <button
                className="w-28 disabled:opacity-10 border-2 border-teal-500 text-teal-500 rounded-md py-2 px-4 font-semibold hover:text-white hover:bg-teal-500 hover:border-teal-500 transition-colors duration-300"
                disabled={step === 3}
                type="button"
                onClick={() => {
                  setStep(step + 1);
                  if (step === 3) {
                    setProgress(100);
                  } else {
                    setProgress(progress + 33.33);
                  }
                }}
              >
                Next
              </button>
            </div>
            {step === 3 && (
              <button
                className="w-28 px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={handleSubmit}
              >
                Submit
              </button>
            )}
          </div>
        </div>
      </form>
      <Footer />
    </>
  );
}
