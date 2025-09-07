# Guida all'utilizzo di Tailwind CSS nel progetto

Questo progetto combina CSS personalizzato con l'utility-first framework Tailwind CSS. Questa guida ti aiuterà a capire come utilizzare entrambi gli approcci in modo efficace.

## Configurazione

Tailwind CSS è già configurato nel progetto. I file principali sono:

- `tailwind.config.js` - configurazione di Tailwind
- `postcss.config.js` - configurazione di PostCSS per processare Tailwind

## Approcci di stile disponibili

### 1. CSS Personalizzato (File componenti .css)

I componenti principali del progetto utilizzano file CSS dedicati:

- `NavBar.css`
- `Hero.css`
- `FeaturedProducts.css`

Questi stili seguono una struttura tradizionale e offrono design complessi e animazioni.

### 2. Tailwind CSS (Classi utility)

Per elementi più semplici o per prototipazione rapida, puoi usare le classi utility di Tailwind direttamente negli elementi JSX:

```jsx
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
  <h2 className="text-xl font-semibold text-gray-800">Esempio con Tailwind</h2>
  <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
    Azione
  </button>
</div>
```

### 3. Approccio ibrido

Puoi anche combinare entrambi gli approcci:

```jsx
<div className="product-card hover:shadow-xl transition-all">
  {/* La classe product-card proviene dal tuo CSS, mentre hover:shadow-xl è di Tailwind */}
  <h3 className="product-title md:text-xl lg:text-2xl">
    {/* Responsive text size con Tailwind + stile di base dal tuo CSS */}
    Titolo prodotto
  </h3>
</div>
```

## Colori personalizzati

Nel file `tailwind.config.js` sono stati aggiunti i colori principali del tema Apple:

```js
colors: {
  'apple-blue': '#0071e3',
  'apple-blue-hover': '#027efc',
  'apple-dark': '#1d1d1f',
  'apple-light': '#f5f5f7',
}
```

Puoi usarli così: `bg-apple-blue`, `text-apple-dark`, ecc.

## Componente di esempio

Il file `TailwindExample.jsx` mostra esempi pratici di come combinare CSS personalizzato con Tailwind. È un ottimo punto di partenza per esplorare entrambi gli approcci.

## Quando usare cosa

- **CSS personalizzato**: per stili complessi, animazioni e quando hai bisogno di un controllo preciso
- **Tailwind CSS**: per layout rapidi, spaziature, colori e responsive design senza scrivere CSS
- **Approccio ibrido**: per sfruttare il meglio di entrambi i mondi

## Risorse utili

- [Documentazione Tailwind CSS](https://tailwindcss.com/docs)
- [CheatSheet di Tailwind CSS](https://tailwindcomponents.com/cheatsheet/)
- [Estensione VS Code per Tailwind CSS](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)
