import { pageMetadata } from "@/lib/metadata";
import ForgotPasswordForm from "./ForgotPasswordForm";

export const metadata = pageMetadata({
  title: "Forgot password",
  description: "Reset your Chakula Bora Network password.",
  path: "/auth/forgotpassword",
  noIndex: true,
});

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
