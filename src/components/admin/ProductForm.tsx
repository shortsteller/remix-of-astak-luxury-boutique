import { useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import { toast } from "sonner";
import { CATEGORIES } from "@/lib/store";
import { uploadImagesToCloudinary } from "@/lib/cloudinary";
import type { ProductInput, ProductImage, StockStatus } from "@/lib/firestore-products";
import { getImageUrl } from "@/lib/firestore-products";

interface Props {
  initial?: Partial<ProductInput>;
  submitLabel: string;
  onSubmit: (input: ProductInput) => Promise<void>;
}

export function ProductForm({ initial, submitLabel, onSubmit }: Props) {
  const [name, setName] = useState(initial?.name ?? "");
  const [category, setCategory] = useState(initial?.category ?? CATEGORIES[0].slug);
  const [price, setPrice] = useState<string>(initial?.price != null ? String(initial.price) : "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [images, setImages] = useState<ProductImage[]>(
    // Normalize any legacy string entries into the new { url, publicId } shape.
    (initial?.images ?? []).map((img) =>
      typeof img === "string" ? { url: img, publicId: "" } : img,
    ),
  );
  const [stockStatus, setStockStatus] = useState<StockStatus>(initial?.stockStatus ?? "in-stock");
  const [showOnHomepage, setShowOnHomepage] = useState<boolean>(initial?.showOnHomepage ?? false);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const uploaded = await uploadImagesToCloudinary(Array.from(files));
      setImages((prev) => [...prev, ...uploaded]);
      toast.success(`Uploaded ${uploaded.length} image(s)`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (url: string) =>
    setImages((prev) => prev.filter((img) => img.url !== url));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = Number(price);
    if (!Number.isFinite(priceNum) || priceNum < 0) {
      toast.error("Enter a valid price");
      return;
    }
    if (images.length === 0) {
      toast.error("Add at least one product image");
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit({
        name: name.trim(),
        category,
        price: priceNum,
        description: description.trim(),
        images,
        stockStatus,
        showOnHomepage,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-6 max-w-3xl">
      <Field label="Product Name">
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={fieldCls}
        />
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Category">
          <select value={category} onChange={(e) => setCategory(e.target.value)} className={fieldCls}>
            {CATEGORIES.map((c) => (
              <option key={c.slug} value={c.slug}>{c.label}</option>
            ))}
          </select>
        </Field>
        <Field label="Price (₹)">
          <input
            required
            type="number"
            min="0"
            step="1"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className={fieldCls}
          />
        </Field>
      </div>

      <Field label="Description">
        <textarea
          rows={5}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={`${fieldCls} min-h-32 py-3 rounded-2xl`}
        />
      </Field>

      <Field label="Product Images">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => {
            onFiles(e.target.files);
            // reset so re-selecting the same file re-triggers change
            if (e.target) e.target.value = "";
          }}
          className="sr-only"
          disabled={uploading}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex w-full flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-background/60 px-6 py-8 text-center transition hover:border-primary/50 hover:bg-background disabled:opacity-60"
        >
          <ImagePlus className="h-5 w-5 text-muted-foreground" />
          <span className="text-xs uppercase tracking-[0.24em] text-foreground/80">
            {uploading ? "Uploading…" : "Tap to upload images"}
          </span>
          <span className="text-[0.65rem] text-muted-foreground">
            PNG, JPG or WEBP · multiple allowed
          </span>
        </button>
        {images.length > 0 && (
          <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 gap-3">
            {images.map((img) => (
              <div key={img.url} className="relative aspect-square rounded-md overflow-hidden bg-muted border border-border">
                <img src={img.url} alt="Product" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(img.url)}
                  className="absolute top-1 right-1 h-7 w-7 rounded-full bg-background/90 border border-border grid place-items-center hover:bg-destructive hover:text-destructive-foreground transition"
                  aria-label="Remove image"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Stock Status">
          <select
            value={stockStatus}
            onChange={(e) => setStockStatus(e.target.value as StockStatus)}
            className={fieldCls}
          >
            <option value="in-stock">In Stock</option>
            <option value="out-of-stock">Out of Stock</option>
          </select>
        </Field>
        <label className="flex items-center gap-3 pt-8">
          <input
            type="checkbox"
            checked={showOnHomepage}
            onChange={(e) => setShowOnHomepage(e.target.checked)}
            className="h-4 w-4 accent-primary"
          />
          <span className="text-xs uppercase tracking-[0.22em] text-foreground/80">
            Display on Homepage
          </span>
        </label>
      </div>

      <button
        type="submit"
        disabled={submitting || uploading}
        className="inline-flex items-center gap-2 h-11 px-8 rounded-full bg-primary text-primary-foreground text-[0.7rem] uppercase tracking-[0.28em] hover:opacity-90 transition disabled:opacity-60"
      >
        {submitting ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[0.65rem] uppercase tracking-[0.28em] text-muted-foreground mb-2">
        {label}
      </span>
      {children}
    </label>
  );
}

const fieldCls =
  "w-full h-11 rounded-full border border-border bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30";