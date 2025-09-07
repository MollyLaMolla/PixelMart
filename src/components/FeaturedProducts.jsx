import { ProductCard } from "./ProductCard";
import { useRef } from "react";

// Importa direttamente il file CSS di ScrollTrigger se necessario
// import "gsap/ScrollTrigger/dist/ScrollTrigger.css";

// Registra il plugin ScrollTrigger
export function FeaturedProducts() {
  // Riferimento alla sezione e alle card
  const sectionRef = useRef(null);

  // Array di prodotti in evidenza
  const featuredProducts = [
    {
      id: 1,
      name: "iPhone",
      tagline: "Il nostro smartphone più potente di sempre.",
      image: "./images/iphone.png",
      color: "bg-blue-light",
      textColor: "text-dark",
      link: "/store?cat=iPhone",
      tailwindImgDivClasses: "!-bottom-10 !h-[100%] !h-fit",
      tailwindImgClasses: "!max-w-[800px]",
      imgHover: "translate-y-[-8px]",
      showProductFooter: false,
      isFullWidth: true, // Card a larghezza piena
    },
    {
      id: 2,
      name: "MacBook Pro",
      tagline: "Adesso con i superpoteri del chip M3.",
      image: "./images/macbook-pro.png",
      color: "bg-light-gray",
      textColor: "text-dark",
      tailwindImgDivClasses: "!h-[40%] !bottom-16",
      tailwindImgClasses: "",
      imgHover: "translate-y-[-8px] scale-110",
      showProductFooter: true,
      link: "/store?cat=Mac",
    },
    {
      id: 3,
      name: "iPad Pro",
      tagline: "Impossibilmente sottile. Incredibilmente potente.",
      image: "./images/ipad-pro.png",
      color: "bg-dark",
      textColor: "text-light",
      tailwindImgDivClasses: " !h-[50%]",
      tailwindImgClasses: "!w-[80%]",
      imgHover: "translate-y-[-8px] scale-110",
      showProductFooter: true,
      link: "/store?cat=iPad",
    },
    {
      id: 4,
      name: "Apple Watch",
      tagline: "Più schermo. Più stile. Più sottile.",
      image: "./images/apple-watch.png",
      color: "bg-dark",
      textColor: "text-light",
      tailwindImgDivClasses: "!-bottom-[4px] !h-fit",
      tailwindImgClasses: "!max-w-[500px] !min-w-[380px] !w-[80%]",
      imgHover: "translate-y-[-8px] scale-105",
      showProductFooter: true,
      link: "/store?cat=Apple Watch",
    },
    {
      id: 5,
      name: "AirPods",
      tagline: "Audio spaziale. Un'esperienza immersiva.",
      image: "./images/airpods.png",
      color: "bg-white",
      textColor: "text-dark",
      tailwindImgDivClasses: "",
      tailwindImgClasses: "!w-[40%] lg:!w-[60%]",
      imgHover: "translate-y-[-8px] scale-[105%]",
      showProductFooter: true,
      link: "/store?cat=AirPods",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="featured-products"
      aria-labelledby="featured-title"
    >
      <div className="container">
        <h2 id="featured-title" className="section-title">
          Prodotti in evidenza
        </h2>

        <div className="product-grid">
          {featuredProducts.map((product) => (
            <ProductCard product={product} key={product.id} />
          ))}
        </div>
      </div>
    </section>
  );
}
