import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { createAirdropAction } from "@/app/actions/airdrops";
import AirdropForm from "@/components/airdrops/AirdropForm";
import { buildLoginRedirect } from "@/lib/auth-redirect";

export const metadata = {
  title: "Add Airdrop",
  description:
    "Add a new crypto airdrop campaign to your DropTracks dashboard.",
};

export default async function AddAirdropPage() {
  const session = await auth();

  if (!session?.user) {
    redirect(buildLoginRedirect("/dashboard/airdrops/add"));
  }

  return (
    <section className="flex flex-col gap-6">
      <div className="card border border-base-200 bg-base-100/30 backdrop-blur-sm p-6 shadow-sm">
        <AirdropForm mode="create" action={createAirdropAction} />
      </div>
    </section>
  );
}
