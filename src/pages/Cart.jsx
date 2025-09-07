import React, { useEffect, useState, useCallback } from "react";
import productsData from "../data/products.json";
import "./Cart.css";
import { Link, useNavigate } from "react-router-dom";
import CustomSelect from "../components/CustomSelect.jsx";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const warrantyOptions = [
  {
    id: "standard",
    name: "Garanzia Standard",
    price: 0,
    years: "2",
    description: "Garanzia legale di 2 anni inclusa nel prezzo",
  },
  {
    id: "applecare",
    name: "AppleCare+",
    price: 99,
    years: "3",
    description: "Copertura estesa per 3 anni con danni accidentali",
  },
  {
    id: "applecare-premium",
    name: "AppleCare+ Premium",
    price: 149,
    years: "3",
    description: "Copertura estesa + priorità sostituzione 24h",
  },
];

function computePrice(product, opts) {
  if (!product) return 0;
  let basePrice = product.price;
  if (product.specs?.storageOptions && opts.storage) {
    const storageOptions = product.specs.storageOptions;
    const selectedIndex = storageOptions.indexOf(opts.storage);
    if (selectedIndex > 0) {
      let stepIncrease = Math.ceil(product.price * 0.1);
      if (stepIncrease > 360) stepIncrease = 360;
      basePrice = product.price + stepIncrease * selectedIndex;
    }
  }
  if (product.specs?.memory && opts.memory) {
    const memoryOptions = Array.isArray(product.specs.memory)
      ? product.specs.memory
      : [product.specs.memory];
    const baseMemory = memoryOptions[0];
    const selectedIndex = memoryOptions.indexOf(opts.memory);
    if (selectedIndex > 0) {
      const baseRamValue = parseInt(baseMemory);
      const selectedRamValue = parseInt(opts.memory);
      if (!isNaN(baseRamValue) && !isNaN(selectedRamValue)) {
        const gbDifference = selectedRamValue - baseRamValue;
        const steps16GB = Math.ceil(gbDifference / 16);
        let totalRamCost = 0;
        for (let i = 0; i < steps16GB; i++) {
          const stepDiscount = i * 0.12;
          const discountFactor = 1 - (stepDiscount > 0.5 ? 0.5 : stepDiscount);
          const stepCost = 160 * discountFactor;
          totalRamCost += stepCost;
        }
        basePrice += totalRamCost;
      }
    }
  }
  if (product.appleCare && opts.warrantyId) {
    const w = warrantyOptions.find((x) => x.id === opts.warrantyId);
    if (w) basePrice += w.price;
  }
  return Math.ceil(basePrice * (opts.quantity || 1));
}

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem("cartItems") || "[]");
  } catch {
    return [];
  }
}
function saveCart(items) {
  localStorage.setItem("cartItems", JSON.stringify(items));
  window.dispatchEvent(new Event("cartUpdated"));
}

export default function Cart() {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(max-width:1080px)");
    const apply = () => {
      setIsMobile(mq.matches);
      setSummaryOpen(!mq.matches); // open on desktop, collapsed on mobile
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    setItems(loadCart());
  }, []);

  const updateItem = useCallback((idx, patch) => {
    setItems((prev) => {
      const clone = [...prev];
      clone[idx] = { ...clone[idx], ...patch };
      saveCart(clone);
      return clone;
    });
  }, []);

  const removeItem = (idx) => {
    setItems((prev) => {
      const clone = prev.filter((_, i) => i !== idx);
      saveCart(clone);
      return clone;
    });
  };

  const clearCart = () => {
    saveCart([]);
    setItems([]);
  };
  const formatPrice = (price) =>
    `${Number(price).toLocaleString("it-IT", { maximumFractionDigits: 0 })} €`;

  const detailedItems = items.map((ci) => {
    const product = productsData.products.find((p) => p.id === ci.id);
    const lineTotal = computePrice(product, ci.options || {});
    return { ...ci, product, lineTotal };
  });
  const subtotal = detailedItems.reduce((s, i) => s + i.lineTotal, 0);
  const total = subtotal;
  const totalItems = detailedItems.reduce(
    (s, i) => s + (i.options.quantity || 1),
    0
  );

  return (
    <main className="cart-page">
      <div className="cart-container">
        <div className="cart-header-row">
          <h1 className="cart-title">Carrello</h1>
          {items.length > 0 && (
            <button className="cart-clear" onClick={clearCart}>
              Svuota
            </button>
          )}
        </div>
        {items.length === 0 && (
          <div className="cart-empty">
            <p>Il tuo carrello è vuoto.</p>
            <Link to="/store" className="cart-empty-cta">
              Vai allo Store
            </Link>
          </div>
        )}
        {items.length > 0 && (
          <div className="cart-layout">
            <section className="cart-items" aria-label="Prodotti nel carrello">
              {detailedItems.map((item, idx) => {
                const { product } = item;
                if (!product) return null;
                const colors = product.colors || [];
                const storages = product.specs?.storageOptions || [];
                const memories = Array.isArray(product.specs?.memory)
                  ? product.specs.memory
                  : product.specs?.memory
                  ? [product.specs.memory]
                  : [];
                const warrantyList = product.appleCare ? warrantyOptions : [];
                const activeColorImages =
                  product.imagesForAnyColor?.find(
                    (c) => c.color === item.options.color
                  ) || product.imagesForAnyColor?.[0];
                const img = activeColorImages?.images?.[0];
                const colorOptions = colors.map((c) => ({
                  value: c,
                  label: c,
                }));
                const storageOptions = storages.map((s) => ({
                  value: s,
                  label: s,
                }));
                const memoryOptions = memories.map((m) => ({
                  value: m,
                  label: m,
                }));
                const warrantySelectOptions = warrantyList.map((w) => ({
                  value: w.id,
                  label: w.name,
                }));
                return (
                  <article className="cart-item" key={idx}>
                    <div className="cart-item-left">
                      <div className="cart-thumb">
                        {img ? (
                          <img src={img} alt={product.name} loading="lazy" />
                        ) : (
                          <div className="cart-thumb-fallback" />
                        )}
                      </div>
                      <div className="cart-item-info">
                        <h2 className="cart-item-name">{product.name}</h2>
                        <div className="cart-item-options">
                          {colors.length > 0 && (
                            <div className="cart-opt">
                              <span>Colore</span>
                              <CustomSelect
                                options={colorOptions}
                                value={
                                  item.options.color || colorOptions[0]?.value
                                }
                                onChange={(val) =>
                                  updateItem(idx, {
                                    options: { ...item.options, color: val },
                                  })
                                }
                                ariaLabel="Seleziona colore"
                              />
                            </div>
                          )}
                          {storages.length > 0 && (
                            <div className="cart-opt">
                              <span>Storage</span>
                              <CustomSelect
                                options={storageOptions}
                                value={
                                  item.options.storage ||
                                  storageOptions[0]?.value
                                }
                                onChange={(val) =>
                                  updateItem(idx, {
                                    options: { ...item.options, storage: val },
                                  })
                                }
                                ariaLabel="Seleziona storage"
                              />
                            </div>
                          )}
                          {memories.length > 0 && (
                            <div className="cart-opt">
                              <span>RAM</span>
                              <CustomSelect
                                options={memoryOptions}
                                value={
                                  item.options.memory || memoryOptions[0]?.value
                                }
                                onChange={(val) =>
                                  updateItem(idx, {
                                    options: { ...item.options, memory: val },
                                  })
                                }
                                ariaLabel="Seleziona RAM"
                              />
                            </div>
                          )}
                          {warrantyList.length > 0 && (
                            <div className="cart-opt">
                              <span>Protezione</span>
                              <CustomSelect
                                options={warrantySelectOptions}
                                value={
                                  item.options.warrantyId ||
                                  warrantySelectOptions[0]?.value
                                }
                                onChange={(val) =>
                                  updateItem(idx, {
                                    options: {
                                      ...item.options,
                                      warrantyId: val,
                                    },
                                  })
                                }
                                ariaLabel="Seleziona protezione"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="cart-item-actions">
                        <div className="cart-item-qty">
                          <button
                            aria-label="Diminuisci"
                            onClick={() =>
                              updateItem(idx, {
                                options: {
                                  ...item.options,
                                  quantity: Math.max(
                                    1,
                                    (item.options.quantity || 1) - 1
                                  ),
                                },
                              })
                            }
                          >
                            <RemoveIcon fontSize="small" />
                          </button>
                          <span>{item.options.quantity || 1}</span>
                          <button
                            aria-label="Aumenta"
                            onClick={() =>
                              updateItem(idx, {
                                options: {
                                  ...item.options,
                                  quantity: (item.options.quantity || 1) + 1,
                                },
                              })
                            }
                          >
                            <AddIcon fontSize="small" />
                          </button>
                        </div>
                        <button
                          className="cart-item-remove"
                          onClick={() => removeItem(idx)}
                        >
                          Rimuovi
                        </button>
                      </div>
                    </div>
                    <div className="cart-item-price">
                      {formatPrice(item.lineTotal)}
                    </div>
                  </article>
                );
              })}
            </section>
            <aside
              className={
                "cart-summary" +
                (isMobile ? " collapsible" : "") +
                (summaryOpen ? " open" : "")
              }
              aria-label="Riepilogo ordine"
            >
              {isMobile && (
                <button
                  className="cart-summary-toggle"
                  onClick={() => setSummaryOpen((o) => !o)}
                  aria-expanded={summaryOpen}
                  aria-controls="cart-summary-content"
                >
                  <span>Riepilogo ordine</span>
                  <span
                    className={
                      "cart-summary-toggle-icon" + (summaryOpen ? " open" : "")
                    }
                  >
                    {" "}
                    <ExpandMoreIcon fontSize="small" />{" "}
                  </span>
                </button>
              )}
              <div id="cart-summary-content" className="cart-summary-content">
                <h2 className="cart-summary-title">Riepilogo</h2>
                <div className="cart-summary-row">
                  <span>Oggetti ({totalItems})</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="cart-summary-row">
                  <span>Spedizione gratuita</span>
                  <span>Disponibile</span>
                </div>
                <div className="cart-summary-total">
                  <span>Totale</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <button
                  className="cart-checkout-btn"
                  onClick={() => alert("Checkout non implementato")}
                >
                  Procedi all'ordine
                </button>
                <p className="cart-note">
                  Spedizione calcolata nella fase successiva.
                </p>
                <button
                  className="cart-continue"
                  onClick={() => navigate("/store")}
                >
                  Continua a comprare
                </button>
              </div>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
