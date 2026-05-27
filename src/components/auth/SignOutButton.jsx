"use client";

import { useFormStatus } from "react-dom";
import { MdOutlineExitToApp } from "react-icons/md";

const SignOutButton = ({ mobile = false }) => {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className={`btn btn-error ${
        mobile ? "w-full rounded-2xl" : "rounded-full"
      }`}
      disabled={pending}
    >
      {pending ? (
        <>
          <span className="loading loading-spinner loading-xs" />
          Signing out...
        </>
      ) : (
        <>
          <MdOutlineExitToApp size={19} className="mt-0.5" />
          Sign out
        </>
      )}
    </button>
  );
};

export default SignOutButton;
