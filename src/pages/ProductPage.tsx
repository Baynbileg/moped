import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchProduct, formatPrice, type Product } from "../lib/Products";
import { imageUrl } from "../lib/supabase";

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const productId = Number(id);
    if (!Number.isInteger(productId)) {
      setLoading(false);
      return;
    }
    fetchProduct(productId)
      .then(setProduct)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="status">Loading…</p>;
  if (error) return <p className="status">Couldn’t load this product: {error}</p>;
  if (!product) {
    return (
      <p className="status">
        Product not found. <Link to="/">Back to all products</Link>
      </p>
    );
  }

  const photo = imageUrl(product.image_url);

  return (
    <div className="product-page">
      <div className="product-page-image">
        {photo ? (
          <img src={photo} alt={product.name} />
        ) : (
          <div className="no-image">No photo yet</div>
        )}
      </div>
      <div className="product-page-info">
        <Link className="back-link" to="/">
          ← All products
        </Link>
        {product.product_type && (
          <span className="eyebrow">{product.product_type.type}</span>
        )}
        <h1>{product.name}</h1>
        <p className="product-page-price">{formatPrice(product.price)}</p>
        {product.description && (
          <p className="product-page-description">{product.description}</p>
        )}
        <p className="stock-note">
          {product.stock > 0 ? `${product.stock} in stock` : "Sold out"}
        </p>
        <button
          className="button button-dark"
          type="button"
          disabled={product.stock <= 0}
        >
          Add to bag
        </button>
      </div>
    </div>
  );
}