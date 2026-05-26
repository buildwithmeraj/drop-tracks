import { redirect } from "next/navigation";
import {
  FaBolt,
  FaCoins,
  FaLayerGroup,
  FaMoneyBillTrendUp,
  FaRocket,
} from "react-icons/fa6";
import { auth } from "@/auth";
import { buildLoginRedirect } from "@/lib/auth-redirect";
import { getDashboardAirdropOverview } from "@/lib/airdrops";

export const metadata = {
  title: "Dashboard",
  description:
    "Monitor tracked airdrops, upcoming payments, TGEs, and deadlines.",
};

export default async function Stats() {
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
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {statCards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.label}
            className="card border border-base-300 bg-base-300/30 backdrop-blur-sm p-5 shadow-sm"
          >
            <p className="text text-base-content/70 mb-3">{card.label}</p>
            <div className="flex items-center justify-between">
              <h2 className="text-4xl font-bold">{card.value}</h2>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Icon className="text-xl" />
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}
