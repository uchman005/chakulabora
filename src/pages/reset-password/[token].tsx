import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { useColorModeValue, useToast } from "@chakra-ui/react";
import Router, { useRouter } from "next/router";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { IUser } from "../../../interface";

export default function ResetPassword() {
  const router = useRouter();
  const { token } = router.query;
  const toast = useToast();
  const [tokenValid, setTokenValid] = useState(false);
  const [message, setMessage] = useState("Loading...");
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: ""
  });
  const [user, setUser] = useState<IUser|null>(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const validateToken = async () => {
      const res = await fetch(`/api/users/validate-reset-token?token=${token}`);
      const data = await res.json();
      if (data.success) {
        setMessage(data.message)
        setTokenValid(true);
        setUser(data.user);
      } else {
        setMessage(data.message);
      }
    };

    if (token) {
      validateToken();
    }
  }, [token]);
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const { password, confirmPassword } = formData;
    if (password !== confirmPassword) {
      toast({
        title: 'Error',
        description: 'Passwords do not match',
        status: 'error',
      });
      setLoading(false);
      return;
    }

    // Send the password reset request to the server
    const res = await fetch('/api/users/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, password }),
    });

    const data = await res.json();

    if (data.success) {
      toast({
        title: 'Success',
        description: 'Password reset successful',
        status: 'success',
      });
      if (user) {
        const resIn = await signIn("credentials", {
          email: user.email,
          password: password,
          redirect: false
        });
        if (resIn != undefined) {
          if (resIn.ok === true && resIn.status === 200) {
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
            setTimeout(() => {
              Router.push("/dashboard");
            }, 1500)
          } else if (resIn.ok === false && resIn.status === 401) {
            toast({
              title: 'Sign in Error',
              description: resIn.error,
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
    } else {
      toast({
        title: 'Error',
        description: 'Password reset failed',
        status: 'warning',
      });
    }
    setLoading(false);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }
  const bgColor = useColorModeValue("gray.50", "gray.800");
  const bgColor1 = useColorModeValue("white", "gray.700");

  if (!tokenValid) {
    return <div>{message}</div>;
  }

  return (
    <>
      <Navbar />
      <div className={`flex flex-col items-center justify-center min-h-screen bg-${bgColor}`}>
        <h1 className='text-center text-4xl md:text-5xl lg:text-6xl mb-3'>Reset password</h1>
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
                  type="password"
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
                  {loading ? "Saving..." : "Save And Signin"}
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