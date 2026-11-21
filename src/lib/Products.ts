import { getSupabase } from "./supabase";

export type Product = {
  id: number;
  name: string;
  description: string | null;
  price: number | null;
  stock: number;
  image_url: string | null;
  product_type: { type: string } | null;
};

// products_names is joined through product.name_id, product_type through product.type_id
const COLUMNS = "id, price, image_url, products_names(name), product_type(type)";

type ProductRow = {
  id: number;
  price: number | null;
  image_url: string | null;
  products_names: { name: string } | null;
  product_type: { type: string } | null;
};

function toProduct(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.products_names?.name ?? "Unnamed product",
    description: null,
    price: row.price,
    stock: 0, // not selected yet, add the column to COLUMNS when you need it
    image_url: row.image_url,
    product_type: row.product_type,
  };
}

export async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await getSupabase()
    .from("product")
    .select(COLUMNS)
    .order("id");
  if (error) throw error;
  return ((data ?? []) as unknown as ProductRow[]).map(toProduct);
}

export async function fetchProduct(id: number): Promise<Product | null> {
  const { data, error } = await getSupabase()
    .from("product")
    .select(COLUMNS)
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data ? toProduct(data as unknown as ProductRow) : null;
}

const CURRENCY = "MNT"; // change to your currency code

export function formatPrice(price: number | null): string {
  if (price === null) return "";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: CURRENCY,
    maximumFractionDigits: 0,
  }).format(price);
}