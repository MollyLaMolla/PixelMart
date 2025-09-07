import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./StoreCard.css";

export default function StoreCard({ product }) {
  const { id, name, imagesForColors, price, currency, colors } = product;

  const currencySymbol = currency === "EUR" ? "€" : "$";

  const monthly = price ? Math.round((price / 24) * 100) / 100 : null;

  const ImagesRef = React.useRef(imagesForColors);
  const [activeColor, setActiveColor] = useState(product.colors?.[0] || "");
  const [activeImage, setActiveImage] = useState(
    ImagesRef.current?.[0]?.images?.[0] || ""
  );

  const handleColorClick = (color) => {
    setActiveColor(color);
    setActiveImage(
      ImagesRef.current?.find((c) => c.color === color)?.images[0] || ""
    );
  };

  return (
    <div className="store-card" aria-labelledby={`product-${id}-title`}>
      <div className="store-card-media">
  <Link to={`/product/${id}`} className="store-card-link">
          {activeImage ? (
            // eslint-disable-next-line jsx-a11y/img-redundant-alt
            <>
              {ImagesRef.current.map((color, index) => (
                <img
                  key={index}
                  src={color.images[0]}
                  alt={`${name} image`}
                  className={`product-image`}
                  style={{
                    opacity: activeImage === color.images[0] ? 1 : 0,
                    transition:
                      "opacity 500ms ease-in-out, transform 300ms ease-in-out",
                  }}
                />
              ))}
            </>
          ) : (
            <div className="no-image">No image</div>
          )}
  </Link>
      </div>

      <div className="store-card-body">
        <div>
          <h3 id={`product-${id}-title`} className="product-title-store">
            {name}
          </h3>
        </div>
        {colors && colors.length > 0 && (
          <div className="store-card-colors">
            <ul className="colors-list" aria-label="Color options">
              {colors.slice(0, 8).map((c, i) => (
                <li key={i}>
                  <button
                    type="button"
                    className={
                      "color-swatch" +
                      " color-" +
                      colorClassName(c) +
                      (activeColor === c ? " active" : "")
                    }
                    aria-label={c}
                    onClick={() => handleColorClick(c)}
                  >
                    {activeColor === c && (
                      <span
                        className={
                          "color-outer-circle " +
                          "border-" +
                          colorClassName(c) +
                          (activeColor === c ? " active" : "")
                        }
                      />
                    )}
                    {/* kept for screen-readers as extra hint (already provided via aria-label) */}
                    <span className="sr-only">{c}</span>
                    <span
                      className={"color-fill " + "color-" + colorClassName(c)}
                    />
                    {/* visible label that appears on hover / focus */}
                    <span className="color-label" aria-hidden="true">
                      {c}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="store-card-footer">
          <div className="price-root">
            <div className="price">
              {currencySymbol} {formatPrice(price)}
            </div>
            {monthly !== null && (
              <div className="monthly">
                Da {currencySymbol} {formatPrice(monthly)} / mese
              </div>
            )}
          </div>

          <div className="actions">
            <Link to={`/product/${id}`} className="store-card-link">
              <button className="btn-buy">Acquista</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// Small helper to map some common Apple color names to approximate hex values.
function colorClassName(name) {
  const n = (name || "").toLowerCase();
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

function formatPrice(amount) {
  if (typeof amount !== "number") return amount;
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
