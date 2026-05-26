import { auth } from "@/auth";
import Link from "next/link";
import React from "react";
import { FaPlus } from "react-icons/fa6";

const Welcome = async () => {
  const session = await auth();

  if (!session?.user) {
    redirect(buildLoginRedirect("/dashboard"));
  }
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="space-y-3">
        <h1 className="section-title">
          Welcome,{" "}
          <span className="text-primary">
            {session.user.name ?? "Airdrop Hunter"}
          </span>
        </h1>
      </div>
      <Link
        href="/dashboard/airdrops/add"
        className="btn btn-primary rounded-full"
      >
        <FaPlus />
        Add airdrop
      </Link>
    </div>
  );
};

export default Welcome;
