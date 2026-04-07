import Link from "next/link";
import { 
  ArrowRight, 
  PlayCircle, 
  CheckCircle2, 
  ChevronRight, 
  FileText, 
  Users, 
  Activity, 
  ShieldCheck 
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-surface selection:bg-primary-custom/10 selection:text-primary-custom">
      {/* TopNavBar */}
      <header className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-outline-variant/10">
        <nav className="flex justify-between items-center px-6 md:px-12 py-5 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
             <div className="w-9 h-9 bg-primary-custom rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-custom/20">
                <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance_wallet</span>
             </div>
             <span className="text-2xl font-bold tracking-tight text-on-surface">DevBill</span>
          </div>
          
          <div className="hidden md:flex items-center gap-10 font-medium text-sm tracking-tight text-on-surface-variant/80">
            <a className="hover:text-primary-custom transition-all" href="#features">Features</a>
            <a className="hover:text-primary-custom transition-all" href="#pricing">Pricing</a>
            <a className="hover:text-primary-custom transition-all" href="#about">About</a>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" className="hidden sm:block text-sm font-bold text-on-surface-variant hover:text-primary-custom px-4 py-2 transition-all">
              Login
            </Link>
            <Link href="/register" className="bg-primary-custom text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-primary-custom/20 hover:shadow-xl hover:shadow-primary-custom/30 active:scale-95 transition-all">
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      <main>
        {/* Hero Section */}
        <section className="pt-40 pb-24 px-6 md:px-12 max-w-7xl mx-auto overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-10">
              <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-primary-custom/5 text-primary-custom text-[10px] font-bold uppercase tracking-[0.2em] rounded-full border border-primary-custom/10">
                <span className="w-2 h-2 bg-primary-custom rounded-full animate-pulse"></span>
                Precision Curator
              </div>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.05] text-on-surface">
                Professional Invoicing for the <span className="text-primary-custom/90 italic">Sovereign</span> Freelancer.
              </h1>
              <p className="text-lg md:text-xl text-on-surface-variant font-medium leading-relaxed max-w-xl">
                Create beautiful invoices, track payment status, and get paid faster with the industry's cleanest billing tool. Built for the business of one.
              </p>
              <div className="flex flex-wrap gap-5 pt-4">
                <Link href="/register" className="px-10 py-5 bg-primary-custom text-white font-bold rounded-2xl shadow-2xl shadow-primary-custom/20 hover:shadow-primary-custom/30 active:scale-95 transition-all flex items-center gap-3">
                  Start for free
                  <ChevronRight className="h-5 w-5" />
                </Link>
                <button className="px-10 py-5 bg-surface-container-high/50 text-on-surface font-bold rounded-2xl active:scale-95 transition-all flex items-center gap-3 group">
                  <PlayCircle className="h-6 w-6 text-primary-custom/60 group-hover:text-primary-custom transition-colors" />
                  Watch Demo
                </button>
              </div>
            </div>
            
            <div className="relative lg:ml-8">
              <div className="absolute -inset-10 bg-primary-custom/10 rounded-[3rem] blur-[100px]"></div>
              <div className="relative bg-surface-container-lowest border border-outline-variant/15 rounded-[2.5rem] shadow-2xl shadow-surface-variant/20 overflow-hidden">
                <img 
                  alt="Dashboard Preview" 
                  className="w-full h-auto object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCfaNVAyVW8HJqIwuiB2IsSjfkLMD2TVXc_E96T3wP939-_ALRNarGFfURGDM1DGJViETEQcimrSjyG4rmIxWfTxAwZDjJLBq7cHR0qNAT97oW0JDW4aErTFy9p-radzhwOLxp5CgZw3X318t2Kj3urDuzvvLZnuOw5HMI6xbbyNof8ZvKmKITT6EP8RkHS58XXFTLCUpgp7NmIXES5eq38FipB_Djh_DJF6d5S5_VvEmgWWL0rfurlK72Rq3KgZhAK2IFenMQIKc9L"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="py-16 bg-surface-container-low/50 border-y border-outline-variant/15">
          <div className="max-w-7xl mx-auto px-6">
            <p className="text-center text-[10px] font-bold text-outline opacity-70 mb-12 tracking-[0.3em] uppercase">Trusted by 2,000+ modern freelancers</p>
            <div className="flex flex-wrap justify-between items-center gap-12 grayscale opacity-40">
              <span className="text-xl md:text-2xl font-black italic tracking-tighter">TECHCORP</span>
              <span className="text-xl md:text-2xl font-black italic tracking-tighter">DESIGNFLOW</span>
              <span className="text-xl md:text-2xl font-black italic tracking-tighter">PIXELMIND</span>
              <span className="text-xl md:text-2xl font-black italic tracking-tighter">CODEBASE</span>
              <span className="text-xl md:text-2xl font-black italic tracking-tighter">FREELANCEOS</span>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-32 px-6 md:px-12 max-w-7xl mx-auto" id="features">
          <div className="text-center mb-24 space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-on-surface">Built for the Business of One.</h2>
            <div className="h-1.5 w-20 bg-primary-custom mx-auto rounded-full shadow-lg shadow-primary-custom/40"></div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-10">
            <div className="p-12 bg-surface-container-lowest border border-outline-variant/15 rounded-[2.5rem] transition-all hover:bg-surface-container-low transition-colors group">
              <div className="w-16 h-16 bg-primary-custom/10 text-primary-custom rounded-2xl flex items-center justify-center mb-10 group-hover:bg-primary-custom group-hover:text-white transition-all shadow-sm">
                <FileText className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold mb-5 tracking-tight text-on-surface">Precision Invoicing</h3>
              <p className="text-on-surface-variant font-medium leading-relaxed">Create A4-style professional documents in seconds. Editorial-grade layout for your technical services.</p>
            </div>
            
            <div className="p-12 bg-surface-container-lowest border border-outline-variant/15 rounded-[2.5rem] transition-all hover:bg-surface-container-low transition-colors group">
               <div className="w-16 h-16 bg-primary-custom/10 text-primary-custom rounded-2xl flex items-center justify-center mb-10 group-hover:bg-primary-custom group-hover:text-white transition-all shadow-sm">
                <Activity className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold mb-5 tracking-tight text-on-surface">Automated Tracking</h3>
              <p className="text-on-surface-variant font-medium leading-relaxed">Never wonder about a payment status again. Smart notifications for views, due dates, and deposits.</p>
            </div>
            
            <div className="p-12 bg-surface-container-lowest border border-outline-variant/15 rounded-[2.5rem] transition-all hover:bg-surface-container-low transition-colors group">
               <div className="w-16 h-16 bg-primary-custom/10 text-primary-custom rounded-2xl flex items-center justify-center mb-10 group-hover:bg-primary-custom group-hover:text-white transition-all shadow-sm">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold mb-5 tracking-tight text-on-surface">Client Management</h3>
              <p className="text-on-surface-variant font-medium leading-relaxed">A CRM built for your billables. Manage contracts, client details, and payment histories in one place.</p>
            </div>
          </div>
        </section>

        {/* Preview Section */}
        <section className="py-32 bg-primary-custom overflow-hidden relative">
          <div className="max-w-7xl mx-auto px-6 md:px-12 grid lg:grid-cols-5 gap-20 items-center relative z-10">
            <div className="lg:col-span-2 text-white">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-10 leading-tight">The Cleanest Invoice You've Ever Seen.</h2>
              <ul className="space-y-8">
                <li className="flex gap-4 items-center">
                  <div className="bg-white/20 p-1.5 rounded-full"><CheckCircle2 className="h-5 w-5" /></div>
                  <span className="text-lg font-medium opacity-90 tracking-tight">Custom brand colors & logo integration.</span>
                </li>
                <li className="flex gap-4 items-center">
                  <div className="bg-white/20 p-1.5 rounded-full"><CheckCircle2 className="h-5 w-5" /></div>
                  <span className="text-lg font-medium opacity-90 tracking-tight">One-click online payment options.</span>
                </li>
                <li className="flex gap-4 items-center">
                  <div className="bg-white/20 p-1.5 rounded-full"><CheckCircle2 className="h-5 w-5" /></div>
                  <span className="text-lg font-medium opacity-90 tracking-tight">Automatic PDF generation and archival.</span>
                </li>
              </ul>
            </div>
            
            <div className="lg:col-span-3">
              <div className="bg-white rounded-[2.5rem] shadow-2xl p-10 md:p-16 transform lg:rotate-2 hover:rotate-0 transition-transform duration-700">
                <div className="flex justify-between items-start mb-20">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white"><span className="material-symbols-outlined text-sm">account_balance_wallet</span></div>
                    <div>
                      <h4 className="text-xl font-bold text-on-surface tracking-tight">DevBill</h4>
                      <p className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant/60">Precision Ledger</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="bg-emerald-500/10 text-emerald-600 px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest border border-emerald-500/20">PAID</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-12 mb-16">
                  <div>
                    <p className="text-[9px] font-bold text-outline uppercase tracking-widest mb-3">Bill To</p>
                    <p className="font-bold text-on-surface text-lg">Starlight Ventures</p>
                    <p className="text-sm font-medium text-on-surface-variant/70">San Francisco, CA</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-bold text-outline uppercase tracking-widest mb-3">Invoice #</p>
                    <p className="font-bold text-on-surface text-lg">INV-2026-001</p>
                    <p className="text-sm font-medium text-on-surface-variant/70">Oct 12, 2026</p>
                  </div>
                </div>

                <div className="border-y border-outline-variant/10 py-8 mb-10">
                  <div className="flex justify-between font-bold text-[9px] tracking-widest text-outline uppercase mb-6">
                    <span>DESCRIPTION</span>
                    <span>TOTAL</span>
                  </div>
                  <div className="flex justify-between items-center py-5 border-b border-outline-variant/5">
                    <span className="font-semibold text-on-surface">Full-Stack Development - Sprint 12</span>
                    <span className="font-bold text-on-surface">$4,500.00</span>
                  </div>
                  <div className="flex justify-between items-center py-5">
                    <span className="font-semibold text-on-surface-variant">UI/UX Consultation</span>
                    <span className="font-bold text-on-surface">$1,200.00</span>
                  </div>
                </div>

                <div className="flex justify-end">
                  <div className="text-right space-y-2">
                    <p className="text-[9px] font-bold text-outline uppercase tracking-widest">Amount Due</p>
                    <p className="text-5xl font-bold text-primary-custom tracking-tighter">$5,700.00</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Decorative background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[120px] -mr-48 -mt-48 pointer-events-none"></div>
        </section>

        {/* Pricing Section */}
        <section className="py-40 px-6 md:px-12 max-w-7xl mx-auto" id="pricing">
          <div className="text-center max-w-2xl mx-auto mb-24 space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-on-surface">Simple, Honest Pricing.</h2>
            <p className="text-on-surface-variant text-lg font-medium">Everything you need to run your collective business of one.</p>
          </div>
          
          <div className="max-w-xl mx-auto">
            <div className="relative p-16 bg-surface-container-lowest border border-primary-custom/20 rounded-[3rem] shadow-2xl shadow-primary-custom/5 text-center overflow-hidden">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary-custom text-white px-8 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-primary-custom/20">Most Popular</div>
              
              <div className="mb-14">
                <h3 className="text-2xl font-bold mb-6 tracking-tight text-on-surface">Pro Plan</h3>
                <div className="flex items-center justify-center gap-1">
                  <span className="text-2xl font-bold text-on-surface-variant">$</span>
                  <span className="text-7xl font-bold tracking-tighter text-on-surface">19</span>
                  <span className="text-on-surface-variant font-medium">/month</span>
                </div>
              </div>
              
              <ul className="space-y-8 mb-16 text-left max-w-xs mx-auto">
                <li className="flex items-center gap-4">
                  <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                  <span className="font-semibold text-on-surface">Unlimited Invoices</span>
                </li>
                <li className="flex items-center gap-4">
                   <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                  <span className="font-semibold text-on-surface">Custom Branding</span>
                </li>
                <li className="flex items-center gap-4">
                   <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                  <span className="font-semibold text-on-surface">Automatic Late Reminders</span>
                </li>
                <li className="flex items-center gap-4">
                   <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                  <span className="font-semibold text-on-surface">Priority Support</span>
                </li>
              </ul>
              
              <Link href="/register" className="block w-full py-6 bg-primary-custom text-white font-bold rounded-[1.5rem] shadow-xl shadow-primary-custom/20 hover:shadow-primary-custom/30 active:scale-[0.98] transition-all text-xl">
                Get Started Now
              </Link>
            </div>
          </div>
        </section>

        {/* Testimonial Section */}
        <section className="py-40 bg-surface-container-low/30 border-y border-outline-variant/10">
          <div className="max-w-4xl mx-auto px-6 text-center space-y-12">
             <div className="flex justify-center text-primary-custom/20">
               <span className="material-symbols-outlined text-8xl" style={{ fontVariationSettings: "'FILL' 1" }}>format_quote</span>
             </div>
             <blockquote className="text-3xl md:text-5xl font-bold leading-tight tracking-tight italic text-on-surface">
                "DevBill is the first invoicing tool that actually matches the quality of my work. The UI is calm, the output is beautiful, and it saves me hours every month."
             </blockquote>
             <div className="flex flex-col items-center gap-4 pt-4">
               <div className="w-20 h-20 rounded-full border-4 border-white shadow-xl overflow-hidden">
                 <img alt="Senior Developer" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDUQoAPsLIBCSKPA8r5bwGz8YJTq9LEYI-VPuNRz-m628ohWmmlIU2YYicajET32X2su5IX0fmeGvQyMGRAhvo0m1DkkJc1dmInOX9oblvBeoeq6OL7BsvUloCqrDeI0S-Up6pOHfalsJKSHXwjsrZJVz-9fYyStqFWMu0xprBTtvdWENtqugNz2UkfDH14ZtAZTwWIZJCg7rT6Dvedzm85vkfHLgjegjQoM57IoPWjs7UryR7sFnluHKJRobRvGD-kC0j__9lZ2SPh" />
               </div>
               <div>
                  <p className="font-bold text-xl text-on-surface">Marcus Thorne</p>
                  <p className="text-sm font-bold text-primary-custom/60 uppercase tracking-widest">Senior Full-Stack Developer</p>
               </div>
             </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-40 px-6 md:px-12">
          <div className="max-w-6xl mx-auto bg-gradient-to-br from-primary-custom to-primary-container rounded-[4rem] p-20 md:p-32 text-center text-white relative overflow-hidden shadow-3xl shadow-primary-custom/20">
            <div className="relative z-10 space-y-12">
              <h2 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">Ready for Financial Zen?</h2>
              <p className="text-xl md:text-2xl font-medium opacity-80 max-w-2xl mx-auto">Join thousands of high-performing freelancers who have upgraded their billing experience.</p>
              <Link href="/register" className="inline-block px-14 py-7 bg-white text-primary-custom font-bold text-2xl rounded-[2rem] shadow-2xl hover:bg-surface-bright active:scale-95 transition-all">
                Get Started Now
              </Link>
            </div>
            {/* Background decor */}
            <div className="absolute -bottom-24 -left-24 w-[30rem] h-[30rem] bg-white/5 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute -top-24 -right-24 w-[30rem] h-[30rem] bg-black/5 rounded-full blur-[100px] pointer-events-none"></div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-20 bg-surface-container-low/50 border-t border-outline-variant/10">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid md:grid-cols-2 justify-between items-start gap-16">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-primary-custom rounded-xl flex items-center justify-center text-white">
                  <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance_wallet</span>
               </div>
               <span className="text-2xl font-bold tracking-tight text-on-surface">DevBill</span>
            </div>
            <p className="max-w-xs font-medium text-on-surface-variant leading-relaxed">© 2026 DevBill. The Precision Curator for Freelance Finance.</p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-12 sm:gap-24">
            <div className="flex flex-col gap-6">
              <p className="font-bold text-[10px] uppercase tracking-[0.2em] text-outline opacity-60">Product</p>
              <nav className="flex flex-col gap-4 font-semibold text-sm text-on-surface-variant">
                <a className="hover:text-primary-custom transition-all" href="#">Features</a>
                <a className="hover:text-primary-custom transition-all" href="#">Pricing</a>
              </nav>
            </div>
            <div className="flex flex-col gap-6">
              <p className="font-bold text-[10px] uppercase tracking-[0.2em] text-outline opacity-60">Company</p>
              <nav className="flex flex-col gap-4 font-semibold text-sm text-on-surface-variant">
                <a className="hover:text-primary-custom transition-all" href="#">About</a>
                <a className="hover:text-primary-custom transition-all" href="#">Privacy</a>
              </nav>
            </div>
            <div className="flex flex-col gap-6">
              <p className="font-bold text-[10px] uppercase tracking-[0.2em] text-outline opacity-60">Legal</p>
              <nav className="flex flex-col gap-4 font-semibold text-sm text-on-surface-variant">
                <a className="hover:text-primary-custom transition-all" href="#">Terms</a>
              </nav>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
