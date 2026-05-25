import { auth } from "@/auth";
import Login from "@/components/auth/Login";
import { getAuthMessage } from "@/lib/auth-redirect";
import { redirect } from "next/navigation";

const page = async ({ searchParams }) => {
  const params = await searchParams;
  const session = await auth();
  const callbackUrl = params?.callbackUrl || "/dashboard";

  if (session?.user) {
    redirect(callbackUrl);
  }

  return (
    <Login
      message={getAuthMessage(params?.message)}
      callbackUrl={callbackUrl}
    />
  );
};

export default page;
