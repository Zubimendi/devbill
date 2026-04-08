"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "@/components/auth/LogoutButton";
import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  Plus,
  HelpCircle,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Invoices",
    href: "/dashboard/invoices",
    icon: FileText,
  },
  {
    label: "Clients",
    href: "/dashboard/clients",
    icon: Users,
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export function DashboardSidebar({ userName }: { userName: string }) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <aside className="sticky top-0 hidden h-screen w-64 flex-col border-r border-outline-variant/10 bg-surface-container-low lg:flex">
      {/* Editorial Header Section */}
      <div className="flex flex-col gap-1 px-6 py-10">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-custom text-white shadow-lg shadow-primary-custom/20">
            <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance</span>
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tighter text-on-surface italic uppercase">DevBill</h1>
            <p className="text-[10px] font-black tracking-[0.2em] text-outline uppercase opacity-60">The Sovereign Ledger</p>
          </div>
        </div>
      </div>

      {/* Primary Navigation Tabs */}
      <nav className="flex-1 space-y-1 px-4">
        {navItems.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-4 rounded-xl px-4 py-3 text-sm transition-all duration-300 group hover:translate-x-1 ${
                active
                  ? "bg-primary-custom/10 text-primary-custom font-black"
                  : "text-on-surface-variant font-bold hover:bg-surface-container-high hover:text-on-surface"
              }`}
            >
              <Icon
                className={`h-5 w-5 transition-all ${
                  active ? "fill-primary-custom/20 stroke-[3px]" : "stroke-[2.5px] opacity-40 group-hover:opacity-100"
                }`}
              />
              <span className="tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Action Suite & Footer */}
      <div className="mt-auto flex flex-col gap-1 border-t border-outline-variant/10 p-5">
        <Link href="/dashboard/invoices/new" className="mb-6">
          <Button className="h-14 w-full gap-3 rounded-[20px] bg-gradient-to-tr from-primary-custom to-primary-container font-black text-sm uppercase tracking-widest text-white shadow-2xl shadow-primary-custom/20 transition-all hover:shadow-primary-custom/40 active:scale-95">
            <Plus className="h-5 w-5 stroke-[4px]" aria-hidden="true" />
            <span>New Invoice</span>
          </Button>
        </Link>
        
        <Link 
          href="/dashboard/support"
          className="flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-bold text-on-surface-variant transition-all hover:bg-surface-container-high hover:text-on-surface"
        >
          <HelpCircle className="h-5 w-5 stroke-[2.5px] opacity-40" />
          <span>Support</span>
        </Link>

        {/* Custom Logout UI inspired by the design */}
        <div className="mt-2 group">
           <LogoutButton />
        </div>
      </div>
    </aside>
  );
}
