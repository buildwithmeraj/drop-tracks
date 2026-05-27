"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";

function useMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

const ThemeSwithcer = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();

  const handleToggle = (e) => {
    setTheme(e.target.checked ? "dark" : "light");
  };

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <label
      className={`relative inline-flex items-center gap-3 ${
        mounted ? "cursor-pointer" : "cursor-default opacity-0"
      }`}
      aria-hidden={!mounted}
    >
      <input
        className="sr-only peer"
        type="checkbox"
        checked={isDark}
        onChange={handleToggle}
        aria-label="Toggle theme"
        disabled={!mounted}
      />
      <div className="h-8 w-16 rounded-full bg-gradient-to-r from-yellow-300 to-orange-400 transition-all duration-500 peer-checked:from-blue-400 peer-checked:to-indigo-500 md:h-10 md:w-20 after:absolute after:left-1 after:top-1 after:flex after:h-6 after:w-6 after:items-center after:justify-center after:rounded-full after:bg-white after:text-sm after:shadow-md after:transition-all after:duration-500 after:content-['☀️'] peer-checked:after:translate-x-8 peer-checked:after:content-['🌙'] md:after:h-8 md:after:w-8 md:after:text-lg md:peer-checked:after:translate-x-10" />
    </label>
  );
};

export default ThemeSwithcer;
