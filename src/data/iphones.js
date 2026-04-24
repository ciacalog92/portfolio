// availability:
//   'available'   → ordinabile normalmente
//   'on-request'  → previa disponibilità (**) — contattare Daniele
// Modelli con * (non ordinabile) sono esclusi dal listino

export const iphones = [
  // SE 2020
  { id: 1,  model: "iPhone SE 2020",    storage: "64GB",  price: 199,  availability: "available" },
  { id: 2,  model: "iPhone SE 2020",    storage: "128GB", price: 229,  availability: "available" },
  // SE 2022
  { id: 3,  model: "iPhone SE 2022",    storage: "128GB", price: 279,  availability: "available" },
  { id: 4,  model: "iPhone SE 2022",    storage: "256GB", price: 329,  availability: "available" },
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
