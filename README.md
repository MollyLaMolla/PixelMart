# 🛒 PixelMart

A fast, clean, fully client‑side e‑commerce experience.  
Browse products, filter, sort, and manage your cart — all without a backend.

---

## 🧠 Overview

PixelMart is a static online shop designed for speed and simplicity.  
The entire experience runs client‑side, meaning:

- No server rendering  
- No database  
- No login or registration  
- Instant loading on every visit  

All user data (like the cart) is stored locally in the browser, making the site extremely fast and ideal for static hosting platforms such as GitHub Pages.

The shop includes featured products, a full catalog, advanced filters, sorting options, and a persistent cart.

---

## 🔥 Features

- 🏠 Home page with featured products  
- 🛍️ Shop page with full product catalog  
- 🔎 Search bar with live filtering  
- 🎛️ Multi‑filter system:
  - Category  
  - Price range  
  - Year  
  - Color  
- ↕️ Sorting options:
  - Year (asc/desc)  
  - Price (asc/desc)  
  - Name A→Z / Z→A  
- 🛒 Cart with quantity management and total price  
- 💾 Cart persistence via **localStorage**  
- ⚡ Instant navigation thanks to static hosting  
- 📱 Fully responsive layout  
- ✨ Smooth animations and clean UI  

---

## 📊 Client‑Side Logic Highlights

PixelMart handles all data on the client:

- Products are stored as static JSON or JS modules  
- Cart state is saved in `localStorage`  
- Filters and sorting are computed in real time  
- No backend calls, no API latency  

This makes the experience extremely fast and reliable.

---

## 🛠️ Tech Stack

**Core:**
- React  
- Vite  
- HTML, CSS, JavaScript  
- Tailwind CSS  

**UI & Animations:**
- Material UI (`@mui/material`, `@mui/icons-material`)  
- Emotion (`@emotion/react`, `@emotion/styled`)  
- GSAP  
- React Feather Icons  

**Routing:**
- React Router DOM  

**Tooling:**
- ESLint  
- PostCSS  
- Autoprefixer  

---

## 👊 Installation

```bash
# Clone the project
git clone https://github.com/your-username/pixelmart.git
cd pixelmart

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
