import Features from "@/components/home/Features";
import Hero from "@/components/home/Hero";
import HowItWorks from "@/components/home/HowItWorks";
import React from "react";

const page = () => {
  return (
    <div className="space-y-12">
      <Hero />
      <Features />
      <HowItWorks />
    </div>
  );
};

export default page;
