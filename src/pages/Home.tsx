import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchProducts, formatPrice, type Product } from "../lib/Products";
import { imageUrl } from "../lib/supabase";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="status">Loading products…</p>;
  if (error) return <p className="status">Couldn’t load products: {error}</p>;
  if (products.length === 0) return <p className="status">No products yet.</p>;

  return (
    <section className="shop-section" id="shop">
      <div className="product-grid">
        {products.map((product) => {
          const photo = imageUrl(product.image_url);
          return (
            <Link
              className="product-card"
              key={product.id}
              to={`/product/${product.id}`}
            >
              <div className="product-image">
                {photo ? (
                  <img src={photo} alt={product.name} loading="lazy" />
                ) : (
                  <div className="no-image">No photo yet</div>
                )}
                {product.product_type && (
                  <span className="product-category">
                    {product.product_type.type}
                  </span>
                )}
              </div>
              <div className="product-info">
                <h3>{product.name}</h3>
                <span className="product-price">
                  {formatPrice(product.price)}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}