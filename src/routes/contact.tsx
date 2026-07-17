import { createFileRoute } from "@tanstack/react-router";
import { Facebook, Instagram, Mail, MapPin, MessageCircle, Phone } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Astak — Kolkata" },
      { name: "description", content: "Reach the Astak atelier in Kolkata. Phone, WhatsApp, Instagram and Facebook." },
    ],
  }),
  component: Contact,
});

const PHONE_DISPLAY = "+91 82403 38031";
const PHONE_TEL = "+918240338031";
const WHATSAPP_URL = "https://wa.me/918240338031";

function Contact() {
  return (
    <div className="animate-fade-in">
      <section className="container-luxe pt-20 pb-14 text-center max-w-3xl">
        <p className="text-[0.65rem] uppercase tracking-[0.4em] text-muted-foreground">Get in touch</p>
        <h1 className="mt-4 font-heading text-4xl sm:text-6xl">Contact</h1>
        <p className="mt-4 font-accent text-3xl text-primary/70">let's connect</p>
      </section>

      <section className="container-luxe pb-24">
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-20 items-start">
          {/* Left — Contact info list */}
          <div>
            <p className="text-[0.65rem] uppercase tracking-[0.4em] text-muted-foreground">
              Contact Information
            </p>
            <div className="hairline w-16 mt-4 mb-10" />

            <ul className="space-y-8">
              <Item icon={<Phone className="h-4 w-4" />} label="Phone" value={PHONE_DISPLAY} href={`tel:${PHONE_TEL}`} />
              <Item icon={<Mail className="h-4 w-4" />} label="Email" value="—" />
              <Item icon={<MessageCircle className="h-4 w-4" />} label="WhatsApp" value="Chat with us" href={WHATSAPP_URL} external />
              <Item icon={<Instagram className="h-4 w-4" />} label="Instagram" value="" />
              <Item icon={<Facebook className="h-4 w-4" />} label="Facebook" value="" />
              <Item
                icon={<MapPin className="h-4 w-4" />}
                label="Location"
                value="Kolkata, West Bengal, India"
                sub="Shipping Available Across India"
              />
            </ul>
          </div>

          {/* Right — Map */}
          <div className="rounded-md overflow-hidden border border-border shadow-soft h-full min-h-[420px] lg:min-h-[560px]">
            <iframe
              title="Astak — Kolkata"
              src="https://www.google.com/maps?q=Kolkata,West+Bengal&output=embed"
              width="100%"
              height="100%"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full block min-h-[420px] lg:min-h-[560px]"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function Item({
  icon, label, value, sub, href, external,
}: {
  icon: React.ReactNode; label: string; value: string; sub?: string;
  href?: string; external?: boolean;
}) {
  const content = (
    <div className="flex items-start gap-4 group">
      <span className="mt-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border text-primary transition-colors group-hover:border-primary/40 group-hover:bg-primary/5">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-[0.6rem] uppercase tracking-[0.32em] text-muted-foreground">{label}</p>
        {value ? (
          <p className="mt-1 font-heading text-base sm:text-lg break-words">{value}</p>
        ) : (
          <p className="mt-1 h-5" />
        )}
        {sub && <p className="mt-1 text-xs text-muted-foreground">{sub}</p>}
      </div>
    </div>
  );

  return (
    <li>
      {href ? (
        <a href={href} target={external ? "_blank" : undefined} rel="noreferrer" className="block">
          {content}
        </a>
      ) : (
        content
      )}
    </li>
  );
}
