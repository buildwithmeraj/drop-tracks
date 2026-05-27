import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const Loading = () => {
  return (
    <div className="flex flex-col min-h-[77vh] justify-center items-center backdrop-blur-sm">
      <div className="flex items-center justify-center">
        <DotLottieReact
          src="/images/Airdrop.lottie"
          className="h-80 w-80"
          loop
          autoplay
        />
      </div>
    </div>
  );
};

export default Loading;
