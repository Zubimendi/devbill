import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  MoreVertical, 
  ArrowRight, 
  Plus, 
  UserPlus, 
  Users,
  ChevronLeft,
  ChevronRight,
  TrendingDown,
  LineChart
} from "lucide-react";
import connectDB from "@/lib/mongodb";
import Invoice from "@/models/Invoice";
import Client from "@/models/Client";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

async function getDashboardData(userId: string) {
  await connectDB();

  const [invoices, clients, recentInvoices] = await Promise.all([
    Invoice.find({ userId }),
    Client.countDocuments({ userId }),
    Invoice.find({ userId })
      .sort({ createdAt: -1 })
      .limit(6)
      .populate("clientId", "name email company"),
  ]);

  const billedTotal = invoices.reduce((sum, inv) => sum + inv.total, 0);
  const paidTotal = invoices
    .filter((inv) => inv.status === "paid")
    .reduce((sum, inv) => sum + inv.total, 0);
  const pendingTotal = invoices
    .filter((inv) => inv.status === "sent")
    .reduce((sum, inv) => sum + inv.total, 0);
  const overdueTotal = invoices
    .filter((inv) => inv.status === "overdue")
    .reduce((sum, inv) => sum + inv.total, 0);

  const paidCount = invoices.filter(i => i.status === "paid").length;
  const pendingCount = invoices.filter(i => i.status === "sent").length;
  const overdueCount = invoices.filter(i => i.status === "overdue").length;

  // Simple Top Clients Logic (Top 3 by total project count/billed - for now just count)
  const clientAgg = await Invoice.aggregate([
    { $match: { userId: (userId as any) } },
    { $group: { _id: "$clientId", totalBilled: { $sum: "$total" }, projectCount: { $count: {} } } },
    { $sort: { totalBilled: -1 } },
    { $limit: 3 }
  ]);
  
  // Populate client names for the agg (manual populate since aggregate doesn't auto-populate)
  const topClients = await Promise.all(clientAgg.map(async (agg) => {
    const clientData = await Client.findById(agg._id);
    return {
      ...agg,
      name: clientData?.name || "Unknown",
      email: clientData?.email,
      company: clientData?.company
    };
  }));

  return {
    billedTotal,
    paidTotal,
    pendingTotal,
    overdueTotal,
    paidCount,
    pendingCount,
    overdueCount,
    clientCount: clients,
    recentInvoices,
    topClients
  };
}

const statusStyles: Record<string, string> = {
  draft: "bg-surface-container-high text-on-surface-variant border-outline-variant/20",
  sent: "bg-primary-custom/10 text-primary-custom border-primary-custom/20",
  paid: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  overdue: "bg-destructive/10 text-destructive border-destructive/20",
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const data = await getDashboardData(session!.user.id);

  return (
    <div className="p-8 lg:p-12 max-w-[1600px] mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Editorial Header */}
      <header>
        <div className="flex items-center gap-3 mb-2">
           <div className="h-1 w-12 bg-primary-custom rounded-full" />
           <p className="text-[10px] font-black uppercase tracking-[0.3em] text-outline">Sovereign Ledger v1.0</p>
        </div>
        <h1 className="text-5xl font-black tracking-tighter text-on-surface uppercase italic">Financial Overview</h1>
        <p className="text-on-surface-variant/60 font-semibold text-lg mt-2 italic flex items-center gap-2">
           The current state of your professional ventures. <ArrowRight className="h-4 w-4" />
        </p>
      </header>

      {/* Stats Board */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Total Billed */}
        <div className="bg-surface-container-lowest p-8 rounded-[32px] border border-outline-variant/10 shadow-2xl shadow-on-surface/5 hover:-translate-y-1 transition-all group">
          <div className="flex justify-between items-start mb-6">
            <span className="text-[10px] font-black uppercase tracking-widest text-outline">Total Billed</span>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-primary-custom/10 rounded-full text-[10px] font-black text-primary-custom">
               <TrendingUp className="h-3 w-3" /> 12%
            </div>
          </div>
          <div className="text-4xl font-black tracking-tighter text-on-surface italic">${data.billedTotal.toLocaleString()}</div>
          <p className="mt-3 text-[11px] font-semibold text-outline tracking-wide opacity-40 uppercase">Across {data.clientCount} active partnerships</p>
        </div>

        {/* Paid */}
        <div className="bg-surface-container-lowest p-8 rounded-[32px] border border-outline-variant/10 shadow-2xl shadow-on-surface/5 hover:-translate-y-1 transition-all group">
          <div className="flex justify-between items-start mb-6">
            <span className="text-[10px] font-black uppercase tracking-widest text-outline">Paid Ledger</span>
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
          </div>
          <div className="text-4xl font-black tracking-tighter text-emerald-600 italic animate-in fade-in zoom-in duration-1000">${data.paidTotal.toLocaleString()}</div>
          <p className="mt-3 text-[11px] font-semibold text-outline tracking-wide opacity-40 uppercase">{data.paidCount} settlements resolved</p>
        </div>

        {/* Pending */}
        <div className="bg-surface-container-lowest p-8 rounded-[32px] border border-outline-variant/10 shadow-2xl shadow-on-surface/5 hover:-translate-y-1 transition-all group">
          <div className="flex justify-between items-start mb-6">
            <span className="text-[10px] font-black uppercase tracking-widest text-outline">Outstanding</span>
            <Clock className="h-5 w-5 text-amber-500" />
          </div>
          <div className="text-4xl font-black tracking-tighter text-amber-600 italic">${data.pendingTotal.toLocaleString()}</div>
          <p className="mt-3 text-[11px] font-semibold text-outline tracking-wide opacity-40 uppercase">{data.pendingCount} await audit</p>
        </div>

        {/* Overdue */}
        <div className="bg-surface-container-lowest p-8 rounded-[32px] border border-outline-variant/15 shadow-2xl shadow-on-surface/5 hover:-translate-y-1 transition-all group">
          <div className="flex justify-between items-start mb-6">
            <span className="text-[10px] font-black uppercase tracking-widest text-outline">Risk Exposure</span>
            <AlertCircle className="h-5 w-5 text-destructive" />
          </div>
          <div className="text-4xl font-black tracking-tighter text-destructive italic animate-pulse shadow-destructive/20">${data.overdueTotal.toLocaleString()}</div>
          <p className="mt-3 text-[11px] font-semibold text-outline tracking-wide opacity-40 uppercase">{data.overdueCount} critical alerts</p>
        </div>
      </div>

      {/* Main Layout Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-4">
        
        {/* Recent Invoices Column */}
        <section className="lg:col-span-8 bg-surface-container-low/30 rounded-[40px] border border-outline-variant/10 overflow-hidden shadow-2xl shadow-on-surface/5 flex flex-col">
          <div className="p-10 flex justify-between items-center bg-white border-b border-outline-variant/5">
            <div className="space-y-1">
              <h2 className="text-2xl font-black tracking-tighter text-on-surface uppercase italic">Recent Ledger Entries</h2>
              <p className="text-xs font-semibold text-outline tracking-wide opacity-60 uppercase">The latest financial movements</p>
            </div>
            <Link href="/dashboard/invoices" className="h-10 px-6 rounded-xl bg-surface-container-low text-[10px] font-black uppercase tracking-widest hover:bg-surface-container-high transition-all flex items-center">
              Full Document Set
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low/50 border-b border-outline-variant/5">
                  <th className="px-10 py-6 text-[10px] font-black text-outline uppercase tracking-[0.2em]">Document</th>
                  <th className="px-10 py-6 text-[10px] font-black text-outline uppercase tracking-[0.2em]">Partner</th>
                  <th className="px-10 py-6 text-[10px] font-black text-outline uppercase tracking-[0.2em]">Total Amount</th>
                  <th className="px-10 py-6 text-[10px] font-black text-outline uppercase tracking-[0.2em]">Status</th>
                  <th className="px-10 py-6 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/5">
                {data.recentInvoices.map((inv: any) => (
                  <tr key={inv._id} className="hover:bg-white transition-colors group">
                    <td className="px-10 py-8">
                      <p className="font-black text-on-surface tracking-tight italic">{inv.invoiceNumber}</p>
                      <p className="text-[10px] font-semibold text-outline opacity-40 uppercase tracking-widest mt-1">Audit On {format(new Date(inv.createdAt), 'MMM dd, yyyy')}</p>
                    </td>
                    <td className="px-10 py-8">
                      <p className="text-sm font-black text-on-surface opacity-80">{inv.clientId?.name}</p>
                    </td>
                    <td className="px-10 py-8">
                      <p className="text-base font-black italic text-on-surface">${inv.total.toLocaleString()}</p>
                    </td>
                    <td className="px-10 py-8">
                      <Badge className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border shadow-sm ${statusStyles[inv.status]}`} variant="outline">
                        {inv.status}
                      </Badge>
                    </td>
                    <td className="px-10 py-8 text-right">
                      <Link href={`/dashboard/invoices/${inv._id}`} className="p-3 text-outline/40 hover:text-on-surface hover:bg-surface-container-low rounded-2xl transition-all inline-block active:scale-90">
                        <MoreVertical className="h-5 w-5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-8 bg-white/50 border-t border-outline-variant/5 flex justify-between items-center px-10">
             <p className="text-[10px] font-black uppercase tracking-widest text-outline">Page 01 of Audit Log</p>
             <div className="flex gap-2">
                <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-surface-container-low text-outline/40 disabled:opacity-20" disabled><ChevronLeft className="h-5 w-5"/></button>
                <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-surface-container-low text-on-surface hover:bg-surface-container-high transition-all"><ChevronRight className="h-5 w-5"/></button>
             </div>
          </div>
        </section>

        {/* Sidebar Info Area */}
        <aside className="lg:col-span-4 space-y-10">
          
          {/* Dashboard Quick Actions Area - Optimized for Column Width */}
          <div className="bg-white px-8 py-10 rounded-[48px] border border-outline-variant/10 shadow-[0_24px_48px_-8px_rgba(0,0,0,0.03)] animate-in fade-in slide-in-from-right-4 duration-1000">
            <h2 className="text-xl font-[900] italic tracking-tight text-on-surface uppercase mb-10">Directives</h2>
            <div className="space-y-6">
              <Link href="/dashboard/invoices/new" className="flex items-center gap-5 px-6 py-5 bg-[#f0f2ff] hover:bg-[#e8ebff] rounded-[32px] group transition-all border border-primary-custom/5">
                <div className="h-14 w-12 shrink-0 rounded-[22px] bg-[#4648d4] flex items-center justify-center text-white shadow-xl shadow-primary-custom/20 group-hover:scale-105 transition-transform duration-500">
                  <Plus className="h-6 w-6 stroke-[3px]" />
                </div>
                <span className="text-sm font-[900] uppercase tracking-[0.1em] text-[#2f2ebe]/80 leading-tight">Manifest<br/>Invoice</span>
              </Link>
              
              <Link href="/dashboard/clients/new" className="flex items-center gap-5 px-6 py-5 bg-[#f5f7f9] hover:bg-[#eaedf0] rounded-[32px] group transition-all border border-outline-variant/5">
                <div className="h-14 w-12 shrink-0 rounded-[22px] bg-[#e1e4e7] flex items-center justify-center text-on-surface/40 group-hover:scale-105 transition-transform duration-500">
                  <UserPlus className="h-6 w-6" />
                </div>
                <span className="text-sm font-[900] uppercase tracking-[0.1em] text-[#464554]/80 leading-tight">Onboard<br/>Partner</span>
              </Link>
            </div>
          </div>

          {/* Key Partner Performance */}
          <div className="bg-surface-container-lowest p-10 rounded-[40px] border border-outline-variant/10 shadow-2xl shadow-on-surface/5">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-xl font-black italic tracking-tighter text-on-surface uppercase font-black tracking-tight flex items-center gap-3">
                 Top Entities
              </h2>
              <LineChart className="h-5 w-5 text-primary-custom/40" />
            </div>
            <div className="space-y-10">
              {data.topClients.map((client, idx) => (
                <div key={idx} className="flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-surface-container-high to-surface-container-low flex items-center justify-center font-black text-sm text-on-surface shadow-inner group-hover:rotate-6 transition-transform">
                      {client.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-base font-black italic text-on-surface tracking-tight">{client.name}</p>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-outline opacity-40">{client.projectCount} Closed Deals</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-black italic tracking-tighter text-primary-custom">${client.totalBilled.toLocaleString()}</p>
                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Growth +8%</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-12 py-5 rounded-[24px] border-2 border-outline-variant/20 text-xs font-black uppercase tracking-widest text-on-surface hover:bg-surface-container-low transition-all">
               Comprehensive Audit Report
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
