import Image from "next/image";
import Link from "next/link";
import { MdOutlineExitToApp } from "react-icons/md";
import { signOut } from "@/auth";
import { RiLoginBoxLine } from "react-icons/ri";

const AuthActions = ({ user }) => {
  if (!user) {
    return (
      <Link
        href="/login"
        className="btn btn-primary flex items-center rounded-full"
      >
        <RiLoginBoxLine className="text-lg mt-0.5" />
        Login
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="hidden items-center gap-2 rounded-full bg-base-300 px-2 py-1 md:flex">
        {user.image ? (
          <Image
            src={user.image}
            alt={user.name ?? "User avatar"}
            width={36}
            height={36}
            className="h-9 w-9 rounded-full -ml-1"
          />
        ) : (
          <div className="flex h-9 w-9 -ml-1 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
            {(user.name ?? "U").slice(0, 1).toUpperCase()}
          </div>
        )}
        <div className="leading-tight">
          <p className="text-sm font-semibold">{user.name ?? "Airdrop User"}</p>
          <p className="text-xs text-base-content/60">{user.email}</p>
        </div>
      </div>
      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/login" });
        }}
      >
        <button type="submit" className="btn btn-error rounded-full">
          <MdOutlineExitToApp size={19} className="mt-0.5" />
          Sign out
        </button>
      </form>
    </div>
  );
};

export default AuthActions;
