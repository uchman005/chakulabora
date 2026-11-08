"use client";

import Link from "next/link";
import Image from "next/image";
import useSWR from "swr";
import type { IUser } from "@/types";
import { displayName } from "@/lib/user";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Profile({ user }: { user: IUser }) {
  const { data } = useSWR<{ posts: number; answers: number }>(
    user.id ? `/api/${user.id}/count` : null,
    fetcher
  );

  return (
    <div className="flex w-full py-6 md:w-[70%]">
      <div className="w-full overflow-hidden rounded-md bg-white shadow-2xl">
        <div className="mt-12 justify-center">
          <div className="relative mx-auto mb-5 size-40 overflow-hidden rounded-full">
            <Image width={160} height={160} className="size-full object-cover" src="/placeholder.png" alt="" />
            <div className="absolute inset-0 bg-black opacity-40" />
          </div>
        </div>

        <div className="p-6">
          <div className="mb-5 flex flex-col items-center justify-center">
            <h1 className="text-xl font-medium text-nowrap lg:text-2xl">
              {displayName(user, user?.email || user?.phone)}
            </h1>
            <span className="text-gray-600">{user?.role}</span>
          </div>

          <dl className="flex justify-center gap-4">
            <div className="flex flex-col-reverse items-center">
              <dt className="text-gray-600">Questions</dt>
              <dd className="m-0 font-semibold">{data?.posts ?? "–"}</dd>
            </div>
            <div className="flex flex-col-reverse items-center">
              <dt className="text-gray-600">Answers</dt>
              <dd className="m-0 font-semibold">{data?.answers ?? "–"}</dd>
            </div>
            <div className="flex flex-col-reverse items-center">
              <dt className="text-gray-600">Points</dt>
              <dd className="m-0 font-semibold">{user?.pv}</dd>
            </div>
          </dl>
          <Link
            href="/dashboard/setting"
            className="mt-8 block w-full rounded-md bg-blue-800 px-4 py-2 text-center text-white transition-all duration-200 hover:bg-blue-700"
          >
            Settings
          </Link>
        </div>
      </div>
    </div>
  );
}
