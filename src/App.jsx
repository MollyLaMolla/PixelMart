import { BrowserRouter, Routes, Route } from "react-router-dom"; // BrowserRouter per URL puliti
import { NavBar } from "./components/NavBar.jsx";
import { Hero } from "./components/Hero.jsx";
import { FeaturedProducts } from "./components/FeaturedProducts.jsx";
import { Footer } from "./components/Footer.jsx";
import Store from "./pages/Store.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import Cart from "./pages/Cart.jsx";
import "./tailwind.css"; // Importa Tailwind prima degli altri stili
import "./index.css";

export function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <NavBar />
      <Routes>
        <Route
          path="/"
          element={
            <main>
              <Hero />
              <FeaturedProducts />
            </main>
          }
        />
        <Route path="/store" element={<Store />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
