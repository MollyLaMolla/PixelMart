import {
  BrowserRouter,
  Routes,
  Route,
  useNavigationType,
  useLocation,
} from "react-router-dom"; // BrowserRouter per URL puliti
import { useEffect, useRef } from "react";
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
  const basename = import.meta.env.DEV
    ? undefined
    : import.meta.env.BASE_URL.replace(/\/$/, "");
  return (
    <BrowserRouter
      basename={basename}
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <ScrollManager />
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

// Gestisce lo scroll: scrollTop=0 solo per navigazioni PUSH (click link / buttons)
function ScrollManager() {
  const action = useNavigationType(); // POP | PUSH | REPLACE
  const location = useLocation();
  const prevPathRef = useRef(location.pathname);

  useEffect(() => {
    const prevPath = prevPathRef.current;
    const newPath = location.pathname;
    // Scroll solo se: nuova navigazione PUSH (click link / navigate) e pathname diverso
    // Questo evita scroll reset su cambi di query string (?cat= / ?search=) e su POP (back/forward)
    if (action === "PUSH" && newPath !== prevPath) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }
    prevPathRef.current = newPath;
  }, [location.pathname, action]);
  return null;
}
