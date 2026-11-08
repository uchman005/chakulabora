"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { useSession } from "next-auth/react";
import Required from "@/components/Required";
import countriesList from "@/utils/countries";
import { useAppDispatch, useAppSelector } from "@/store";
import { setUser } from "@/store/user";
import { notify } from "@/lib/toast";
import type { IUser } from "@/types";

const label = "mb-2 block text-xs font-bold tracking-wide text-gray-700 uppercase";
const field = "form-field-filled";

export default function SettingsForm() {
  const user = useAppSelector((state) => state.user);
  const { status } = useSession();

  if (status === "unauthenticated") return <h1>You must Login to view Settings</h1>;
  if (status === "loading") return <p role="status">Loading...</p>;
  // Remount (and re-seed the fields) once the user record has loaded.
  return <SettingsFields key={user.id || "pending"} user={user} />;
}

function SettingsFields({ user }: { user: IUser }) {
  const dispatch = useAppDispatch();
  const [userData, setUserData] = useState<IUser>(user);
  const [password, setPassword] = useState("");
  const [repassword, setRepassword] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value, name } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await fetch(`/api/${user.id}/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      const updated = await res.json();
      if (updated === null || !res.ok) throw new Error();
      dispatch(setUser({ ...updated, id: updated._id }));
      notify({ title: "Account Update successful", description: "Account update was successful", status: "success" });
    } catch {
      notify({
        title: "Account Update failed.",
        description: "Account updated failed unexpectedly, check your network connection",
        status: "warning",
      });
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== repassword) {
      notify({ title: "Password Update failed.", description: "Passwords did not match", status: "warning" });
      return;
    }
    setSavingPassword(true);
    try {
      const res = await fetch("/api/users/updatepassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const updated = await res.json();
      if (updated !== true) throw new Error();
      notify({ title: "Password Update successful", description: "Password update was successful", status: "success" });
      setPassword("");
      setRepassword("");
    } catch {
      notify({
        title: "Password Update failed.",
        description: "Password updated failed unexpectedly, check your network connection",
        status: "warning",
      });
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <>
      <h1 className="sr-only">Settings</h1>
      <form onSubmit={handleSubmit} aria-labelledby="edit-profile" className="mx-auto w-full max-w-lg rounded-lg bg-white p-8 shadow-sm lg:ml-8">
        <h2 id="edit-profile" className="mb-6 text-center text-3xl">
          Edit Profile
        </h2>
        <div className="-mx-3 mb-6 flex flex-wrap">
          <div className="mb-6 w-full px-3 md:mb-0 md:w-1/2">
            <label className={label} htmlFor="first-name">
              First Name:
            </label>
            <input autoComplete="given-name" className={`${field} mb-3`} id="first-name" type="text" name="fname" value={userData.fname ?? ""} onChange={handleChange} />
          </div>
          <div className="w-full px-3 md:w-1/2">
            <label className={label} htmlFor="last-name">
              Last Name:
            </label>
            <input autoComplete="family-name" className={field} id="last-name" type="text" name="lname" value={userData.lname ?? ""} onChange={handleChange} />
          </div>
        </div>
        <div className="-mx-3 mb-6 flex flex-wrap">
          <div className="w-full px-3 md:w-1/2">
            <label className={label} htmlFor="email">
              Email:
            </label>
            <input readOnly className={`${field} mb-3`} id="email" type="email" name="email" value={userData.email ?? ""} aria-describedby="email-help" />
            <p id="email-help" className="sr-only">
              Your email address cannot be changed here.
            </p>
          </div>
          <div className="w-full px-3 md:w-1/2">
            <label className={label} htmlFor="website">
              Website
            </label>
            <input className={field} id="website" type="text" inputMode="url" autoComplete="url" name="website" value={userData.website ?? ""} onChange={handleChange} />
          </div>
        </div>

        <div className="-mx-3 mb-6 flex flex-wrap">
          <div className="w-full px-3">
            <label className={label} htmlFor="bio">
              Bio
            </label>
            <textarea id="bio" className={`${field} mb-3`} name="bio" value={userData.bio ?? ""} placeholder="Write a short bio" onChange={handleChange} />
          </div>
        </div>
        <div className="-mx-3 mb-6 flex flex-wrap">
          <div className="w-full px-3 md:w-1/2">
            <label className={label} htmlFor="street_address">
              Street
            </label>
            <input className={`${field} mb-3`} id="street_address" name="street_address" autoComplete="street-address" type="text" placeholder="Your street or close Landmark" value={userData.street_address ?? ""} onChange={handleChange} />
          </div>
          <div className="w-full px-3 md:w-1/2">
            <label className={label} htmlFor="country">
              Country / Region
            </label>
            <input
              id="country"
              list="country-options"
              autoComplete="country-name"
              placeholder="Select Your country"
              className={field}
              name="country"
              value={userData.country ?? ""}
              onChange={handleChange}
            />
            <datalist id="country-options">
              {countriesList.map((item) => (
                <option value={item.name} key={item.code} />
              ))}
            </datalist>
          </div>
        </div>
        <div className="-mx-3 mb-2 flex flex-wrap">
          <div className="mb-6 w-full px-3 md:mb-0 md:w-1/3">
            <label className={label} htmlFor="city">
              City
            </label>
            <input className={field} id="city" type="text" autoComplete="address-level2" placeholder="Your city" name="city" value={userData.city ?? ""} onChange={handleChange} />
          </div>
          <div className="mb-6 w-full px-3 md:mb-0 md:w-1/3">
            <label className={label} htmlFor="state">
              State
            </label>
            <input className={field} id="state" type="text" autoComplete="address-level1" placeholder="Your state" name="state" onChange={handleChange} value={userData.state ?? ""} />
          </div>
          <div className="mb-6 w-full px-3 md:mb-0 md:w-1/3">
            <label className={label} htmlFor="postal_code">
              Zip
            </label>
            <input className={field} id="postal_code" type="text" autoComplete="postal-code" placeholder="480" value={userData.postal_code ?? ""} name="postal_code" onChange={handleChange} />
          </div>
          <div className="my-6 flex w-full items-center justify-center">
            <button type="submit" disabled={savingProfile} aria-busy={savingProfile} className="rounded-sm bg-blue-600 px-4 py-2 font-bold text-white hover:bg-blue-800 disabled:opacity-65">
              {savingProfile ? "UPDATING…" : "UPDATE"}
            </button>
          </div>
        </div>
      </form>

      <form onSubmit={handlePasswordSubmit} aria-labelledby="edit-password" className="mx-auto my-10 w-full max-w-lg rounded-lg bg-white p-8 shadow-sm lg:ml-8">
        <h2 id="edit-password" className="mb-6 text-center text-3xl">
          Edit Password
        </h2>
        <div className="-mx-3 mb-6 flex flex-wrap">
          <div className="mb-6 w-full px-3">
            <label className={label} htmlFor="new-password">
              New Password: <Required />
            </label>
            <input required autoComplete="new-password" className={`${field} mb-3`} id="new-password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="* * * * * " />
          </div>
          <div className="mb-6 w-full px-3">
            <label className={label} htmlFor="re_password">
              Retype Password: <Required />
            </label>
            <input required autoComplete="new-password" className={`${field} mb-3`} id="re_password" name="repassword" value={repassword} onChange={(e) => setRepassword(e.target.value)} type="password" placeholder="* * * * * " />
          </div>
        </div>
        <div className="my-6 flex w-full items-center justify-center">
          <button type="submit" disabled={savingPassword} aria-busy={savingPassword} className="rounded-sm bg-blue-600 px-4 py-2 font-bold text-white hover:bg-blue-800 disabled:opacity-65">
            {savingPassword ? "UPDATING…" : "UPDATE PASSWORD"}
          </button>
        </div>
      </form>
    </>
  );
}
