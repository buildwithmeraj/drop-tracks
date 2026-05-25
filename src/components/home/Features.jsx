import { siteConfig } from "@/lib/site";
import {
  FaBolt,
  FaClockRotateLeft,
  FaLayerGroup,
  FaRegNoteSticky,
  FaTelegram,
  FaWallet,
} from "react-icons/fa6";

const featureCards = [
  {
    title: "Track every campaign in one place",
    description:
      "Save the airdrops you join, keep their links, and stop losing track of where each farming opportunity stands.",
    icon: FaLayerGroup,
  },
  {
    title: "Organize multiple wallets and identities",
    description:
      "Store usernames, emails, wallet addresses, and multiple-account setups for campaigns that need more than one identity.",
    icon: FaWallet,
  },
  {
    title: "Pull details from Telegram posts",
    description:
      "Paste a public Telegram message link and let DropTracks fetch the post, summarize it, and auto-fill useful campaign details.",
    icon: FaTelegram,
  },
  {
    title: "Watch payment and TGE timelines",
    description:
      "Keep expected payment dates, TGE dates, and end dates visible so upcoming milestones do not surprise you.",
    icon: FaClockRotateLeft,
  },
  {
    title: "Remember daily check-ins",
    description:
      "Mark campaigns that need recurring tasks or streak check-ins and keep them surfaced in a dedicated dashboard reminder block.",
    icon: FaBolt,
  },
  {
    title: "Keep notes beside the campaign",
    description:
      "Write down task progress, proof links, strategy reminders, and anything else you would normally scatter across chats and sheets.",
    icon: FaRegNoteSticky,
  },
];

const Features = () => {
  return (
    <section className="space-y-6">
      <div className="space-y-3">
        <h2 className="section-title max-w-3xl">
          Features of{" "}
          <span className="text-primary font-extrabold">{siteConfig.name}</span>
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {featureCards.map((feature) => {
          const Icon = feature.icon;

          return (
            <div
              key={feature.title}
              className="card border border-base-200 bg-base-200/30 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-md"
            >
              <div className="card-body relative gap-4">
                <h2 className="card-title">{feature.title}</h2>
                <p className="text-sm leading-6 text-base-content/70 pr-18">
                  {feature.description}
                </p>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary absolute top-18 right-6">
                  <Icon size={26} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Features;
