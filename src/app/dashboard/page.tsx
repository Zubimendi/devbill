import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, FileText, Users, TrendingUp, Plus, ArrowUpRight } from "lucide-react";
import connectDB from "@/lib/mongodb";
import Invoice from "@/models/Invoice";
import Client from "@/models/Client";
import Link from "next/link";

async function getDashboardStats(userId: string) {
  await connectDB();

  const [invoices, clients] = await Promise.all([
    Invoice.find({ userId }),
    Client.countDocuments({ userId }),
  ]);

  const totalRevenue = invoices
    .filter((inv: any) => inv.status === "paid")
    .reduce((sum: number, inv: any) => sum + inv.total, 0);

  const totalInvoices = invoices.length;
  const pendingInvoices = invoices.filter(
    (inv: any) => inv.status === "sent"
  ).length;
  const paidInvoices = invoices.filter(
    (inv: any) => inv.status === "paid"
  ).length;
  const paidRate =
    totalInvoices > 0 ? Math.round((paidInvoices / totalInvoices) * 100) : 0;

  return {
    totalRevenue,
    totalInvoices,
    pendingInvoices,
    activeClients: clients,
    paidRate,
  };
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const stats = await getDashboardStats(session!.user.id);

  return (
    <div className="p-8 lg:p-12">
      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-on-surface mb-2">
          Welcome back, {session!.user?.name}
        </h1>
        <p className="text-on-surface-variant font-medium">
          Here&apos;s a quick glance at your ledger&apos;s performance.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-outline-variant/15 bg-surface-container-lowest shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-outline">
              Total Revenue
            </CardTitle>
            <div className="p-2 bg-emerald-50 rounded-lg">
              <DollarSign className="h-4 w-4 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-on-surface tracking-tight">
              ${stats.totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs font-semibold text-emerald-600 mt-1">From paid invoices</p>
          </CardContent>
        </Card>

        <Card className="border-outline-variant/15 bg-surface-container-lowest shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-outline">
              All Invoices
            </CardTitle>
            <div className="p-2 bg-primary-custom/5 rounded-lg">
              <FileText className="h-4 w-4 text-primary-custom" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-on-surface tracking-tight">
              {stats.totalInvoices}
            </div>
            <p className="text-xs font-medium text-on-surface-variant mt-1">
              {stats.pendingInvoices} currently pending payment
            </p>
          </CardContent>
        </Card>

        <Card className="border-outline-variant/15 bg-surface-container-lowest shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-outline">
              Active Clients
            </CardTitle>
            <div className="p-2 bg-violet-50 rounded-lg">
              <Users className="h-4 w-4 text-violet-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-on-surface tracking-tight">
              {stats.activeClients}
            </div>
            <p className="text-xs font-medium text-on-surface-variant mt-1">
              {stats.activeClients === 0
                ? "Add your first client to start"
                : "Professional developer network"}
            </p>
          </CardContent>
        </Card>

        <Card className="border-outline-variant/15 bg-surface-container-lowest shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-outline">
              Paid Success Rate
            </CardTitle>
            <div className="p-2 bg-amber-50 rounded-lg">
              <TrendingUp className="h-4 w-4 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-on-surface tracking-tight">
              {stats.paidRate}%
            </div>
            <p className="text-xs font-medium text-on-surface-variant mt-1">Efficiency percentage</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions Panel */}
      <div className="mt-16">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-outline opacity-60">
            Quick Actions Menu
          </h2>
          <div className="h-px flex-1 bg-outline-variant/10"></div>
        </div>
        
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/dashboard/invoices/new"
            className="group relative flex flex-col items-start gap-4 rounded-2xl border border-outline-variant/15 bg-surface-container-lowest p-6 transition-all hover:scale-[1.02] active:scale-[0.98] hover:border-primary-custom/40 hover:shadow-xl hover:shadow-primary-custom/5"
          >
            <div className="flex w-full items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-custom text-white shadow-lg shadow-primary-custom/20 group-hover:rotate-6 transition-transform">
                <FileText className="h-6 w-6" />
              </div>
              <ArrowUpRight className="h-5 w-5 text-outline opacity-0 group-hover:opacity-100 transition-all" />
            </div>
            <div className="mt-2">
              <p className="text-lg font-bold text-on-surface">New Invoice</p>
              <p className="text-sm text-on-surface-variant font-medium">Generate a professional ledger entry.</p>
            </div>
          </Link>

          <Link
            href="/dashboard/clients/new"
            className="group relative flex flex-col items-start gap-4 rounded-2xl border border-outline-variant/15 bg-surface-container-lowest p-6 transition-all hover:scale-[1.02] active:scale-[0.98] hover:border-violet-400/40 hover:shadow-xl hover:shadow-violet-500/5"
          >
            <div className="flex w-full items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-lg shadow-violet-600/20 group-hover:rotate-6 transition-transform">
                <Users className="h-6 w-6" />
              </div>
              <ArrowUpRight className="h-5 w-5 text-outline opacity-0 group-hover:opacity-100 transition-all" />
            </div>
            <div className="mt-2">
              <p className="text-lg font-bold text-on-surface">Add Client</p>
              <p className="text-sm text-on-surface-variant font-medium">Register a contact to your business.</p>
            </div>
          </Link>

          <Link
            href="/dashboard/settings"
            className="group relative flex flex-col items-start gap-4 rounded-2xl border border-outline-variant/15 bg-surface-container-lowest p-6 transition-all hover:scale-[1.02] active:scale-[0.98] hover:border-amber-400/40 hover:shadow-xl hover:shadow-amber-500/5"
          >
            <div className="flex w-full items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-lg shadow-amber-500/20 group-hover:rotate-6 transition-transform">
                <Settings className="h-6 w-6" />
              </div>
              <ArrowUpRight className="h-5 w-5 text-outline opacity-0 group-hover:opacity-100 transition-all" />
            </div>
            <div className="mt-2">
              <p className="text-lg font-bold text-on-surface">Settings</p>
              <p className="text-sm text-on-surface-variant font-medium">Manage your profile and branding.</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
