"use client";

import { useSession } from "next-auth/react";
import Profile from "@/components/Profile";
import { useAppSelector } from "@/store";

export default function ProfileView() {
  const user = useAppSelector((state) => state.user);
  const { status } = useSession();

  if (status === "loading") return <p role="status">Loading...</p>;
  if (status === "unauthenticated") return <h1>You must login to view Profile</h1>;

  return (
    <div className="flex items-center lg:justify-center">
      <Profile user={user} />
    </div>
  );
}
