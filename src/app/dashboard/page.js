import Link from "next/link";
import { redirect } from "next/navigation";
import {
  FaBolt,
  FaCoins,
  FaLayerGroup,
  FaMoneyBillTrendUp,
  FaPlus,
  FaRocket,
} from "react-icons/fa6";
import { auth } from "@/auth";
import { buildLoginRedirect } from "@/lib/auth-redirect";
import { getDashboardAirdropOverview } from "@/lib/airdrops";
import { formatDate, formatRelativeWindow } from "@/lib/formatters";

export const metadata = {
  title: "Dashboard",
  description: "Monitor tracked airdrops, upcoming payments, TGEs, and deadlines.",
};

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect(buildLoginRedirect("/dashboard"));
  }

  const overview = await getDashboardAirdropOverview(session.user.id);
  const statCards = [
    {
      label: "Tracked airdrops",
      value: overview.stats.totalTracked,
      icon: FaLayerGroup,
    },
    {
      label: "Upcoming payments",
      value: overview.stats.upcomingPayments,
      icon: FaMoneyBillTrendUp,
    },
    {
      label: "Upcoming TGEs",
      value: overview.stats.upcomingTges,
      icon: FaRocket,
    },
    {
      label: "Ending soon",
      value: overview.stats.endingSoon,
      icon: FaCoins,
    },
    {
      label: "Daily task drops",
      value: overview.stats.dailyTasks,
      icon: FaBolt,
    },
  ];

  return (
    <section className="mx-auto flex min-h-[calc(100vh-12rem)] w-full max-w-6xl flex-col gap-8 px-4 py-12 md:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">
          Welcome back
          </p>
          <h1 className="text-4xl font-black tracking-tight md:text-5xl">
            Hi, {session.user.name?.split(" ")[0] ?? "Airdrop Hunter"}
          </h1>
          <p className="max-w-2xl text-base-content/70">
            Your tracker is now live. Watch payment dates, upcoming TGEs, and
            campaign deadlines from one dashboard.
          </p>
        </div>
        <Link href="/dashboard/airdrops/add" className="btn btn-primary rounded-full">
          <FaPlus />
          Add airdrop
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {statCards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.label}
              className="rounded-[1.75rem] border border-base-300 bg-base-100 p-5 shadow-sm"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Icon className="text-xl" />
              </div>
              <p className="text-sm text-base-content/60">{card.label}</p>
              <h2 className="mt-2 text-3xl font-black">{card.value}</h2>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[2rem] border border-base-300 bg-base-100 p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold">Upcoming timeline</h2>
              <p className="text-sm text-base-content/65">
                Payments, TGEs, and end dates closest to today.
              </p>
            </div>
            <Link href="/dashboard/airdrops" className="btn btn-ghost btn-sm rounded-full">
              View all
            </Link>
          </div>

          <div className="space-y-3">
            {overview.timeline.length ? (
              overview.timeline.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-base-300 bg-base-200/50 px-4 py-4 transition hover:border-primary/40"
                >
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm capitalize text-base-content/60">
                      {item.type} date
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatDate(item.date)}</p>
                    <p className="text-sm text-base-content/60">
                      {formatRelativeWindow(item.date)}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-base-300 px-4 py-8 text-center text-base-content/65">
                Add airdrops with payment, TGE, or end dates to populate your
                timeline.
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[2rem] border border-base-300 bg-base-100 p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-xl font-bold">Daily task reminders</h2>
              <span className="badge badge-primary badge-outline">
                {overview.stats.dailyTasks} active
              </span>
            </div>
            <div className="space-y-3">
              {overview.dailyTaskAirdrops.length ? (
                overview.dailyTaskAirdrops.map((item) => (
                  <Link
                    key={item._id}
                    href={`/dashboard/airdrops/update/${item._id}`}
                    className="block rounded-2xl border border-base-300 bg-base-200/40 px-4 py-3"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold">{item.name}</p>
                      <span className="badge badge-warning badge-outline">
                        Daily
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-base-content/60">
                      Open this airdrop and finish today&apos;s check-in or repeat task.
                    </p>
                  </Link>
                ))
              ) : (
                <p className="text-sm text-base-content/65">
                  No daily-task airdrops yet. Mark one in the form when a
                  campaign requires recurring actions.
                </p>
              )}
            </div>
          </div>

          <div className="rounded-[2rem] border border-base-300 bg-base-100 p-6 shadow-sm">
            <h2 className="text-xl font-bold">Account setup</h2>
            <div className="mt-4 space-y-3 text-sm text-base-content/70">
              <p>Signed in as {session.user.email}</p>
              <p>{overview.stats.multipleAccounts} campaigns use multiple accounts.</p>
              <p>{overview.stats.dailyTasks} campaigns need recurring check-ins.</p>
            </div>
          </div>

          <div className="rounded-[2rem] border border-base-300 bg-base-100 p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-xl font-bold">Recently added</h2>
              <Link href="/dashboard/airdrops/add" className="btn btn-outline btn-sm rounded-full">
                Add more
              </Link>
            </div>
            <div className="space-y-3">
              {overview.recentAirdrops.length ? (
                overview.recentAirdrops.map((item) => (
                  <Link
                    key={item._id}
                    href={`/dashboard/airdrops/update/${item._id}`}
                    className="block rounded-2xl border border-base-300 bg-base-200/40 px-4 py-3"
                  >
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-base-content/60">
                      Joined {formatDate(item.joinedAt)}
                    </p>
                  </Link>
                ))
              ) : (
                <p className="text-sm text-base-content/65">
                  Nothing tracked yet. Start by adding your first airdrop.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
