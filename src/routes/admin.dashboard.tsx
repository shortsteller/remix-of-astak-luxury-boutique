import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { LogOut, Package, Plus, Settings } from "lucide-react";
import { CATEGORIES } from "@/lib/store";
import { useProducts } from "@/lib/firestore-products";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/dashboard")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const { products, loading } = useProducts();
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const homepageCount = products.filter((p) => p.showOnHomepage).length;

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

      <div className="mt-10 grid gap-3 sm:grid-cols-3">
        <Link to="/admin/products/new" className="inline-flex items-center justify-center gap-2 h-12 rounded-full bg-primary text-primary-foreground text-[0.7rem] uppercase tracking-[0.25em] hover:opacity-90 transition">
          <Plus className="h-4 w-4" /> Add Product
        </Link>
        <Link to="/admin/products" className="inline-flex items-center justify-center gap-2 h-12 rounded-full border border-border bg-card text-[0.7rem] uppercase tracking-[0.25em] hover:border-primary/40 hover:text-primary transition">
          <Package className="h-4 w-4" /> Manage Products
        </Link>
        <button
          onClick={onLogout}
          className="inline-flex items-center justify-center gap-2 h-12 rounded-full border border-border bg-card text-[0.7rem] uppercase tracking-[0.25em] hover:border-primary/40 hover:text-primary transition"
        >
          <Settings className="h-4 w-4" /> Logout
        </button>
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