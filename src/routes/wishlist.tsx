import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, X } from "lucide-react";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/wishlist")({
  head: () => ({ meta: [{ title: "Wishlist — Astak" }] }),
  component: Wishlist,
});

function Wishlist() {
  const { wishlist, toggleWishlist, addToCart } = useStore();

  return (
    <div className="animate-fade-in container-luxe pt-20 pb-24">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <p className="text-[0.65rem] uppercase tracking-[0.4em] text-muted-foreground">Saved for later</p>
        <h1 className="mt-4 font-heading text-4xl sm:text-6xl">Wishlist</h1>
      </div>

      {wishlist.length === 0 ? (
        <div className="border border-dashed border-border rounded-lg py-24 px-6 text-center bg-card/40">
          <Heart className="h-8 w-8 mx-auto text-primary/60" />
          <p className="mt-6 font-accent text-4xl text-primary/70">nothing saved yet</p>
          <p className="mt-4 text-sm text-muted-foreground">Tap the heart on any piece to save it here.</p>
          <Link to="/catalog" className="mt-8 inline-block btn-luxe">Browse Catalog</Link>
        </div>
      ) : (
        <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {wishlist.map((p) => (
            <li key={p.id} className="rounded-md border border-border bg-card p-5 group">
              <div className="aspect-[3/4] rounded-md bg-muted overflow-hidden">
                {p.image ? <img src={p.image} alt={p.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" /> : null}
              </div>
              <div className="mt-4 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-heading text-lg truncate">{p.name}</p>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">₹{p.price.toLocaleString("en-IN")}</p>
                </div>
                <button onClick={() => toggleWishlist(p)} className="p-1 text-muted-foreground hover:text-destructive">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <button onClick={() => addToCart(p)} className="btn-ghost-luxe w-full justify-center mt-4">Add to Bag</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
