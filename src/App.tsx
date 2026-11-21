import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import { StoreProvider } from "./lib/store";
import Home from "./pages/Home";
import ProductPage from "./pages/ProductPage";

function App() {
  return (
    <BrowserRouter>
      <StoreProvider>
        <Header />
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
      </StoreProvider>
    </BrowserRouter>
  );
}

export default App;