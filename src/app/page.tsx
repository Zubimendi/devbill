import Link from "next/link";
import { FileText, Users, Zap, Shield, ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-zinc-200/50 bg-white/80 backdrop-blur-xl dark:border-zinc-800/50 dark:bg-zinc-950/80">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-xs font-bold text-white dark:bg-white dark:text-zinc-900">
              db
            </div>
            <span className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              devbill
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-zinc-800 hover:shadow-lg hover:shadow-zinc-900/20 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Gradient orbs */}
        <div className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-40 top-20 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="mx-auto max-w-6xl px-6 pb-24 pt-20 md:pb-32 md:pt-28">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/60 px-4 py-1.5 text-sm font-medium text-zinc-600 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-400">
              <Zap className="h-3.5 w-3.5 text-amber-500" />
              Built for developers, by developers
            </div>
            <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight text-zinc-900 dark:text-zinc-50 md:text-6xl lg:text-7xl">
              Invoicing that{" "}
              <span className="bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent">
                just works
              </span>
            </h1>
            <p className="mb-10 text-lg leading-relaxed text-zinc-600 dark:text-zinc-400 md:text-xl">
              Create professional invoices, track payments, and manage clients —
              all in one minimal, fast, and beautiful tool. No bloat, no
              complexity.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/register"
                className="group flex h-12 items-center gap-2 rounded-xl bg-zinc-900 px-8 text-sm font-semibold text-white shadow-lg shadow-zinc-900/20 transition-all hover:bg-zinc-800 hover:shadow-xl hover:shadow-zinc-900/30 dark:bg-white dark:text-zinc-900 dark:shadow-white/10 dark:hover:bg-zinc-100"
              >
                Start for free
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/login"
                className="flex h-12 items-center rounded-xl border border-zinc-200 bg-white px-8 text-sm font-semibold text-zinc-700 transition-all hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:bg-zinc-800"
              >
                Sign in to dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-zinc-200/50 bg-white dark:border-zinc-800/50 dark:bg-zinc-900/30">
        <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 md:text-4xl">
              Everything you need to get paid
            </h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-400">
              Simple, focused tools that help you spend less time on paperwork.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: FileText,
                title: "Invoice Builder",
                desc: "Create clean, professional invoices with line items, taxes, and custom notes in seconds.",
                gradient: "from-violet-500 to-purple-600",
              },
              {
                icon: Users,
                title: "Client Manager",
                desc: "Keep all your client details organized. Link invoices and track payment history.",
                gradient: "from-blue-500 to-cyan-500",
              },
              {
                icon: Zap,
                title: "PDF Export",
                desc: "Generate beautiful PDF invoices ready to send. Professional formatting built in.",
                gradient: "from-amber-500 to-orange-500",
              },
              {
                icon: Shield,
                title: "Secure & Private",
                desc: "Your data stays yours. Secure authentication and encrypted connections.",
                gradient: "from-emerald-500 to-teal-500",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="group rounded-2xl border border-zinc-200/50 bg-zinc-50/50 p-6 transition-all hover:border-zinc-300/50 hover:bg-white hover:shadow-lg hover:shadow-zinc-200/50 dark:border-zinc-800/50 dark:bg-zinc-900/50 dark:hover:border-zinc-700/50 dark:hover:bg-zinc-900 dark:hover:shadow-zinc-900/50"
              >
                <div
                  className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${feature.gradient} text-white shadow-lg shadow-${feature.gradient.split(" ")[0]}/20`}
                >
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-zinc-200/50 dark:border-zinc-800/50">
        <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
          <div className="relative overflow-hidden rounded-3xl bg-zinc-900 px-8 py-16 text-center dark:bg-zinc-800 md:px-16">
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-violet-500/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-cyan-500/20 blur-3xl" />
            <div className="relative">
              <h2 className="mb-4 text-3xl font-bold tracking-tight text-white md:text-4xl">
                Ready to simplify your invoicing?
              </h2>
              <p className="mb-8 text-lg text-zinc-400">
                Join developers who spend less time on billing and more time
                building.
              </p>
              <Link
                href="/register"
                className="group inline-flex h-12 items-center gap-2 rounded-xl bg-white px-8 text-sm font-semibold text-zinc-900 transition-all hover:bg-zinc-100 hover:shadow-xl"
              >
                Create your free account
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200/50 dark:border-zinc-800/50">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-8">
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <div className="flex h-5 w-5 items-center justify-center rounded bg-zinc-900 text-[8px] font-bold text-white dark:bg-white dark:text-zinc-900">
              db
            </div>
            devbill © {new Date().getFullYear()}
          </div>
          <div className="flex gap-6 text-sm text-zinc-500">
            <Link
              href="/login"
              className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-300"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-300"
            >
              Register
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
