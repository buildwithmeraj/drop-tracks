import React from "react";
import Icon from "./Icon";
import { siteConfig } from "@/lib/site";

const Logo = () => {
  return (
    <div className="flex items-center justify-center gap-2 text-2xl font-bold text-base-content">
      <Icon /> {siteConfig.name}
    </div>
  );
};

export default Logo;
