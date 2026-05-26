import { auth } from "@/auth";
import Menu from "@/components/dashboard/Menu";
import Stats from "@/components/dashboard/Stats";
import Welcome from "@/components/dashboard/Welcome";
import React from "react";

const page = async () => {
  const session = await auth();

  if (!session?.user) {
    redirect(buildLoginRedirect("/dashboard"));
  }
  return (
    <div className="space-y-6">
      <Welcome />
      <Stats />
      <Menu />
    </div>
  );
};

export default page;
