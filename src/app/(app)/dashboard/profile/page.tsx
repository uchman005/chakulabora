import { pageMetadata } from "@/lib/metadata";
import ProfileView from "./ProfileView";

export const metadata = pageMetadata({
  title: "Profile",
  path: "/dashboard/profile",
  noIndex: true,
});

export default function ProfilePage() {
  return <ProfileView />;
}
