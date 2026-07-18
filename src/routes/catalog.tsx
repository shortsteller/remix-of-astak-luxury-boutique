import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { CATEGORIES } from "@/lib/store";
import { useProducts } from "@/lib/firestore-products";
import { ProductCard } from "@/components/ProductCard";
import { z } from "zod";

const searchSchema = z.object({
  category: z.string().optional(),
  q: z.string().optional(),
});

export const Route = createFileRoute("/catalog")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Catalog — Astak" },
      { name: "description", content: "Explore the Astak catalog — sarees, kurta sets, dress materials, dresses and bed sheets." },
    ],
  }),
  component: Catalog,
});

function Catalog() {
  const { category: initialCategory, q: initialQuery } = Route.useSearch();
  const navigate = Route.useNavigate();
  const [category, setCategory] = useState<string>(initialCategory ?? "all");
  const [query, setQuery] = useState(initialQuery ?? "");
  const [sort, setSort] = useState<"newest" | "asc" | "desc">("newest");
  const { products, loading } = useProducts();

  useEffect(() => {
    setQuery(initialQuery ?? "");
  }, [initialQuery]);
  useEffect(() => {
    setCategory(initialCategory ?? "all");
  }, [initialCategory]);

  const filtered = useMemo(() => {
    let list = products.map((p) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      image: getImageUrl(p.images[0]),
      category: p.category,
    }));
    if (category !== "all") list = list.filter((p) => p.category === category);
    if (query) list = list.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));
    if (sort === "asc") list.sort((a, b) => a.price - b.price);
    if (sort === "desc") list.sort((a, b) => b.price - a.price);
    return list;
  }, [category, query, sort, products]);

  const selectCategory = (slug: string) => {
    setCategory(slug);
    navigate({ search: slug === "all" ? {} : { category: slug }, replace: true });
  };

  const chips = [{ slug: "all", label: "All" }, ...CATEGORIES];

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <section className="container-luxe pt-14 sm:pt-20 pb-8 text-center">
        <p className="text-[0.65rem] uppercase tracking-[0.4em] text-muted-foreground">The Collection</p>
        <h1 className="mt-3 font-heading text-4xl sm:text-6xl">Catalog</h1>
        <p className="mt-3 font-accent text-2xl text-primary/70">a curated edit</p>
      </section>

      {/* Categories — always visible */}
      <section className="container-luxe pb-8">
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
          {chips.map((c) => {
            const active = category === c.slug;
            return (
              <button
                key={c.slug}
                onClick={() => selectCategory(c.slug)}
                className={`px-4 sm:px-6 py-2.5 rounded-full text-[0.65rem] sm:text-[0.7rem] uppercase tracking-[0.22em] transition-all duration-300 border ${
                  active
                    ? "bg-primary text-primary-foreground border-primary shadow-soft"
                    : "bg-card text-foreground/70 border-border hover:border-primary/40 hover:text-primary"
                }`}
              >
                {c.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* Search + Sort */}
      <section className="container-luxe pb-8">
        <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products…"
              className="w-full h-11 rounded-full border border-border bg-card pl-11 pr-4 text-xs focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as typeof sort)}
            className="h-11 rounded-full border border-border bg-card px-4 text-xs focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <option value="newest">Newest</option>
            <option value="asc">Price: Low to High</option>
            <option value="desc">Price: High to Low</option>
          </select>
        </div>
      </section>

      {/* Products */}
      <section className="container-luxe pb-24">
        <p className="text-center text-[0.65rem] uppercase tracking-[0.28em] text-muted-foreground mb-6">
          {filtered.length} {filtered.length === 1 ? "piece" : "pieces"}
        </p>

        {loading ? (
          <p className="text-center text-xs uppercase tracking-[0.28em] text-muted-foreground py-24">Loading…</p>
        ) : filtered.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-3 sm:gap-6 grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="border border-dashed border-border rounded-lg py-24 px-6 text-center bg-card/40 animate-fade-up">
      <p className="font-accent text-4xl text-primary/70">nothing here</p>
      <h3 className="mt-4 font-heading text-2xl">No products in this filter</h3>
      <p className="mt-3 text-xs uppercase tracking-[0.28em] text-muted-foreground">
        Try a different category
      </p>
    </div>
  );
}
