import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { updateAirdropAction } from "@/app/actions/airdrops";
import AirdropForm from "@/components/airdrops/AirdropForm";
import { getAirdropByIdForUser } from "@/lib/airdrops";

export const metadata = {
  title: "Update Airdrop",
  description: "Edit saved airdrop campaign details inside DropTracks.",
};

export default async function UpdateAirdropPage({ params }) {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  const { id } = await params;
  const airdrop = await getAirdropByIdForUser(session.user.id, id);

  if (!airdrop) {
    notFound();
  }

  const updateAction = updateAirdropAction.bind(null, id);

  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-10 md:px-6">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">
          Update Airdrop
        </p>
        <h1 className="text-3xl font-black tracking-tight md:text-4xl">
          Edit {airdrop.name}
        </h1>
        <p className="max-w-2xl text-base-content/70">
          Update campaign dates, account identifiers, or notes without losing
          the original joined date.
        </p>
      </div>

      <div className="rounded-[2rem] border border-base-300 bg-base-100 p-6 shadow-sm md:p-8">
        <AirdropForm mode="update" initialData={airdrop} action={updateAction} />
      </div>
    </section>
  );
}
