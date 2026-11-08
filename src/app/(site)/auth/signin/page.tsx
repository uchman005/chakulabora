import PageBackground from "@/components/PageBackground";
import { pageMetadata } from "@/lib/metadata";
import SignInForm from "./SignInForm";

export const metadata = pageMetadata({
  title: "Sign in",
  description: "Sign in to the Chakula Bora Network to ask questions and share answers with the community.",
  path: "/auth/signin",
  noIndex: true,
});

export default function SignInPage() {
  return (
    <>
      <PageBackground src="/background.jpg" />
      <SignInForm />
    </>
  );
}
