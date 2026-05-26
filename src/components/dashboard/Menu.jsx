import Link from "next/link";
import React from "react";
import { getDashboardAirdropOverview } from "@/lib/airdrops";
import { auth } from "@/auth";
import { formatDate } from "@/lib/formatters";

const Menu = async () => {
  const session = await auth();
  const overview = await getDashboardAirdropOverview(session.user.id);
  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="rounded-[2rem] border border-base-300 bg-base-100 p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold">Upcoming timeline</h2>
            <p className="text-sm text-base-content/65">
              Payments, TGEs, and end dates closest to today.
            </p>
          </div>
          <Link
            href="/dashboard/airdrops"
            className="btn btn-ghost btn-sm rounded-full"
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
                    Open this airdrop and finish today&apos;s check-in or repeat
                    task.
                  </p>
                </Link>
              ))
            ) : (
              <p className="text-sm text-base-content/65">
                No daily-task airdrops yet. Mark one in the form when a campaign
                requires recurring actions.
              </p>
            )}
          </div>
        </div>

        <div className="rounded-[2rem] border border-base-300 bg-base-100 p-6 shadow-sm">
          <h2 className="text-xl font-bold">Account setup</h2>
          <div className="mt-4 space-y-3 text-sm text-base-content/70">
            <p>Signed in as {session.user.email}</p>
            <p>
              {overview.stats.multipleAccounts} campaigns use multiple accounts.
            </p>
            <p>
              {overview.stats.dailyTasks} campaigns need recurring check-ins.
            </p>
          </div>
        </div>

        <div className="rounded-[2rem] border border-base-300 bg-base-100 p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-xl font-bold">Recently added</h2>
            <Link
              href="/dashboard/airdrops/add"
              className="btn btn-outline btn-sm rounded-full"
            >
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
  );
};

export default Menu;
