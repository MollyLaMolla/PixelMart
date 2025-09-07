// Intro hero section with large typography and subtle gradient background.
import { Link } from "react-router-dom";

export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-bg" aria-hidden="true" />
      <div className="hero-content">
        <h1 id="hero-title" className="hero-title">
          Tutta l'esperienza Apple,
          <br /> in un unico posto.
        </h1>
        <p className="hero-sub">
          Un catalogo pulito, veloce e focalizzato sui dettagli. Esplora i
          prodotti, confronta i modelli e lasciati ispirare dal design.
        </p>
        <div className="hero-ctas">
          <Link to="/store" className="btn primary">
            Inizia a esplorare
          </Link>
          <Link to="/store" className="btn ghost">
            Scopri le offerte
          </Link>
        </div>
        <div className="hero-hint">
          PixelMart – Il tuo ecommerce tecnologico di fiducia
        </div>
      </div>
    </section>
  );
}
