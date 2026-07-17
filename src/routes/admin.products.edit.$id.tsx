import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { ProductForm } from "@/components/admin/ProductForm";
import { updateProduct, useProduct } from "@/lib/firestore-products";

export const Route = createFileRoute("/admin/products/edit/$id")({
  component: EditProductPage,
});

function EditProductPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { product, loading } = useProduct(id);

  return (
    <div className="container-luxe py-12 sm:py-16">
      <Link to="/admin/dashboard" className="inline-flex items-center gap-1.5 text-[0.65rem] uppercase tracking-[0.28em] text-muted-foreground hover:text-primary">
        <ArrowLeft className="h-3 w-3" /> Dashboard
      </Link>
      <h1 className="mt-2 font-heading text-3xl sm:text-4xl">Edit Product</h1>

      <div className="mt-10">
        {loading ? (
          <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">Loading…</p>
        ) : !product ? (
          <p className="text-sm text-muted-foreground">Product not found.</p>
        ) : (
          <ProductForm
            initial={product}
            submitLabel="Save Changes"
            onSubmit={async (input) => {
              try {
                await updateProduct(id, input);
                toast.success("Product updated");
                navigate({ to: "/admin/dashboard" });
              } catch (err) {
                toast.error(err instanceof Error ? err.message : "Update failed");
              }
            }}
          />
        )}
      </div>
    </div>
  );
}