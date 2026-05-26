import Link from "next/link";
import Logo from "../utilities/Logo";
import { auth } from "@/auth";
import AuthActions from "@/components/auth/AuthActions";
import ThemeSwithcer from "../utilities/ThemeSwithcer";
import { HiBars3 } from "react-icons/hi2";
import { TbHome, TbLayoutDashboard, TbParachute } from "react-icons/tb";
import { IoMdCloseCircleOutline } from "react-icons/io";

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
    <div className="drawer lg:drawer-open">
      <input id="mobile-nav-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        <nav className="navbar fixed top-0 z-30 border-b border-base-300 bg-base-100/30 text-base-content px-4 backdrop-blur-sm lg:px-10 xl:px-20">
          <div className="navbar-start gap-6 md:gap-2">
            <label
              htmlFor="mobile-nav-drawer"
              className="btn btn-sm lg:hidden"
              aria-label="Open navigation menu"
            >
              <HiBars3 className="text-2xl" />
            </label>
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
            <div className="hidden md:flex">
              <AuthActions user={session?.user} />
            </div>
            <ThemeSwithcer />
          </div>
        </nav>
      </div>
      <div className="drawer-side z-40 lg:hidden">
        <label
          htmlFor="mobile-nav-drawer"
          aria-label="Close navigation menu"
          className="drawer-overlay"
        />
        <aside className="min-h-full w-80 max-w-[85vw] border-r border-base-300 bg-base-100 p-4 text-base-content">
          <div className="mb-6 flex items-center justify-between gap-3">
            <Link href="/" className="max-w-full">
              <Logo />
            </Link>
            <label
              htmlFor="mobile-nav-drawer"
              className="btn btn-ghost btn-sm rounded-full"
            >
              <IoMdCloseCircleOutline size={22} className="opacity-50" />
            </label>
          </div>

          <ul className="menu w-full gap-1 rounded-box bg-base-300/90 p-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>
                  {item.icon}
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-6">
            <AuthActions user={session?.user} mobile />
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Navbar;
