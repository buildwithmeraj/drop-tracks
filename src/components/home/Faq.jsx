import { siteConfig } from "@/lib/site";
import { GrInfo } from "react-icons/gr";

const faqs = [
  {
    question: "Does DropTracks support multiple wallets or accounts?",
    answer:
      "Yes. You can save multiple identities for a single campaign using usernames, emails, and EVM wallets under the same airdrop.",
  },
  {
    question: "Can it extract details from Telegram posts?",
    answer:
      "Yes. For supported public Telegram message links, DropTracks can fetch the post and use AI to help fill fields like notes and important dates.",
  },
  {
    question: "Can I track airdrops that need daily check-ins?",
    answer:
      "Yes. You can mark an airdrop as needing daily tasks or recurring check-ins, and it will appear in a dedicated reminder section on the dashboard.",
  },
  {
    question: "Can I keep notes and reminders inside each campaign?",
    answer:
      "Yes. Every airdrop can store notes for task progress, proof links, strategies, and anything else you want to keep attached to that campaign.",
  },
  {
    question: "Does Telegram autofill work for every Telegram link?",
    answer:
      "Not yet. The current version focuses on public Telegram message links. Private Telegram posts are not supported in the current flow.",
  },
];

const Faq = () => {
  return (
    <section className="space-y-6">
      <div className="space-y-3">
        <h2 className="section-title max-w-3xl">
          Frequently asked questions about{" "}
          <span className="text-primary font-extrabold">{siteConfig.name}</span>
        </h2>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <div
            key={faq.question}
            className="collapse collapse-arrow border border-base-200 bg-base-200/30 backdrop-blur-sm"
          >
            <input
              type="radio"
              name="home-faq-accordion"
              defaultChecked={index === 0}
            />
            <div className="collapse-title text-lg font-bold">
              {faq.question}
            </div>
            <div className="collapse-content">
              <p className="text-sm leading-6 text-base-content/70">
                <GrInfo className="inline mr-1.5 mb-0.5 text-info" size={16} />
                {faq.answer}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Faq;
