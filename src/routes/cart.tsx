import { createFileRoute, Link } from "@tanstack/react-router";
import { MessageCircle, Minus, Plus, Share2, X } from "lucide-react";
import { useStore } from "@/lib/store";
import { WHATSAPP_NUMBER } from "@/lib/products";
import { toast } from "sonner";

export const Route = createFileRoute("/cart")({
  head: () => ({ meta: [{ title: "Shopping Bag — Astak" }] }),
  component: Cart,
});

function buildOrderMessage(items: { name: string; price: number; quantity: number }[], total: number) {
  const lines = items.map(
    (i) => `• ${i.name}\n   Qty: ${i.quantity} × ₹${i.price.toLocaleString("en-IN")} = ₹${(i.price * i.quantity).toLocaleString("en-IN")}`
  );
  return `Hello Astak, I would like to place an order for the following items.\n\n${lines.join("\n\n")}\n\n————————\nGrand Total: ₹${total.toLocaleString("en-IN")}\n\nPlease confirm availability and next steps. Thank you.`;
}

function Cart() {
  const { cart, removeFromCart, updateQty, toggleWishlist } = useStore();
  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const itemCount = cart.reduce((s, i) => s + i.quantity, 0);
  const total = subtotal;

  const orderOnWhatsApp = () => {
    if (!cart.length) return;
    const text = buildOrderMessage(cart, total);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, "_blank");
  };

  const shareCart = async () => {
    if (!cart.length) return;
    const text = buildOrderMessage(cart, total).replace(
      "Hello Astak, I would like to place an order for the following items.",
      "Look at my Astak cart:"
    );
    if (navigator.share) {
      try { await navigator.share({ title: "My Astak Cart", text }); return; } catch { /* dismissed */ }
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="animate-fade-in container-luxe pt-16 sm:pt-20 pb-24">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <p className="text-[0.65rem] uppercase tracking-[0.4em] text-muted-foreground">Your Selection</p>
        <h1 className="mt-4 font-heading text-4xl sm:text-6xl">Shopping Bag</h1>
      </div>

      {cart.length === 0 ? (
        <div className="border border-dashed border-border rounded-lg py-24 px-6 text-center bg-card/40">
          <p className="font-accent text-4xl text-primary/70">nothing here yet</p>
          <p className="mt-4 text-sm text-muted-foreground">Your bag is waiting to be filled.</p>
          <Link to="/catalog" className="mt-8 inline-block btn-luxe">Browse Catalog</Link>
        </div>
      ) : (
        <div className="grid gap-10 lg:grid-cols-[1fr_400px]">
          <ul className="space-y-4">
            {cart.map((item) => (
              <li key={item.id} className="rounded-lg bg-card p-4 sm:p-5 shadow-soft/50 border border-border/60">
                <div className="grid grid-cols-[80px_1fr] sm:grid-cols-[100px_1fr_auto] gap-4 sm:gap-6 items-start">
                  <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-md overflow-hidden bg-muted">
                    {item.image ? (
                      <img src={item.image} alt={item.name} loading="lazy" className="h-full w-full object-cover" />
                    ) : null}
                  </div>
                  <div className="min-w-0">
                    <p className="font-heading text-sm sm:text-lg leading-snug">{item.name}</p>
                    <p className="text-[0.65rem] text-muted-foreground uppercase tracking-widest mt-1">{item.category}</p>
                    <p className="mt-2 text-sm text-primary font-heading">₹{item.price.toLocaleString("en-IN")}</p>

                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <div className="inline-flex items-center border border-border rounded-full bg-background">
                        <button onClick={() => updateQty(item.id, item.quantity - 1)} className="h-8 w-8 grid place-items-center hover:bg-muted rounded-l-full" aria-label="Decrease">
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-8 text-center text-xs">{item.quantity}</span>
                        <button onClick={() => updateQty(item.id, item.quantity + 1)} className="h-8 w-8 grid place-items-center hover:bg-muted rounded-r-full" aria-label="Increase">
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <button
                        onClick={() => { toggleWishlist(item); toast.success("Saved to wishlist"); }}
                        className="text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="inline-flex items-center gap-1 text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <X className="h-3 w-3" /> Remove
                      </button>
                    </div>
                  </div>
                  <div className="col-span-2 sm:col-span-1 sm:text-right pt-2 sm:pt-0 border-t sm:border-0 border-border/60">
                    <p className="text-[0.6rem] uppercase tracking-[0.28em] text-muted-foreground">Item total</p>
                    <p className="font-heading text-lg mt-1">₹{(item.price * item.quantity).toLocaleString("en-IN")}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <aside className="rounded-lg border border-border bg-card p-6 sm:p-8 h-fit lg:sticky lg:top-28 shadow-soft">
            <h2 className="font-heading text-xl">Order Summary</h2>
            <div className="hairline my-6" />
            <dl className="space-y-3 text-sm">
              <Row label="Total items" value={`${itemCount}`} />
              <Row label="Subtotal" value={`₹${subtotal.toLocaleString("en-IN")}`} />
              <Row label="Shipping" value="Calculated at confirmation" />
            </dl>
            <div className="hairline my-6" />
            <div className="flex items-baseline justify-between">
              <span className="text-[0.65rem] uppercase tracking-[0.3em] text-muted-foreground">Grand Total</span>
              <span className="font-heading text-3xl text-primary">₹{total.toLocaleString("en-IN")}</span>
            </div>

            <button
              onClick={orderOnWhatsApp}
              className="mt-8 w-full inline-flex items-center justify-center gap-2 h-12 rounded-full bg-primary text-primary-foreground text-[0.72rem] uppercase tracking-[0.28em] transition-all hover:opacity-90 shadow-luxe"
            >
              <MessageCircle className="h-4 w-4" /> Order on WhatsApp
            </button>
            <button
              onClick={shareCart}
              className="mt-3 w-full inline-flex items-center justify-center gap-2 h-11 rounded-full border border-border bg-background text-[0.7rem] uppercase tracking-[0.24em] transition-all hover:border-primary/40 hover:text-primary"
            >
              <Share2 className="h-4 w-4" /> Share Cart on WhatsApp
            </button>

            <p className="mt-6 text-[0.65rem] text-center text-muted-foreground leading-relaxed">
              Your cart details will be sent as a message. We'll confirm availability and share payment options.
            </p>
          </aside>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-muted-foreground">{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
