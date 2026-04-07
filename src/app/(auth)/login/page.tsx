"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";

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
    const email = formData.get("email");
    const password = formData.get("password");

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
      <section className="hidden lg:flex w-1/2 bg-[#0A0F1E] relative flex-col justify-between p-12 overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary-custom/20 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
        
        {/* Logo Section */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary-custom rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-custom/20">
              <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance_wallet</span>
            </div>
            <span className="text-3xl font-bold tracking-tight text-white">DevBill</span>
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center justify-center">
          <div className="relative w-full max-w-lg perspective-1000">
            <div className="transform -rotate-6 skew-y-3 invoice-mock-shadow rounded-xl overflow-hidden border border-white/10">
              <img 
                className="w-full h-auto object-cover" 
                alt="Premium digital invoice interface" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAeKgSW0jOk456CD1J3xCI4laJGFCKGIaCyVHjmIB0K70Fje_rW7fxyGCSiclJ2cKGF4PR-GG5_XrknJn72peMC_UzwqJQKbK-dwUwhANzaufpRC6w6l5SJG-ngBXuZM7c4Of6VryIAqWh0GlTokGj6f20WpqY8LleF3dmnyeu6EfUPxZVv2vL5_pY6WvhosrmQoyyjagwm4GZyj4tMVNI3vdmLX8mwsBdSHDUELg9LVsC_78YT0qjY9a178OjX8-S4chpQYR2eBQnR"
              />
            </div>
            {/* Floating Accent Card */}
            <div className="absolute -bottom-8 -right-8 glass-panel p-6 rounded-2xl w-64 translate-z-10 border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-tertiary-custom rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                </div>
                <span className="text-white text-sm font-semibold">Payment Received</span>
              </div>
              <div className="h-2 w-full bg-white/10 rounded-full mb-2">
                <div className="h-full w-full bg-tertiary-custom rounded-full"></div>
              </div>
              <span className="text-white/60 text-xs">$12,450.00 deposited</span>
            </div>
          </div>
          <div className="mt-24 text-center max-w-sm mx-auto">
            <h1 className="text-5xl lg:text-6xl font-bold text-white tracking-tighter mb-8 leading-[1.1]">
              Get paid faster.<br/>
              <span className="text-primary-fixed-dim italic">Invoice like a pro.</span>
            </h1>
          </div>
        </div>

        {/* Social Proof */}
        <div className="relative z-10 border-t border-white/5 pt-8">
          <div className="flex items-center justify-between">
            <div className="flex -space-x-3">
              <img className="w-10 h-10 rounded-full border-2 border-[#0A0F1E] object-cover" alt="User" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCt7UJZZHo9y8owTZ4MKEpwyh0Y4Boj7KYv_2vif7Y0ftGMrbGKgSHaxHgmgsHQR6jE5pxObQUoF9zZ4Km3fXnd3WIbPIJT1ie8MlkyrFZvkGeBpYb9r9Lvzc2xx-TZr_5Cj1jI2qH-02LUVHOrcfAQKnlMWGOgcVHXewZCuv_sYDqHUq7eootlnPYeazGVAX6ZhrQXruMF4dT1ZRINjKxoa25wHrru9Tn2shVMj50EEUJR_fn7Sfm57GLsq4wn6hx0e6veQiFBefHX"/>
              <img className="w-10 h-10 rounded-full border-2 border-[#0A0F1E] object-cover" alt="User" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCQ6TIKykOwiL4yAYYp0_xtuvjlkws16IwZkRhVsaySpoFGDRikj10dntspxoEJblUK7gY0jfDHMLTqhQt-tpQalRkXYQvL8g9SfbCJFjyRhcXsuH3p2NNkP0FJdq6XsVOlyPwrV0VDkZwxiINxdawtIhZRt0DRGdf4cYzs04jNc3HxraGXQNyeiyYlzjwqfbrSJAFc4-7CvcjoXFWBYdrv32k2T0u3lIh_E3A5vKBHfvrrjhU6_jfm9bBo0SDCtpdnPVLQXFDa45EJ"/>
              <img className="w-10 h-10 rounded-full border-2 border-[#0A0F1E] object-cover" alt="User" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAKpBKqlhZ6xC_EoW4SWSNFRgQtKqI3n5JVlEfhm4sjUfaZzTeJNb08pAXbFsmFk3oeGcbzjAG_C0MjvydW3dGJP5nf5UdycYPixtBsvOUUz_PaRnLmjDIKPD6NABMueD5_zOTiIZjRszmVxZfXCC17qXWrvMdub-5emTZfGAwGyjp031sKEtbGlhT7eq7tjbQO-oN8L5oym1laFFcTHVTA4GpySIelpSZoHUKDTOouo7sMeJmrj66cPmu_X8vf3L3Shslpba1Ajbfb"/>
              <div className="w-10 h-10 rounded-full border-2 border-[#0A0F1E] bg-slate-800 flex items-center justify-center text-xs font-bold text-white">+2k</div>
            </div>
            <div className="text-white/60 text-sm">
              Trusted by 2,000+ freelancers globally
            </div>
          </div>
        </div>
      </section>

      {/* RIGHT PANEL: Auth UI */}
      <main className="flex-1 bg-surface-container-low/30 relative flex flex-col items-center justify-center p-8 md:p-12 overflow-y-auto">
        <div className="w-full max-w-md my-auto space-y-10">
          {/* Mobile Logo (Hidden on Desktop) */}
          <div className="lg:hidden flex items-center gap-3 mb-16 justify-center">
            <div className="w-10 h-10 bg-primary-custom rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-custom/20">
              <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance_wallet</span>
            </div>
            <span className="text-2xl font-bold tracking-tight text-on-surface">DevBill</span>
          </div>

          {/* Header */}
          <div className="text-center lg:text-left space-y-3">
            <h2 className="text-4xl md:text-5xl mt-20 font-bold text-on-surface tracking-tighter">Welcome back</h2>
            <p className="text-on-surface-variant font-medium text-lg leading-relaxed opacity-80">Enter your credentials to manage your ledger.</p>
          </div>

          {/* Status Messages */}
          {success && (
            <div className="mb-6 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-sm text-emerald-600 dark:text-emerald-400">
              {success}
            </div>
          )}
          {error && (
            <div className="mb-6 rounded-xl bg-destructive/10 border border-destructive/20 p-4 text-sm text-destructive">
              {error}
            </div>
          )}

          {/* Email Login Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant/70 ml-1" htmlFor="email">Email address</label>
              <input 
                className="w-full px-4 py-3.5 bg-surface-container-lowest rounded-xl border border-outline-variant/15 text-on-surface font-medium focus:ring-2 focus:ring-primary-custom focus:border-transparent transition-all outline-none placeholder:text-outline/40" 
                id="email" 
                name="email"
                placeholder="name@company.com" 
                type="email"
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant/70" htmlFor="password">Password</label>
                <Link className="text-xs font-bold text-primary-custom hover:text-primary-container transition-colors" href="/forgot-password">Forgot password?</Link>
              </div>
              <input 
                className="w-full px-4 py-3.5 bg-surface-container-lowest rounded-xl border border-outline-variant/15 text-on-surface font-medium focus:ring-2 focus:ring-primary-custom focus:border-transparent transition-all outline-none placeholder:text-outline/40" 
                id="password" 
                name="password"
                placeholder="••••••••" 
                type="password"
                required
                disabled={isLoading}
              />
            </div>

            {/* Divider */}
            <div className="relative flex items-center py-4">
              <div className="flex-grow border-t border-outline-variant/15"></div>
              <span className="flex-shrink mx-4 text-on-surface-variant text-[10px] font-bold uppercase tracking-widest leading-none">or sign in with</span>
              <div className="flex-grow border-t border-outline-variant/15"></div>
            </div>

            {/* Social Auth Cluster */}
            <div className="grid grid-cols-2 gap-4">
              <button 
                type="button"
                onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
                className="flex items-center justify-center gap-3 px-4 py-3 bg-[#191c1e] text-white rounded-lg font-medium hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-50"
                disabled={isLoading}
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"></path>
                </svg>
                <span>GitHub</span>
              </button>
              <button 
                type="button"
                onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                className="flex items-center justify-center gap-3 px-4 py-3 bg-surface-container-lowest border-2 border-outline-variant/15 text-on-surface rounded-lg font-medium hover:bg-surface-container-low transition-all active:scale-95 disabled:opacity-50"
                disabled={isLoading}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                </svg>
                <span>Google</span>
              </button>
            </div>

            <div className="pt-2">
              <button 
                className="w-full py-4 px-6 bg-gradient-to-r from-primary-custom to-primary-container text-white rounded-xl font-bold text-lg shadow-lg shadow-primary-custom/20 active:scale-[0.98] transition-transform flex items-center justify-center gap-2 disabled:opacity-50 disabled:active:scale-100" 
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span className="font-semibold">Signing in...</span>
                  </>
                ) : (
                  <>
                    <span className="font-semibold">Sign in to Ledger</span>
                    <span className="material-symbols-outlined text-xl">login</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Footer Toggle */}
          <div className="pt-6 border-t border-outline-variant/10 text-center">
            <p className="text-on-surface-variant text-sm font-medium">
              Don't have an account? 
              <Link className="text-primary-custom font-bold hover:underline underline-offset-8 ml-1.5" href="/register">Sign up</Link>
            </p>
          </div>

          {/* Legal/Trust Link */}
          <div className="mt-16 text-center">
            <p className="text-on-surface-variant text-[10px] uppercase tracking-[0.15em] font-bold opacity-40">
              Secure 256-bit SSL Encrypted Connection
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
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
