import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export interface Product {
  id: string;
  name: string;
  price: number;
  image?: string;
  category: string;
}

export interface CartItem extends Product {
  quantity: number;
}

interface StoreContextValue {
  cart: CartItem[];
  wishlist: Product[];
  addToCart: (p: Product, qty?: number) => void;
  removeFromCart: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  toggleWishlist: (p: Product) => void;
  isWishlisted: (id: string) => boolean;
  cartCount: number;
  wishlistCount: number;
}

const StoreContext = createContext<StoreContextValue | null>(null);

const isBrowser = typeof window !== "undefined";
const read = <T,>(k: string, fallback: T): T => {
  if (!isBrowser) return fallback;
  try {
    const raw = window.localStorage.getItem(k);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setCart(read<CartItem[]>("astak_cart", []));
    setWishlist(read<Product[]>("astak_wishlist", []));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem("astak_cart", JSON.stringify(cart));
  }, [cart, hydrated]);
  useEffect(() => {
    if (hydrated) window.localStorage.setItem("astak_wishlist", JSON.stringify(wishlist));
  }, [wishlist, hydrated]);

  const addToCart = (p: Product, qty = 1) =>
    setCart((prev) => {
      const found = prev.find((i) => i.id === p.id);
      if (found) return prev.map((i) => (i.id === p.id ? { ...i, quantity: i.quantity + qty } : i));
      return [...prev, { ...p, quantity: qty }];
    });
  const removeFromCart = (id: string) => setCart((prev) => prev.filter((i) => i.id !== id));
  const updateQty = (id: string, qty: number) =>
    setCart((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity: Math.max(1, qty) } : i)),
    );
  const toggleWishlist = (p: Product) =>
    setWishlist((prev) =>
      prev.some((i) => i.id === p.id) ? prev.filter((i) => i.id !== p.id) : [...prev, p],
    );
  const isWishlisted = (id: string) => wishlist.some((i) => i.id === id);

  return (
    <StoreContext.Provider
      value={{
        cart,
        wishlist,
        addToCart,
        removeFromCart,
        updateQty,
        toggleWishlist,
        isWishlisted,
        cartCount: hydrated ? cart.reduce((s, i) => s + i.quantity, 0) : 0,
        wishlistCount: hydrated ? wishlist.length : 0,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be inside StoreProvider");
  return ctx;
}

export const CATEGORIES = [
  { slug: "sarees", label: "Sarees", tagline: "Draped in tradition, woven with grace" },
  { slug: "kurta-sets", label: "Kurta Sets", tagline: "Effortless ensembles for every occasion" },
  { slug: "dress-materials", label: "Dress Materials", tagline: "Unstitched artistry, tailored to you" },
  { slug: "dresses", label: "Dresses", tagline: "Silhouettes that honour the modern woman" },
  { slug: "bed-sheets", label: "Bed Sheets", tagline: "Heirloom comfort for quiet hours" },
] as const;
