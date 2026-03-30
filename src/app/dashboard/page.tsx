import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth-options";
import LogoutButton from "@/components/auth/LogoutButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutDashboard, Users, FileText, Settings } from "lucide-react";

export default function DashboardPage() {
  return sessionHandler();
}

async function sessionHandler() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-zinc-50/50 dark:bg-zinc-950">
      {/* Sidebar - Simple for MVP */}
      <aside className="w-64 border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 p-6 space-y-6">
        <div className="flex items-center gap-2 font-bold text-xl text-primary">
          <div className="h-8 w-8 bg-primary rounded-md flex items-center justify-center text-white">
            db
          </div>
          devbill
        </div>
        
        <nav className="space-y-1">
          <div className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50">
            <LayoutDashboard className="h-4 w-4 text-primary" />
            Dashboard
          </div>
          <div className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors cursor-pointer">
            <FileText className="h-4 w-4" />
            Invoices
          </div>
          <div className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors cursor-pointer">
            <Users className="h-4 w-4" />
            Clients
          </div>
          <div className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors cursor-pointer">
            <Settings className="h-4 w-4" />
            Settings
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Welcome back, {session.user?.name}
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400">
              Here is what is happening with your invoices today.
            </p>
          </div>
          <LogoutButton />
        </header>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium uppercase text-zinc-500 tracking-wider">
                Total Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$0.00</div>
              <p className="text-xs text-zinc-500">+0% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium uppercase text-zinc-500 tracking-wider">
                Invoices Sent
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-zinc-500">0 pending payment</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium uppercase text-zinc-500 tracking-wider">
                Active Clients
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-zinc-500">Add your first client</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium uppercase text-zinc-500 tracking-wider">
                Paid Invoices
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0%</div>
              <p className="text-xs text-zinc-500">Payment success rate</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
