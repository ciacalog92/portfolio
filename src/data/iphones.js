// availability:
//   'available'   → ordinabile normalmente
//   'on-request'  → previa disponibilità (**) — contattare Daniele
//   * (non ordinabile a fornitore) → inclusi come on-request

export const iphones = [
  // SE 2020
  { id: 1,  model: "iPhone SE 2020",    storage: "64GB",  price: 199,  availability: "available" },
  { id: 2,  model: "iPhone SE 2020",    storage: "128GB", price: 229,  availability: "available" },
  // SE 2022
  { id: 3,  model: "iPhone SE 2022",    storage: "128GB", price: 279,  availability: "available" },
  { id: 4,  model: "iPhone SE 2022",    storage: "256GB", price: 329,  availability: "available" },
  // 11 — non ordinabile a fornitore (*)
  { id: 52, model: "iPhone 11",         storage: "64GB",  price: 229,  availability: "on-request" },
  { id: 53, model: "iPhone 11",         storage: "128GB", price: 279,  availability: "on-request" },
  // 11 Pro — non ordinabile a fornitore (*)
  { id: 54, model: "iPhone 11 Pro",     storage: "64GB",  price: 249,  availability: "on-request" },
  { id: 55, model: "iPhone 11 Pro",     storage: "256GB", price: 299,  availability: "on-request" },
  // 11 Pro Max — non ordinabile a fornitore (*)
  { id: 56, model: "iPhone 11 Pro Max", storage: "64GB",  price: 299,  availability: "on-request" },
  { id: 57, model: "iPhone 11 Pro Max", storage: "256GB", price: 349,  availability: "on-request" },
  // 12 Mini
  { id: 5,  model: "iPhone 12 Mini",    storage: "128GB", price: 299,  availability: "available" },
  { id: 6,  model: "iPhone 12 Mini",    storage: "256GB", price: 349,  availability: "available" },
  // 12
  { id: 7,  model: "iPhone 12",         storage: "64GB",  price: 279,  availability: "available" },
  { id: 8,  model: "iPhone 12",         storage: "128GB", price: 329,  availability: "available" },
  { id: 9,  model: "iPhone 12",         storage: "256GB", price: 379,  availability: "available" },
  // 12 Pro
  { id: 10, model: "iPhone 12 Pro",     storage: "128GB", price: 399,  availability: "available" },
  { id: 11, model: "iPhone 12 Pro",     storage: "256GB", price: 449,  availability: "available" },
  // 12 Pro Max
  { id: 12, model: "iPhone 12 Pro Max", storage: "128GB", price: 499,  availability: "available" },
  { id: 13, model: "iPhone 12 Pro Max", storage: "256GB", price: 549,  availability: "available" },
  // 13 Mini — previa disponibilità
  { id: 14, model: "iPhone 13 Mini",    storage: "128GB", price: 359,  availability: "on-request" },
  { id: 15, model: "iPhone 13 Mini",    storage: "256GB", price: 399,  availability: "on-request" },
  // 13
  { id: 16, model: "iPhone 13",         storage: "128GB", price: 379,  availability: "available" },
  { id: 17, model: "iPhone 13",         storage: "256GB", price: 429,  availability: "available" },
  // 13 Pro
  { id: 18, model: "iPhone 13 Pro",     storage: "128GB", price: 499,  availability: "available" },
  { id: 19, model: "iPhone 13 Pro",     storage: "256GB", price: 549,  availability: "available" },
  // 13 Pro Max
  { id: 20, model: "iPhone 13 Pro Max", storage: "128GB", price: 549,  availability: "available" },
  { id: 21, model: "iPhone 13 Pro Max", storage: "256GB", price: 599,  availability: "available" },
  // 14
  { id: 22, model: "iPhone 14",         storage: "128GB", price: 449,  availability: "available" },
  { id: 23, model: "iPhone 14",         storage: "256GB", price: 499,  availability: "available" },
  // 14 Plus — previa disponibilità
  { id: 24, model: "iPhone 14 Plus",    storage: "128GB", price: 499,  availability: "on-request" },
  { id: 25, model: "iPhone 14 Plus",    storage: "256GB", price: 549,  availability: "on-request" },
  // 14 Pro
  { id: 26, model: "iPhone 14 Pro",     storage: "128GB", price: 599,  availability: "available" },
  { id: 27, model: "iPhone 14 Pro",     storage: "256GB", price: 659,  availability: "available" },
  // 14 Pro Max
  { id: 28, model: "iPhone 14 Pro Max", storage: "128GB", price: 699,  availability: "available" },
  { id: 29, model: "iPhone 14 Pro Max", storage: "256GB", price: 759,  availability: "available" },
  // 15
  { id: 30, model: "iPhone 15",         storage: "128GB", price: 549,  availability: "available" },
  { id: 31, model: "iPhone 15",         storage: "256GB", price: 619,  availability: "available" },
  // 15 Plus — previa disponibilità
  { id: 32, model: "iPhone 15 Plus",    storage: "128GB", price: 649,  availability: "on-request" },
  { id: 33, model: "iPhone 15 Plus",    storage: "256GB", price: 699,  availability: "on-request" },
  // 15 Pro
  { id: 34, model: "iPhone 15 Pro",     storage: "128GB", price: 729,  availability: "available" },
  { id: 35, model: "iPhone 15 Pro",     storage: "256GB", price: 779,  availability: "available" },
  // 15 Pro Max
  { id: 36, model: "iPhone 15 Pro Max", storage: "256GB", price: 829,  availability: "available" },
  { id: 37, model: "iPhone 15 Pro Max", storage: "512GB", price: 899,  availability: "available" },
  // 16 — previa disponibilità
  { id: 38, model: "iPhone 16",         storage: "128GB", price: 699,  availability: "on-request" },
  { id: 39, model: "iPhone 16",         storage: "256GB", price: 749,  availability: "on-request" },
  // 16 Pro
  { id: 40, model: "iPhone 16 Pro",     storage: "128GB", price: 879,  availability: "available" },
  { id: 41, model: "iPhone 16 Pro",     storage: "256GB", price: 949,  availability: "available" },
  // 16 Pro Max
  { id: 42, model: "iPhone 16 Pro Max", storage: "256GB", price: 1049, availability: "available" },
  { id: 43, model: "iPhone 16 Pro Max", storage: "512GB", price: 1129, availability: "available" },
  // 17 — previa disponibilità · prezzo NUOVO
  { id: 44, model: "iPhone 17",         storage: "256GB", price: 979,  availability: "on-request", isNew: true },
  { id: 45, model: "iPhone 17",         storage: "512GB", price: 1229, availability: "on-request", isNew: true },
  // 17 Pro — previa disponibilità · prezzo NUOVO
  { id: 46, model: "iPhone 17 Pro",     storage: "256GB", price: 1339, availability: "on-request", isNew: true },
  { id: 47, model: "iPhone 17 Pro",     storage: "512GB", price: 1589, availability: "on-request", isNew: true },
  { id: 48, model: "iPhone 17 Pro",     storage: "1TB",   price: 1839, availability: "on-request", isNew: true },
  // 17 Pro Max — previa disponibilità · prezzo NUOVO
  { id: 49, model: "iPhone 17 Pro Max", storage: "256GB", price: 1489, availability: "on-request", isNew: true },
  { id: 50, model: "iPhone 17 Pro Max", storage: "512GB", price: 1739, availability: "on-request", isNew: true },
  { id: 51, model: "iPhone 17 Pro Max", storage: "1TB",   price: 1989, availability: "on-request", isNew: true },
];

export const sedi = [
  "Siena", "Pisa", "Torino", "Brescia", "Appia", "Pescara",
  "Roma Tuscolana", "Roma Talenti", "Nardò", "Maglie",
  "Gallipoli", "Lecce", "Taranto",
];

// Colori ufficiali Apple per ogni modello (preferred = colore consigliato)
export const modelColors = {
  "iPhone 11": [
    { name: "Nero",   hex: "#1c1c1e" },
    { name: "Bianco", hex: "#f2f0ea", preferred: true },
    { name: "Rosso",  hex: "#b71c1c" },
    { name: "Viola",  hex: "#7b5ea7" },
    { name: "Verde",  hex: "#3d6b4f" },
    { name: "Giallo", hex: "#f5c542" },
  ],
  "iPhone 11 Pro": [
    { name: "Space Gray",     hex: "#5a5a5a" },
    { name: "Silver",         hex: "#e0e0db", preferred: true },
    { name: "Gold",           hex: "#c5a96f" },
    { name: "Midnight Green", hex: "#3a4f41" },
  ],
  "iPhone 11 Pro Max": [
    { name: "Space Gray",     hex: "#5a5a5a" },
    { name: "Silver",         hex: "#e0e0db", preferred: true },
    { name: "Gold",           hex: "#c5a96f" },
    { name: "Midnight Green", hex: "#3a4f41" },
  ],
  "iPhone SE 2020": [
    { name: "Nero",   hex: "#1c1c1e" },
    { name: "Bianco", hex: "#f0ede6", preferred: true },
    { name: "Rosso",  hex: "#b71c1c" },
  ],
  "iPhone SE 2022": [
    { name: "Midnight",  hex: "#2c2c2e" },
    { name: "Starlight", hex: "#f5f0e8", preferred: true },
    { name: "Rosso",     hex: "#b71c1c" },
  ],
  "iPhone 12 Mini": [
    { name: "Nero",    hex: "#1c1c1e" },
    { name: "Bianco",  hex: "#f2f2f0" },
    { name: "Rosso",   hex: "#b71c1c" },
    { name: "Verde",   hex: "#3d6b4f", preferred: true },
    { name: "Azzurro", hex: "#2e5d8a" },
    { name: "Viola",   hex: "#8e5fad" },
  ],
  "iPhone 12": [
    { name: "Nero",    hex: "#1c1c1e" },
    { name: "Bianco",  hex: "#f2f2f0" },
    { name: "Rosso",   hex: "#b71c1c" },
    { name: "Verde",   hex: "#3d6b4f", preferred: true },
    { name: "Azzurro", hex: "#2e5d8a" },
    { name: "Viola",   hex: "#8e5fad" },
  ],
  "iPhone 12 Pro": [
    { name: "Grafite",      hex: "#5a5a5a" },
    { name: "Oro",          hex: "#c5a96f", preferred: true },
    { name: "Argento",      hex: "#e0e0db" },
    { name: "Pacific Blue", hex: "#2b5f75" },
  ],
  "iPhone 12 Pro Max": [
    { name: "Grafite",      hex: "#5a5a5a" },
    { name: "Oro",          hex: "#c5a96f", preferred: true },
    { name: "Argento",      hex: "#e0e0db" },
    { name: "Pacific Blue", hex: "#2b5f75" },
  ],
  "iPhone 13 Mini": [
    { name: "Mezzanotte", hex: "#2c2c2e" },
    { name: "Galassia",   hex: "#f5f0e8" },
    { name: "Rosso",      hex: "#b71c1c" },
    { name: "Verde",      hex: "#4a7c59", preferred: true },
    { name: "Azzurro",    hex: "#5e8dbd" },
    { name: "Rosa",       hex: "#f4a7b9" },
  ],
  "iPhone 13": [
    { name: "Mezzanotte", hex: "#2c2c2e" },
    { name: "Galassia",   hex: "#f5f0e8" },
    { name: "Rosso",      hex: "#b71c1c" },
    { name: "Verde",      hex: "#4a7c59", preferred: true },
    { name: "Azzurro",    hex: "#5e8dbd" },
    { name: "Rosa",       hex: "#f4a7b9" },
  ],
  "iPhone 13 Pro": [
    { name: "Grafite",      hex: "#5a5a5a" },
    { name: "Oro",          hex: "#c5a96f" },
    { name: "Argento",      hex: "#e0e0db" },
    { name: "Sierra Blue",  hex: "#5b8fa8", preferred: true },
    { name: "Verde Alpino", hex: "#4a6741" },
  ],
  "iPhone 13 Pro Max": [
    { name: "Grafite",      hex: "#5a5a5a" },
    { name: "Oro",          hex: "#c5a96f" },
    { name: "Argento",      hex: "#e0e0db" },
    { name: "Sierra Blue",  hex: "#5b8fa8", preferred: true },
    { name: "Verde Alpino", hex: "#4a6741" },
  ],
  "iPhone 14": [
    { name: "Mezzanotte", hex: "#2c2c2e" },
    { name: "Galassia",   hex: "#f5f0e8" },
    { name: "Rosso",      hex: "#b71c1c" },
    { name: "Blu",        hex: "#3b76c3", preferred: true },
    { name: "Viola",      hex: "#7b5ea7" },
    { name: "Giallo",     hex: "#f5c542" },
  ],
  "iPhone 14 Plus": [
    { name: "Mezzanotte", hex: "#2c2c2e" },
    { name: "Galassia",   hex: "#f5f0e8" },
    { name: "Rosso",      hex: "#b71c1c" },
    { name: "Blu",        hex: "#3b76c3", preferred: true },
    { name: "Viola",      hex: "#7b5ea7" },
    { name: "Giallo",     hex: "#f5c542" },
  ],
  "iPhone 14 Pro": [
    { name: "Space Black", hex: "#1c1c1e" },
    { name: "Oro",         hex: "#c5a96f" },
    { name: "Argento",     hex: "#e0e0db" },
    { name: "Deep Purple", hex: "#4e2d6d", preferred: true },
  ],
  "iPhone 14 Pro Max": [
    { name: "Space Black", hex: "#1c1c1e" },
    { name: "Oro",         hex: "#c5a96f" },
    { name: "Argento",     hex: "#e0e0db" },
    { name: "Deep Purple", hex: "#4e2d6d", preferred: true },
  ],
  "iPhone 15": [
    { name: "Nero",    hex: "#2c2c2e" },
    { name: "Rosa",    hex: "#f5b8c4", preferred: true },
    { name: "Giallo",  hex: "#f2d64a" },
    { name: "Verde",   hex: "#c0d6b4" },
    { name: "Blu",     hex: "#8ab0c5" },
  ],
  "iPhone 15 Plus": [
    { name: "Nero",    hex: "#2c2c2e" },
    { name: "Rosa",    hex: "#f5b8c4", preferred: true },
    { name: "Giallo",  hex: "#f2d64a" },
    { name: "Verde",   hex: "#c0d6b4" },
    { name: "Blu",     hex: "#8ab0c5" },
  ],
  "iPhone 15 Pro": [
    { name: "Titanio Nero",     hex: "#3a3530", preferred: true },
    { name: "Titanio Bianco",   hex: "#f5f1eb" },
    { name: "Titanio Naturale", hex: "#c8b8a2" },
    { name: "Titanio Blu",      hex: "#6f8fa5" },
  ],
  "iPhone 15 Pro Max": [
    { name: "Titanio Nero",     hex: "#3a3530", preferred: true },
    { name: "Titanio Bianco",   hex: "#f5f1eb" },
    { name: "Titanio Naturale", hex: "#c8b8a2" },
    { name: "Titanio Blu",      hex: "#6f8fa5" },
  ],
  "iPhone 16": [
    { name: "Nero",        hex: "#1c1c1e" },
    { name: "Bianco",      hex: "#f5f0e8" },
    { name: "Rosa",        hex: "#f4b8c8", preferred: true },
    { name: "Teal",        hex: "#4a8c8c" },
    { name: "Ultramarine", hex: "#3d4b8c" },
  ],
  "iPhone 16 Pro": [
    { name: "Titanio Deserto",  hex: "#c5a882", preferred: true },
    { name: "Titanio Bianco",   hex: "#f5f1eb" },
    { name: "Titanio Nero",     hex: "#3a3530" },
    { name: "Titanio Naturale", hex: "#c8b8a2" },
  ],
  "iPhone 16 Pro Max": [
    { name: "Titanio Deserto",  hex: "#c5a882", preferred: true },
    { name: "Titanio Bianco",   hex: "#f5f1eb" },
    { name: "Titanio Nero",     hex: "#3a3530" },
    { name: "Titanio Naturale", hex: "#c8b8a2" },
  ],
  "iPhone 17": [
    { name: "Celeste",     hex: "#a8c4d6", preferred: true },
    { name: "Bianco",      hex: "#f5f0e8" },
    { name: "Nero",        hex: "#1c1c1e" },
    { name: "Verde Menta", hex: "#a8c4b0" },
  ],
  "iPhone 17 Pro": [
    { name: "Blu Profondo",     hex: "#1a3a5c", preferred: true },
    { name: "Arancione Cosmico", hex: "#c8622a" },
    { name: "Silver",           hex: "#e8e8e8" },
  ],
  "iPhone 17 Pro Max": [
    { name: "Blu Profondo",     hex: "#1a3a5c", preferred: true },
    { name: "Arancione Cosmico", hex: "#c8622a" },
    { name: "Silver",           hex: "#e8e8e8" },
  ],
};

// Caratteristiche tecniche complete per ogni modello
export const modelSpecs = {
  "iPhone 11":         { display: '6.1" Liquid Retina HD',               chip: 'A13 Bionic',  rearCam: '12 MP Dual',    frontCam: '12 MP TrueDepth', battery: '~17 h video', connector: 'Lightning', biometric: 'Face ID',  fiveG: false, promotion: false, dynamicIsland: false, intelligence: false, weight: '194 g', year: 2019 },
  "iPhone 11 Pro":     { display: '5.8" Super Retina XDR',               chip: 'A13 Bionic',  rearCam: '12 MP Pro · 2× tele', frontCam: '12 MP TrueDepth', battery: '~18 h video', connector: 'Lightning', biometric: 'Face ID',  fiveG: false, promotion: false, dynamicIsland: false, intelligence: false, weight: '188 g', year: 2019 },
  "iPhone 11 Pro Max": { display: '6.5" Super Retina XDR',               chip: 'A13 Bionic',  rearCam: '12 MP Pro · 2× tele', frontCam: '12 MP TrueDepth', battery: '~20 h video', connector: 'Lightning', biometric: 'Face ID',  fiveG: false, promotion: false, dynamicIsland: false, intelligence: false, weight: '226 g', year: 2019 },
  "iPhone SE 2020":    { display: '4.7" Retina HD',                chip: 'A13 Bionic',  rearCam: '12 MP',         frontCam: '7 MP',          battery: '~13 h video',   connector: 'Lightning', biometric: 'Touch ID', fiveG: false, promotion: false, dynamicIsland: false, intelligence: false, weight: '148 g', year: 2020 },
  "iPhone SE 2022":    { display: '4.7" Retina HD',                chip: 'A15 Bionic',  rearCam: '12 MP',         frontCam: '7 MP',          battery: '~15 h video',   connector: 'Lightning', biometric: 'Touch ID', fiveG: true,  promotion: false, dynamicIsland: false, intelligence: false, weight: '144 g', year: 2022 },
  "iPhone 12 Mini":    { display: '5.4" Super Retina XDR',         chip: 'A14 Bionic',  rearCam: '12 MP Dual',    frontCam: '12 MP TrueDepth', battery: '~15 h video', connector: 'Lightning', biometric: 'Face ID',  fiveG: true,  promotion: false, dynamicIsland: false, intelligence: false, weight: '133 g', year: 2020 },
  "iPhone 12":         { display: '6.1" Super Retina XDR',         chip: 'A14 Bionic',  rearCam: '12 MP Dual',    frontCam: '12 MP TrueDepth', battery: '~17 h video', connector: 'Lightning', biometric: 'Face ID',  fiveG: true,  promotion: false, dynamicIsland: false, intelligence: false, weight: '164 g', year: 2020 },
  "iPhone 12 Pro":     { display: '6.1" Super Retina XDR',         chip: 'A14 Bionic',  rearCam: '12 MP Pro',     frontCam: '12 MP TrueDepth', battery: '~17 h video', connector: 'Lightning', biometric: 'Face ID',  fiveG: true,  promotion: false, dynamicIsland: false, intelligence: false, weight: '189 g', year: 2020 },
  "iPhone 12 Pro Max": { display: '6.7" Super Retina XDR',         chip: 'A14 Bionic',  rearCam: '12 MP Pro',     frontCam: '12 MP TrueDepth', battery: '~20 h video', connector: 'Lightning', biometric: 'Face ID',  fiveG: true,  promotion: false, dynamicIsland: false, intelligence: false, weight: '226 g', year: 2020 },
  "iPhone 13 Mini":    { display: '5.4" Super Retina XDR',         chip: 'A15 Bionic',  rearCam: '12 MP Dual',    frontCam: '12 MP TrueDepth', battery: '~17 h video', connector: 'Lightning', biometric: 'Face ID',  fiveG: true,  promotion: false, dynamicIsland: false, intelligence: false, weight: '141 g', year: 2021 },
  "iPhone 13":         { display: '6.1" Super Retina XDR',         chip: 'A15 Bionic',  rearCam: '12 MP Dual',    frontCam: '12 MP TrueDepth', battery: '~19 h video', connector: 'Lightning', biometric: 'Face ID',  fiveG: true,  promotion: false, dynamicIsland: false, intelligence: false, weight: '174 g', year: 2021 },
  "iPhone 13 Pro":     { display: '6.1" Super Retina XDR ProMotion 120Hz', chip: 'A15 Bionic', rearCam: '12 MP Pro · LiDAR', frontCam: '12 MP TrueDepth', battery: '~22 h video', connector: 'Lightning', biometric: 'Face ID', fiveG: true, promotion: true, dynamicIsland: false, intelligence: false, weight: '204 g', year: 2021 },
  "iPhone 13 Pro Max": { display: '6.7" Super Retina XDR ProMotion 120Hz', chip: 'A15 Bionic', rearCam: '12 MP Pro · LiDAR', frontCam: '12 MP TrueDepth', battery: '~28 h video', connector: 'Lightning', biometric: 'Face ID', fiveG: true, promotion: true, dynamicIsland: false, intelligence: false, weight: '240 g', year: 2021 },
  "iPhone 14":         { display: '6.1" Super Retina XDR',         chip: 'A15 Bionic',  rearCam: '12 MP Dual',    frontCam: '12 MP TrueDepth', battery: '~20 h video', connector: 'Lightning', biometric: 'Face ID',  fiveG: true,  promotion: false, dynamicIsland: false, intelligence: false, weight: '172 g', year: 2022 },
  "iPhone 14 Plus":    { display: '6.7" Super Retina XDR',         chip: 'A15 Bionic',  rearCam: '12 MP Dual',    frontCam: '12 MP TrueDepth', battery: '~26 h video', connector: 'Lightning', biometric: 'Face ID',  fiveG: true,  promotion: false, dynamicIsland: false, intelligence: false, weight: '203 g', year: 2022 },
  "iPhone 14 Pro":     { display: '6.1" Super Retina XDR ProMotion · Dynamic Island', chip: 'A16 Bionic', rearCam: '48 MP Pro · LiDAR', frontCam: '12 MP TrueDepth', battery: '~23 h video', connector: 'Lightning', biometric: 'Face ID', fiveG: true, promotion: true, dynamicIsland: true, intelligence: false, weight: '206 g', year: 2022 },
  "iPhone 14 Pro Max": { display: '6.7" Super Retina XDR ProMotion · Dynamic Island', chip: 'A16 Bionic', rearCam: '48 MP Pro · LiDAR', frontCam: '12 MP TrueDepth', battery: '~29 h video', connector: 'Lightning', biometric: 'Face ID', fiveG: true, promotion: true, dynamicIsland: true, intelligence: false, weight: '240 g', year: 2022 },
  "iPhone 15":         { display: '6.1" Super Retina XDR · Dynamic Island', chip: 'A16 Bionic', rearCam: '48 MP Dual', frontCam: '12 MP TrueDepth', battery: '~20 h video', connector: 'USB-C', biometric: 'Face ID', fiveG: true, promotion: false, dynamicIsland: true, intelligence: false, weight: '171 g', year: 2023 },
  "iPhone 15 Plus":    { display: '6.7" Super Retina XDR · Dynamic Island', chip: 'A16 Bionic', rearCam: '48 MP Dual', frontCam: '12 MP TrueDepth', battery: '~26 h video', connector: 'USB-C', biometric: 'Face ID', fiveG: true, promotion: false, dynamicIsland: true, intelligence: false, weight: '201 g', year: 2023 },
  "iPhone 15 Pro":     { display: '6.1" Super Retina XDR ProMotion · Always-On',     chip: 'A17 Pro · 3nm', rearCam: '48 MP Pro · LiDAR · 3× tele', frontCam: '12 MP TrueDepth', battery: '~23 h video', connector: 'USB-C 3', biometric: 'Face ID', fiveG: true, promotion: true, dynamicIsland: true, intelligence: true, weight: '187 g', year: 2023 },
  "iPhone 15 Pro Max": { display: '6.7" Super Retina XDR ProMotion · Always-On',     chip: 'A17 Pro · 3nm', rearCam: '48 MP Pro · LiDAR · 5× tele', frontCam: '12 MP TrueDepth', battery: '~29 h video', connector: 'USB-C 3', biometric: 'Face ID', fiveG: true, promotion: true, dynamicIsland: true, intelligence: true, weight: '221 g', year: 2023 },
  "iPhone 16":         { display: '6.1" Super Retina XDR · Dynamic Island',          chip: 'A18',           rearCam: '48 MP Fusion · 2× tele', frontCam: '12 MP TrueDepth', battery: '~22 h video', connector: 'USB-C', biometric: 'Face ID', fiveG: true, promotion: false, dynamicIsland: true, intelligence: true, weight: '170 g', year: 2024 },
  "iPhone 16 Pro":     { display: '6.3" Super Retina XDR ProMotion · Always-On',     chip: 'A18 Pro',       rearCam: '48 MP Pro · LiDAR · 5× tele', frontCam: '12 MP TrueDepth', battery: '~27 h video', connector: 'USB-C 3', biometric: 'Face ID', fiveG: true, promotion: true, dynamicIsland: true, intelligence: true, weight: '199 g', year: 2024 },
  "iPhone 16 Pro Max": { display: '6.9" Super Retina XDR ProMotion · Always-On',     chip: 'A18 Pro',       rearCam: '48 MP Pro · LiDAR · 5× tele', frontCam: '12 MP TrueDepth', battery: '~33 h video', connector: 'USB-C 3', biometric: 'Face ID', fiveG: true, promotion: true, dynamicIsland: true, intelligence: true, weight: '227 g', year: 2024 },
  "iPhone 17":         { display: '6.1" Super Retina XDR · Dynamic Island',          chip: 'A19',           rearCam: '48 MP Fusion · 2× tele', frontCam: '18 MP TrueDepth',  battery: '~24 h video', connector: 'USB-C', biometric: 'Face ID', fiveG: true, promotion: false, dynamicIsland: true, intelligence: true, weight: '170 g', year: 2025 },
  "iPhone 17 Pro":     { display: '6.3" Super Retina XDR ProMotion · Always-On',     chip: 'A19 Pro',       rearCam: '48 MP Pro · LiDAR · 5× tele', frontCam: '18 MP TrueDepth', battery: '~28 h video', connector: 'USB-C 3', biometric: 'Face ID', fiveG: true, promotion: true, dynamicIsland: true, intelligence: true, weight: '199 g', year: 2025 },
  "iPhone 17 Pro Max": { display: '6.9" Super Retina XDR ProMotion · Always-On',     chip: 'A19 Pro',       rearCam: '48 MP Pro · LiDAR · 5× tele', frontCam: '18 MP TrueDepth', battery: '~34 h video', connector: 'USB-C 3', biometric: 'Face ID', fiveG: true, promotion: true, dynamicIsland: true, intelligence: true, weight: '228 g', year: 2025 },
};

// Path slug for product images placed in /public/images/iphones/
// e.g. "iPhone 15 Pro" → "iphone-15-pro" → /images/iphones/iphone-15-pro.jpg
export function modelSlug(model) {
  return model.toLowerCase().replace(/\s+/g, '-');
}

// PUBLIC_URL keeps the path correct on GitHub Pages (./).
// The img tag will silently fall back to the SVG render if the file is missing.
export function modelImageUrl(model) {
  const base = process.env.PUBLIC_URL || '.';
  return `${base}/images/iphones/${modelSlug(model)}.jpg`;
}
