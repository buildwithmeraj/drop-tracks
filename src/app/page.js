import Faq from "@/components/home/Faq";
import Features from "@/components/home/Features";
import Hero from "@/components/home/Hero";
import HowItWorks from "@/components/home/HowItWorks";
import WhoItsFor from "@/components/home/WhoItsFor";
import WhyBetter from "@/components/home/WhyBetter";
import { siteConfig } from "@/lib/site";
export const metadata = {
  title: `Hunt Airdrop Smartly | ${siteConfig.name}`,
};

const page = () => {
  return (
    <div className="space-y-12">
      <Hero />
      <WhoItsFor />
      <Features />
      <WhyBetter />
      <HowItWorks />
      <Faq />
    </div>
  );
};

export default page;
