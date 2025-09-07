import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import CustomSelect from "./CustomSelect";
import Slider from "@mui/material/Slider";
import "./FilterStore.css";
import "./SearchResultsInfo.css";
import productsData from "../data/products.json";
import CloseIcon from "./MuiCloseIcon";

const categories = Array.from(
  new Set(
    productsData.products.filter((p) => p.category).map((p) => p.category)
  )
);
const years = Array.from(
  new Set(
    productsData.products
      .filter((p) => p.specs && p.specs.releaseYear)
      .map((p) => p.specs.releaseYear)
  )
).sort((a, b) => b - a);
const colors = Array.from(
  new Set(productsData.products.flatMap((p) => p.colors || []))
);

const minProductPrice = Math.min(
  ...productsData.products.filter((p) => p.price).map((p) => p.price)
);
const maxProductPrice = Math.max(
  ...productsData.products.filter((p) => p.price).map((p) => p.price)
);

export default function FilterStore({ onFilter }) {
  // Funzione per leggere i filtri dalla query string
  function getFiltersFromURL() {
    const params = new URLSearchParams(window.location.search);
    return {
      selectedCategory: params.get("cat") || "",
      selectedYear: params.get("year") ? String(params.get("year")) : "",
      selectedColor: params.get("color") || "",
      priceRange: [
        params.get("priceMin")
          ? Number(params.get("priceMin"))
          : minProductPrice,
        params.get("priceMax")
          ? Number(params.get("priceMax"))
          : maxProductPrice,
      ],
      search: params.get("search") || "",
      sortBy: params.get("sort") || "default",
    };
  }

  // Stato locale dei filtri
  const initialFilters = getFiltersFromURL();
  const [localCategory, setLocalCategory] = useState(
    initialFilters.selectedCategory
  );
  const [localYear, setLocalYear] = useState(initialFilters.selectedYear);
  const [localColor, setLocalColor] = useState(initialFilters.selectedColor);
  const [localPriceRange, setLocalPriceRange] = useState(
    initialFilters.priceRange
  );
  const [localSearch, setLocalSearch] = useState(initialFilters.search);
  const [localSortBy, setLocalSortBy] = useState(initialFilters.sortBy);

  // Stato effettivo applicato (sincronizzato con URL)
  const [selectedCategory, setSelectedCategory] = useState(
    initialFilters.selectedCategory
  );
  const [selectedYear, setSelectedYear] = useState(initialFilters.selectedYear);
  const [selectedColor, setSelectedColor] = useState(
    initialFilters.selectedColor
  );
  const [priceRange, setPriceRange] = useState(initialFilters.priceRange);
  const [search, setSearch] = useState(initialFilters.search);
  const [sortBy, setSortBy] = useState(initialFilters.sortBy);

  // Stato per tracciare i click sulla NavBar
  const [navBarClick, setNavBarClick] = useState(0);
  const location = useLocation();

  // Sincronizza SEMPRE i filtri locali e applicati con la query string
  useEffect(() => {
    const filters = getFiltersFromURL();
    // Se siamo su /store senza categoria, resetta la categoria
    if (location.pathname === "/store" && !filters.selectedCategory) {
      setSelectedCategory("");
      setLocalCategory("");
    } else {
      setSelectedCategory(filters.selectedCategory);
      setLocalCategory(filters.selectedCategory);
    }
    setSelectedYear(filters.selectedYear);
    setSelectedColor(filters.selectedColor);
    setPriceRange(filters.priceRange);
    setSearch(filters.search);
    setSortBy(filters.sortBy);
    setLocalYear(filters.selectedYear);
    setLocalColor(filters.selectedColor);
    setLocalPriceRange(filters.priceRange);
    setLocalSearch(filters.search);
    setLocalSortBy(filters.sortBy);
  }, [location]);

  // Aggiungi un event listener per intercettare i click sulla NavBar
  useEffect(() => {
    const handleNavBarClick = () => {
      setNavBarClick((prev) => prev + 1);
    };
    window.addEventListener("navBarClick", handleNavBarClick);
    return () => {
      window.removeEventListener("navBarClick", handleNavBarClick);
    };
  }, []);

  // Debounce logic
  const debounceRef = useRef();

  function handleFilter(countOnly = false) {
    let filtered = productsData.products.filter((p) => p.name && p.price);
    if (selectedCategory)
      filtered = filtered.filter((p) => p.category === selectedCategory);
    if (selectedYear)
      filtered = filtered.filter(
        (p) => p.specs && p.specs.releaseYear === Number(selectedYear)
      );
    if (selectedColor)
      filtered = filtered.filter((p) =>
        (p.colors || []).includes(selectedColor)
      );
    filtered = filtered.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );
    if (search.trim()) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          (p.shortDescription || "")
            .toLowerCase()
            .includes(search.toLowerCase())
      );
    }

    // Se vogliamo solo il conteggio, restituiamolo qui
    if (countOnly) {
      return filtered.length;
    }

    // Ordina i prodotti
    switch (sortBy) {
      case "price-asc":
        filtered = filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filtered = filtered.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        filtered = filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        filtered = filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "year-desc":
        filtered = filtered.sort(
          (a, b) => (b.specs?.releaseYear || 0) - (a.specs?.releaseYear || 0)
        );
        break;
      case "year-asc":
        filtered = filtered.sort(
          (a, b) => (a.specs?.releaseYear || 0) - (b.specs?.releaseYear || 0)
        );
        break;
      default:
        break;
    }
    onFilter(filtered);
  }

  // Aggiorna la query string quando cambiano i filtri
  // Aggiorna la query string e applica i filtri solo al click
  function applyFilters() {
    setSelectedCategory(localCategory);
    setSelectedYear(localYear);
    setSelectedColor(localColor);
    setPriceRange(localPriceRange);
    setSearch(localSearch);
    setSortBy(localSortBy);
    const params = new URLSearchParams();
    if (localCategory) params.set("cat", localCategory);
    if (localYear) params.set("year", localYear);
    if (localColor) params.set("color", localColor);
    if (localPriceRange[0] !== minProductPrice)
      params.set("priceMin", localPriceRange[0]);
    if (localPriceRange[1] !== maxProductPrice)
      params.set("priceMax", localPriceRange[1]);
    if (localSearch) params.set("search", localSearch);
    if (localSortBy && localSortBy !== "default")
      params.set("sort", localSortBy);
    const newUrl =
      window.location.pathname +
      (params.toString() ? `?${params.toString()}` : "");
    if (window.location.pathname + window.location.search !== newUrl) {
      window.history.pushState({}, "", newUrl);
    }
    // EMETTI EVENTO CUSTOM
    const event = new Event("filtersApplied");
    window.dispatchEvent(event);
  }

  // Debounced filter effect solo sui filtri applicati
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      handleFilter();
    }, 100);
    return () => clearTimeout(debounceRef.current);
  }, [
    selectedCategory,
    selectedYear,
    selectedColor,
    priceRange,
    search,
    sortBy,
  ]);

  // Aggiorna i filtri quando la query string cambia (popstate)
  useEffect(() => {
    const syncFilters = () => {
      const filters = getFiltersFromURL();
      setSelectedCategory(filters.selectedCategory);
      setSelectedYear(filters.selectedYear);
      setSelectedColor(filters.selectedColor);
      setPriceRange(filters.priceRange);
      setSearch(filters.search);
      setSortBy(filters.sortBy);
      setLocalCategory(filters.selectedCategory);
      setLocalYear(filters.selectedYear);
      setLocalColor(filters.selectedColor);
      setLocalPriceRange(filters.priceRange);
      setLocalSearch(filters.search);
      setLocalSortBy(filters.sortBy);
    };
    window.addEventListener("popstate", syncFilters);
    // Sincronizza immediatamente
    syncFilters();
    return () => {
      window.removeEventListener("popstate", syncFilters);
    };
  }, [navBarClick]); // Aggiungi navBarClick come dipendenza

  // Verifica se i filtri locali sono diversi da quelli applicati
  function filtersChanged() {
    return (
      localCategory !== selectedCategory ||
      localYear !== selectedYear ||
      localColor !== selectedColor ||
      localPriceRange[0] !== priceRange[0] ||
      localPriceRange[1] !== priceRange[1] ||
      localSearch !== search ||
      localSortBy !== sortBy
    );
  }

  // Calcola il numero di risultati filtrati
  const countFilteredResults = () => {
    return handleFilter(true); // Passa true per indicare che vogliamo solo il conteggio
  };

  const filteredCount = countFilteredResults();

  // Funzione per rimuovere la ricerca mantenendo gli altri filtri
  const clearSearch = () => {
    // Aggiorniamo lo stato locale
    setLocalSearch("");

    // Aggiorniamo lo stato effettivo e sincronizziamo con URL
    setSearch("");

    // Aggiorniamo la query string mantenendo gli altri filtri
    const params = new URLSearchParams(window.location.search);
    params.delete("search");

    const newUrl =
      window.location.pathname +
      (params.toString() ? `?${params.toString()}` : "");

    if (window.location.pathname + window.location.search !== newUrl) {
      window.history.pushState({}, "", newUrl);
    }

    // Riapplica i filtri senza la ricerca
    handleFilter();
  };

  return (
    <section className="filter-store" aria-label="Filtri prodotti">
      {search.trim() && (
        <div className="search-results-info">
          <div className="search-results-text">
            <span className="results-count">{filteredCount} risultati</span>
            <span className="for-query">
              per "<span className="query-text">{search}</span>"
            </span>
          </div>
          <button
            className="clear-search-btn"
            onClick={clearSearch}
            aria-label="Rimuovi ricerca"
          >
            <CloseIcon className="search-clear-icon" />
          </button>
        </div>
      )}
      <div className="filter-row enhanced-filter-row">
        <div className="filter-row">
          <div className="filter-group enhanced-filter-group">
            <CustomSelect
              label="Categoria"
              ariaLabel="Categoria"
              value={localCategory}
              onChange={setLocalCategory}
              options={[
                { value: "", label: "Tutte" },
                ...categories.map((c) => ({ value: c, label: c })),
              ]}
            />
          </div>
          <div className="filter-group enhanced-filter-group">
            <CustomSelect
              label="Anno"
              ariaLabel="Anno"
              value={localYear}
              onChange={setLocalYear}
              options={[
                { value: "", label: "Tutti" },
                ...years.map((y) => ({ value: String(y), label: y })),
              ]}
            />
          </div>
          <div className="filter-group enhanced-filter-group">
            <CustomSelect
              label="Colore"
              ariaLabel="Colore"
              value={localColor}
              onChange={setLocalColor}
              options={[
                { value: "", label: "Tutti" },
                ...colors.map((col) => ({ value: col, label: col })),
              ]}
            />
          </div>
          <div className="filter-group enhanced-filter-group">
            <CustomSelect
              label="Ordina per"
              ariaLabel="Ordina per"
              value={localSortBy}
              onChange={setLocalSortBy}
              options={[
                { value: "default", label: "Default" },
                { value: "price-asc", label: "Prezzo crescente" },
                { value: "price-desc", label: "Prezzo decrescente" },
                { value: "name-asc", label: "Nome A-Z" },
                { value: "name-desc", label: "Nome Z-A" },
                { value: "year-desc", label: "Anno più recente" },
                { value: "year-asc", label: "Anno più vecchio" },
              ]}
            />
          </div>
        </div>
        <div className="filter-row">
          <div className="filter-group price-slider-group enhanced-filter-group">
            <span
              style={{
                marginBottom: "0.5rem",
                display: "block",
                color: "var(--muted)",
                fontWeight: 500,
                fontSize: "1.1rem",
                letterSpacing: "0.02em",
              }}
            >
              Prezzo
            </span>
            <div className="price-slider-labels enhanced-slider-labels">
              <span>{localPriceRange[0]} EUR</span>
              <span>–</span>
              <span>
                {localPriceRange[1]} EUR
                {localPriceRange[1] === maxProductPrice ? " e più" : ""}
              </span>
            </div>
            <div className="price-slider-root">
              <Slider
                value={localPriceRange}
                min={minProductPrice}
                max={maxProductPrice}
                step={1}
                onChange={(_, newValue) => setLocalPriceRange(newValue)}
                valueLabelDisplay="auto"
                getAriaLabel={() => "Range prezzo"}
                getAriaValueText={(val) => `${val} EUR`}
                sx={{
                  color: "var(--accent)",
                  height: 6,
                  padding: "15px 0",
                  transition: "box-shadow 0.3s",
                  boxShadow: "0 2px 16px 0 rgba(0,0,0,0.08)",
                  borderRadius: 8,
                  "&:hover": {
                    boxShadow: "0 4px 24px 0 rgba(0,0,0,0.16)",
                  },
                  "& .MuiSlider-thumb": {
                    border: "2px solid white",
                    backgroundColor: "var(--accent)",
                    transition: "transform 0.2s",
                    "&:hover": {
                      boxShadow: "0 0 0 6px rgba(0,123,255,0.15)",
                    },
                  },
                  "& .MuiSlider-track": {
                    backgroundColor: "var(--accent)",
                    transition: "background-color 0.3s",
                  },
                  "& .MuiSlider-rail": {
                    backgroundColor: "var(--muted)",
                    opacity: 0.7,
                  },
                }}
              />
            </div>
          </div>
        </div>
        <div
          className="filter-group enhanced-filter-group apply-filters-container"
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "center",
          }}
        >
          <button
            className="apply-filters-btn"
            onClick={applyFilters}
            disabled={!filtersChanged()}
            style={{
              padding: "0.7rem 1.6rem",
              fontSize: "1rem",
              borderRadius: "8px",
              background: filtersChanged() ? "#fff" : "#222",
              color: filtersChanged() ? "#111" : "#888",
              border: "none",
              fontWeight: 600,
              cursor: filtersChanged() ? "pointer" : "not-allowed",
              boxShadow: filtersChanged()
                ? "0 2px 8px 0 rgba(0,0,0,0.08)"
                : "none",
              transition: "all 0.2s",
            }}
          >
            Applica filtri
          </button>
        </div>
      </div>
    </section>
  );
}
