import { pageMetadata } from "@/lib/metadata";
import SettingsForm from "./SettingsForm";

export const metadata = pageMetadata({
  title: "Settings",
  path: "/dashboard/setting",
  noIndex: true,
});

export default function SettingsPage() {
  return <SettingsForm />;
}
