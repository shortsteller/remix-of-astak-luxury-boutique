import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="mt-32 border-t border-border/60 bg-card/40">
      <div className="container-luxe py-16 grid gap-12 md:grid-cols-4">
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-baseline gap-3">
            <span className="font-brand text-4xl text-primary">अस्तक</span>
            <span className="text-[0.65rem] tracking-[0.4em] uppercase text-muted-foreground">
              Astak
            </span>
          </div>
          <p className="font-accent text-2xl text-primary/80">Ethnic. Elegant. Exclusively yours.</p>
          <p className="max-w-md text-xs leading-relaxed text-muted-foreground">
            A Kolkata-based premium ethnic fashion house — crafting sarees, kurta sets,
            dress materials, dresses and bed linen for the modern connoisseur.
          </p>
        </div>
        <div>
          <h4 className="text-[0.65rem] uppercase tracking-[0.3em] text-foreground mb-4">Explore</h4>
          <ul className="space-y-3 text-xs text-muted-foreground">
            <li><Link to="/" className="link-underline">Home</Link></li>
            <li><Link to="/catalog" className="link-underline">Catalog</Link></li>
            <li><Link to="/about" className="link-underline">About</Link></li>
            <li><Link to="/contact" className="link-underline">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-[0.65rem] uppercase tracking-[0.3em] text-foreground mb-4">Reach Us</h4>
          <ul className="space-y-3 text-xs text-muted-foreground">
            <li>Kolkata, West Bengal</li>
            <li>+91 82403 38031</li>
            <li>Shipping across India</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="container-luxe py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[0.65rem] uppercase tracking-[0.28em] text-muted-foreground">
          <span>© {new Date().getFullYear()} Astak. All rights reserved.</span>
          <span>Handcrafted in Kolkata</span>
        </div>
      </div>
    </footer>
  );
}
