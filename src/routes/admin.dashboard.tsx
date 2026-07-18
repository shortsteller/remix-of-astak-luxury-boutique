import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Eye, EyeOff, LogOut, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { CATEGORIES } from "@/lib/store";
import {
  deleteProduct,
  updateProduct,
  useProducts,
  getImageUrl,
  type FirestoreProduct,
} from "@/lib/firestore-products";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/dashboard")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const { products, loading } = useProducts();
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [category, setCategory] = useState<string>("all");
  const [q, setQ] = useState("");

  const homepageCount = products.filter((p) => p.showOnHomepage).length;

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return products.filter((p) => {
      if (category !== "all" && p.category !== category) return false;
      if (!term) return true;
      const catLabel = CATEGORIES.find((c) => c.slug === p.category)?.label ?? p.category;
      return (
        p.name.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term) ||
        catLabel.toLowerCase().includes(term)
      );
    });
  }, [products, category, q]);

  const onLogout = async () => {
    await logout();
    toast.success("Signed out");
    navigate({ to: "/admin/login", replace: true });
  };

  return (
    <div className="container-luxe py-12 sm:py-16">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-[0.65rem] uppercase tracking-[0.35em] text-muted-foreground">Astak Admin</p>
          <h1 className="mt-2 font-heading text-3xl sm:text-4xl">Dashboard</h1>
          {user?.email && (
            <p className="mt-1 text-xs text-muted-foreground">Signed in as {user.email}</p>
          )}
        </div>
        <button
          onClick={onLogout}
          className="inline-flex items-center gap-2 h-10 px-5 rounded-full border border-border text-[0.7rem] uppercase tracking-[0.25em] hover:border-primary/40 hover:text-primary transition"
        >
          <LogOut className="h-3.5 w-3.5" /> Logout
        </button>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        <StatCard label="Total Products" value={loading ? "…" : products.length} />
        <StatCard label="Total Categories" value={CATEGORIES.length} />
        <StatCard label="Homepage Products" value={loading ? "…" : homepageCount} />
      </div>

      <div className="mt-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          <CategoryChip active={category === "all"} onClick={() => setCategory("all")}>
            All Products
          </CategoryChip>
          {CATEGORIES.map((c) => (
            <CategoryChip
              key={c.slug}
              active={category === c.slug}
              onClick={() => setCategory(c.slug)}
            >
              {c.label}
            </CategoryChip>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search products…"
              className="h-11 w-full sm:w-72 rounded-full border border-border bg-background pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <Link
            to="/admin/products/new"
            className="inline-flex items-center gap-2 h-11 px-5 rounded-full bg-primary text-primary-foreground text-[0.7rem] uppercase tracking-[0.25em] hover:opacity-90 transition whitespace-nowrap"
          >
            <Plus className="h-4 w-4" /> Add Product
          </Link>
        </div>
      </div>

      <div className="mt-8">
        {loading ? (
          <p className="p-12 text-center text-xs uppercase tracking-[0.28em] text-muted-foreground">
            Loading…
          </p>
        ) : filtered.length === 0 ? (
          <p className="p-12 text-center text-sm text-muted-foreground">
            {products.length === 0
              ? "No products yet. Add your first one."
              : "No products match the current filters."}
          </p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((p) => (
              <ProductAdminCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CategoryChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`h-9 px-4 rounded-full border text-[0.65rem] uppercase tracking-[0.25em] transition ${
        active
          ? "bg-primary text-primary-foreground border-primary"
          : "border-border bg-card text-foreground/80 hover:border-primary/40 hover:text-primary"
      }`}
    >
      {children}
    </button>
  );
}

function ProductAdminCard({ product }: { product: FirestoreProduct }) {
  const [busy, setBusy] = useState(false);
  const catLabel =
    CATEGORIES.find((c) => c.slug === product.category)?.label ?? product.category;
  const inStock = product.stockStatus === "in-stock";

  const toggleStock = async () => {
    setBusy(true);
    try {
      await updateProduct(product.id, {
        stockStatus: inStock ? "out-of-stock" : "in-stock",
      });
      toast.success(inStock ? "Marked out of stock" : "Marked in stock");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    } finally {
      setBusy(false);
    }
  };

  const toggleHomepage = async () => {
    setBusy(true);
    try {
      await updateProduct(product.id, { showOnHomepage: !product.showOnHomepage });
      toast.success(product.showOnHomepage ? "Hidden from homepage" : "Shown on homepage");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    } finally {
      setBusy(false);
    }
  };

  const onDelete = async () => {
    if (!confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
    setBusy(true);
    try {
      await deleteProduct(product.id);
      toast.success("Product deleted");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
      setBusy(false);
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden flex flex-col">
      <div className="relative aspect-square bg-muted">
        {product.images[0] && (
          <img src={getImageUrl(product.images[0])} alt={product.name} className="w-full h-full object-cover" />
        )}
        <span
          className={`absolute top-3 left-3 text-[0.6rem] uppercase tracking-[0.2em] px-2 py-1 rounded-full ${
            inStock ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
          }`}
        >
          {inStock ? "In Stock" : "Out"}
        </span>
        {product.showOnHomepage && (
          <span className="absolute top-3 right-3 text-[0.6rem] uppercase tracking-[0.2em] px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
            Homepage
          </span>
        )}
      </div>
      <div className="p-4 flex-1 flex flex-col gap-3">
        <div>
          <p className="text-[0.6rem] uppercase tracking-[0.28em] text-muted-foreground">
            {catLabel}
          </p>
          <h3 className="mt-1 font-medium text-sm line-clamp-2">{product.name}</h3>
          <p className="mt-1 text-sm text-primary">₹{product.price.toLocaleString("en-IN")}</p>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-auto">
          <button
            onClick={toggleStock}
            disabled={busy}
            className="inline-flex items-center justify-center gap-1 h-9 rounded-full border border-border text-[0.6rem] uppercase tracking-[0.2em] hover:border-primary/40 hover:text-primary transition disabled:opacity-50"
          >
            {inStock ? "Mark Out" : "Mark In"}
          </button>
          <button
            onClick={toggleHomepage}
            disabled={busy}
            className="inline-flex items-center justify-center gap-1 h-9 rounded-full border border-border text-[0.6rem] uppercase tracking-[0.2em] hover:border-primary/40 hover:text-primary transition disabled:opacity-50"
          >
            {product.showOnHomepage ? (
              <>
                <EyeOff className="h-3 w-3" /> Hide
              </>
            ) : (
              <>
                <Eye className="h-3 w-3" /> Show
              </>
            )}
          </button>
          <Link
            to="/admin/products/edit/$id"
            params={{ id: product.id }}
            className="inline-flex items-center justify-center gap-1 h-9 rounded-full border border-border text-[0.6rem] uppercase tracking-[0.2em] hover:border-primary/40 hover:text-primary transition"
          >
            <Pencil className="h-3 w-3" /> Edit
          </Link>
          <button
            onClick={onDelete}
            disabled={busy}
            className="inline-flex items-center justify-center gap-1 h-9 rounded-full border border-border text-[0.6rem] uppercase tracking-[0.2em] hover:border-destructive/60 hover:text-destructive transition disabled:opacity-50"
          >
            <Trash2 className="h-3 w-3" /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <p className="text-[0.65rem] uppercase tracking-[0.3em] text-muted-foreground">{label}</p>
      <p className="mt-3 font-heading text-4xl text-primary">{value}</p>
    </div>
  );
}