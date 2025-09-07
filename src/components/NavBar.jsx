import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "./MuiCloseIcon";
import productsList from "../data/products.json";

// Minimal, spacious Apple-inspired navigation bar.
export function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [filtersAppliedCount, setFiltersAppliedCount] = useState(0);
  const searchInputRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const lock = mobileOpen || searchOpen;
    document.body.style.overflow = lock ? "hidden" : "";
  }, [mobileOpen, searchOpen]);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  // Close search panel when clicking outside
  useEffect(() => {
    if (!searchOpen) return;

    const handleOutsideClick = (e) => {
      const navShell = document.querySelector(".nav-shell");

      if (searchOpen && navShell && !navShell.contains(e.target)) {
        setSearchOpen(false);
        // setQuery to the query string in the URL, if any
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [searchOpen]);

  useEffect(() => {
    if (!searchOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        setSearchOpen(false);
        setQuery("");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [searchOpen]);

  // Funzione per eseguire la ricerca
  const handleSearch = () => {
    if (query.trim()) {
      navigate(`/store?search=${encodeURIComponent(query.trim())}`);
      setSearchOpen(false);
    } else {
      // If query is empty, just close the search panel and clear in URL
      setQuery("");
      navigate("/store");
      setSearchOpen(false);
    }
  };

  const links = [
    "Home",
    "Store",
    "iPhone",
    "Mac",
    "iPad",
    "Apple Watch",
    "AirPods",
    "Accessories",
    "Support",
  ];
  // Stato del link selezionato
  const [active, setActive] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const updateCount = () => {
      try {
        const items = JSON.parse(localStorage.getItem("cartItems") || "[]");
        const count = Array.isArray(items)
          ? items.reduce((s, i) => s + (i.options?.quantity || 1), 0)
          : 0;
        setCartCount(count);
      } catch {
        setCartCount(0);
      }
    };
    updateCount();
    window.addEventListener("cartUpdated", updateCount);
    window.addEventListener("storage", updateCount);
    return () => {
      window.removeEventListener("cartUpdated", updateCount);
      window.removeEventListener("storage", updateCount);
    };
  }, []);

  const categoryLinks = [
    "iPhone",
    "Mac",
    "iPad",
    "Apple Watch",
    "AirPods",
    "Accessories",
  ];

  function getActiveNav(windowLocation) {
    const params = new URLSearchParams(windowLocation.search);
    const cat = params.get("cat");
    // Home
    if (windowLocation.pathname === "/") {
      return "Home";
    }
    // Store senza categoria
    if (windowLocation.pathname === "/store" && !cat) {
      return "Store";
    }
    // Store con categoria
    if (windowLocation.pathname === "/store" && cat) {
      if (categoryLinks.includes(cat)) {
        return cat;
      } else {
        // Se la categoria non è valida, fallback su Store
        return "Store";
      }
    }
    // Fallback: nessun active
    return "";
  }

  // Sincronizza il selected della NavBar con la query string
  useEffect(() => {
    setActive(getActiveNav(window.location));
  }, [location, filtersAppliedCount]);

  useEffect(() => {
    const onFiltersApplied = () => {
      setFiltersAppliedCount((c) => c + 1);
    };
    window.addEventListener("filtersApplied", onFiltersApplied);
    return () => {
      window.removeEventListener("filtersApplied", onFiltersApplied);
    };
  }, []);

  const navigate = useNavigate();

  // create an array of product names from the product list
  const suggestions = productsList.products.map((p) => p.name);
  const filtered = query.trim()
    ? suggestions.filter((s) => s.toLowerCase().includes(query.toLowerCase()))
    : suggestions.slice(0, 6);

  // Ensure ONLY hamburger opens the mobile menu
  const handleHamburgerClick = (e) => {
    e.stopPropagation();
    setMobileOpen((o) => !o);
  };
  const handleLinkClick = (label, e) => {
    e.preventDefault();
    setMobileOpen(false);
    if (label === "Store") {
      navigate("/store");
    } else if (label === "Home") {
      navigate("/");
    } else if (label === "Support") {
      window.open("https://support.apple.com/en-gb");
    } else if (
      [
        "iPhone",
        "Mac",
        "iPad",
        "Apple Watch",
        "AirPods",
        "Accessories",
      ].includes(label)
    ) {
      navigate(`/store?cat=${encodeURIComponent(label)}`);
      // Emetti l'evento 'navBarClick' per sincronizzare i filtri
      const event = new Event("navBarClick");
      window.dispatchEvent(event);
    }
  };

  // Add universal click protection
  const preventToggle = (e) => {
    // Stop propagation for any click in the navbar except the hamburger
    e.stopPropagation();
  };

  return (
    <header
      className={"nav-shell" + (scrolled ? " is-scrolled" : "")}
      onClick={preventToggle}
    >
      <nav className="nav-inner" aria-label="Main" onClick={preventToggle}>
        <div className="nav-left">
          <button className="brand" aria-label="Homepage">
            
          </button>
        </div>
        <ul className="nav-links" data-visible={mobileOpen ? "true" : "false"}>
          {links.map((label, idx) => (
            <li key={label} style={{ "--i": idx }}>
              <a
                href="#"
                onClick={(e) => handleLinkClick(label, e)}
                aria-current={active === label ? "page" : undefined}
                tabIndex={mobileOpen || window.innerWidth >= 960 ? 0 : -1}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
        <div className="nav-right" onClick={preventToggle}>
          <button
            className="icon-btn search-trigger"
            aria-label={searchOpen ? "Chiudi ricerca" : "Apri ricerca"}
            aria-expanded={searchOpen}
            aria-controls="nav-search-panel"
            onClick={(e) => {
              e.stopPropagation();
              // set query to the query string in the URL
              const params = new URLSearchParams(window.location.search);
              const searchParam = params.get("search") || "";
              setQuery(searchParam);
              setSearchOpen(true);
            }}
          >
            <SearchIcon className="mui-icon" />
          </button>
          <button
            className="icon-btn cart-btn"
            aria-label={"Carrello" + (cartCount ? ` (${cartCount})` : "")}
            onClick={(e) => {
              e.stopPropagation();
              navigate("/cart");
            }}
          >
            <span className="icon-bag" />
            {cartCount > 0 && (
              <span className="nav-cart-badge" aria-label="Numero articoli">
                {cartCount}
              </span>
            )}
          </button>
          <button
            className="hamburger"
            aria-expanded={mobileOpen}
            aria-label="Menu"
            onClick={handleHamburgerClick}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>
      <div
        className={"mobile-overlay" + (mobileOpen || searchOpen ? " open" : "")}
        onClick={() => {
          setMobileOpen(false);
          setSearchOpen(false);
        }}
      />
      <div
        id="nav-search-panel"
        className={"nav-search-panel" + (searchOpen ? " open" : "")}
        role="search"
        aria-label="Ricerca prodotti"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="nav-search-bar">
          <input
            ref={searchInputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cerca prodotti (es. iPhone, MacBook Air...)"
            aria-label="Campo di ricerca"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
          />
          <div className="search-controls">
            {query && (
              <button
                className="clear-btn"
                onClick={() => {
                  setQuery("");
                  navigate("/store");
                  setSearchOpen(false);
                }}
                aria-label="Pulisci ricerca"
              >
                <CloseIcon className="mui-icon" />
              </button>
            )}
            <button
              className="search-btn"
              onClick={handleSearch}
              aria-label="Cerca"
            >
              <SearchIcon className="mui-icon" />
            </button>
          </div>
        </div>
        <ul className="search-suggestions" aria-label="Suggerimenti">
          {filtered.length === 0 && <li className="empty">Nessun risultato</li>}
          {filtered.map((s) => (
            <li key={s}>
              <button
                onClick={() => {
                  setQuery(s);
                  setSearchOpen(false);
                  navigate(`/store?search=${encodeURIComponent(s)}`);
                }}
                className="suggestion-item"
                aria-label={`Vai a ${s}`}
              >
                {s}
              </button>
            </li>
          ))}
        </ul>
        <button
          className="close-btn mobile-only"
          onClick={() => {
            setSearchOpen(false);
            setQuery("");
          }}
          aria-label="Chiudi ricerca"
        >
          Esc
        </button>
      </div>
    </header>
  );
}
