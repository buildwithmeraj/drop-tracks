import Link from "next/link";
import { auth, signIn } from "@/auth";
import { FaArrowTrendUp } from "react-icons/fa6";
import { HiMiniSparkles } from "react-icons/hi2";

export default async function Home() {
  const session = await auth();

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-primary/15 to-transparent" />
      <div className="mx-auto flex min-h-[calc(100vh-12rem)] w-full max-w-6xl flex-col justify-center gap-12 px-4 py-16 md:px-6">
        <div className="max-w-3xl space-y-6">
          <div className="badge badge-primary badge-outline gap-2 px-4 py-4">
            <HiMiniSparkles />
            Built for serious airdrop hunters
          </div>
          <h1 className="text-5xl font-black tracking-tight md:text-7xl">
            Track every crypto airdrop before it slips through the cracks.
          </h1>
          <p className="max-w-2xl text-lg text-base-content/70">
            Keep one clean dashboard for campaigns, task progress, deadlines,
            wallets, and notes so you always know what to do next.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            {session?.user ? (
              <Link href="/dashboard" className="btn btn-primary rounded-full">
                Go to dashboard
              </Link>
            ) : (
              <form
                action={async () => {
                  "use server";
                  await signIn("google", { redirectTo: "/dashboard" });
                }}
              >
                <button type="submit" className="btn btn-primary rounded-full">
                  Start with Google
                </button>
              </form>
            )}
            <span className="text-sm text-base-content/60">
              DropTracks is ready for Mongo-backed airdrop tracking.
            </span>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="card border border-base-300 bg-base-100 shadow-sm">
            <div className="card-body">
              <FaArrowTrendUp className="text-2xl text-primary" />
              <h2 className="card-title">Track campaign status</h2>
              <p className="text-sm text-base-content/70">
                Store which airdrops you joined, where you are in the process,
                and what is still pending.
              </p>
            </div>
          </div>
          <div className="card border border-base-300 bg-base-100 shadow-sm">
            <div className="card-body">
              <FaArrowTrendUp className="text-2xl text-primary" />
              <h2 className="card-title">Keep wallet notes organized</h2>
              <p className="text-sm text-base-content/70">
                Separate wallets, links, task history, and reminders without
                juggling spreadsheets.
              </p>
            </div>
          </div>
          <div className="card border border-base-300 bg-base-100 shadow-sm">
            <div className="card-body">
              <FaArrowTrendUp className="text-2xl text-primary" />
              <h2 className="card-title">Build toward a real dashboard</h2>
              <p className="text-sm text-base-content/70">
                This first step handles Google sign-in so we can move next into
                saving airdrop records per user.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
