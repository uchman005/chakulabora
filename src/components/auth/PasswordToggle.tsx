"use client";

import { FaEye, FaEyeSlash } from "react-icons/fa";

/** Show / hide password button with an accessible state. */
export default function PasswordToggle({
  shown,
  onToggle,
  controls,
}: {
  shown: boolean;
  onToggle: () => void;
  controls: string;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={shown}
      aria-controls={controls}
      aria-label={shown ? "Hide password" : "Show password"}
      className="rounded-sm bg-blue-600 p-2 text-white shadow-md shadow-black hover:bg-blue-800 hover:shadow-xs active:shadow-lg"
    >
      {shown ? <FaEyeSlash aria-hidden /> : <FaEye aria-hidden />}
    </button>
  );
}
