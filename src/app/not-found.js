import Image from "next/image";
import Link from "next/link";
import { TbHome } from "react-icons/tb";

export const metadata = {
  title: "404 - Not Found",
};

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-[77vh] justify-center items-center">
      <h2 className="text-primary text-center section-title md:hidden">
        Not Found
      </h2>
      <div className="grid md:grid-cols-2 justify-center items-center gap-4 md:12">
        <Image
          src="/images/404.svg"
          alt="404"
          width={1200}
          height={800}
          className="w-full"
        />
        <div className="space-y-8 card border border-base-300 bg-base-100/30 backdrop-blur-sm justify-center">
          <div className="card-body">
            <h2 className="card-title text-center text-primary section-title hidden md:block mb-4">
              Not Found
            </h2>
            <p className="text-center text-base-content/70">
              The page or resource you requested could not be found at our
              server. The page or resource may have been moved, deleted or did
              not exists at our server. Please visit our home page to find your
              desired page.
            </p>
            <div className="card-actions justify-center mt-4">
              <Link href="/" className="btn btn-primary">
                <TbHome className="mb-0.5" size={18} />
                Return Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
