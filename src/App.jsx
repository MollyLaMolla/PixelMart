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
  // In sviluppo nessun basename; in produzione usa quello derivato da Vite (es. /PixelMart.Deploy/)
  const basename = import.meta.env.DEV ? undefined : import.meta.env.BASE_URL.replace(/\/$/, "");
  return (
    <BrowserRouter basename={basename}
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
