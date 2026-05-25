import React from "react";
import { FaArrowTrendUp } from "react-icons/fa6";

const Features = () => {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="card border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body">
          <FaArrowTrendUp className="text-2xl text-primary" />
          <h2 className="card-title">Track campaign status</h2>
          <p className="text-sm text-base-content/70">
            Store which airdrops you joined, where you are in the process, and
            what is still pending.
          </p>
        </div>
      </div>
      <div className="card border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body">
          <FaArrowTrendUp className="text-2xl text-primary" />
          <h2 className="card-title">Keep wallet notes organized</h2>
          <p className="text-sm text-base-content/70">
            Separate wallets, links, task history, and reminders without
            juggling spreadsheets.
          </p>
        </div>
      </div>
      <div className="card border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body">
          <FaArrowTrendUp className="text-2xl text-primary" />
          <h2 className="card-title">Build toward a real dashboard</h2>
          <p className="text-sm text-base-content/70">
            This first step handles Google sign-in so we can move next into
            saving airdrop records per user.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Features;
