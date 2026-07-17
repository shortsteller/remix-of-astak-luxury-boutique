import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { ProductForm } from "@/components/admin/ProductForm";
import { createProduct } from "@/lib/firestore-products";

export const Route = createFileRoute("/admin/products/new")({
  component: NewProductPage,
});

function NewProductPage() {
  const navigate = useNavigate();
  return (
    <div className="container-luxe py-12 sm:py-16">
      <Link to="/admin/dashboard" className="inline-flex items-center gap-1.5 text-[0.65rem] uppercase tracking-[0.28em] text-muted-foreground hover:text-primary">
        <ArrowLeft className="h-3 w-3" /> Dashboard
      </Link>
      <h1 className="mt-2 font-heading text-3xl sm:text-4xl">Add Product</h1>

      <div className="mt-10">
        <ProductForm
          submitLabel="Create Product"
          onSubmit={async (input) => {
            try {
              await createProduct(input);
              toast.success("Product created");
              navigate({ to: "/admin/dashboard" });
            } catch (err) {
              toast.error(err instanceof Error ? err.message : "Create failed");
            }
          }}
        />
      </div>
    </div>
  );
}