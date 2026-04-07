"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "@/components/auth/LogoutButton";
import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
} from "lucide-react";

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
    <aside className="sticky top-0 flex h-screen w-64 flex-col border-r border-outline-variant/15 bg-surface-container-lowest">
      {/* Premium Logo Header */}
      <div className="flex h-20 items-center gap-3 px-6 border-b border-outline-variant/10">
        <div className="w-9 h-9 bg-primary-custom rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-custom/20">
          <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance_wallet</span>
        </div>
        <span className="text-xl font-bold tracking-tight text-on-surface">
          DevBill
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1.5 px-3 py-6">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all group ${
                active
                  ? "bg-primary-custom/10 text-primary-custom shadow-sm"
                  : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
              }`}
            >
              <item.icon
                className={`h-4.5 w-4.5 transition-colors ${
                  active
                    ? "text-primary-custom"
                    : "text-outline group-hover:text-on-surface"
                }`}
              />
              <span className={active ? "font-semibold" : ""}>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Premium User Segment */}
      <div className="border-t border-outline-variant/10 p-5 bg-surface-container-low/30">
        <div className="mb-4 flex items-center gap-3 px-1">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary-custom to-primary-container font-bold text-white shadow-sm shadow-primary-custom/10">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-semibold text-on-surface">
              {userName}
            </p>
            <p className="truncate text-[10px] font-bold text-outline-variant uppercase tracking-wider">
              Ledger Admin
            </p>
          </div>
        </div>
        <LogoutButton />
      </div>
    </aside>
  );
}
