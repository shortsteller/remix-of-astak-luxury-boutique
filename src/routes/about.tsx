import { createFileRoute, Link } from "@tanstack/react-router";
import { CATEGORIES } from "@/lib/store";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Astak — Kolkata's Premium Ethnic Fashion House" },
      { name: "description", content: "Astak is a Kolkata-based premium ethnic fashion brand offering sarees, kurta sets, dress materials, dresses and bed sheets." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <div className="animate-fade-in">
      <section className="container-luxe pt-20 pb-16 text-center max-w-3xl">
        <p className="text-[0.65rem] uppercase tracking-[0.4em] text-muted-foreground">Our Story</p>
        <h1 className="mt-4 font-heading text-4xl sm:text-6xl leading-tight">
          A quiet house of ethnic craft, rooted in Kolkata.
        </h1>
        <p className="mt-6 font-accent text-3xl text-primary/70">Ethnic. Elegant. Exclusively yours.</p>
      </section>

      <section className="container-luxe max-w-3xl pb-24">
        <div className="space-y-6">
          <div className="hairline w-24 mx-auto" />
          <p className="text-sm leading-relaxed text-muted-foreground text-center">
            Astak is a Kolkata-based premium ethnic fashion brand. Our atelier draws from the
            city's centuries-old textile heritage — the weavers of Bengal, the drape of a Baluchari,
            the softness of Bengal cotton — and reframes it for a modern, considered wardrobe.
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground text-center">
            Every piece is chosen with intent. We keep our collections small, our craftspeople
            close, and our attention on the details that only reveal themselves over years of wear.
          </p>
        </div>
      </section>

      <section className="bg-card/50 border-y border-border/60 py-24">
        <div className="container-luxe">
          <p className="text-[0.65rem] uppercase tracking-[0.4em] text-muted-foreground text-center">
            What we make
          </p>
          <h2 className="mt-4 text-center font-heading text-3xl sm:text-4xl">Five chapters, one wardrobe</h2>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {CATEGORIES.map((c, i) => (
              <Link
                key={c.slug}
                to="/catalog"
                search={{ category: c.slug }}
                className="group rounded-md border border-border bg-background p-8 text-center transition-all duration-500 hover:-translate-y-1 hover:shadow-soft hover:border-primary/40 animate-fade-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <p className="font-brand text-3xl text-primary/70">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-4 font-heading text-lg group-hover:text-primary transition-colors">{c.label}</h3>
                <p className="mt-2 text-[0.7rem] tracking-wide text-muted-foreground leading-relaxed">
                  {c.tagline}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="container-luxe py-24 text-center max-w-2xl">
        <p className="font-accent text-4xl text-primary">— from our atelier to your closet</p>
        <p className="mt-8 text-sm leading-relaxed text-muted-foreground">
          Based in Kolkata, West Bengal. Shipping thoughtfully packaged across India.
        </p>
      </section>
    </div>
  );
}
