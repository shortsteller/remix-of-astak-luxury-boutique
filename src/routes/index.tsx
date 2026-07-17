import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react";
import { CATEGORIES } from "@/lib/store";
import { useProducts } from "@/lib/firestore-products";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Astak — Ethnic. Elegant. Exclusively Yours." },
      { name: "description", content: "Discover Astak's Kolkata-crafted collection of sarees, kurta sets, dress materials, dresses and bed sheets." },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <div className="animate-fade-in">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="relative h-[78vh] min-h-[560px] w-full bg-gradient-to-br from-primary/90 via-primary to-primary/80 flex items-end">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center px-6 animate-fade-up">
              <p className="text-primary-foreground/60 text-[0.7rem] tracking-[0.5em] uppercase mb-6">
                Kolkata, Est. Handcrafted
              </p>
              <h1 className="flex justify-center leading-none">
                <img
                  src="/favicon.png"
                  alt="अस्तक — Astak"
                  width={512}
                  height={512}
                  className="h-48 w-48 sm:h-64 sm:w-64 md:h-80 md:w-80 object-contain rounded-2xl shadow-luxe"
                />
              </h1>
              <p className="mt-6 font-accent text-3xl sm:text-4xl text-accent">
                Ethnic. Elegant. Exclusively Yours.
              </p>
            </div>
          </div>

          <div className="relative z-10 container-luxe pb-10 sm:pb-14 animate-fade-up delay-300">
            <Link
              to="/catalog"
              className="inline-flex items-center gap-3 rounded-full bg-background/95 backdrop-blur px-7 py-4 text-[0.7rem] uppercase tracking-[0.3em] text-foreground shadow-luxe hover:bg-background transition-all duration-500 hover:gap-5"
            >
              Browse Products
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent pointer-events-none" />
        </div>
      </section>

      {/* Intro strip */}
      <section className="container-luxe py-24 text-center">
        <p className="inline-flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.4em] text-muted-foreground">
          <Sparkles className="h-3 w-3 text-accent" />
          The Astak Atelier
        </p>
        <h2 className="mt-6 font-heading text-3xl sm:text-5xl max-w-3xl mx-auto leading-tight">
          A quiet luxury, drawn from the looms and lanes of Bengal.
        </h2>
      </section>

      {/* Categories — heading, images, view more */}
      <section className="container-luxe pb-32 space-y-24">
        {CATEGORIES.map((cat, i) => (
          <CategoryBlock key={cat.slug} index={i} slug={cat.slug} label={cat.label} />
        ))}
      </section>
    </div>
  );
}

function CategoryBlock({ index, slug, label }: { index: number; slug: string; label: string }) {
  const { products } = useProducts();
  const items = products.filter((p) => p.showOnHomepage && p.category === slug).slice(0, 4);
  return (
    <div className="animate-fade-up">
      {/* Heading */}
      <div className="text-center mb-10">
        <p className="text-[0.65rem] uppercase tracking-[0.4em] text-muted-foreground">
          Chapter {String(index + 1).padStart(2, "0")}
        </p>
        <h2 className="mt-3 font-heading text-4xl sm:text-5xl">{label}</h2>
        <div className="hairline w-24 mx-auto mt-6" />
      </div>

      {/* Images */}
      {items.length > 0 ? (
        <div className="grid gap-4 sm:gap-6 grid-cols-2 lg:grid-cols-4">
          {items.map((p) => (
            <Link
              key={p.id}
              to="/product/$id"
              params={{ id: p.id }}
              className="group relative aspect-[3/4] overflow-hidden rounded-md bg-muted"
            >
              <img
                src={p.images[0]}
                alt={p.name}
                loading="lazy"
                width={1024}
                height={1024}
                className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-foreground/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <p className="text-primary-foreground text-[0.7rem] uppercase tracking-[0.2em] line-clamp-1">
                  {p.name}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, k) => (
            <div key={k} className="aspect-[3/4] rounded-md bg-gradient-to-br from-muted via-secondary to-muted" />
          ))}
        </div>
      )}

      {/* View more */}
      <div className="text-center mt-10">
        <Link to="/catalog" search={{ category: slug }} className="btn-ghost-luxe">
          View more <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}
