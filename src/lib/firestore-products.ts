import {
  addDoc,
  collection,
  deleteDoc,
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

export interface FirestoreProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  images: string[];
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

// NOTE: This only deletes the Firestore document. Cloudinary images are NOT
// removed here because deletion requires the Cloudinary API secret, which
// must never be exposed to the browser. Implement image deletion later via a
// secure Firebase Cloud Function that stores the secret in server-side config.
export async function deleteProduct(id: string) {
  return deleteDoc(doc(db, "products", id));
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