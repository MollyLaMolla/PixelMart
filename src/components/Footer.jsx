import React from "react";
import { Link } from "react-router-dom";
import {
  ChevronUp,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  GitHub,
} from "react-feather";
import "./Footer.css";

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Anno corrente per il copyright
  const currentYear = new Date().getFullYear();

  return (
    <footer className="ftr-container">
      <div className="ftr-content">
        <button
          className="ftr-back-to-top"
          onClick={scrollToTop}
          aria-label="Torna all'inizio"
        >
          <ChevronUp size={16} />
          <span>Torna all'inizio</span>
        </button>

        <div className="ftr-grid">
          <div className="ftr-column">
            <h3 className="ftr-title">Prodotti</h3>
            <ul className="ftr-links">
              <li>
                <Link to="/store?cat=iPhone" className="ftr-link">
                  iPhone
                </Link>
              </li>
              <li>
                <Link to="/store?cat=iPad" className="ftr-link">
                  iPad
                </Link>
              </li>
              <li>
                <Link to="/store?cat=Mac" className="ftr-link">
                  Mac
                </Link>
              </li>
              <li>
                <Link to="/store?cat=Apple Watch" className="ftr-link">
                  Apple Watch
                </Link>
              </li>
              <li>
                <Link to="/store?cat=AirPods" className="ftr-link">
                  AirPods
                </Link>
              </li>
              <li>
                <Link to="/store?cat=Accessories" className="ftr-link">
                  Accessori
                </Link>
              </li>
            </ul>
          </div>

          <div className="ftr-column">
            <h3 className="ftr-title">Store</h3>
            <ul className="ftr-links">
              <li>
                <Link to="/store" className="ftr-link">
                  Acquista online
                </Link>
              </li>
              <li>
                <Link to="#" className="ftr-link">
                  Trova un negozio
                </Link>
              </li>
              <li>
                <Link to="#" className="ftr-link">
                  Genius Bar
                </Link>
              </li>
              <li>
                <Link to="#" className="ftr-link">
                  Finanziamento
                </Link>
              </li>
              <li>
                <Link to="#" className="ftr-link">
                  Stato dell'ordine
                </Link>
              </li>
              <li>
                <Link to="#" className="ftr-link">
                  Supporto all'acquisto
                </Link>
              </li>
            </ul>
          </div>

          <div className="ftr-column">
            <h3 className="ftr-title">Servizi</h3>
            <ul className="ftr-links">
              <li>
                <Link to="#" className="ftr-link">
                  Apple Music
                </Link>
              </li>
              <li>
                <Link to="#" className="ftr-link">
                  Apple TV+
                </Link>
              </li>
              <li>
                <Link to="#" className="ftr-link">
                  Apple Fitness+
                </Link>
              </li>
              <li>
                <Link to="#" className="ftr-link">
                  Apple Arcade
                </Link>
              </li>
              <li>
                <Link to="#" className="ftr-link">
                  iCloud
                </Link>
              </li>
              <li>
                <Link to="#" className="ftr-link">
                  Apple One
                </Link>
              </li>
            </ul>
          </div>

          <div className="ftr-column">
            <h3 className="ftr-title">Account</h3>
            <ul className="ftr-links">
              <li>
                <Link to="#" className="ftr-link">
                  Gestisci il tuo ID Apple
                </Link>
              </li>
              <li>
                <Link to="#" className="ftr-link">
                  Account Apple Store
                </Link>
              </li>
              <li>
                <Link to="#" className="ftr-link">
                  iCloud.com
                </Link>
              </li>
              <li>
                <Link to="#" className="ftr-link">
                  Privacy e sicurezza
                </Link>
              </li>
            </ul>
          </div>

          <div className="ftr-column">
            <h3 className="ftr-title">Informazioni</h3>
            <ul className="ftr-links">
              <li>
                <Link to="#" className="ftr-link">
                  Newsroom
                </Link>
              </li>
              <li>
                <Link to="#" className="ftr-link">
                  Leadership Apple
                </Link>
              </li>
              <li>
                <Link to="#" className="ftr-link">
                  Opportunità di lavoro
                </Link>
              </li>
              <li>
                <Link to="#" className="ftr-link">
                  Investitori
                </Link>
              </li>
              <li>
                <Link to="#" className="ftr-link">
                  Etica e conformità
                </Link>
              </li>
              <li>
                <Link to="#" className="ftr-link">
                  Eventi
                </Link>
              </li>
              <li>
                <Link to="#" className="ftr-link">
                  Contatta Apple
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="ftr-newsletter-section">
          <div className="ftr-column ftr-newsletter">
            <h3 className="ftr-title">Rimani aggiornato</h3>
            <p className="ftr-newsletter-text">
              Iscriviti alla nostra newsletter per ricevere aggiornamenti su
              nuovi prodotti, offerte esclusive e consigli utili.
            </p>
            <div className="ftr-form">
              <input
                type="email"
                className="ftr-input"
                placeholder="Il tuo indirizzo email"
                aria-label="Email address"
              />
              <button className="ftr-submit" aria-label="Subscribe">
                Iscriviti
              </button>
            </div>
          </div>
        </div>

        <div className="ftr-bottom">
          <div className="ftr-legal">
            <p className="ftr-copyright">
              Copyright © {currentYear} Apple Inc. Tutti i diritti riservati.
            </p>
            <div className="ftr-legal-links">
              <Link to="#" className="ftr-legal-link">
                Privacy Policy
              </Link>
              <Link to="#" className="ftr-legal-link">
                Termini e Condizioni
              </Link>
              <Link to="#" className="ftr-legal-link">
                Vendite e Rimborsi
              </Link>
              <Link to="#" className="ftr-legal-link">
                Note Legali
              </Link>
              <Link to="#" className="ftr-legal-link">
                Mappa del Sito
              </Link>
            </div>
          </div>
          <div className="ftr-social">
            <Link to="#" className="ftr-social-link" aria-label="Facebook">
              <Facebook size={18} />
            </Link>
            <Link to="#" className="ftr-social-link" aria-label="Twitter">
              <Twitter size={18} />
            </Link>
            <Link to="#" className="ftr-social-link" aria-label="Instagram">
              <Instagram size={18} />
            </Link>
            <Link to="#" className="ftr-social-link" aria-label="LinkedIn">
              <Linkedin size={18} />
            </Link>
            <Link to="#" className="ftr-social-link" aria-label="GitHub">
              <GitHub size={18} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
