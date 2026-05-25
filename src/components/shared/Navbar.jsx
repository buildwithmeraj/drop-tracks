import Link from "next/link";
import Logo from "../utilities/Logo";
import { auth } from "@/auth";
import AuthActions from "@/components/auth/AuthActions";
import ThemeSwithcer from "../utilities/ThemeSwithcer";
import { TbHome, TbLayoutDashboard, TbParachute } from "react-icons/tb";

const navItems = [
  { href: "/", label: "Home", icon: <TbHome size={16} /> },
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: <TbLayoutDashboard size={16} />,
  },
  {
    href: "/dashboard/airdrops",
    label: "Airdrops",
    icon: <TbParachute size={16} />,
  },
];

const Navbar = async () => {
  const session = await auth();

  return (
    <nav className="navbar fixed top-0 z-30 border-b border-base-300 bg-base-100/30 text-base-content px-4 backdrop-blur md:px-6">
      <div className="navbar-start gap-2">
        <div className="dropdown">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost rounded-full lg:hidden"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {" "}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />{" "}
            </svg>
          </div>
          <ul
            tabIndex="-1"
            className="menu menu-sm dropdown-content rounded-box z-1 mt-3 w-52 border border-base-300 bg-base-100 p-2 shadow"
          >
            {navItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <Link href="/">
          <Logo />
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="hover:bg-primary transition-colors hover:text-primary-content"
              >
                {item.icon}
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="navbar-end flex items-center gap-3">
        <AuthActions user={session?.user} />
        <ThemeSwithcer />
      </div>
    </nav>
  );
};

export default Navbar;
