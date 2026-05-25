import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { createAirdropAction } from "@/app/actions/airdrops";
import AirdropForm from "@/components/airdrops/AirdropForm";
import { buildLoginRedirect } from "@/lib/auth-redirect";

export const metadata = {
  title: "Add Airdrop",
  description: "Add a new crypto airdrop campaign to your DropTracks dashboard.",
};

export default async function AddAirdropPage() {
  const session = await auth();

  if (!session?.user) {
    redirect(buildLoginRedirect("/dashboard/airdrops/add"));
  }

  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-10 md:px-6">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">
          Add Airdrop
        </p>
        <h1 className="text-3xl font-black tracking-tight md:text-4xl">
          Save a new campaign
        </h1>
        <p className="max-w-2xl text-base-content/70">
          Store account identifiers, expected dates, notes, and whether the
          airdrop is being tracked with multiple accounts.
        </p>
      </div>

      <div className="rounded-[2rem] border border-base-300 bg-base-100 p-6 shadow-sm md:p-8">
        <AirdropForm mode="create" action={createAirdropAction} />
      </div>
    </section>
  );
}
