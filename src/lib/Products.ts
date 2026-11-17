import { supabase } from "./supabase";

export type Product = {
  id: number;
  name: string;
  description: string | null;
  price: number | null;
  stock: number;
  image_url: string | null;
  product_type: { type: string } | null;
};

const COLUMNS =
  "id, name, description, price, stock, image_url, product_type(type)";

export async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select(COLUMNS)
    .order("id");
  if (error) throw error;
  return (data ?? []) as unknown as Product[];
}

export async function fetchProduct(id: number): Promise<Product | null> {
  const { data, error } = await supabase
    .from("products")
    .select(COLUMNS)
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data as unknown as Product | null;
}

const CURRENCY = "USD"; // change to your currency code, e.g. "MNT"

export function formatPrice(price: number | null): string {
  if (price === null) return "";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: CURRENCY,
    maximumFractionDigits: 0,
  }).format(price);
}