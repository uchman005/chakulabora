import { pageMetadata } from "@/lib/metadata";
import AskQuestionForm from "./AskQuestionForm";

export const metadata = pageMetadata({
  title: "Ask Question",
  description: "Ask the Chakula Bora community a question about farming, food and agriculture.",
  path: "/dashboard/questions",
  noIndex: true,
});

export default function AskQuestionPage() {
  return <AskQuestionForm />;
}
