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
    <aside className="sticky top-0 flex h-screen w-64 flex-col border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b border-zinc-200 px-6 dark:border-zinc-800">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-xs font-bold text-white dark:bg-white dark:text-zinc-900">
          db
        </div>
        <span className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          devbill
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                active
                  ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50"
                  : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-50"
              }`}
            >
              <item.icon
                className={`h-4 w-4 ${
                  active
                    ? "text-violet-600 dark:text-violet-400"
                    : ""
                }`}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="border-t border-zinc-200 p-4 dark:border-zinc-800">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-blue-500 text-xs font-bold text-white">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 truncate">
            <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-50">
              {userName}
            </p>
          </div>
        </div>
        <LogoutButton />
      </div>
    </aside>
  );
}
