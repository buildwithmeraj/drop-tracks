import { redirect } from "next/navigation";

export default async function AirdpopsUpdateAliasPage({ params }) {
  const { id } = await params;
  redirect(`/dashboard/airdrops/update/${id}`);
}
