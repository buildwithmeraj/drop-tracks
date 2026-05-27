"use client";

import { useFormStatus } from "react-dom";
import { FcGoogle } from "react-icons/fc";

const LoginSubmitButton = () => {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className="btn w-28 rounded-full border border-primary/30 bg-gray-100 text-black transition-all duration-300 hover:w-full hover:btn-soft hover:border-primary disabled:w-full disabled:cursor-wait disabled:opacity-90"
      disabled={pending}
    >
      {pending ? (
        <>
          <span className="loading loading-spinner loading-xs" />
          Signing in...
        </>
      ) : (
        <>
          <FcGoogle className="mt-0.5 text-lg" />
          Sign in
        </>
      )}
    </button>
  );
};

export default LoginSubmitButton;
