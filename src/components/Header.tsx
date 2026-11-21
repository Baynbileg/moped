import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useStore } from "../lib/store";
import HeartIcon from "./HeartIcon";

export default function Header() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { types, likedIds } = useStore();
  const [text, setText] = useState(params.get("q") ?? "");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // keep the search box in sync with the url
  useEffect(() => {
    setText(params.get("q") ?? "");
  }, [params]);

  // close the category menu when clicking outside of it
  useEffect(() => {
    if (!menuOpen) return;
    const close = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [menuOpen]);

  function onSearch(e: FormEvent) {
    e.preventDefault();
    const q = text.trim();
    navigate(q ? `/?q=${encodeURIComponent(q)}` : "/");
  }

  return (
    <header className="topbar">
      <div className="topbar-inner">
        <Link className="logo" to="/" aria-label="Moped Supply home">
          <span>MOPED</span>
          <span className="logo-accent">SUPPLY</span>
        </Link>

        <div className="category-menu" ref={menuRef}>
          <button
            type="button"
            className="category-button"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span aria-hidden="true">☰</span> Category
          </button>
          {menuOpen && (
            <div className="category-dropdown">
              {types.map((type) => (
                <Link
                  key={type}
                  to={`/?type=${encodeURIComponent(type)}`}
                  onClick={() => setMenuOpen(false)}
                >
                  {type}
                </Link>
              ))}
            </div>
          )}
        </div>

        <form className="search" role="search" onSubmit={onSearch}>
          <input
            type="search"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Search products"
            aria-label="Search products"
          />
          <button type="submit">Search</button>
        </form>

        <nav className="topbar-actions" aria-label="Account">
          <Link className="icon-link" to="/?liked=1" aria-label="Liked products">
            <HeartIcon size={22} />
            {likedIds.length > 0 && (
              <span className="badge">{likedIds.length}</span>
            )}
          </Link>
          {/* no accounts yet, hook these up when you add Supabase auth */}
          <button type="button" className="btn-light">
            Log in
          </button>
          <button type="button" className="btn-dark">
            Sign up
          </button>
        </nav>
      </div>
    </header>
  );
}