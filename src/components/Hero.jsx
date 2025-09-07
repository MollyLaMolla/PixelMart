// Intro hero section with large typography and subtle gradient background.
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
          <a href="/store" className="btn primary">
            Inizia a esplorare
          </a>
          <a href="/store" className="btn ghost">
            Scopri le offerte
          </a>
        </div>
        <div className="hero-hint">
          PixelMart – Il tuo ecommerce tecnologico di fiducia
        </div>
      </div>
    </section>
  );
}
