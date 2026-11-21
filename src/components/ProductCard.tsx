import { Link } from "react-router-dom";
import { formatPrice, type Product } from "../lib/Products";
import { useStore } from "../lib/store";
import { imageUrl } from "../lib/supabase";
import HeartIcon from "./HeartIcon";

export default function ProductCard({ product }: { product: Product }) {
  const { isLiked, toggleLike } = useStore();
  const photo = imageUrl(product.image_url);
  const liked = isLiked(product.id);

  return (
    <article className="pcard">
      <Link className="pcard-link" to={`/product/${product.id}`}>
        <div className="pcard-image">
          {photo ? (
            <img src={photo} alt="" loading="lazy" />
          ) : (
            <span>No photo yet</span>
          )}
        </div>
        <h3 className="pcard-name">{product.name}</h3>
        <p className="pcard-price">{formatPrice(product.price)}</p>
      </Link>

      <button
        type="button"
        className={`pcard-like${liked ? " is-liked" : ""}`}
        aria-pressed={liked}
        aria-label={liked ? "Remove from liked" : "Add to liked"}
        onClick={() => toggleLike(product.id)}
      >
        <HeartIcon filled={liked} />
      </button>
    </article>
  );
}