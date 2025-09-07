import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function ProductCard({ product }) {
  // Stato locale per tracciare l'hover sulla card
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);
  const imgRef = useRef(null);
  const [shouldLoadImage, setShouldLoadImage] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  gsap.registerPlugin(ScrollTrigger);

  useEffect(() => {
    if (!cardRef.current) return;

    // Animazione di entrata con GSAP
    gsap.set(cardRef.current, {
      opacity: 0,
      scale: 0.9,
      y: 100,
      rotationX: 45,
      transformOrigin: "center bottom",
    });

    const animation = gsap.to(cardRef.current, {
      opacity: 1,
      scale: 1,
      y: 0,
      rotationX: 0,
      ease: "power1.inOut",
      duration: 0.1,
      scrollTrigger: {
        trigger: cardRef.current,
        start: "top bottom -=100",
        end: "center bottom",
        toggleActions: "play none none none",
      },
    });

    // Lazy loading con IntersectionObserver
    if (cardRef.current && !shouldLoadImage) {
      if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                setShouldLoadImage(true);
                observer.disconnect();
              }
            });
          },
          { rootMargin: "200px 0px", threshold: 0.05 }
        );
        observer.observe(cardRef.current);
        // Controllo immediato nel caso la card sia già visibile
        if (
          cardRef.current.getBoundingClientRect().top <
          window.innerHeight + 200
        ) {
          setShouldLoadImage(true);
          observer.disconnect();
        }
      } else {
        setShouldLoadImage(true);
      }
    }

    return () => {
      if (animation.scrollTrigger) {
        animation.scrollTrigger.kill();
      }
    };
  }, [shouldLoadImage]);

  return (
    <a
      href={product.link}
      ref={cardRef}
      className={`product-card ${product.color}`}
      data-full-width={product.isFullWidth}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`featured-product-content ${
          product.isFullWidth ? "center-flex" : ""
        }`}
      >
        <h3 className={`product-title ${product.textColor}`}>{product.name}</h3>
        <p className={`product-tagline ${product.textColor}`}>
          {product.tagline}
        </p>

        <div className="product-cta">
          <span className="btn-link">Scopri di più</span>
          <span className="btn-link accent ml-4">Acquista</span>
        </div>
        {product.isFullWidth && (
          <p className="designed-text gradient-animated-text">
            Progettato per Apple Intelligence.
          </p>
        )}
      </div>

      {!product.isFullWidth ? (
        <div
          className={`product-image-container ${product.tailwindImgDivClasses}`}
        >
          <img
            ref={imgRef}
            src={shouldLoadImage ? product.image : undefined}
            data-src={product.image}
            alt={product.name}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            className={`product-image ${product.tailwindImgClasses} ${
              isHovered ? `${product.imgHover}` : ""
            }`}
            style={{
              opacity: imageLoaded ? 1 : 0,
            }}
          />
        </div>
      ) : (
        <figure className="product-image-placeholder iphone-image"></figure>
      )}

      {product.showProductFooter && (
        <div className="product-footer">
          <span className="designed-text gradient-animated-text">
            Progettato per Apple Intelligence.
          </span>
        </div>
      )}
    </a>
  );
}
