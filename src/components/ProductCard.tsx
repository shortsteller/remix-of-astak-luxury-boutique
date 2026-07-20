import { Heart, ShoppingBag, MessageCircle, Share2 } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useStore, type Product } from "@/lib/store";
import { WHATSAPP_NUMBER } from "@/lib/firebase";
import { toast } from "sonner";

export function ProductCard({ product }: { product: Product }) {
  const { addToCart, toggleWishlist, isWishlisted } = useStore();
  const wished = isWishlisted(product.id);
  const outOfStock = product.inStock === false;
  const hasMore = (product.variantCount ?? 0) > 1;

  const orderOnWhatsApp = () => {
    if (outOfStock) return;
    const text = `Hello Astak, I'd like to order:\n\n• ${product.name}\n  Price: ₹${product.price.toLocaleString("en-IN")}\n\nPlease share availability and next steps.`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, "_blank");
  };

  const share = async () => {
    const shareData = {
      title: `${product.name} — Astak`,
      text: `${product.name} · ₹${product.price.toLocaleString("en-IN")} — from Astak`,
      url: typeof window !== "undefined" ? window.location.href : "",
    };
    try {
      if (navigator.share) await navigator.share(shareData);
      else {
        await navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
        toast.success("Link copied to clipboard");
      }
    } catch { /* dismissed */ }
  };

  return (
    <article className="group relative flex flex-col rounded-lg bg-card overflow-hidden transition-all duration-500 hover:shadow-luxe hover:-translate-y-1">
      <Link
        to="/product/$id"
        params={{ id: product.id }}
        className="relative aspect-[3/4] overflow-hidden bg-muted block"
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          width={1024}
          height={1024}
          className={`h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105 ${
            outOfStock ? "opacity-50 grayscale" : ""
          }`}
        />
        {outOfStock && (
          <span className="absolute bottom-3 left-3 text-[0.6rem] uppercase tracking-[0.22em] px-2.5 py-1 rounded-full bg-red-100 text-red-700">
            Out of Stock
          </span>
        )}
      </Link>
      <button
          onClick={(e) => { e.preventDefault(); toggleWishlist(product); }}
          aria-label="Wishlist"
          className={`absolute top-3 right-3 h-9 w-9 grid place-items-center rounded-full backdrop-blur-md bg-background/80 border border-border/60 transition-all duration-300 hover:scale-110 ${
            wished ? "text-destructive" : "text-foreground/70"
          }`}
        >
          <Heart className={`h-4 w-4 ${wished ? "fill-current" : ""}`} />
      </button>

      <div className="flex flex-col flex-1 p-3 sm:p-4">
        <Link to="/product/$id" params={{ id: product.id }}>
          <h3 className="font-heading text-[0.9rem] sm:text-base leading-snug line-clamp-2 min-h-[2.4em] hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1 sm:mt-2 font-heading text-base sm:text-lg text-primary">
          ₹{product.price.toLocaleString("en-IN")}
        </p>
        {hasMore && (
          <p className="mt-1 text-[0.6rem] sm:text-[0.65rem] uppercase tracking-[0.22em] text-muted-foreground">
            More options available
          </p>
        )}

        <div className="mt-3 sm:mt-4 grid gap-1.5 sm:gap-2">
          <button
            onClick={() => {
              if (outOfStock) return;
              addToCart(product);
              toast.success("Added to bag");
            }}
            disabled={outOfStock}
            className="inline-flex items-center justify-center gap-2 h-9 sm:h-10 rounded-full bg-primary text-primary-foreground text-[0.65rem] sm:text-[0.7rem] uppercase tracking-[0.22em] transition-all hover:opacity-90 disabled:opacity-50 disabled:pointer-events-none"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{outOfStock ? "Out of Stock" : "Add to Bag"}</span>
            <span className="sm:hidden">{outOfStock ? "Out" : "Bag"}</span>
          </button>
          <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
            <button
              onClick={orderOnWhatsApp}
              disabled={outOfStock}
              className="inline-flex items-center justify-center gap-1.5 h-9 sm:h-10 rounded-full border border-border bg-background text-[0.6rem] sm:text-[0.68rem] uppercase tracking-[0.18em] transition-all hover:border-primary/40 hover:text-primary disabled:opacity-50 disabled:pointer-events-none"
            >
              <MessageCircle className="h-3.5 w-3.5" /> <span className="hidden sm:inline">WhatsApp</span><span className="sm:hidden">Order</span>
            </button>
            <button
              onClick={share}
              className="inline-flex items-center justify-center gap-1.5 h-9 sm:h-10 rounded-full border border-border bg-background text-[0.6rem] sm:text-[0.68rem] uppercase tracking-[0.18em] transition-all hover:border-primary/40 hover:text-primary"
            >
              <Share2 className="h-3.5 w-3.5" /> Share
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
