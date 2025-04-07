"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes";
import { Toaster } from "@/components/ui/sonner";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    document.body.classList.add("theme-transition");
    return () => {
      document.body.classList.remove("theme-transition");
    };
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mb-4"></div>
          <p className="text-purple-600 font-medium">Loading theme...</p>
        </div>
      </div>
    );
  }

  return (
    <NextThemesProvider
      {...props}
      enableSystem={true}
      disableTransitionOnChange={false}
      themes={["light", "dark", "violet"]}
      defaultTheme="light"
      attribute="class"
    >
      <style jsx global>{`
        .theme-transition * {
          transition: background-color 0.3s ease, color 0.2s ease;
        }
        .light {
          --theme-accent: 139, 92, 246;
          --theme-bg: 243, 244, 246;
        }
        .dark {
          --theme-accent: 167, 139, 250;
          --theme-bg: 17, 24, 39;
        }
        .violet {
          --theme-accent: 124, 58, 237;
          --theme-bg: 245, 243, 255;
        }
      `}</style>

      {children}

      <Toaster 
        position="top-center"
        toastOptions={{
          classNames: {
            toast: "group toast group-[.toaster]:bg-gradient-to-br group-[.toaster]:from-purple-50 group-[.toaster]:to-pink-50 group-[.toaster]:border group-[.toaster]:border-purple-100 group-[.toaster]:shadow-lg",
            title: "font-bold text-purple-800",
            description: "text-purple-600",
            actionButton: "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600",
            cancelButton: "bg-purple-100 text-purple-700 hover:bg-purple-200",
          },
        }}
      />
    </NextThemesProvider>
  );
}
