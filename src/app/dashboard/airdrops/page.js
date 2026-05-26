import AirdropsList from "@/components/airdrops/AirdropList";
import React from "react";

export const metadata = {
  title: "Airdrops",
  description: "Track, review, edit, and organize all saved airdrop campaigns.",
};

const page = () => {
  return <AirdropsList />;
};

export default page;
