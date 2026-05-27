import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { buildLoginRedirect } from "@/lib/auth-redirect";
import { listAirdropsByUser } from "@/lib/airdrops";
import AirdropListClient from "@/components/airdrops/AirdropListClient";

export default async function AirdropsList({ searchParams }) {
  const session = await auth();

  if (!session?.user) {
    redirect(buildLoginRedirect("/dashboard/airdrops"));
  }

  const params = await searchParams;
  const page = Number(params?.page) || 1;

  const { items, pagination } = await listAirdropsByUser(
    session.user.id,
    page,
    undefined,
    "",
  );

  return <AirdropListClient items={items} pagination={pagination} />;
}
