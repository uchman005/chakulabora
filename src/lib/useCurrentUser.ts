"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useAppDispatch, useAppSelector } from "@/store";
import { clearUser, setUser } from "@/store/user";
import type { IUser } from "@/types";

/**
 * Keeps the Redux `user` slice in sync with the NextAuth session.
 * The session stores the Mongo user id in `session.user.email`.
 */
export function useCurrentUser() {
  const { status, data: session } = useSession();
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const sessionUserId = session?.user?.email;

  useEffect(() => {
    if (status === "unauthenticated" && user.id) {
      dispatch(clearUser());
      return;
    }
    if (status !== "authenticated" || !sessionUserId || user.id === sessionUserId) return;

    const controller = new AbortController();
    fetch(`/api/${sessionUserId}/user`, {
      headers: { Accept: "application/json" },
      signal: controller.signal,
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: (IUser & { _id: string }) | null) => {
        if (data) dispatch(setUser({ ...data, id: data._id }));
      })
      .catch(() => {
        /* aborted or offline — the next session change retries */
      });
    return () => controller.abort();
  }, [status, sessionUserId, user.id, dispatch]);

  return user;
}
