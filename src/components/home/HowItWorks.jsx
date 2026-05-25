import { siteConfig } from "@/lib/site";
import {
  FaBolt,
  FaClipboardCheck,
  FaRegClock,
  FaTelegram,
} from "react-icons/fa6";

const steps = [
  {
    number: "01",
    title: "Add the Airdrop",
    description:
      "Create a new airdrop entry with its link, the account you plan to use, and whether it needs multiple identities or daily tasking.",
    icon: FaClipboardCheck,
  },
  {
    number: "02",
    title: "Pull details from Telegram",
    description:
      "If the source is a public Telegram post, fetch the message and let AI summarize it and auto-fill useful fields like notes and dates.",
    icon: FaTelegram,
  },
  {
    number: "03",
    title: "Track dates and progress",
    description:
      "Keep payment dates, TGE dates, end dates, notes, and campaign status together so nothing gets lost in chats or spreadsheets.",
    icon: FaRegClock,
  },
  {
    number: "04",
    title: "Come back for reminders",
    description:
      "Use the dashboard to spot upcoming milestones and keep daily check-in campaigns visible until the work is done.",
    icon: FaBolt,
  },
];

const HowItWorks = () => {
  return (
    <section className="space-y-6">
      <div className="space-y-3">
        <h2 className="section-title max-w-3xl">
          How{" "}
          <span className="text-primary font-extrabold">{siteConfig.name}</span>{" "}
          works
        </h2>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {steps.map((step) => {
          const Icon = step.icon;

          return (
            <div
              key={step.number}
              className="card border border-base-200 bg-base-200/30 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-md"
            >
              <div className="card-body gap-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="badge badge-lg badge-info font-bold">
                      <span className="hidden md:flex">STEP </span>
                      {step.number}
                    </span>
                    <h3 className="text-xl font-bold">{step.title}</h3>
                  </div>
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Icon size={24} />
                  </div>
                </div>
                <p className="text-sm leading-6 text-base-content/70">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default HowItWorks;
