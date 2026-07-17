import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import { ADMIN_EMAIL } from "@/lib/firebase";

export const Route = createFileRoute("/admin/login")({
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim().toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
      toast.error("This account is not authorised.");
      return;
    }
    setSubmitting(true);
    try {
      await login(email.trim(), password);
      toast.success("Signed in");
      navigate({ to: "/admin/dashboard", replace: true });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Sign in failed";
      toast.error(msg.replace("Firebase: ", ""));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container-luxe py-20 flex justify-center">
      <div className="w-full max-w-md bg-card border border-border rounded-xl p-8 shadow-soft">
        <p className="text-[0.65rem] uppercase tracking-[0.4em] text-muted-foreground text-center">Astak</p>
        <h1 className="mt-2 font-heading text-3xl text-center">Admin Login</h1>
        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <div>
            <label className="block text-[0.65rem] uppercase tracking-[0.25em] text-muted-foreground mb-2">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-11 rounded-full border border-border bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              autoComplete="email"
            />
          </div>
          <div>
            <label className="block text-[0.65rem] uppercase tracking-[0.25em] text-muted-foreground mb-2">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-11 rounded-full border border-border bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              autoComplete="current-password"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full h-11 rounded-full bg-primary text-primary-foreground text-[0.7rem] uppercase tracking-[0.28em] hover:opacity-90 transition disabled:opacity-60"
          >
            {submitting ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}