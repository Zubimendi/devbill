import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, FileText, Users, TrendingUp } from "lucide-react";
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
    <div className="p-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Welcome back, {session!.user?.name}
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          Here&apos;s what&apos;s happening with your invoices today.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-zinc-200/50 dark:border-zinc-800/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-500">
              Total Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              ${stats.totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-zinc-500">From paid invoices</p>
          </CardContent>
        </Card>

        <Card className="border-zinc-200/50 dark:border-zinc-800/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-500">
              Invoices
            </CardTitle>
            <FileText className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              {stats.totalInvoices}
            </div>
            <p className="text-xs text-zinc-500">
              {stats.pendingInvoices} pending payment
            </p>
          </CardContent>
        </Card>

        <Card className="border-zinc-200/50 dark:border-zinc-800/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-500">
              Active Clients
            </CardTitle>
            <Users className="h-4 w-4 text-violet-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              {stats.activeClients}
            </div>
            <p className="text-xs text-zinc-500">
              {stats.activeClients === 0

                ? "Add your first client"
                : "Total clients"}
            </p>
          </CardContent>
        </Card>

        <Card className="border-zinc-200/50 dark:border-zinc-800/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-500">
              Payment Rate
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              {stats.paidRate}%
            </div>
            <p className="text-xs text-zinc-500">Invoices paid on time</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="mt-10">
        <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Quick Actions
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/dashboard/invoices/new"
            className="group flex items-center gap-4 rounded-xl border border-zinc-200/50 bg-white p-5 transition-all hover:border-violet-200 hover:shadow-lg hover:shadow-violet-500/5 dark:border-zinc-800/50 dark:bg-zinc-900/50 dark:hover:border-violet-800"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium text-zinc-900 dark:text-zinc-50">
                New Invoice
              </p>
              <p className="text-sm text-zinc-500">Create a new invoice</p>
            </div>
          </Link>

          <Link
            href="/dashboard/clients/new"
            className="group flex items-center gap-4 rounded-xl border border-zinc-200/50 bg-white p-5 transition-all hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/5 dark:border-zinc-800/50 dark:bg-zinc-900/50 dark:hover:border-blue-800"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium text-zinc-900 dark:text-zinc-50">
                Add Client
              </p>
              <p className="text-sm text-zinc-500">Register a new client</p>
            </div>
          </Link>

          <Link
            href="/dashboard/settings"
            className="group flex items-center gap-4 rounded-xl border border-zinc-200/50 bg-white p-5 transition-all hover:border-amber-200 hover:shadow-lg hover:shadow-amber-500/5 dark:border-zinc-800/50 dark:bg-zinc-900/50 dark:hover:border-amber-800"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium text-zinc-900 dark:text-zinc-50">
                Business Profile
              </p>
              <p className="text-sm text-zinc-500">Set up your details</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
