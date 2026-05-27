const NavbarFallback = () => {
  return (
    <nav className="navbar fixed top-0 z-30 border-b border-base-300 bg-base-100/30 px-4 backdrop-blur-sm lg:px-10 xl:px-20">
      <div className="navbar-start gap-6 md:gap-2">
        <div className="skeleton h-9 w-9 rounded-xl lg:hidden" />
        <div className="skeleton h-10 w-36 rounded-full" />
      </div>

      <div className="navbar-center hidden lg:flex">
        <div className="flex items-center gap-3">
          <div className="skeleton h-10 w-24 rounded-full" />
          <div className="skeleton h-10 w-28 rounded-full" />
          <div className="skeleton h-10 w-24 rounded-full" />
        </div>
      </div>

      <div className="navbar-end flex items-center gap-3">
        <div className="hidden md:block skeleton h-10 w-36 rounded-full" />
        <div className="skeleton h-8 w-16 rounded-full md:h-10 md:w-20" />
      </div>
    </nav>
  );
};

export default NavbarFallback;
