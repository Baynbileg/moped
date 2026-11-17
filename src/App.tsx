import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import ProductPage from "./pages/ProductPage";

function App() {
  return (
    <BrowserRouter>
      <header className="site-header">
        <Link className="wordmark" to="/" aria-label="Moped Supply home">
          <span className="wordmark-icon" aria-hidden="true">
            m
          </span>
          <span>
            MOPED
            <br />
            SUPPLY
          </span>
        </Link>
        <nav className="main-nav" aria-label="Main navigation">
          <button type="button">Mopeds</button>
          <button type="button">Parts</button>
          <button type="button">Gear</button>
          <button type="button">About</button>
        </nav>
        <button className="cart-button" type="button">
          Bag <span className="cart-count">0</span>
        </button>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route
            path="*"
            element={
              <p className="status">
                Page not found. <Link to="/">Back to all products</Link>
              </p>
            }
          />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;