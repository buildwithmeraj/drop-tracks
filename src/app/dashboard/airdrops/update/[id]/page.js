import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { updateAirdropAction } from "@/app/actions/airdrops";
import AddAirdrop from "@/components/airdrops/AddAirdrop";
import { getAirdropByIdForUser } from "@/lib/airdrops";
import { buildLoginRedirect } from "@/lib/auth-redirect";

export const metadata = {
  title: "Update Airdrop",
  description: "Edit saved airdrop campaign details inside DropTracks.",
};

export default async function UpdateAirdropPage({ params }) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user) {
    redirect(buildLoginRedirect(`/dashboard/airdrops/update/${id}`));
  }

  const airdrop = await getAirdropByIdForUser(session.user.id, id);

  if (!airdrop) {
    notFound();
  }

  const updateAction = updateAirdropAction.bind(null, id);

  return (
    <section className="flex flex-col gap-6">
      <div className="card border border-base-200 bg-base-100/30 backdrop-blur-sm p-6 shadow-sm">
        <AddAirdrop mode="update" initialData={airdrop} action={updateAction} />
      </div>
    </section>
  );
}
