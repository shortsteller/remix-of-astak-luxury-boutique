import type { Product } from "./store";
import saree1 from "@/assets/products/saree-1.jpg";
import saree2 from "@/assets/products/saree-2.jpg";
import kurta1 from "@/assets/products/kurta-1.jpg";
import kurta2 from "@/assets/products/kurta-2.jpg";
import dm1 from "@/assets/products/dress-material-1.jpg";
import dm2 from "@/assets/products/dress-material-2.jpg";
import dress1 from "@/assets/products/dress-1.jpg";
import dress2 from "@/assets/products/dress-2.jpg";
import bed1 from "@/assets/products/bedsheet-1.jpg";
import bed2 from "@/assets/products/bedsheet-2.jpg";

export interface CatalogProduct extends Product {
  featured?: boolean;
}

export const PRODUCTS: CatalogProduct[] = [
  { id: "sar-01", name: "Bordeaux Kanchipuram Silk Saree", price: 12800, image: saree1, category: "sarees", featured: true },
  { id: "sar-02", name: "Ivory Banarasi Zari Saree", price: 15400, image: saree2, category: "sarees", featured: true },
  { id: "kur-01", name: "Blush Chikankari Kurta Set", price: 4200, image: kurta1, category: "kurta-sets", featured: true },
  { id: "kur-02", name: "Sage Linen Kurta with Dupatta", price: 3800, image: kurta2, category: "kurta-sets", featured: true },
  { id: "dm-01", name: "Teal Chanderi Unstitched Set", price: 2900, image: dm1, category: "dress-materials", featured: true },
  { id: "dm-02", name: "Dusty Rose Silk Suit Piece", price: 3400, image: dm2, category: "dress-materials", featured: true },
  { id: "dr-01", name: "Wine Anarkali with Zardozi", price: 9800, image: dress1, category: "dresses", featured: true },
  { id: "dr-02", name: "Ivory Indo-Western Cape Dress", price: 7600, image: dress2, category: "dresses", featured: true },
  { id: "bed-01", name: "Ivory Block-Print Cotton Bed Set", price: 2400, image: bed1, category: "bed-sheets", featured: true },
  { id: "bed-02", name: "Jaipur Floral Bed Sheet Set", price: 2800, image: bed2, category: "bed-sheets", featured: true },
];

export const WHATSAPP_NUMBER = "918240338031";

export function productsByCategory(slug: string) {
  return PRODUCTS.filter((p) => p.category === slug);
}
export function featuredByCategory(slug: string) {
  return PRODUCTS.filter((p) => p.category === slug && p.featured);
}
