"use client";

import { ThemeProvider } from "next-themes";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { ToastManager } from "@/components/ToastManager";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="data-theme" defaultTheme="dark" enableSystem>
      <CartProvider>
        <WishlistProvider>
          {children}
          <ToastManager />
        </WishlistProvider>
      </CartProvider>
    </ThemeProvider>
  );
}
