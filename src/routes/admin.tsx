import { createFileRoute, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Astak" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminLayout,
});

function AdminLayout() {
  const { user, loading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isLoginRoute = pathname === "/admin/login";

  useEffect(() => {
    if (loading) return;
    if (!isLoginRoute && !isAdmin) {
      navigate({ to: "/admin/login", replace: true });
    }
    if (isLoginRoute && isAdmin) {
      navigate({ to: "/admin/dashboard", replace: true });
    }
  }, [loading, isAdmin, isLoginRoute, navigate]);

  if (loading) {
    return (
      <div className="min-h-[60vh] grid place-items-center">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Loading…</p>
      </div>
    );
  }
  if (!isLoginRoute && !isAdmin) return null;
  if (isLoginRoute && isAdmin) return null;

  // Signed-in but not admin: allowed email mismatch
  if (!isLoginRoute && user && !isAdmin) {
    return (
      <div className="container-luxe py-24 text-center">
        <h1 className="font-heading text-3xl">Access denied</h1>
        <p className="mt-3 text-xs uppercase tracking-[0.28em] text-muted-foreground">
          This account is not authorised to access the admin panel.
        </p>
      </div>
    );
  }

  return <Outlet />;
}