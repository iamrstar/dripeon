"use client";

import { ThemeProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";
import { CartProvider } from "@/context/CartContext";
import { ToastManager } from "@/components/ToastManager";
import ComingSoonOverlay from "@/components/ComingSoonOverlay";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="data-theme" defaultTheme="dark" enableSystem>
        <CartProvider>
          {children}
          <ToastManager />
          <ComingSoonOverlay />
        </CartProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
