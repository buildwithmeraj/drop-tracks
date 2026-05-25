"use client";

import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";

const AppProviders = ({ children }) => {
  return (
    <ThemeProvider
      attribute="data-theme"
      defaultTheme="light"
      enableSystem={false}
    >
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
        }}
      />
    </ThemeProvider>
  );
};

export default AppProviders;
