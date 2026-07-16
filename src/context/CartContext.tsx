"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type CartItem = {
  id: string; // product ID
  name: string;
  price: number;
  image: string;
  size: string;
  quantity: number;
};

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string, size: string) => void;
  updateQuantity: (id: string, size: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  appliedCoupon: string | null;
  discountAmount: number;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    setMounted(true);
    const storedCart = localStorage.getItem("dripeon_cart");
    const storedCoupon = localStorage.getItem("dripeon_coupon");
    
    if (storedCart) {
      try {
        setCartItems(JSON.parse(storedCart));
      } catch (err) {
        console.error("Failed to parse cart", err);
      }
    }
    
    if (storedCoupon) {
      try {
        const parsed = JSON.parse(storedCoupon);
        setAppliedCoupon(parsed.code);
        setDiscountAmount(parsed.amount);
      } catch (err) {
        console.error("Failed to parse coupon", err);
      }
    }
  }, []);

  // Save to local storage whenever cart or coupon changes
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("dripeon_cart", JSON.stringify(cartItems));
      
      if (appliedCoupon) {
        localStorage.setItem("dripeon_coupon", JSON.stringify({ code: appliedCoupon, amount: discountAmount }));
      } else {
        localStorage.removeItem("dripeon_coupon");
      }
    }
  }, [cartItems, appliedCoupon, discountAmount, mounted]);

  const addToCart = (item: CartItem) => {
    setCartItems((prev) => {
      const existing = prev.find(
        (i) => i.id === item.id && i.size === item.size
      );
      if (existing) {
        return prev.map((i) =>
          i.id === item.id && i.size === item.size
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (id: string, size: string) => {
    setCartItems((prev) => prev.filter((i) => !(i.id === id && i.size === size)));
  };

  const updateQuantity = (id: string, size: string, quantity: number) => {
    if (quantity < 1) return;
    setCartItems((prev) =>
      prev.map((i) =>
        i.id === id && i.size === size ? { ...i, quantity } : i
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setAppliedCoupon(null);
    setDiscountAmount(0);
  };

  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Recalculate dynamic discounts (e.g. 10% off) when cartTotal changes
  useEffect(() => {
    if (appliedCoupon === 'WELCOME10') {
      setDiscountAmount(Math.floor(cartTotal * 0.10));
    } else if (appliedCoupon === 'DRIPEON500' && cartTotal > 2000) {
      setDiscountAmount(500);
    } else if (appliedCoupon === 'DRIPEON500' && cartTotal <= 2000) {
      // Auto-remove if condition no longer met
      setAppliedCoupon(null);
      setDiscountAmount(0);
    }
  }, [cartTotal, appliedCoupon]);

  const applyCoupon = (code: string) => {
    const upperCode = code.trim().toUpperCase();
    
    if (upperCode === 'WELCOME10') {
      setAppliedCoupon('WELCOME10');
      setDiscountAmount(Math.floor(cartTotal * 0.10));
      return { success: true, message: '10% discount applied!' };
    } 
    
    if (upperCode === 'DRIPEON500') {
      if (cartTotal > 2000) {
        setAppliedCoupon('DRIPEON500');
        setDiscountAmount(500);
        return { success: true, message: 'Flat ₹500 discount applied!' };
      } else {
        return { success: false, message: 'Cart value must be above ₹2000 for this coupon.' };
      }
    }

    return { success: false, message: 'Invalid or expired coupon code.' };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        appliedCoupon,
        discountAmount,
        applyCoupon,
        removeCoupon,
        isCartOpen,
        openCart,
        closeCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
