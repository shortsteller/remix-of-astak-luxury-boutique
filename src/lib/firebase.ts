import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA3IVbtBvm5GF-REPWk9fPl7iuUJ_D6oUw",
  authDomain: "astak-c5dab.firebaseapp.com",
  projectId: "astak-c5dab",
  storageBucket: "astak-c5dab.firebasestorage.app",
  messagingSenderId: "353537671830",
  appId: "1:353537671830:web:4ae790636a486c27a3b8b7",
  measurementId: "G-EPGZK2W08C",
};

export const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);

// Only the admin email is allowed to access the admin panel.
export const ADMIN_EMAIL = "chandramaity16@gmail.com";

if (typeof window !== "undefined") {
  setPersistence(auth, browserLocalPersistence).catch(() => {});
}

// Cloudinary (unsigned client-side upload). Deleting images requires the
// Cloudinary API secret which must NEVER be exposed to the browser. Image
// deletion should be implemented later via a secure Firebase Cloud Function.
export const CLOUDINARY_CLOUD_NAME = "ou3p2mmc";
export const CLOUDINARY_UPLOAD_PRESET = "astak_unsigned";

export const WHATSAPP_NUMBER = "918240338031";