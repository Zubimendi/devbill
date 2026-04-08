"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (searchParams.get("registered")) {
      setSuccess("Account created successfully! Please sign in.");
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid email or password");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full flex-col md:flex-row bg-surface overflow-hidden">
      {/* LEFT PANEL: Visual Identity & Hero */}
      <section className="hidden lg:flex w-1/2 bg-[#0A0F1E] relative flex-col justify-between p-16 overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-primary-custom/15 blur-[150px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
        
        {/* Logo Section */}
        <div className="relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-primary-custom rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-primary-custom/30">
              <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance_wallet</span>
            </div>
            <span className="text-4xl font-extrabold tracking-tight text-white">DevBill</span>
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center justify-center">
          <div className="relative w-full max-w-lg perspective-1000">
            <div className="transform -rotate-3 skew-y-1 hover:rotate-0 transition-transform duration-700 invoice-mock-shadow rounded-2xl overflow-hidden border border-white/10">
              <img 
                className="w-full h-auto object-cover" 
                alt="Premium digital invoice interface" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAeKgSW0jOk456CD1J3xCI4laJGFCKGIaCyVHjmIB0K70Fje_rW7fxyGCSiclJ2cKGF4PR-GG5_XrknJn72peMC_UzwqJQKbK-dwUwhANzaufpRC6w6l5SJG-ngBXuZM7c4Of6VryIAqWh0GlTokGj6f20WpqY8LleF3dmnyeu6EfUPxZVv2vL5_pY6WvhosrmQoyyjagwm4GZyj4tMVNI3vdmLX8mwsBdSHDUELg9LVsC_78YT0qjY9a178OjX8-S4chpQYR2eBQnR"
              />
            </div>
            {/* Floating Accent Card */}
            <div className="absolute -bottom-10 -right-10 glass-panel p-8 rounded-3xl w-72 translate-z-10 border-white/10 shadow-2xl">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-10 h-10 bg-tertiary-fixed rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#002113] text-lg font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                </div>
                <span className="text-white text-base font-bold">Payment Received</span>
              </div>
              <div className="h-2.5 w-full bg-white/10 rounded-full mb-3">
                <div className="h-full w-full bg-tertiary-fixed rounded-full shadow-[0_0_15px_rgba(111,251,190,0.5)]"></div>
              </div>
              <span className="text-white/60 text-sm font-medium">$12,450.00 deposited</span>
            </div>
          </div>
          <div className="mt-28 text-center max-w-md mx-auto">
            <h1 className="text-6xl font-extrabold text-white tracking-tighter mb-8 leading-[1]">
              Get paid faster.<br/>
              <span className="text-primary-fixed-dim italic font-serif">Invoice like a pro.</span>
            </h1>
          </div>
        </div>

        {/* Social Proof */}
        <div className="relative z-10 border-t border-white/10 pt-10">
          <div className="flex items-center justify-between">
            <div className="flex -space-x-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-12 h-12 rounded-full border-2 border-[#0A0F1E] bg-slate-800 overflow-hidden">
                  <img 
                    className="w-full h-full object-cover opacity-80" 
                    alt="User" 
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`}
                  />
                </div>
              ))}
              <div className="w-12 h-12 rounded-full border-2 border-[#0A0F1E] bg-primary-custom flex items-center justify-center text-xs font-black text-white">+2k</div>
            </div>
            <div className="text-white/50 text-base font-medium">
              Trusted by 2,000+ freelance engineers
            </div>
          </div>
        </div>
      </section>

      {/* RIGHT PANEL: Auth UI */}
      <main className="flex-1 bg-surface-container-low/20 relative flex flex-col items-center justify-center p-8 md:p-16 overflow-y-auto">
        <div className="w-full max-w-md my-auto space-y-12">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-4 mb-16 justify-center">
            <div className="w-12 h-12 bg-primary-custom rounded-2xl flex items-center justify-center text-white shadow-xl shadow-primary-custom/20">
              <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance_wallet</span>
            </div>
            <span className="text-3xl font-extrabold tracking-tight text-on-surface">DevBill</span>
          </div>

          {/* Header */}
          <div className="text-center lg:text-left space-y-4">
            <h2 className="text-5xl font-extrabold text-on-surface tracking-tighter">Welcome back</h2>
            <p className="text-on-surface-variant font-semibold text-xl leading-relaxed opacity-70">Manage your business ledger with ease.</p>
          </div>

          {/* Status Messages */}
          {success && (
            <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-5 text-base text-emerald-600 font-bold flex items-center gap-3">
              <span className="material-symbols-outlined">check_circle</span>
              {success}
            </div>
          )}
          {error && (
            <div className="rounded-2xl bg-destructive/10 border border-destructive/20 p-5 text-base text-destructive font-bold flex items-center gap-3">
              <span className="material-symbols-outlined">error</span>
              {error}
            </div>
          )}

          {/* Social Auth Focus: Google Only */}
          <div className="space-y-4">
            <Button 
              type="button"
              variant="outline"
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              className="w-full h-14 bg-surface-container-lowest border-outline-variant/15 text-on-surface rounded-2xl font-black text-lg hover:bg-surface-container-low transition-all active:scale-95 flex items-center justify-center gap-4 shadow-sm"
              disabled={isLoading}
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
              </svg>
              <span>Continue with Google</span>
            </Button>
            
            <div className="relative flex items-center py-6">
              <div className="flex-grow border-t border-outline-variant/15"></div>
              <span className="flex-shrink mx-6 text-outline text-xs font-black uppercase tracking-[0.25em] leading-none">or use email</span>
              <div className="flex-grow border-t border-outline-variant/15"></div>
            </div>
          </div>

          {/* Email Login Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2.5">
              <Label className="text-[11px] font-black uppercase tracking-[0.2em] text-outline ml-1" htmlFor="email">Email address</Label>
              <Input 
                id="email" 
                name="email"
                placeholder="name@company.com" 
                type="email"
                required
                disabled={isLoading}
                className="h-14 rounded-2xl focus:ring-primary-custom"
              />
            </div>
            <div className="space-y-2.5">
              <div className="flex justify-between items-center px-1">
                <Label className="text-[11px] font-black uppercase tracking-[0.2em] text-outline" htmlFor="password">Password</Label>
                <Link className="text-[11px] font-black text-primary-custom hover:text-primary-container transition-colors uppercase tracking-widest" href="/forgot-password">Forgot password?</Link>
              </div>
              <PasswordInput 
                id="password" 
                name="password"
                placeholder="••••••••" 
                required
                disabled={isLoading}
                className="h-14 rounded-2xl"
              />
            </div>

            <Button 
              className="w-full h-15 bg-gradient-to-r from-primary-custom to-primary-container text-white rounded-2xl font-black text-xl shadow-2xl shadow-primary-custom/30 hover:shadow-primary-custom/40 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50" 
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <span className="material-symbols-outlined text-2xl">arrow_forward</span>
                </>
              )}
            </Button>
          </form>

          {/* Footer Toggle */}
          <div className="pt-8 border-t border-outline-variant/10 text-center">
            <p className="text-on-surface-variant text-base font-bold">
              New to DevBill? 
              <Link className="text-primary-custom font-black hover:underline underline-offset-8 decoration-2 ml-2" href="/register">Create an account</Link>
            </p>
          </div>

          {/* Legal/Trust Link */}
          <div className="mt-20 text-center opacity-40">
            <p className="text-on-surface-variant text-[10px] uppercase font-black tracking-[0.2em]">
              BANK-GRADE 256-BIT ENCRYPTION
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#0A0F1E]">
          <Loader2 className="h-10 w-10 animate-spin text-primary-custom" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}

