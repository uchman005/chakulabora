import PageBackground from "@/components/PageBackground";
import { pageMetadata } from "@/lib/metadata";
import SignUpForm from "./SignUpForm";

export const metadata = pageMetadata({
  title: "Sign up",
  description:
    "Join the Chakula Bora Network — connect with farmers, researchers and agribusinesses building sustainable food systems.",
  path: "/auth/signup",
});

export default function SignUpPage() {
  return (
    <>
      <PageBackground src="/background.jpg" />
      <SignUpForm />
    </>
  );
}
