import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { fetchProducts, type Product } from "./Products";

// products without a type are grouped under this name
export const OTHER_TYPE = "Other";
export const typeOf = (p: Product) => p.product_type?.type ?? OTHER_TYPE;

const LIKES_KEY = "moped-liked";

function readLikes(): number[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(LIKES_KEY) ?? "[]");
    return Array.isArray(parsed)
      ? parsed.filter((n): n is number => typeof n === "number")
      : [];
  } catch {
    return [];
  }
}

type Store = {
  products: Product[];
  loading: boolean;
  error: string | null;
  types: string[];
  likedIds: number[];
  isLiked: (id: number) => boolean;
  toggleLike: (id: number) => void;
};

const StoreContext = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [likedIds, setLikedIds] = useState<number[]>(readLikes);

  // products are loaded once and shared by the header and the pages
  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(LIKES_KEY, JSON.stringify(likedIds));
    } catch {
      // storage can be blocked, likes then only last until refresh
    }
  }, [likedIds]);

  const types = useMemo(
    () => Array.from(new Set(products.map(typeOf))),
    [products],
  );

  const value: Store = {
    products,
    loading,
    error,
    types,
    likedIds,
    isLiked: (id) => likedIds.includes(id),
    toggleLike: (id) =>
      setLikedIds((ids) =>
        ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id],
      ),
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside <StoreProvider>");
  return ctx;
}