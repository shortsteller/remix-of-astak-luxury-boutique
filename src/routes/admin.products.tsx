import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { CATEGORIES } from "@/lib/store";
import { deleteProduct, useProducts } from "@/lib/firestore-products";

export const Route = createFileRoute("/admin/products")({
  component: AdminProducts,
});

function AdminProducts() {
  const { products, loading } = useProducts();

  const onDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await deleteProduct(id);
      toast.success("Product deleted");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  };

  return (
    <div className="container-luxe py-12 sm:py-16">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link to="/admin/dashboard" className="inline-flex items-center gap-1.5 text-[0.65rem] uppercase tracking-[0.28em] text-muted-foreground hover:text-primary">
            <ArrowLeft className="h-3 w-3" /> Dashboard
          </Link>
          <h1 className="mt-2 font-heading text-3xl sm:text-4xl">Manage Products</h1>
        </div>
        <Link to="/admin/products/new" className="inline-flex items-center gap-2 h-10 px-5 rounded-full bg-primary text-primary-foreground text-[0.7rem] uppercase tracking-[0.25em] hover:opacity-90 transition">
          <Plus className="h-4 w-4" /> Add Product
        </Link>
      </div>

      <div className="mt-10 rounded-xl border border-border bg-card overflow-hidden">
        {loading ? (
          <p className="p-8 text-center text-xs uppercase tracking-[0.28em] text-muted-foreground">Loading…</p>
        ) : products.length === 0 ? (
          <p className="p-12 text-center text-sm text-muted-foreground">No products yet. Add your first one.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-[0.6rem] uppercase tracking-[0.25em] text-muted-foreground">
                <tr>
                  <th className="text-left px-4 py-3">Product</th>
                  <th className="text-left px-4 py-3">Category</th>
                  <th className="text-left px-4 py-3">Price</th>
                  <th className="text-left px-4 py-3">Stock</th>
                  <th className="text-left px-4 py-3">Homepage</th>
                  <th className="text-right px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => {
                  const cat = CATEGORIES.find((c) => c.slug === p.category)?.label ?? p.category;
                  return (
                    <tr key={p.id} className="border-t border-border">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img src={p.images[0]} alt={p.name} className="h-12 w-12 rounded object-cover bg-muted" />
                          <span className="font-medium">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{cat}</td>
                      <td className="px-4 py-3">₹{p.price.toLocaleString("en-IN")}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-1 rounded-full ${p.stockStatus === "in-stock" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                          {p.stockStatus === "in-stock" ? "In Stock" : "Out"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-1 rounded-full ${p.showOnHomepage ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                          {p.showOnHomepage ? "Yes" : "No"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <Link
                            to="/admin/products/edit/$id"
                            params={{ id: p.id }}
                            className="inline-flex items-center gap-1 h-8 px-3 rounded-full border border-border text-[0.65rem] uppercase tracking-[0.2em] hover:border-primary/40 hover:text-primary"
                          >
                            <Pencil className="h-3 w-3" /> Edit
                          </Link>
                          <button
                            onClick={() => onDelete(p.id, p.name)}
                            className="inline-flex items-center gap-1 h-8 px-3 rounded-full border border-border text-[0.65rem] uppercase tracking-[0.2em] hover:border-destructive/60 hover:text-destructive"
                          >
                            <Trash2 className="h-3 w-3" /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}