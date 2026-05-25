import Image from "next/image";
import React from "react";

const Icon = () => {
  return (
    <Image
      src="/images/icon.svg"
      width={45}
      height={45}
      alt="Logo"
      className="p-1"
    />
  );
};

export default Icon;
