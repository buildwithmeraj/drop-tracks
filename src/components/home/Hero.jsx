import Link from "next/link";
import { auth, signIn } from "@/auth";
import { siteConfig } from "@/lib/site";
import Image from "next/image";
import { RiLoginBoxLine } from "react-icons/ri";
import { TbLayoutDashboard } from "react-icons/tb";
import { MdMyLocation } from "react-icons/md";

export default async function Home() {
  const session = await auth();

  return (
    <section className="relative">
      <div className="bg-base-200/30 border border-base-200 card shadow-md hover:shadow-lg transition-all duration-300 backdrop-blur-sm p-6">
        <div className="card-body space-y-5 -mb-4 relative lg:pr-60">
          <h2 className="text-5xl font-bold">
            Welcome to{" "}
            <span className="text-primary font-extrabold">
              {siteConfig.name}
            </span>
          </h2>
          <h1 className="text-3xl font-black tracking-tight">
            <MdMyLocation className="inline mb-0.5 mr-2 text-primary" />
            Track every crypto airdrop before it slips through the cracks.
          </h1>
          <p className="max-w-2xl text-lg text-base-content/70">
            Keep one clean dashboard for campaigns, task progress, deadlines,
            multiple accounts, wallets, daily tasks/check-in and notes so you
            always know what to do next.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            {session?.user ? (
              <Link href="/dashboard" className="btn btn-primary rounded-full">
                <TbLayoutDashboard size={16} />
                Go to dashboard
              </Link>
            ) : (
              <Link
                href="/login"
                className="btn btn-primary flex items-center rounded-full"
              >
                <RiLoginBoxLine className="text-lg mt-0.5" />
                Login
              </Link>
            )}
            <span className="text-base-content/60">
              To start your smart airdrop hunting journey now!
            </span>
          </div>
          <Image
            src="/images/icon.svg"
            width={600}
            height={600}
            alt="Logo"
            className="absolute right-4 bottom-18 h-56 w-56 hidden lg:block lg:opacity-80"
          />
        </div>
      </div>
    </section>
  );
}
