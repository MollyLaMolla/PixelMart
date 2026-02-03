# 🛒 PixelMart

A fast, clean, fully client‑side e‑commerce experience.  
Browse products, filter, compare, and manage your cart — all without a backend.

---

## 🧠 Overview

PixelMart is a static online shop focused on performance and user experience.  
It’s hosted as a static page (via GitHub Pages) and runs entirely client‑side:

- No server rendering  
- No database  
- No login or registration  
- Instant loading and smooth navigation  

All user data — like cart contents and filter preferences — is stored locally in the browser.  
The site is designed with a clean, modern aesthetic and includes advanced filtering, product comparison, and a responsive cart system.

---

## 🔥 Features

- 🏠 Homepage with featured products and promotional highlights  
- 🛍️ Store page with full catalog and dynamic filters  
- 🔎 Search bar with live suggestions and tag-based quick access  
- 🎛️ Filter system:
  - Category  
  - Year  
  - Color  
  - Price range slider  
  - Sort by: year, price, name (A→Z / Z→A)  
- 📱 Product cards with:
  - Color previews  
  - Price and monthly installment  
  - “Buy” button  
- 📦 Product detail pages with:
  - Storage options  
  - Protection plans  
  - Delivery methods  
  - Technical specifications  
- 🛒 Cart with:
  - Quantity control  
  - Warranty selection  
  - Total price calculation  
  - Checkout summary  
- 💾 Cart persistence via **localStorage**  
- ⚡ Instant navigation and zero loading delays  
- 📱 Fully responsive layout  
- ✨ Smooth transitions and animations  

---

## 📊 Product Options & Logic

Each product supports:

- Multiple colors  
- Storage capacities  
- Protection plans (Standard, AppleCare+, Premium)  
- Delivery methods (Standard, Express, Same-day)  
- Dynamic pricing and monthly payment breakdown  

Cart logic includes:

- Quantity adjustment  
- Real-time price updates  
- Summary box with shipping and total  
- Persistent cart across sessions

---

## 🛠️ Tech Stack

**Frontend:**
- React  
- Vite  
- Tailwind CSS  
- HTML, CSS, JavaScript  

**UI & Animations:**
- Material UI (`@mui/material`, `@mui/icons-material`)  
- Emotion (`@emotion/react`, `@emotion/styled`)  
- GSAP  

---

## 👊 Installation

```bash

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```
## 🌐 Live Demo
[Try it here](https://mollylamolla.github.io/PixelMart.Deploy/)

## 📄 License
This project is licensed under the ISC License.
