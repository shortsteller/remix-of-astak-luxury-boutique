import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Heart, MessageCircle, Share2, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useProduct, getImageUrl } from "@/lib/firestore-products";
import { WHATSAPP_NUMBER } from "@/lib/firebase";
import { CATEGORIES, useStore } from "@/lib/store";

export const Route = createFileRoute("/product/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `Product — Astak` },
      { name: "description", content: `Product details for ${params.id} on Astak.` },
    ],
  }),
  component: ProductDetails,
});

function ProductDetails() {
  const { id } = Route.useParams();
  const { product, loading } = useProduct(id);
  const { addToCart, toggleWishlist, isWishlisted } = useStore();
  const [activeIdx, setActiveIdx] = useState(0);

  if (loading) {
    return (
      <div className="container-luxe py-24 text-center">
        <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">Loading…</p>
      </div>
    );
  }
  if (!product) {
    return (
      <div className="container-luxe py-24 text-center">
        <h1 className="font-heading text-3xl">Product not found</h1>
        <div className="mt-6">
          <Link to="/catalog" className="btn-luxe">Back to Catalog</Link>
        </div>
      </div>
    );
  }

  const catLabel = CATEGORIES.find((c) => c.slug === product.category)?.label ?? product.category;
  const wished = isWishlisted(product.id);
  const active = getImageUrl(product.images[activeIdx] ?? product.images[0]);
  const firstImage = getImageUrl(product.images[0]);

  const cartProduct = {
    id: product.id,
    name: product.name,
    price: product.price,
    image: firstImage,
    category: product.category,
  };

  const orderOnWhatsApp = () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const text = `Hello Astak, I'd like to order:\n\n• ${product.name}\n  Price: ₹${product.price.toLocaleString("en-IN")}\n  ${url}\n\nPlease share availability and next steps.`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, "_blank");
  };

  const share = async () => {
    const shareData = {
      title: `${product.name} — Astak`,
      text: `${product.name} · ₹${product.price.toLocaleString("en-IN")} — from Astak`,
      url: typeof window !== "undefined" ? window.location.href : "",
    };
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
        toast.success("Link copied to clipboard");
      }
    } catch { /* dismissed */ }
  };

  return (
    <div className="container-luxe py-10 sm:py-16 animate-fade-in">
      <Link to="/catalog" className="inline-flex items-center gap-1.5 text-[0.65rem] uppercase tracking-[0.28em] text-muted-foreground hover:text-primary">
        <ArrowLeft className="h-3 w-3" /> Back to Catalog
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        {/* Gallery */}
        <div>
          <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-muted">
            <img src={active} alt={product.name} className="w-full h-full object-cover" />
          </div>
          {product.images.length > 1 && (
            <div className="mt-4 grid grid-cols-5 gap-2">
              {product.images.map((img, i) => {
                const url = getImageUrl(img);
                return (
                <button
                  key={url}
                  onClick={() => setActiveIdx(i)}
                  className={`aspect-square rounded overflow-hidden border transition ${
                    i === activeIdx ? "border-primary" : "border-border hover:border-primary/40"
                  }`}
                >
                  <img src={url} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" />
                </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <p className="text-[0.65rem] uppercase tracking-[0.4em] text-muted-foreground">{catLabel}</p>
          <h1 className="mt-3 font-heading text-3xl sm:text-4xl">{product.name}</h1>
          <p className="mt-4 font-heading text-2xl text-primary">₹{product.price.toLocaleString("en-IN")}</p>

          <span
            className={`inline-block mt-4 text-[0.65rem] uppercase tracking-[0.22em] px-3 py-1 rounded-full ${
              product.stockStatus === "in-stock"
                ? "bg-emerald-100 text-emerald-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {product.stockStatus === "in-stock" ? "In Stock" : "Out of Stock"}
          </span>

          {product.description && (
            <p className="mt-6 text-sm leading-relaxed text-foreground/80 whitespace-pre-wrap">
              {product.description}
            </p>
          )}

          <div className="mt-8 grid gap-3">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => { addToCart(cartProduct); toast.success("Added to bag"); }}
                disabled={product.stockStatus === "out-of-stock"}
                className="inline-flex items-center justify-center gap-2 h-11 rounded-full bg-primary text-primary-foreground text-[0.7rem] uppercase tracking-[0.22em] hover:opacity-90 transition disabled:opacity-50"
              >
                <ShoppingBag className="h-4 w-4" /> Add to Bag
              </button>
              <button
                onClick={() => toggleWishlist(cartProduct)}
                className={`inline-flex items-center justify-center gap-2 h-11 rounded-full border border-border text-[0.7rem] uppercase tracking-[0.22em] transition hover:border-primary/40 ${wished ? "text-destructive" : ""}`}
              >
                <Heart className={`h-4 w-4 ${wished ? "fill-current" : ""}`} /> Wishlist
              </button>
            </div>
            <button
              onClick={orderOnWhatsApp}
              className="inline-flex items-center justify-center gap-2 h-11 rounded-full border border-border text-[0.7rem] uppercase tracking-[0.22em] hover:border-primary/40 hover:text-primary transition"
            >
              <MessageCircle className="h-4 w-4" /> Order on WhatsApp
            </button>
            <button
              onClick={share}
              className="inline-flex items-center justify-center gap-2 h-11 rounded-full border border-border text-[0.7rem] uppercase tracking-[0.22em] hover:border-primary/40 hover:text-primary transition"
            >
              <Share2 className="h-4 w-4" /> Share Product
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}