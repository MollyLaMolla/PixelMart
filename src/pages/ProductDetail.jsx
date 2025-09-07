import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import productsData from "../data/products.json";
import "./ProductDetail.css";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedStorage, setSelectedStorage] = useState("");
  const [selectedMemory, setSelectedMemory] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // Delivery options
  const deliveryOptions = [
    {
      id: "standard",
      name: "Consegna Standard",
      price: 0,
      days: "2-3",
      icon: "📦",
      description: "Consegna gratuita entro 2-3 giorni lavorativi",
    },
    {
      id: "express",
      name: "Consegna Express",
      price: 4.99,
      days: "1",
      icon: "🚚",
      description: "Consegna il giorno lavorativo successivo",
    },
    {
      id: "sameday",
      name: "Consegna Oggi",
      price: 9.99,
      days: "0",
      icon: "⚡",
      description: "Consegna entro oggi se ordini entro le 12:00",
    },
  ];
  const [selectedDelivery, setSelectedDelivery] = useState(
    deliveryOptions[0].id
  );

  // Warranty options
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
      description:
        "Copertura estesa per 3 anni con sostituzione in caso di danni accidentali",
    },
    {
      id: "applecare-premium",
      name: "AppleCare+ Premium",
      price: 149,
      years: "3",
      description:
        "Tutto di AppleCare+ con priorità di assistenza e sostituzione garantita entro 24 ore",
    },
  ];
  const [selectedWarranty, setSelectedWarranty] = useState(
    warrantyOptions[0].id
  );

  // Find the product matching the ID
  useEffect(() => {
    const numericId = parseInt(id, 10);
    const foundProduct = productsData.products.find((p) => p.id === numericId);

    if (foundProduct) {
      setProduct(foundProduct);
      // Set defaults
      setSelectedColor(foundProduct.colors[0] || "");
      setSelectedStorage(
        foundProduct.specs?.storageOptions
          ? foundProduct.specs.storageOptions[0]
          : ""
      );
      setSelectedMemory(
        foundProduct.specs?.memory ? foundProduct.specs.memory[0] : ""
      );
    }

    setLoading(false);
  }, [id]);

  // Get current active image set based on selected color
  const getActiveImageSet = () => {
    if (!product || !product.imagesForAnyColor) return [];

    const colorImages = product.imagesForAnyColor.find(
      (c) => c.color === selectedColor
    );

    return colorImages?.images || [];
  };

  // Calculate final price
  const calculateFinalPrice = () => {
    if (!product) return 0;
    let basePrice = product.price;

    // Add storage price increase if applicable
    if (product.specs?.storageOptions && selectedStorage) {
      const storageOptions = product.specs.storageOptions;
      const baseStorage = storageOptions[0];
      const selectedIndex = storageOptions.indexOf(selectedStorage);
      if (selectedIndex > 0) {
        const increasePercentage = selectedIndex * 0.1;
        let stepIncrease = Math.ceil(product.price * 0.1);
        if (stepIncrease > 360) stepIncrease = 360;
        basePrice = product.price + stepIncrease * selectedIndex;
      }
    }

    // Add RAM price increase if applicable
    if (product.specs?.memory && selectedMemory) {
      const memoryOptions = product.specs.memory;
      const baseMemory = memoryOptions[0];
      const selectedIndex = memoryOptions.indexOf(selectedMemory);

      if (selectedIndex > 0) {
        // Parse RAM values to calculate GB difference
        const baseRamValue = parseInt(baseMemory);
        const selectedRamValue = parseInt(selectedMemory);

        if (!isNaN(baseRamValue) && !isNaN(selectedRamValue)) {
          // Calculate how many 16GB steps we have from base RAM
          const gbDifference = selectedRamValue - baseRamValue;
          const steps16GB = Math.ceil(gbDifference / 16);

          // Price increase: 160€ per 16GB step, minus 12% discount for each additional step
          let totalRamCost = 0;
          for (let i = 0; i < steps16GB; i++) {
            const stepDiscount = i * 0.12; // 12% discount per step
            const discountFactor =
              1 - (stepDiscount > 0.5 ? 0.5 : stepDiscount); // Cap discount at 50%
            const stepCost = 160 * discountFactor;
            totalRamCost += stepCost;
          }

          basePrice += totalRamCost;
        }
      }
    }

    // Add warranty price only if appleCare is true and a warranty option is selected
    if (product.appleCare) {
      const warrantyOption = warrantyOptions.find(
        (w) => w.id === selectedWarranty
      );
      if (warrantyOption) {
        basePrice += warrantyOption.price;
      }
    }
    const deliveryOption = deliveryOptions.find(
      (d) => d.id === selectedDelivery
    );
    if (deliveryOption) {
      basePrice += deliveryOption.price;
    }
    return Math.ceil(basePrice * quantity);
  };

  // Format price with currency symbol
  const formatPrice = (price, decimalPlaces) => {
    if (isNaN(price)) return "-";
    if (decimalPlaces === undefined || isNaN(decimalPlaces)) decimalPlaces = 0;
    const numPrice = Number(price);
    return `${numPrice.toLocaleString("it-IT", {
      maximumFractionDigits: decimalPlaces,
      minimumFractionDigits: decimalPlaces,
    })} ${product.currency === "EUR" ? "€" : "$"}`;
  };

  // Handle adding to cart (localStorage based)
  const handleAddToCart = () => {
    if (!product) return;
    const cartKey = "cartItems";
    const quantityNum = quantity || 1;
    let items = [];
    try {
      items = JSON.parse(localStorage.getItem(cartKey) || "[]");
      if (!Array.isArray(items)) items = [];
    } catch {
      items = [];
    }
    const options = {
      color: selectedColor || product.colors?.[0] || null,
      storage: selectedStorage || product.specs?.storageOptions?.[0] || null,
      memory:
        selectedMemory ||
        (Array.isArray(product.specs?.memory)
          ? product.specs.memory[0]
          : product.specs?.memory) ||
        null,
      warrantyId: product.appleCare ? selectedWarranty : null,
      quantity: quantityNum,
    };
    const signature = (item) =>
      [
        item.id,
        item.options?.color,
        item.options?.storage,
        item.options?.memory,
        item.options?.warrantyId,
      ].join("|");
    const newSig = signature({ id: product.id, options });
    const existing = items.find((it) => signature(it) === newSig);
    if (existing) {
      existing.options.quantity =
        (existing.options.quantity || 1) + quantityNum;
    } else {
      items.push({ id: product.id, options });
    }
    localStorage.setItem(cartKey, JSON.stringify(items));
    window.dispatchEvent(new Event("cartUpdated"));
    try {
      const toast = document.createElement("div");
      toast.className = "cart-toast";
      toast.textContent = "Aggiunto al carrello";
      document.body.appendChild(toast);
      setTimeout(() => {
        toast.classList.add("show");
        setTimeout(() => {
          toast.classList.remove("show");
          setTimeout(() => toast.remove(), 400);
        }, 1800);
      }, 10);
    } catch {
      alert("Prodotto aggiunto al carrello");
    }
  };

  // Renderizza le specifiche tecniche in base alla categoria del prodotto
  const renderCategorySpecificSpecs = () => {
    if (!product || !product.specs) return null;

    // Array di componenti da renderizzare
    const specComponents = [];

    // Specifiche comuni a tutte le categorie
    if (product.specs?.display) {
      specComponents.push(
        <div className="spec-item" key="display">
          <h3>Display</h3>
          <p>{product.specs.display}</p>
          {product.specs.refreshRate && (
            <p>
              <strong>Frequenza di aggiornamento:</strong>{" "}
              {product.specs.refreshRate}
            </p>
          )}
          {product.specs.brightness && (
            <p>
              <strong>Luminosità:</strong> {product.specs.brightness}
            </p>
          )}
          {product.specs.resolution && (
            <p>
              <strong>Risoluzione:</strong> {product.specs.resolution}
            </p>
          )}
          {product.specs.screenSize && (
            <p>
              <strong>Dimensioni:</strong> {product.specs.screenSize}
            </p>
          )}
        </div>
      );
    }

    // Chip/processore (comune a tutti i dispositivi)
    if (product.specs.chip) {
      specComponents.push(
        <div className="spec-item" key="processor">
          <h3>Processore</h3>
          <p>
            <strong>Chip:</strong> {product.specs.chip}
          </p>
          {product.specs.gpuCores && (
            <p>
              <strong>GPU:</strong> {product.specs.gpuCores} core GPU
            </p>
          )}
          {product.specs.cpuCores && (
            <p>
              <strong>CPU:</strong> {product.specs.cpuCores}
            </p>
          )}
          {product.specs.neural && (
            <p>
              <strong>Neural Engine:</strong> {product.specs.neural}
            </p>
          )}
          {product.specs.AppleIntelligence && (
            <p className="feature-highlight">
              Compatibile con Apple Intelligence
            </p>
          )}
        </div>
      );
    }

    // Specifiche in base alla categoria
    switch (product.category) {
      case "iPhone":
        // Fotocamera (specifico per iPhone)
        if (product.specs.cameraSpecs) {
          specComponents.push(
            <div className="spec-item" key="camera">
              <h3>Fotocamera</h3>
              {product.specs.cameraSpecs.main && (
                <p>
                  <strong>Principale:</strong> {product.specs.cameraSpecs.main}
                </p>
              )}
              {product.specs.cameraSpecs.ultraWide && (
                <p>
                  <strong>Ultra-grandangolo:</strong>{" "}
                  {product.specs.cameraSpecs.ultraWide}
                </p>
              )}
              {product.specs.cameraSpecs.telephoto && (
                <p>
                  <strong>Teleobiettivo:</strong>{" "}
                  {product.specs.cameraSpecs.telephoto}
                </p>
              )}
              {product.specs.cameraSpecs.front && (
                <p>
                  <strong>Fotocamera frontale:</strong>{" "}
                  {product.specs.cameraSpecs.front}
                </p>
              )}
              {product.specs.cameraSpecs.video && (
                <p>
                  <strong>Video:</strong> {product.specs.cameraSpecs.video}
                </p>
              )}
              {product.specs.zoom && (
                <>
                  {product.specs.zoom.optical && (
                    <p>
                      <strong>Zoom ottico:</strong> {product.specs.zoom.optical}
                    </p>
                  )}
                  {product.specs.zoom.digital && (
                    <p>
                      <strong>Zoom digitale:</strong>{" "}
                      {product.specs.zoom.digital}
                    </p>
                  )}
                </>
              )}
              {product.specs.cameraSideControl && (
                <p className="feature-highlight">
                  Controllo Fotocamera laterale
                </p>
              )}
            </div>
          );
        }

        // Dynamic Island (specifico per iPhone)
        if (product.specs.dynamicIsland !== undefined) {
          specComponents.push(
            <div className="spec-item" key="dynamicIsland">
              <h3>Features</h3>
              <p
                className={
                  product.specs.dynamicIsland ? "feature-highlight" : ""
                }
              >
                {product.specs.dynamicIsland
                  ? "Dynamic Island"
                  : "Notch tradizionale"}
              </p>
              {product.specs.faceID && (
                <p className="feature-highlight">Face ID</p>
              )}
            </div>
          );
        }
        break;

      case "iPad":
        // Accessori compatibili (specifico per iPad)
        if (product.specs.pencilSupport || product.specs.keyboardSupport) {
          specComponents.push(
            <div className="spec-item" key="accessories">
              <h3>Accessori Compatibili</h3>
              {product.specs.pencilSupport && (
                <p className="feature-highlight">
                  {product.specs.pencilSupport}
                </p>
              )}
              {product.specs.keyboardSupport && (
                <p className="feature-highlight">
                  {product.specs.keyboardSupport}
                </p>
              )}
            </div>
          );
        }
        break;

      case "Mac":
        // Porte e connettività (specifico per Mac)
        if (product.specs.ports && product.specs.ports.length > 0) {
          specComponents.push(
            <div className="spec-item" key="ports">
              <h3>Porte</h3>
              <ul className="ports-list">
                {product.specs.ports.map((port, index) => (
                  <li key={index}>{port}</li>
                ))}
              </ul>
            </div>
          );
        }

        // RAM e Storage (specifico per Mac)
        if (product.specs.memory || product.specs.storageOptions) {
          specComponents.push(
            <div className="spec-item" key="memory">
              <h3>Memoria</h3>
              {product.specs.memory && Array.isArray(product.specs.memory) ? (
                <p>
                  <strong>RAM:</strong> {product.specs.memory.join(", ")}
                </p>
              ) : product.specs.memory ? (
                <p>
                  <strong>RAM:</strong> {product.specs.memory}
                </p>
              ) : null}
              {product.specs.storageOptions && (
                <p>
                  <strong>Storage:</strong>{" "}
                  {product.specs.storageOptions.join(", ")}
                </p>
              )}
            </div>
          );
        }

        // Grafica (specifico per Mac)
        if (product.specs.graphics) {
          specComponents.push(
            <div className="spec-item" key="graphics">
              <h3>Grafica</h3>
              <p>{product.specs.graphics}</p>
            </div>
          );
        }

        // Audio (specifico per Mac)
        if (product.specs.audio) {
          specComponents.push(
            <div className="spec-item" key="mac-audio">
              <h3>Audio</h3>
              <p>{product.specs.audio}</p>
            </div>
          );
        }
        break;

      case "Apple Watch":
        // Sensori (specifico per Apple Watch)
        if (product.specs.sensors && product.specs.sensors.length > 0) {
          specComponents.push(
            <div className="spec-item" key="sensors">
              <h3>Sensori</h3>
              <ul className="sensors-list">
                {product.specs.sensors.map((sensor, index) => (
                  <li key={index}>{sensor}</li>
                ))}
              </ul>
            </div>
          );
        }

        // Funzionalità per la salute (specifico per Apple Watch)
        if (
          product.specs.healthFeatures &&
          product.specs.healthFeatures.length > 0
        ) {
          specComponents.push(
            <div className="spec-item" key="health">
              <h3>Funzionalità per la salute</h3>
              <ul className="health-list">
                {product.specs.healthFeatures.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          );
        }

        // Impermeabilità (specifico per Apple Watch)
        if (product.specs.waterResistance) {
          specComponents.push(
            <div className="spec-item" key="waterResistance">
              <h3>Resistenza all'acqua</h3>
              <p>{product.specs.waterResistance}</p>
            </div>
          );
        }
        break;

      case "AirPods":
        // Funzionalità audio (specifico per AirPods)
        if (
          product.specs.audioFeatures &&
          product.specs.audioFeatures.length > 0
        ) {
          specComponents.push(
            <div className="spec-item" key="audio">
              <h3>Funzionalità Audio</h3>
              <ul className="audio-list">
                {product.specs.audioFeatures.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          );
        }

        // Microfoni (specifico per AirPods)
        if (product.specs.microphones && product.specs.microphones.length > 0) {
          specComponents.push(
            <div className="spec-item" key="microphones">
              <h3>Microfoni</h3>
              <ul className="microphones-list">
                {product.specs.microphones.map((mic, index) => (
                  <li key={index}>{mic}</li>
                ))}
              </ul>
            </div>
          );
        }

        // Resistenza (specifico per AirPods)
        if (product.specs.resistance) {
          specComponents.push(
            <div className="spec-item" key="resistance">
              <h3>Resistenza</h3>
              <p>{product.specs.resistance}</p>
            </div>
          );
        }
        break;

      case "Accessories":
        // Specifiche per accessori come cavi, caricatori, etc.
        // Lunghezza (per cavi)
        if (product.specs.length) {
          specComponents.push(
            <div className="spec-item" key="cable-length">
              <h3>Caratteristiche</h3>
              <p>
                <strong>Lunghezza:</strong> {product.specs.length}
              </p>
              {product.specs.maxPower && (
                <p>
                  <strong>Potenza massima:</strong> {product.specs.maxPower}
                </p>
              )}
              {product.specs.connector && (
                <p>
                  <strong>Connettore:</strong> {product.specs.connector}
                </p>
              )}
              {product.specs.material && (
                <p>
                  <strong>Materiale:</strong> {product.specs.material}
                </p>
              )}
              {product.specs.dataTransfer && (
                <p>
                  <strong>Trasferimento dati:</strong>{" "}
                  {product.specs.dataTransfer}
                </p>
              )}
            </div>
          );
        }

        // Compatibilità
        if (product.specs.compatibility) {
          specComponents.push(
            <div className="spec-item" key="compatibility">
              <h3>Compatibilità</h3>
              <p>{product.specs.compatibility}</p>
            </div>
          );
        }

        // Speaker (per AirTag)
        if (product.specs.speaker) {
          specComponents.push(
            <div className="spec-item" key="speaker">
              <h3>Altoparlante</h3>
              <p>{product.specs.speaker}</p>
            </div>
          );
        }
        break;
    }

    // Batteria (comune a molti dispositivi)
    if (product.specs.batteryHour || product.specs.battery) {
      specComponents.push(
        <div className="spec-item" key="battery">
          <h3>Batteria</h3>
          {product.specs.batteryHour && (
            <p>Fino a {product.specs.batteryHour} ore di utilizzo</p>
          )}
          {product.specs.battery && <p>{product.specs.battery}</p>}
          {product.specs.fastCharge && (
            <p>
              <strong>Ricarica rapida:</strong> {product.specs.fastCharge}
            </p>
          )}
          {product.specs.wirelessCharging && (
            <p>
              <strong>Ricarica wireless:</strong>{" "}
              {product.specs.wirelessCharging}
            </p>
          )}
          {product.specs.charging && (
            <p>
              <strong>Ricarica:</strong> {product.specs.charging}
            </p>
          )}
        </div>
      );
    }

    // Materiali (comune a molti dispositivi)
    if (
      product.specs.screenMaterial ||
      product.specs.phoneMaterial ||
      product.specs.weight ||
      product.specs.dimensions
    ) {
      specComponents.push(
        <div className="spec-item" key="materials">
          <h3>Materiali e Dimensioni</h3>
          {product.specs.screenMaterial && (
            <p>
              <strong>Display:</strong> {product.specs.screenMaterial}
            </p>
          )}
          {product.specs.phoneMaterial && (
            <p>
              <strong>Scocca:</strong> {product.specs.phoneMaterial}
            </p>
          )}
          {product.specs.weight && (
            <p>
              <strong>Peso:</strong> {product.specs.weight}
            </p>
          )}
          {product.specs.dimensions && (
            <p>
              <strong>Dimensioni:</strong> {product.specs.dimensions}
            </p>
          )}
        </div>
      );
    }

    // Connettività (comune a molti dispositivi)
    if (
      product.specs["5G"] ||
      product.specs.usb ||
      product.specs.wifi ||
      product.specs.bluetooth ||
      (product.specs.connectivity && product.specs.connectivity.length > 0)
    ) {
      specComponents.push(
        <div className="spec-item" key="connectivity">
          <h3>Connettività</h3>
          {product.specs["5G"] && (
            <p>
              <strong>5G:</strong> Supportato
            </p>
          )}
          {product.specs.usb && (
            <p>
              <strong>USB:</strong> {product.specs.usb}
            </p>
          )}
          {product.specs.wifi && (
            <p>
              <strong>Wi-Fi:</strong> {product.specs.wifi}
            </p>
          )}
          {product.specs.bluetooth && (
            <p>
              <strong>Bluetooth:</strong> {product.specs.bluetooth}
            </p>
          )}
          {product.specs.thunderbolt && (
            <p>
              <strong>Thunderbolt:</strong> {product.specs.thunderbolt}
            </p>
          )}
          {product.specs.headphoneJack && (
            <p>
              <strong>Jack cuffie:</strong> {product.specs.headphoneJack}
            </p>
          )}
          {product.specs.connectivity &&
            product.specs.connectivity.length > 0 && (
              <ul className="connectivity-list">
                {product.specs.connectivity.map((conn, index) => (
                  <li key={index}>{conn}</li>
                ))}
              </ul>
            )}
        </div>
      );
    }

    // Anno di rilascio (comune a tutti i dispositivi)
    if (product.specs?.releaseYear) {
      specComponents.push(
        <div className="spec-item" key="release">
          <h3>Anno di rilascio</h3>
          <p>{product.specs.releaseYear}</p>
        </div>
      );
    }

    // Verifica se ci sono altre specifiche che non sono state gestite
    // e le mostra in una sezione "Altre specifiche"
    const handledSpecs = [
      "display",
      "refreshRate",
      "brightness",
      "resolution",
      "screenSize",
      "chip",
      "gpuCores",
      "cpuCores",
      "neural",
      "AppleIntelligence",
      "cameraSpecs",
      "dynamicIsland",
      "faceID",
      "pencilSupport",
      "keyboardSupport",
      "ports",
      "memory",
      "storageOptions",
      "graphics",
      "audio",
      "sensors",
      "healthFeatures",
      "waterResistance",
      "audioFeatures",
      "microphones",
      "resistance",
      "batteryHour",
      "battery",
      "fastCharge",
      "wirelessCharging",
      "charging",
      "screenMaterial",
      "phoneMaterial",
      "weight",
      "dimensions",
      "5G",
      "usb",
      "wifi",
      "bluetooth",
      "thunderbolt",
      "headphoneJack",
      "connectivity",
      "releaseYear",
      "length",
      "maxPower",
      "connector",
      "material",
      "dataTransfer",
      "compatibility",
      "speaker",
      "cameraSideControl",
      "zoom", // Aggiunto per evitare duplicazione in "Altre specifiche"
    ];

    const otherSpecs = Object.keys(product.specs).filter(
      (key) => !handledSpecs.includes(key)
    );

    if (otherSpecs.length > 0) {
      specComponents.push(
        <div className="spec-item" key="other-specs">
          <h3>Altre specifiche</h3>
          {otherSpecs.map((key) => (
            <p key={key}>
              <strong>
                {key.charAt(0).toUpperCase() +
                  key.slice(1).replace(/([A-Z])/g, " $1")}
                :
              </strong>{" "}
              {typeof product.specs[key] === "boolean"
                ? product.specs[key]
                  ? "Sì"
                  : "No"
                : Array.isArray(product.specs[key])
                ? product.specs[key].join(", ")
                : String(product.specs[key])}
            </p>
          ))}
        </div>
      );
    }

    return specComponents;
  };

  if (loading) {
    return <div className="product-loading">Caricamento...</div>;
  }

  if (!product) {
    return (
      <div className="product-not-found">
        <h1>Prodotto non trovato</h1>
        <Link to="/store" className="back-to-store">
          Torna allo Store
        </Link>
      </div>
    );
  }

  const images = getActiveImageSet();

  return (
    <main className="product-detail-page">
      <div className="product-detail-container">
        {/* Breadcrumb */}
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <ol>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/store">Store</Link>
            </li>
            <li>
              <Link to={`/store?cat=${product.category}`}>
                {product.category}
              </Link>
            </li>
            <li aria-current="page">{product.name}</li>
          </ol>
        </nav>

        <div className="product-content">
          {/* Left column - Product images */}
          <section className="product-images">
            <div className="image-gallery">
              <div className="main-image-container">
                {images.length > 0 ? (
                  <div
                    className="carousel"
                    onTouchStart={(e) => {
                      const touchStartX = e.touches[0].clientX;
                      const touchStartY = e.touches[0].clientY;
                      e.currentTarget.setAttribute("data-x", touchStartX);
                      e.currentTarget.setAttribute("data-y", touchStartY);
                    }}
                    onTouchMove={(e) => {
                      if (images.length <= 1) return;

                      const touchStartX = parseFloat(
                        e.currentTarget.getAttribute("data-x") || "0"
                      );
                      const touchStartY = parseFloat(
                        e.currentTarget.getAttribute("data-y") || "0"
                      );
                      const touchCurrentX = e.touches[0].clientX;
                      const touchCurrentY = e.touches[0].clientY;

                      // Calculate horizontal and vertical distance moved
                      const diffX = touchStartX - touchCurrentX;
                      const diffY = touchStartY - touchCurrentY;

                      // Only handle horizontal swipes (when horizontal movement > vertical movement)
                      if (
                        Math.abs(diffX) > Math.abs(diffY) &&
                        Math.abs(diffX) > 30
                      ) {
                        // Evita il warning "Unable to preventDefault inside passive event listener invocation"
                        // chiamando preventDefault solo se l'evento è annullabile.
                        if (e.cancelable) e.preventDefault();

                        // Get the inner container and apply a temporary transform
                        const innerEl =
                          e.currentTarget.querySelector(".carousel-inner");
                        if (innerEl) {
                          innerEl.style.transition = "none";
                          innerEl.style.transform = `translateX(${
                            -selectedImage * 100 -
                            (diffX / innerEl.clientWidth) * 100
                          }%)`;
                          e.currentTarget.setAttribute("data-swiping", "true");
                        }
                      }
                    }}
                    onTouchEnd={(e) => {
                      if (images.length <= 1) return;

                      const touchStartX = parseFloat(
                        e.currentTarget.getAttribute("data-x") || "0"
                      );
                      const touchCurrentX = e.changedTouches[0].clientX;
                      const diffX = touchStartX - touchCurrentX;

                      // Reset the inner container's transition
                      const innerEl =
                        e.currentTarget.querySelector(".carousel-inner");
                      if (innerEl) {
                        innerEl.style.transition = "transform 0.5s ease";

                        // If swipe distance is significant, change the slide
                        if (Math.abs(diffX) > 50) {
                          if (diffX > 0 && selectedImage < images.length - 1) {
                            setSelectedImage(selectedImage + 1);
                          } else if (diffX < 0 && selectedImage > 0) {
                            setSelectedImage(selectedImage - 1);
                          } else {
                            // Reset to current slide if at the edges
                            innerEl.style.transform = `translateX(-${
                              selectedImage * 100
                            }%)`;
                          }
                        } else {
                          // Not a significant swipe, return to the current slide
                          innerEl.style.transform = `translateX(-${
                            selectedImage * 100
                          }%)`;
                        }
                      }

                      e.currentTarget.setAttribute("data-swiping", "false");
                    }}
                  >
                    <div
                      className="carousel-inner"
                      style={{
                        transform: `translateX(-${selectedImage * 100}%)`,
                      }}
                    >
                      {images.map((img, index) => (
                        <div
                          key={index}
                          className="carousel-item-container"
                          data-index={index + 1}
                        >
                          <div key={index} className="carousel-item">
                            <img
                              src={img}
                              alt={`${product.name} in ${selectedColor}`}
                              className="main-image"
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    {images.length > 1 && (
                      <>
                        <div className="carousel-controls">
                          <button
                            className="carousel-prev"
                            onClick={() =>
                              setSelectedImage((prev) => Math.max(0, prev - 1))
                            }
                            aria-label="Immagine precedente"
                            disabled={selectedImage === 0}
                          >
                            <ArrowBackIosNewRoundedIcon className="carousel-icon" />
                          </button>
                          <button
                            className="carousel-next"
                            onClick={() =>
                              setSelectedImage((prev) =>
                                Math.min(images.length - 1, prev + 1)
                              )
                            }
                            aria-label="Immagine successiva"
                            disabled={selectedImage === images.length - 1}
                          >
                            <ArrowForwardIosRoundedIcon className="carousel-icon" />
                          </button>
                        </div>

                        <div className="carousel-indicators">
                          {images.map((_, index) => (
                            <span
                              key={index}
                              className={`carousel-indicator ${
                                selectedImage === index ? "active" : ""
                              }`}
                              onClick={() => setSelectedImage(index)}
                              aria-label={`Vai all'immagine ${index + 1}`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="image-placeholder">
                    Immagine non disponibile
                  </div>
                )}
              </div>

              {images.length > 1 && (
                <div className="image-thumbnails">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      className={`thumbnail-button ${
                        selectedImage === index ? "active" : ""
                      }`}
                      onClick={() => setSelectedImage(index)}
                      aria-label={`Visualizza immagine ${index + 1} di ${
                        product.name
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Thumbnail ${index + 1}`}
                        className="thumbnail-image"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Right column - Product info */}
          <section className="product-info">
            <div className="product-header">
              <h1>{product.name}</h1>
              <p className="product-description">{product.shortDescription}</p>
              <div className="product-price-container">
                <span className="product-price">
                  {formatPrice(calculateFinalPrice())}
                </span>
                {product.price > 500 && (
                  <span className="product-installment">
                    o {formatPrice((calculateFinalPrice() / 24).toFixed(2), 2)}{" "}
                    al mese per 24 mesi
                  </span>
                )}
              </div>
            </div>

            {/* Color selection */}
            <div className="product-option-section">
              <h2>Colore</h2>
              <div className="color-options">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    className={`color-option ${
                      selectedColor === color ? "active" : ""
                    }`}
                    onClick={() => {
                      setSelectedColor(color);
                    }}
                    aria-label={`Seleziona colore ${color}`}
                    aria-pressed={selectedColor === color}
                    title={color}
                  >
                    <span
                      className={`color-swatch color-${getColorClass(color)}`}
                    ></span>
                    <span className="color-name">{color}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Storage selection if available */}
            {product.specs?.storageOptions && (
              <div className="product-option-section">
                <h2>Capacità</h2>
                <div className="storage-options">
                  {product.specs.storageOptions.map((storage, index) => {
                    const isPriceIncrease = index > 0;
                    let priceIncreaseAmount = 0;
                    if (isPriceIncrease) {
                      let stepIncrease = Math.ceil(product.price * 0.1);
                      if (stepIncrease > 360) stepIncrease = 360;
                      priceIncreaseAmount = stepIncrease * index;
                    }
                    const priceIncreaseText = isPriceIncrease
                      ? `+${priceIncreaseAmount.toLocaleString("it-IT", {
                          maximumFractionDigits: 0,
                          minimumFractionDigits: 0,
                        })} €`
                      : "";
                    return (
                      <button
                        key={storage}
                        className={`storage-option ${
                          selectedStorage === storage ? "active" : ""
                        } ${isPriceIncrease ? "price-increase" : ""}`}
                        onClick={() => setSelectedStorage(storage)}
                        aria-pressed={selectedStorage === storage}
                        data-price-increase={priceIncreaseText}
                      >
                        {storage}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Memory (RAM) selection if available */}
            {product.specs?.memory && product.specs.memory.length > 1 && (
              <div className="product-option-section">
                <h2>Memoria</h2>
                <div className="storage-options memory-options">
                  {product.specs.memory.map((memory, index) => {
                    const isPriceIncrease = index > 0;
                    let priceIncreaseAmount = 0;

                    if (isPriceIncrease) {
                      // Parse RAM values to calculate GB difference
                      const baseRamValue = parseInt(product.specs.memory[0]);
                      const currentRamValue = parseInt(memory);

                      if (!isNaN(baseRamValue) && !isNaN(currentRamValue)) {
                        // Calculate how many 16GB steps we have from base RAM
                        const gbDifference = currentRamValue - baseRamValue;
                        const steps16GB = Math.ceil(gbDifference / 16);

                        // Price increase: 160€ per 16GB step, minus 12% discount for each additional step
                        for (let i = 0; i < steps16GB; i++) {
                          const stepDiscount = i * 0.12; // 12% discount per step
                          const discountFactor =
                            1 - (stepDiscount > 0.5 ? 0.5 : stepDiscount); // Cap discount at 50%
                          const stepCost = 160 * discountFactor;
                          priceIncreaseAmount += stepCost;
                        }
                      }
                    }

                    const priceIncreaseText = isPriceIncrease
                      ? `+${Math.ceil(priceIncreaseAmount).toLocaleString(
                          "it-IT",
                          {
                            maximumFractionDigits: 0,
                            minimumFractionDigits: 0,
                          }
                        )} €`
                      : "";

                    return (
                      <button
                        key={memory}
                        className={`storage-option ${
                          selectedMemory === memory ? "active" : ""
                        } ${isPriceIncrease ? "price-increase" : ""}`}
                        onClick={() => setSelectedMemory(memory)}
                        aria-pressed={selectedMemory === memory}
                        data-price-increase={priceIncreaseText}
                      >
                        {memory}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Delivery options */}
            <div className="product-option-section">
              <h2>Spedizione</h2>
              <div className="delivery-options">
                {deliveryOptions.map((option) => (
                  <button
                    key={option.id}
                    className={`delivery-option ${
                      selectedDelivery === option.id ? "active" : ""
                    }`}
                    onClick={() => setSelectedDelivery(option.id)}
                    aria-pressed={selectedDelivery === option.id}
                  >
                    <div className="delivery-option-content">
                      <span className="delivery-icon">{option.icon}</span>
                      <div className="delivery-details">
                        <span className="delivery-name">{option.name}</span>
                        <span className="delivery-description">
                          {option.description}
                        </span>
                      </div>
                      <span className="delivery-price">
                        {option.price === 0
                          ? "Gratis"
                          : formatPrice(option.price)}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Warranty options - show only if appleCare is true */}
            {product.appleCare && (
              <div className="product-option-section">
                <h2>Protezione</h2>
                <div className="warranty-options">
                  {warrantyOptions.map((option) => (
                    <button
                      key={option.id}
                      className={`warranty-option ${
                        selectedWarranty === option.id ? "active" : ""
                      }`}
                      onClick={() => setSelectedWarranty(option.id)}
                      aria-pressed={selectedWarranty === option.id}
                    >
                      <div className="warranty-option-content">
                        <div className="warranty-details">
                          <span className="warranty-name">{option.name}</span>
                          <span className="warranty-description">
                            {option.description}
                          </span>
                        </div>
                        <span className="warranty-price">
                          {option.price === 0
                            ? "Inclusa"
                            : `+${formatPrice(option.price)}`}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="product-option-section">
              <h2>Quantità</h2>
              <div className="quantity-selector">
                <button
                  className="quantity-button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Diminuisci quantità"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="quantity-value">{quantity}</span>
                <button
                  className="quantity-button"
                  onClick={() => setQuantity((q) => q + 1)}
                  aria-label="Aumenta quantità"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to cart and total */}
            <div className="product-actions">
              <div className="product-total">
                <span className="total-label">Totale</span>
                <span className="total-price">
                  {formatPrice(calculateFinalPrice())}
                </span>
              </div>

              <div className="product-buttons">
                <button
                  className="add-to-cart-button"
                  onClick={handleAddToCart}
                >
                  Aggiungi al carrello
                </button>
                <button className="buy-now-button">Acquista ora</button>
              </div>
            </div>
          </section>
        </div>

        {/* Product details and specs */}
        <section className="product-details">
          <h2>Specifiche tecniche</h2>
          <div className="specs-grid">
            {/* Rendering delle specifiche in base alla categoria del prodotto */}
            {renderCategorySpecificSpecs()}
            {/* Camera specifications */}
          </div>
        </section>

        {/* Additional information */}
        <section className="additional-info">
          <div className="info-columns">
            <div className="info-column">
              <h3>Spedizione e resi</h3>
              <p>
                Spedizione gratuita su ordini superiori a €30. Consegna stimata
                entro 2-3 giorni lavorativi.
              </p>
              <p>
                Hai 14 giorni per restituire il prodotto non utilizzato nella
                sua confezione originale.
              </p>
            </div>

            <div className="info-column">
              <h3>Pagamento sicuro</h3>
              <p>
                Accettiamo tutte le principali carte di credito, PayPal e
                pagamento a rate senza interessi.
              </p>
              <p>
                Tutte le transazioni sono protette con crittografia SSL a 256
                bit.
              </p>
            </div>

            <div className="info-column">
              <h3>Supporto clienti</h3>
              <p>
                Il nostro team di supporto è disponibile 24/7 per aiutarti con
                qualsiasi domanda.
              </p>
              <p>Contattaci via email o telefono per assistenza rapida.</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

// Helper function to get color class
function getColorClass(colorName) {
  const n = (colorName || "").toLowerCase();
  if (n.includes("titanium black")) return "titanium-black";
  if (n.includes("titanium white")) return "titanium-white";
  if (n.includes("titanium sand")) return "titanium-sand";
  if (n.includes("titanium natural")) return "titanium-natural";
  if (n.includes("light azure")) return "light-azure";
  if (n.includes("overseas blue")) return "overseas-blue";
  if (n.includes("light yellow")) return "light-yellow";
  if (n.includes("light pink")) return "light-pink";
  if (n.includes("light green")) return "light-green";
  if (n.includes("space gray")) return "space-gray";
  if (n.includes("blush pink")) return "blush-pink";
  if (n.includes("blue navy")) return "blue-navy";
  if (n.includes("dark purple")) return "dark-purple";
  if (n.includes("purple")) return "purple";
  if (n.includes("azure")) return "azure";
  if (n.includes("black")) return "black";
  if (n.includes("white")) return "white";
  if (n.includes("silver")) return "silver";
  if (n.includes("midnight")) return "midnight";
  if (n.includes("pink")) return "pink";
  if (n.includes("grey")) return "grey";
  if (n.includes("galaxy")) return "galaxy";
  if (n.includes("green")) return "green";
  if (n.includes("acquamarine")) return "acquamarine";
  if (n.includes("blue")) return "blue";
  if (n.includes("crimson")) return "crimson";
  if (n.includes("yellow")) return "yellow";
  if (n.includes("denim")) return "denim";
  if (n.includes("ink")) return "ink";
  if (n.includes("plum")) return "plum";
  if (n.includes("gold")) return "gold";
  if (n.includes("orange")) return "orange";
  return "";
}
