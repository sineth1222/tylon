"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, ShieldCheck, AlertCircle } from "lucide-react";
import { signIn } from "@/lib/actions/auth";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginClient() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await signIn(formData);
      if (result?.error) {
        setError(result.error);
        return;
      }

      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setError("Authentication failed.");
        return;
      }

      const { data: profile } = await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single();
      if (!profile || profile.role !== "admin") {
        await supabase.auth.signOut();
        setError("Access denied. This account does not have admin privileges.");
        return;
      }
      router.push("/admin");
      router.refresh();
    });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #2A2118 0%, #3D342E 50%, #2A2118 100%)",
      }}
    >
      {/* Decorative */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-20 w-64 h-64 rounded-full border border-rose-500/10" />
        <div className="absolute top-32 right-32 w-32 h-32 rounded-full border border-gold-400/10" />
        <div className="absolute bottom-20 left-20 w-48 h-48 rounded-full border border-rose-400/10" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="bg-cream-50 rounded-4xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-stone-800 mb-4 shadow-lg">
              <ShieldCheck size={28} className="text-rose-300" />
            </div>
            <div className="font-display text-3xl font-bold italic text-stone-800 mb-1">
              Siena
            </div>
            <p className="text-[10px] tracking-[0.3em] text-rose-400 uppercase">
              Admin Panel
            </p>
          </div>

          {error && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-2xl px-4 py-3 mb-5">
              <AlertCircle size={15} className="text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold tracking-[0.15em] uppercase text-stone-400 mb-1.5">
                Email
              </label>
              <input
                name="email"
                type="email"
                required
                placeholder="admin@zoraluxury.lk"
                className="input-zora"
                autoComplete="email"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold tracking-[0.15em] uppercase text-stone-400 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  className="input-zora pr-12"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-stone-800 text-cream-100 py-4 rounded-2xl text-xs font-bold tracking-[0.2em] uppercase hover:bg-stone-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
            >
              {isPending ? (
                <>
                  <Loader2 size={14} className="animate-spin" /> Signing in…
                </>
              ) : (
                <>
                  <ShieldCheck size={14} /> Sign In to Admin
                </>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-stone-400 mt-6">
            <a
              href="/"
              className="hover:text-rose-500 transition-colors underline underline-offset-2"
            >
              ← Return to store
            </a>
          </p>
        </div>
        <p className="text-center text-xs text-stone-600 mt-4">
          © 2026 ZORA LUXURY CLOTHING
        </p>
      </div>
    </div>
  );
}
