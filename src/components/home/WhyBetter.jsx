import { siteConfig } from "@/lib/site";
import { FaCheck, FaXmark } from "react-icons/fa6";

const comparisons = [
  {
    label: "Telegram post details",
    oldWay: "Manually copied into notes or lost in chats",
    dropTracks: "Pulled from public Telegram posts with AI-assisted autofill",
  },
  {
    label: "Multiple accounts and wallets",
    oldWay: "Spread across cells, tabs, or random text blocks",
    dropTracks: "Grouped cleanly under each airdrop entry",
  },
  {
    label: "Daily check-ins",
    oldWay: "Easy to forget unless you build your own reminders",
    dropTracks: "Visible in a dedicated daily-task reminder section",
  },
  {
    label: "Payment and TGE tracking",
    oldWay: "Buried in comments or not tracked at all",
    dropTracks: "Shown in your dashboard timeline and airdrop records",
  },
];

const WhyBetter = () => {
  return (
    <section className="space-y-6">
      <div className="space-y-3">
        <h2 className="section-title max-w-3xl">
          Why{" "}
          <span className="text-primary font-extrabold">{siteConfig.name}</span>{" "}
          beats spreadsheets
        </h2>
      </div>

      <div className="overflow-hidden rounded-3xl border border-base-200 bg-base-200/30 shadow-sm backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Workflow area</th>
                <th>Sheets / scattered notes</th>
                <th>{siteConfig.name}</th>
              </tr>
            </thead>
            <tbody>
              {comparisons.map((item) => (
                <tr key={item.label}>
                  <td className="font-semibold">{item.label}</td>
                  <td>
                    <div className="flex items-start gap-3">
                      <FaXmark className="mt-1 text-error" />
                      <span className="text-sm text-base-content/70">
                        {item.oldWay}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-start gap-3">
                      <FaCheck className="mt-1 text-success" />
                      <span className="text-sm text-base-content/70">
                        {item.dropTracks}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default WhyBetter;
