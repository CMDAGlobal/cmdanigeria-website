"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Eye, EyeOff, Loader2, Lock, Mail, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toaster } from "@/components/ui/sonner";
import { loginAction } from "@/admin/auth/server";
import { useAdminSession } from "@/components/admin/admin-session";

export const Route = createFileRoute("/admin/login")({
  component: AdminLoginPage,
  head: () => ({
    meta: [
      { title: "Admin Sign In · CMDA Nigeria" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

function AdminLoginPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const session = useAdminSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (session.data?.user && !session.isFetching) {
      navigate({ to: "/admin", replace: true });
    }
  }, [session.data, session.isFetching, navigate]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    setError(null);
    setSubmitting(true);

    try {
      const result = await loginAction({
        data: {
          email,
          password,
        },
      });
      if (!result.ok) {
        setError(result.error ?? "Sign in failed. Please try again.");
        return;
      }
      await queryClient.invalidateQueries({ queryKey: ["admin-session"] });
      toast.success(`Welcome back, ${result.user?.name ?? result.user?.email ?? ""}`);
      navigate({ to: "/admin", replace: true });
    } catch (caught) {
      console.error(caught);
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden bg-primary-deep sm:grid sm:grid-cols-2">
      <div className="relative hidden flex-col justify-between gap-10 p-12 text-white sm:flex">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_20%_10%,rgba(184,134,11,0.28),transparent_70%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_50%_at_90%_90%,rgba(153,66,121,0.45),transparent_70%)]" />
        <div className="relative flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15">
            <ShieldCheck className="h-6 w-6 text-gold" />
          </div>
          <div>
            <p className="font-display text-lg font-bold tracking-tight">CMDA Nigeria</p>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/50">
              Admin Console
            </p>
          </div>
        </div>

        <div className="relative">
          <p className="max-w-md font-display text-3xl font-bold leading-tight text-white sm:text-4xl">
            Administer the Christian Medical &amp; Dental Association of Nigeria.
          </p>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-white/60">
            Sign in to manage sections, chapters, events, news and the wider organisation. Access is
            role-based and every action is recorded in the audit log.
          </p>
          <div className="mt-10 flex flex-col gap-4 text-sm text-white/75">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-xs font-semibold text-gold">
                1
              </span>
              <span>Access is granted by a Super Admin and scoped to your role.</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-xs font-semibold text-gold">
                2
              </span>
              <span>Sign-in activity is tracked in the central audit log.</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-xs font-semibold text-gold">
                3
              </span>
              <span>Use a strong, private password — never share it.</span>
            </div>
          </div>
        </div>

        <p className="relative text-xs text-white/40">
          © {new Date().getFullYear()} CMDA Nigeria. Authorised personnel only.
        </p>
      </div>

      <div className="relative flex items-center justify-center bg-background px-6 py-12 sm:py-0">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-3 sm:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <ShieldCheck className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-display text-base font-bold tracking-tight">CMDA Nigeria</p>
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Admin Console
              </p>
            </div>
          </div>

          <h2 className="font-display text-2xl font-bold tracking-tight">Sign in</h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Enter your administrator credentials to continue.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  autoComplete="username"
                  required
                  placeholder="you@cmdanigeria.org"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="px-9"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={submitting || !email || !password}
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {submitting ? "Signing in…" : "Sign in"}
            </Button>
          </form>

          <p className="mt-8 text-center text-xs text-muted-foreground">
            Unauthorised use of this console is recorded and reviewed.
          </p>
        </div>
      </div>
      <Toaster position="bottom-right" />
    </div>
  );
}
