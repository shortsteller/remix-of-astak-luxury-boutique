import { useEffect } from "react";
import {
  useProducts,
  getImageUrl,
  getImagePrice,
  firstInStockImage,
  hasAnyInStock,
} from "@/lib/firestore-products";
import { useStore } from "@/lib/store";

/**
 * Silently reconciles the shopper's cart & wishlist with the live product
 * catalog. Removes items whose product was deleted and refreshes wishlist
 * fields (price, image, stock, variant count) as they change upstream.
 */
export function CartSync() {
  const { products, loading } = useProducts();
  const { syncCatalog } = useStore();

  useEffect(() => {
    if (loading) return;
    const map = new Map(
      products.map((p) => {
        const first = firstInStockImage(p.images);
        return [
          p.id,
          {
            name: p.name,
            category: p.category,
            price: getImagePrice(first, p.price),
            image: getImageUrl(first),
            inStock: hasAnyInStock(p.images),
            variantCount: p.images.length,
          },
        ] as const;
      }),
    );
    syncCatalog(map);
  }, [products, loading, syncCatalog]);

  return null;
}