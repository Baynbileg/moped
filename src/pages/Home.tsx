import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import ProductSlider from "../components/ProductSlider";
import type { Product } from "../lib/Products";
import { typeOf, useStore } from "../lib/store";
import { imageUrl } from "../lib/supabase";

const SLIDER_LIMIT = 12;

export default function Home() {
  const [params] = useSearchParams();
  const { products, loading, error, likedIds } = useStore();

  const activeType = params.get("type");
  const rawQuery = (params.get("q") ?? "").trim();
  const showLiked = params.get("liked") === "1";

  // one group per product type, newest products first
  const groups = useMemo(() => {
    const map = new Map<string, Product[]>();
    for (const p of products) {
      const type = typeOf(p);
      map.set(type, [...(map.get(type) ?? []), p]);
    }
    return Array.from(map, ([type, items]) => ({
      type,
      items: [...items].sort((a, b) => b.id - a.id),
    }));
  }, [products]);

  if (loading) return <p className="status">Loading products…</p>;
  if (error) return <p className="status">Couldn’t load products: {error}</p>;
  if (products.length === 0) return <p className="status">No products yet.</p>;

  const isFiltered = Boolean(activeType || rawQuery || showLiked);

  const filtered = products.filter((p) => {
    if (activeType && typeOf(p) !== activeType) return false;
    if (showLiked && !likedIds.includes(p.id)) return false;
    if (
      rawQuery &&
      !`${p.name} ${typeOf(p)}`.toLowerCase().includes(rawQuery.toLowerCase())
    )
      return false;
    return true;
  });

  let title = activeType ?? "";
  if (rawQuery) title = `Results for “${rawQuery}”`;
  if (showLiked) title = "Liked products";

  return (
    <div className="home">
      {/* category buttons */}
      <nav className="tiles" aria-label="Categories">
        {groups.map(({ type, items }) => {
          const photo = imageUrl(items.find((p) => p.image_url)?.image_url ?? null);
          const active = activeType === type;
          return (
            <Link
              key={type}
              className={`tile${active ? " is-active" : ""}`}
              // clicking the selected category again goes back to everything
              to={active ? "/" : `/?type=${encodeURIComponent(type)}`}
              aria-current={active ? "true" : undefined}
            >
              {active && (
                <span className="tile-close" aria-hidden="true">
                  ✕
                </span>
              )}
              <span className="tile-name">{type}</span>
              <span className="tile-count">{items.length} items</span>
              {photo && <img src={photo} alt="" loading="lazy" />}
            </Link>
          );
        })}
      </nav>

      {isFiltered ? (
        <section>
          <div className="section-head">
            <h2>{title}</h2>
            <span className="section-count">{filtered.length} items</span>
          </div>
          {filtered.length === 0 ? (
            <p className="status-inline">Nothing found here yet.</p>
          ) : (
            <div className="product-grid-new">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      ) : (
        groups.map(({ type, items }) => (
          <ProductSlider
            key={type}
            title={type}
            products={items.slice(0, SLIDER_LIMIT)}
            seeAllTo={`/?type=${encodeURIComponent(type)}`}
          />
        ))
      )}
    </div>
  );
}