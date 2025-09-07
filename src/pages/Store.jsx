import StoreCard from "../components/StoreCard";
import FilterStore from "../components/FilterStore";
import "./Store.css";
import productsData from "../data/products.json";
import React from "react";

// Simple Store page: only NavBar is rendered by App, so here we render the grid

export default function Store() {
  const [filteredProducts, setFilteredProducts] = React.useState([]);

  // On mount, show all products
  React.useEffect(() => {
    setFilteredProducts(
      productsData.products
        .filter((p) => p.name && p.price)
        .map((p) => ({
          id: p.id,
          name: p.name,
          tagline: p.shortDescription || "",
          imagesForColors: p.imagesForAnyColor || [],
          specs: p.specs || {},
          colors: p.colors,
          currency: p.currency || "EUR",
          textColor: p.textColor || "text-dark",
          price: p.price || 0,
          link: `#/product/${p.id}`,
          tailwindImgDivClasses: p.tailwindImgDivClasses || "",
          tailwindImgClasses: p.tailwindImgClasses || "",
          imgHover: "translate-y-[-6px] scale-105",
          showProductFooter: false,
        }))
    );
  }, []);

  function handleFilter(filtered) {
    setFilteredProducts(
      filtered.map((p) => ({
        id: p.id,
        name: p.name,
        tagline: p.shortDescription || "",
        imagesForColors: p.imagesForAnyColor || [],
        specs: p.specs || {},
        colors: p.colors,
        currency: p.currency || "EUR",
        textColor: p.textColor || "text-dark",
        price: p.price || 0,
        link: `#/product/${p.id}`,
        tailwindImgDivClasses: p.tailwindImgDivClasses || "",
        tailwindImgClasses: p.tailwindImgClasses || "",
        imgHover: "translate-y-[-6px] scale-105",
        showProductFooter: false,
      }))
    );
  }

  return (
    <main className="store-page">
      <div className="store-container">
        <FilterStore onFilter={handleFilter} />
        <div className="store-grid">
          {filteredProducts.length === 0 ? (
            <div
              className="no-results"
              style={{
                color: "#fff",
                textAlign: "center",
                fontSize: "1.3rem",
                padding: "2rem 0",
                width: "100%",
              }}
            >
              Nessun risultato trovato
            </div>
          ) : (
            filteredProducts.map((p) => <StoreCard product={p} key={p.id} />)
          )}
        </div>
      </div>
    </main>
  );
}
