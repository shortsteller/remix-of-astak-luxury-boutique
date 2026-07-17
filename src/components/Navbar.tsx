import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { ArrowRight, Heart, Menu, Search, ShoppingBag, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useStore } from "@/lib/store";

const links = [
  { to: "/", label: "Home" },
  { to: "/catalog", label: "Catalog" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact Us" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const { cartCount, wishlistCount } = useStore();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const term = q.trim();
    navigate({ to: "/catalog", search: term ? { q: term } : {} });
    setSearchOpen(false);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  return (
    <>
    <header
      className={`sticky top-0 z-50 w-full backdrop-blur-xl transition-all duration-500 ${
        scrolled ? "bg-background/85 border-b border-border/60" : "bg-background/60"
      }`}
    >
      <div className="container-luxe flex h-20 items-center gap-6">
        {/* Brand + desktop links */}
        <div className="flex min-w-0 items-center gap-8">
          <Link to="/" className="flex shrink-0 items-baseline gap-2 group">
            <span className="font-brand text-3xl leading-none text-primary transition-transform duration-500 group-hover:-translate-y-0.5">
              अस्तक
            </span>
            <span className="hidden sm:inline text-[0.6rem] tracking-[0.35em] uppercase text-muted-foreground">
              Astak
            </span>
          </Link>
          <nav className="hidden lg:flex items-center gap-7">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="link-underline text-[0.72rem] uppercase tracking-[0.28em] text-foreground/80 hover:text-foreground transition-colors"
                activeProps={{ className: "text-foreground" }}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Center search */}
        <div className="hidden md:flex flex-1 justify-center">
          <form onSubmit={submitSearch} className="relative w-full max-w-md">
            <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search sarees, kurtas, dresses…"
              className="w-full h-11 rounded-full border border-border bg-card/70 pl-11 pr-12 text-xs tracking-wider text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition"
            />
            <button
              type="submit"
              aria-label="Search"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground hover:opacity-90 transition"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>

        {/* Right icons */}
        <div className="ml-auto flex items-center gap-1">
          <button
            onClick={() => setSearchOpen((v) => !v)}
            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-muted transition"
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
          </button>
          <Link
            to="/wishlist"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-muted transition"
            aria-label="Wishlist"
          >
            <Heart className="h-4 w-4" />
            {wishlistCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 h-4 min-w-4 px-1 rounded-full bg-primary text-primary-foreground text-[9px] flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </Link>
          <Link
            to="/cart"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-muted transition"
            aria-label="Cart"
          >
            <ShoppingBag className="h-4 w-4" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 h-4 min-w-4 px-1 rounded-full bg-primary text-primary-foreground text-[9px] flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
          <button
            onClick={() => setOpen(true)}
            className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-muted transition"
            aria-label="Menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Mobile search drawer */}
      {searchOpen && (
        <div className="md:hidden border-t border-border/60 bg-background/95 px-5 py-4 animate-fade-in">
          <form onSubmit={submitSearch} className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              autoFocus
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search…"
              className="w-full h-11 rounded-full border border-border bg-card pl-11 pr-12 text-xs tracking-wider focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <button
              type="submit"
              aria-label="Search"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground hover:opacity-90 transition"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}

      {/* Mobile menu overlay */}
    </header>
    {typeof document !== "undefined" &&
      createPortal(
        <div
          className={`fixed inset-0 z-[60] lg:hidden overflow-hidden transition-opacity duration-500 ${
            open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        >
          <div
            className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <aside
            className={`absolute right-0 top-0 h-full w-[82%] max-w-sm bg-white text-foreground shadow-2xl transition-transform duration-500 ${
              open ? "translate-x-0" : "translate-x-full"
            }`}
            style={{ boxShadow: "-20px 0 60px -20px rgba(0,0,0,0.25)" }}
          >
            <div className="flex items-center justify-between px-6 h-20 border-b border-border">
              <span className="font-brand text-2xl text-primary">अस्तक</span>
              <button
                onClick={() => setOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-muted"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex flex-col p-6 gap-1 bg-white">
              {links.map((l, i) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className="py-4 border-b border-border/60 text-sm uppercase tracking-[0.28em] text-foreground/80 hover:text-primary transition-colors animate-fade-up"
                  style={{ animationDelay: `${i * 70}ms` }}
                >
                  {l.label}
                </Link>
              ))}
              <p className="mt-10 font-accent text-3xl text-primary/80">Ethnic. Elegant.</p>
              <p className="font-accent text-3xl text-primary/80 -mt-2">Exclusively yours.</p>
            </nav>
          </aside>
        </div>,
        document.body,
      )}
    </>
  );
}
