import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  type Timestamp,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "./firebase";

export type StockStatus = "in-stock" | "out-of-stock";

export interface ProductImage {
  url: string;
  publicId: string;
  /**
   * Per-image (variant) stock status. Optional for backward compatibility;
   * treat `undefined` as in stock.
   */
  inStock?: boolean;
}

/**
 * Normalize a stored image entry. Legacy documents stored images as plain
 * URL strings; new documents store `{ url, publicId }`. This helper lets
 * consumers read either shape safely.
 */
export function getImageUrl(img: ProductImage | string | undefined): string {
  if (!img) return "";
  return typeof img === "string" ? img : img.url;
}

/**
 * Backward-compatible check for whether an image/variant is in stock.
 * Legacy string entries and entries without `inStock` default to true.
 */
export function isImageInStock(img: ProductImage | string | undefined): boolean {
  if (!img) return false;
  if (typeof img === "string") return true;
  return img.inStock !== false;
}

/**
 * Returns the first in-stock image, or the first image as fallback.
 */
export function firstInStockImage(
  images: (ProductImage | string)[] | undefined,
): ProductImage | string | undefined {
  if (!images || images.length === 0) return undefined;
  return images.find(isImageInStock) ?? images[0];
}

export interface FirestoreProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  // Legacy docs may still contain plain-string entries; use `getImageUrl` when rendering.
  images: (ProductImage | string)[];
  stockStatus: StockStatus;
  showOnHomepage: boolean;
  createdAt?: Timestamp | null;
  updatedAt?: Timestamp | null;
}

export type ProductInput = Omit<FirestoreProduct, "id" | "createdAt" | "updatedAt">;

const productsCol = () => collection(db, "products");

export async function createProduct(input: ProductInput) {
  return addDoc(productsCol(), {
    ...input,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateProduct(id: string, input: Partial<ProductInput>) {
  return updateDoc(doc(db, "products", id), {
    ...input,
    updatedAt: serverTimestamp(),
  });
}

// Secure deletion is handled by a deployed Firebase Cloud Function that
// removes the Cloudinary images (via publicId) and the Firestore document
// atomically. The direct client-side deleteDoc path has been removed to
// avoid orphaning Cloudinary assets.
const DELETE_PRODUCT_FN_URL =
  "https://deleteproduct-qiuyb6g4mq-uc.a.run.app";

export async function deleteProduct(id: string): Promise<void> {
  const res = await fetch(DELETE_PRODUCT_FN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId: id }),
  });
  if (!res.ok) {
    let msg = `Delete failed (${res.status})`;
    try {
      const data = await res.json();
      if (data && typeof data === "object") {
        msg =
          (data as { error?: string; message?: string }).error ??
          (data as { message?: string }).message ??
          msg;
      }
    } catch {
      const text = await res.text().catch(() => "");
      if (text) msg = text;
    }
    throw new Error(msg);
  }
}

export async function getProduct(id: string): Promise<FirestoreProduct | null> {
  const snap = await getDoc(doc(db, "products", id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...(snap.data() as Omit<FirestoreProduct, "id">) };
}

export function useProducts() {
  const [products, setProducts] = useState<FirestoreProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const q = query(productsCol(), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(
      q,
      (snap) => {
        setProducts(
          snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<FirestoreProduct, "id">) })),
        );
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      },
    );
    return unsub;
  }, []);

  return { products, loading, error };
}

export function useProduct(id: string | undefined) {
  const [product, setProduct] = useState<FirestoreProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    const unsub = onSnapshot(
      doc(db, "products", id),
      (snap) => {
        setProduct(
          snap.exists()
            ? { id: snap.id, ...(snap.data() as Omit<FirestoreProduct, "id">) }
            : null,
        );
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      },
    );
    return unsub;
  }, [id]);

  return { product, loading, error };
}