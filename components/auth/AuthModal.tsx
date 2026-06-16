"use client";

import { useState, useEffect } from "react";
import { X, Eye, EyeOff, Loader2 } from "lucide-react";
import {
  signIn,
  signUp,
  verifyEmail,
  resendVerificationCode,
} from "@/lib/actions/auth";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

type AuthView = "signin" | "signup" | "verify";

export default function AuthModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<AuthView>("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");
  const [verifyCode, setVerifyCode] = useState(["", "", "", "", "", ""]);
  const [redirectTo, setRedirectTo] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const handleOpen = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      setIsOpen(true);
      setView("signin");
      setRedirectTo(detail?.redirectTo || null);
    };
    window.addEventListener("open-auth-modal", handleOpen);
    return () => window.removeEventListener("open-auth-modal", handleOpen);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    setView("signin");
    setVerifyCode(["", "", "", "", "", ""]);
    setPendingEmail("");
    setRedirectTo(null);
  };

  const afterSignIn = () => {
    toast.success("WELCOME BACK");
    setIsOpen(false);
    if (redirectTo) router.push(redirectTo);
    else router.refresh();
  };

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const result = await signIn(formData);
    setLoading(false);
    if (result?.error) {
      if ((result as any).needsVerification) {
        setPendingEmail((result as any).email);
        setView("verify");
        toast.error("VERIFY YOUR EMAIL FIRST");
      } else {
        toast.error(result.error.toUpperCase());
      }
    } else if (result?.success) {
      afterSignIn();
    }
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const result = await signUp(formData);
    setLoading(false);
    if (result?.error) {
      toast.error(result.error.toUpperCase());
    } else if (result?.success && result.email) {
      setPendingEmail(result.email);
      setView("verify");
      toast.success("VERIFICATION CODE SENT");
    }
  };

  const codeString = verifyCode.join("");

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (codeString.length !== 6) return;
    setLoading(true);
    const result = await verifyEmail(pendingEmail, codeString);
    setLoading(false);
    if (result?.error) {
      toast.error("INVALID CODE. TRY AGAIN.");
    } else {
      toast.success("EMAIL VERIFIED. SIGN IN.");
      setView("signin");
    }
  };

  const handleCodeInput = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newCode = [...verifyCode];
    newCode[index] = value.slice(-1);
    setVerifyCode(newCode);
    if (value && index < 5) {
      const next = document.getElementById(`otp-${index + 1}`);
      next?.focus();
    }
  };

  const handleCodeKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !verifyCode[index] && index > 0) {
      const prev = document.getElementById(`otp-${index - 1}`);
      prev?.focus();
    }
  };

  const handleCodePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newCode = Array(6).fill("");
    pasted.split("").forEach((c, i) => { newCode[i] = c; });
    setVerifyCode(newCode);
    const lastIdx = Math.min(pasted.length, 5);
    document.getElementById(`otp-${lastIdx}`)?.focus();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center px-4 pb-4 sm:pb-0">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-tylon-bg/85 backdrop-blur-sm" onClick={handleClose} />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-sm bg-tylon-secondary border border-tylon-border animate-scale-in">
        {/* Top stripe */}
        <div className="h-1 bg-army w-full" />

        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-6 pb-0">
          <div>
            <p className="font-mono text-[9px] tracking-[0.4em] text-army uppercase mb-2">— TYLON ACCESS</p>
            {view === "signin" && (
              <h2 className="font-display text-2xl font-bold tracking-[0.1em] text-tylon-primary uppercase">SIGN IN</h2>
            )}
            {view === "signup" && (
              <h2 className="font-display text-2xl font-bold tracking-[0.1em] text-tylon-primary uppercase">JOIN THE RANKS</h2>
            )}
            {view === "verify" && (
              <>
                <h2 className="font-display text-2xl font-bold tracking-[0.1em] text-tylon-primary uppercase">VERIFY</h2>
                <p className="font-mono text-[10px] text-tylon-muted mt-1 tracking-wide">
                  CODE SENT TO {pendingEmail.toUpperCase()}
                </p>
              </>
            )}
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 border border-tylon-border flex items-center justify-center text-tylon-muted hover:border-army hover:text-tylon-primary transition-all mt-1"
          >
            <X size={14} />
          </button>
        </div>

        <div className="px-6 py-6 space-y-4">
          {/* Sign In */}
          {view === "signin" && (
            <form onSubmit={handleSignIn} className="space-y-4">
              <input
                name="email"
                type="email"
                placeholder="EMAIL ADDRESS"
                required
                className="input-tylon font-mono text-[11px] tracking-widest placeholder:tracking-[0.2em]"
                autoComplete="email"
              />
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="PASSWORD"
                  required
                  className="input-tylon pr-12 font-mono text-[11px] tracking-widest placeholder:tracking-[0.2em]"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-tylon-muted hover:text-tylon-primary"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-army text-tylon-primary py-4 font-display text-sm tracking-[0.2em] uppercase hover:bg-army-light transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading && <Loader2 size={14} className="animate-spin" />}
                ENTER
              </button>
              <p className="text-center font-mono text-[11px] text-tylon-muted tracking-wide">
                NEW RECRUIT?{" "}
                <button
                  type="button"
                  onClick={() => setView("signup")}
                  className="text-army-light hover:text-army transition-colors"
                >
                  CREATE ACCOUNT
                </button>
              </p>
            </form>
          )}

          {/* Sign Up */}
          {view === "signup" && (
            <form onSubmit={handleSignUp} className="space-y-4">
              <input
                name="fullName"
                type="text"
                placeholder="YOUR NAME"
                required
                className="input-tylon font-mono text-[11px] tracking-widest placeholder:tracking-[0.2em]"
                autoComplete="name"
              />
              <input
                name="email"
                type="email"
                placeholder="EMAIL ADDRESS"
                required
                className="input-tylon font-mono text-[11px] tracking-widest placeholder:tracking-[0.2em]"
                autoComplete="email"
              />
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="PASSWORD (MIN 8 CHARS)"
                  required
                  minLength={8}
                  className="input-tylon pr-12 font-mono text-[11px] tracking-widest placeholder:tracking-[0.2em]"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-tylon-muted hover:text-tylon-primary"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-army text-tylon-primary py-4 font-display text-sm tracking-[0.2em] uppercase hover:bg-army-light transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading && <Loader2 size={14} className="animate-spin" />}
                JOIN THE RANKS
              </button>
              <p className="text-center font-mono text-[11px] text-tylon-muted tracking-wide">
                ALREADY IN?{" "}
                <button
                  type="button"
                  onClick={() => setView("signin")}
                  className="text-army-light hover:text-army transition-colors"
                >
                  SIGN IN
                </button>
              </p>
            </form>
          )}

          {/* Verify */}
          {view === "verify" && (
            <form onSubmit={handleVerify} className="space-y-6">
              <div>
                <label className="block font-mono text-[9px] tracking-[0.3em] uppercase text-tylon-muted mb-4 text-center">
                  ENTER 6-DIGIT CODE
                </label>
                <div className="flex gap-2 justify-center" onPaste={handleCodePaste}>
                  {verifyCode.map((digit, i) => (
                    <input
                      key={i}
                      id={`otp-${i}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleCodeInput(i, e.target.value)}
                      onKeyDown={(e) => handleCodeKeyDown(i, e)}
                      className="w-11 h-13 text-center text-xl font-bold bg-tylon-card border-2 border-tylon-border focus:outline-none focus:border-army text-tylon-primary transition-all font-mono"
                      style={{ height: "52px" }}
                    />
                  ))}
                </div>
                <p className="text-center font-mono text-[9px] text-tylon-muted mt-3 tracking-widest">
                  CODE EXPIRES IN 15 MINUTES
                </p>
              </div>
              <button
                type="submit"
                disabled={loading || codeString.length !== 6}
                className="w-full bg-army text-tylon-primary py-4 font-display text-sm tracking-[0.2em] uppercase hover:bg-army-light transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading && <Loader2 size={14} className="animate-spin" />}
                VERIFY
              </button>
              <div className="text-center space-y-2">
                <p className="font-mono text-[11px] text-tylon-muted tracking-wide">
                  DIDN'T RECEIVE IT?{" "}
                  <button
                    type="button"
                    onClick={async () => {
                      await resendVerificationCode(pendingEmail);
                      toast.success("NEW CODE SENT");
                    }}
                    className="text-army-light hover:text-army transition-colors"
                  >
                    RESEND
                  </button>
                </p>
                <button
                  type="button"
                  onClick={() => setView("signup")}
                  className="font-mono text-[10px] text-tylon-muted/50 hover:text-tylon-muted tracking-widest"
                >
                  ← BACK TO SIGNUP
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
