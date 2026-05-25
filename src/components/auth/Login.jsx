import React from "react";
import { siteConfig } from "@/lib/site";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "@/auth";

const Login = () => {
  return (
    <div className="flex flex-col min-h-[78vh] justify-center items-center">
      <div className="card max-w-sm bg-base-200/40 shadow-md backdrop-blur-xs px-4">
        <div className="card-body">
          <h2 className="font-bold text-2xl text-center my-2">Login</h2>
          <p className="text-center my-2">
            To access the features of the {siteConfig.name}, please login with
            your google account.
          </p>
          <form
            className="mt-4 flex justify-center items-center"
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: "/dashboard" });
            }}
          >
            <button
              type="submit"
              className="btn w-28 bg-gray-100 rounded-full text-black hover:w-full hover:mx-0 transition-all duration-300 hover:btn-soft hover:border hover:border-primary"
            >
              <FcGoogle className="text-lg mt-0.5" />
              Sign in
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
