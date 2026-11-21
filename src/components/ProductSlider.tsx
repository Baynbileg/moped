import { useRef } from "react";
import { Link } from "react-router-dom";
import type { Product } from "../lib/Products";
import ProductCard from "./ProductCard";

type Props = {
  title: string;
  products: Product[];
  seeAllTo: string;
};

export default function ProductSlider({ title, products, seeAllTo }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);

  function scroll(direction: 1 | -1) {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: direction * track.clientWidth * 0.85, behavior: "smooth" });
  }

  return (
    <section className="slider">
      <div className="section-head">
        <h2>{title}</h2>
        <Link to={seeAllTo}>See all →</Link>
      </div>

      <div className="slider-body">
        <button
          type="button"
          className="slider-arrow slider-arrow-prev"
          aria-label={`Previous ${title}`}
          onClick={() => scroll(-1)}
        >
          ←
        </button>
        <div className="slider-track" ref={trackRef}>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <button
          type="button"
          className="slider-arrow slider-arrow-next"
          aria-label={`Next ${title}`}
          onClick={() => scroll(1)}
        >
          →
        </button>
      </div>
    </section>
  );
}