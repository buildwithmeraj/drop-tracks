import { siteConfig } from "@/lib/site";
import {
  FaBolt,
  FaLayerGroup,
  FaSheetPlastic,
  FaUsers,
} from "react-icons/fa6";

const audiences = [
  {
    title: "Solo airdrop hunters",
    description:
      "Perfect if you want one clean place to keep links, notes, payout dates, and your next steps without relying on memory.",
    icon: FaLayerGroup,
  },
  {
    title: "Multi-account farmers",
    description:
      "Useful for campaigns where you rotate several wallets, usernames, or emails and need to keep each setup separated.",
    icon: FaUsers,
  },
  {
    title: "Daily task grinders",
    description:
      "Helpful for streaks, recurring check-ins, and task-heavy campaigns that need regular attention to stay alive.",
    icon: FaBolt,
  },
  {
    title: "Spreadsheet escapees",
    description:
      "Great if your current workflow lives across Telegram saved messages, notes apps, and messy sheets that are hard to trust.",
    icon: FaSheetPlastic,
  },
];

const WhoItsFor = () => {
  return (
    <section className="space-y-6">
      <div className="space-y-3">
        <h2 className="section-title max-w-3xl">
          Who{" "}
          <span className="text-primary font-extrabold">{siteConfig.name}</span>{" "}
          is for
        </h2>
        <p className="max-w-2xl text-base-content/70">
          Built for people who take airdrop tracking seriously and want a
          workflow that feels clearer than scattered notes and spreadsheets.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {audiences.map((audience) => {
          const Icon = audience.icon;

          return (
            <div
              key={audience.title}
              className="card border border-base-200 bg-base-200/30 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-md"
            >
              <div className="card-body gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon size={26} />
                </div>
                <h3 className="text-xl font-bold">{audience.title}</h3>
                <p className="text-sm leading-6 text-base-content/70">
                  {audience.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default WhoItsFor;
