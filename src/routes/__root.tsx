import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { StoreProvider } from "../lib/store";
import { Toaster } from "sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="font-accent text-5xl text-primary">Astak</p>
        <h1 className="mt-4 text-6xl font-heading">404</h1>
        <p className="mt-3 text-xs uppercase tracking-[0.3em] text-muted-foreground">
          This page has drifted off the loom
        </p>
        <div className="mt-8">
          <Link to="/" className="btn-luxe">Return home</Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-heading text-foreground">Something didn't drape right</h1>
        <p className="mt-3 text-xs uppercase tracking-[0.28em] text-muted-foreground">
          Please try again or return home
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button onClick={() => { router.invalidate(); reset(); }} className="btn-luxe">Try again</button>
          <a href="/" className="btn-ghost-luxe">Go home</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Astak — Premium Ethnic Fashion from Kolkata" },
      { name: "description", content: "Astak is a Kolkata-based premium ethnic fashion house crafting sarees, kurta sets, dress materials, dresses and bed sheets. Ethnic. Elegant. Exclusively yours." },
      { name: "author", content: "Astak" },
      { property: "og:title", content: "Astak — Premium Ethnic Fashion from Kolkata" },
      { property: "og:description", content: "Sarees, kurta sets, dress materials, dresses and bed sheets — crafted with care in Kolkata." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800&family=JetBrains+Mono:wght@300;400;500&family=Great+Vibes&family=Yatra+One&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <StoreProvider>
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">
            <Outlet />
          </main>
          <Footer />
        </div>
        <Toaster position="bottom-center" theme="light" />
      </StoreProvider>
    </QueryClientProvider>
  );
}
