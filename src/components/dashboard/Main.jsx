import Link from "next/link";
import { redirect } from "next/navigation";
import {
  FaArrowTrendUp,
  FaBolt,
  FaCoins,
  FaLayerGroup,
  FaPlus,
  FaRocket,
} from "react-icons/fa6";
import { auth } from "@/auth";
import { buildLoginRedirect } from "@/lib/auth-redirect";
import { formatDate, formatRelativeWindow } from "@/lib/formatters";
import { getDashboardAirdropOverview } from "@/lib/airdrops";
import { TbParachute } from "react-icons/tb";

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-base-300 bg-base-200/30 p-4 shadow-sm backdrop-blur-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-base-content/50">
            {label}
          </p>
          <p className="mt-2 text-3xl font-black tracking-tight">{value}</p>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/12 text-primary">
          <Icon size={18} />
        </div>
      </div>
    </div>
  );
}

export default async function Main() {
  const session = await auth();

  if (!session?.user) {
    redirect(buildLoginRedirect("/dashboard"));
  }

  const overview = await getDashboardAirdropOverview(session.user.id);

  const statCards = [
    {
      label: "Tracked",
      value: overview.stats.totalTracked,
      icon: FaLayerGroup,
    },
    {
      label: "Payments",
      value: overview.stats.upcomingPayments,
      icon: FaArrowTrendUp,
    },
    {
      label: "TGEs",
      value: overview.stats.upcomingTges,
      icon: FaRocket,
    },
    {
      label: "Ending soon",
      value: overview.stats.endingSoon,
      icon: FaCoins,
    },
    {
      label: "Daily tasks",
      value: overview.stats.dailyTasks,
      icon: FaBolt,
    },
  ];

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight">
            Welcome,{" "}
            <span className="text-primary">
              {session.user.name ?? "Airdrop Hunter"}
            </span>
          </h1>
        </div>

        <div className="flex flex-wrap justify-end md:justify-normal gap-2">
          <Link
            href="/dashboard/airdrops"
            className="btn btn-soft btn-sm sm:btn-md"
          >
            <TbParachute />
            Airdrops list
          </Link>
          <Link
            href="/dashboard/airdrops/add"
            className="btn btn-primary btn-sm sm:btn-md"
          >
            <FaPlus />
            Add airdrop
          </Link>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {statCards.map((card) => (
          <StatCard
            key={card.label}
            icon={card.icon}
            label={card.label}
            value={card.value}
          />
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-base-300 bg-base-200/30 p-4 shadow-sm backdrop-blur-sm sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold">Upcoming timeline</h2>
              <p className="text-sm text-base-content/60">
                Closest payment, TGE, and campaign end windows.
              </p>
            </div>
            <Link
              href="/dashboard/airdrops"
              className="btn btn-soft btn-xs sm:btn-sm"
            >
              View all
            </Link>
          </div>

          <div className="space-y-3">
            {overview.timeline.length ? (
              overview.timeline.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-base-300 bg-base-100/70 px-4 py-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40"
                >
                  <div className="space-y-1">
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-xs uppercase tracking-[0.18em] text-base-content/50">
                      {item.type} date
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="font-semibold">{formatDate(item.date)}</p>
                    <p className="text-xs text-primary">
                      {formatRelativeWindow(item.date)}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-base-300 bg-base-100/50 px-4 py-8 text-center text-sm text-base-content/65">
                Add payment, TGE, or end dates to populate your timeline.
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-3xl border border-base-300 bg-base-200/30 p-4 shadow-sm backdrop-blur-sm sm:p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-xl font-bold">Daily task reminders</h2>
              <span className="badge badge-warning badge-sm sm:badge-md">
                {overview.stats.dailyTasks} active
              </span>
            </div>

            <div className="space-y-3">
              {overview.dailyTaskAirdrops.length ? (
                overview.dailyTaskAirdrops.map((item) => (
                  <Link
                    key={item._id}
                    href={`/dashboard/airdrops/update/${item._id}`}
                    className="block rounded-2xl border border-base-300 bg-base-100/70 px-4 py-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-warning/50"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold">{item.name}</p>
                      <span className="badge badge-warning badge-sm">
                        Daily
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-base-content/60">
                      Open this campaign and complete today&apos;s repeat task.
                    </p>
                  </Link>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-base-300 bg-base-100/50 px-4 py-6 text-sm text-base-content/65">
                  No daily-task airdrops yet. Enable the daily check-in option
                  when a campaign requires recurring actions.
                </div>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-base-300 bg-base-200/30 p-4 shadow-sm backdrop-blur-sm sm:p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-xl font-bold">Recently added</h2>
              <span className="text-xs text-base-content/55">
                Latest campaigns
              </span>
            </div>

            <div className="space-y-3">
              {overview.recentAirdrops.length ? (
                overview.recentAirdrops.map((item) => (
                  <Link
                    key={item._id}
                    href={`/dashboard/airdrops/update/${item._id}`}
                    className="block rounded-2xl border border-base-300 bg-base-100/70 px-4 py-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold">{item.name}</p>
                      {item.needsDailyTasks ? (
                        <span className="badge badge-warning badge-sm">
                          Daily
                        </span>
                      ) : null}
                    </div>
                    <div className="mt-1 flex flex-wrap gap-2 text-xs text-base-content/60">
                      <span>Joined {formatDate(item.joinedAt)}</span>
                      {item.multiple ? (
                        <span className="badge badge-outline badge-primary badge-sm">
                          Multiple
                        </span>
                      ) : null}
                    </div>
                  </Link>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-base-300 bg-base-100/50 px-4 py-6 text-sm text-base-content/65">
                  Nothing tracked yet. Start by adding your first airdrop.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
