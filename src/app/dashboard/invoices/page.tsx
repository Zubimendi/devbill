"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  Loader2,
  Search,
  Download,
  MoreVertical,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Bell,
  SearchIcon,
  Filter,
} from "lucide-react";
import { format } from "date-fns";

interface Invoice {
  _id: string;
  invoiceNumber: string;
  clientId: {
    _id: string;
    name: string;
    email: string;
    company: string;
  };
  total: number;
  status: "draft" | "sent" | "paid" | "overdue";
  dueDate: string;
  createdAt: string;
}

const statusStyles: Record<string, string> = {
  draft: "bg-surface-container-highest text-on-surface-variant/70 border-outline-variant/30",
  sent: "bg-primary-custom/10 text-primary-custom border-primary-custom/20",
  paid: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  overdue: "bg-error/10 text-error border-error/20",
};

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    fetchInvoices();
  }, []);

  useEffect(() => {
    handleFiltering();
  }, [invoices, searchQuery, statusFilter, sortBy]);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/invoices");
      if (res.ok) {
        const data = await res.json();
        setInvoices(data);
      }
    } catch (error) {
      console.error("Error fetching invoices:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFiltering = () => {
    let result = [...invoices];

    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (inv) =>
          inv.invoiceNumber.toLowerCase().includes(q) ||
          inv.clientId?.name.toLowerCase().includes(q) ||
          inv.clientId?.company?.toLowerCase().includes(q)
      );
    }

    // Status
    if (statusFilter !== "all") {
      result = result.filter((inv) => inv.status === statusFilter);
    }

    // Sort
    if (sortBy === "newest") {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === "oldest") {
      result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else if (sortBy === "highest") {
      result.sort((a, b) => b.total - a.total);
    } else if (sortBy === "lowest") {
      result.sort((a, b) => a.total - b.total);
    }

    setFilteredInvoices(result);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f7f9fb]">
      {/* Search and Top Bar */}
      <header className="bg-white/80 backdrop-blur-xl sticky top-0 z-50 border-b border-outline-variant/10">
        <div className="flex justify-between items-center px-8 py-4">
          <div className="hidden lg:flex items-center bg-surface-container-low rounded-2xl px-4 py-2 w-[450px] border border-transparent focus-within:border-primary-custom/20 focus-within:bg-white transition-all">
            <SearchIcon className="h-4 w-4 text-outline opacity-40" />
            <input 
              type="text" 
              placeholder="Search invoices, clients, or ID..." 
              className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-outline/40 font-semibold"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2 text-outline hover:bg-surface-container-low rounded-full transition-all">
              <Bell className="h-6 w-6" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary-custom rounded-full ring-2 ring-white"></span>
            </button>
            <div className="h-8 w-px bg-outline-variant/20" />
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-on-surface leading-tight">Alex Sterling</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-outline">Lead Architect</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-primary-custom/10 flex items-center justify-center font-black text-primary-custom shadow-sm">
                AS
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-8 lg:p-12 max-w-[1600px] w-full mx-auto space-y-10">
        {/* Page Title and Actions */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-black tracking-tighter text-on-surface uppercase italic">Portfolio Invoices</h1>
            <p className="text-on-surface-variant/60 font-semibold text-lg">Manage the financial integrity of your sovereign ventures.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" className="h-12 px-6 rounded-xl font-black uppercase tracking-widest text-xs gap-2 hover:bg-surface-container-low">
              <Download className="h-4 w-4" /> Export CSV
            </Button>
            <Link href="/dashboard/invoices/new">
              <Button className="h-12 px-8 rounded-xl font-black uppercase tracking-widest text-xs bg-gradient-to-tr from-primary-custom to-primary-container text-white shadow-xl shadow-primary-custom/20 hover:shadow-primary-custom/40 active:scale-95 transition-all">
                <Plus className="h-4 w-4" /> New Invoice
              </Button>
            </Link>
          </div>
        </div>

        {/* Filter Suite */}
        <div className="bg-surface-container-low/30 p-4 rounded-2xl border border-outline-variant/10 flex flex-wrap items-center gap-6">
          <div className="flex-1 min-w-[300px] relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-outline/40" />
            <input 
              type="text"
              placeholder="Filter by ID or Client..."
              className="w-full bg-white border-none rounded-xl pl-12 pr-4 py-3 text-sm font-semibold focus:ring-2 focus:ring-primary-custom/10 placeholder:text-outline/30 shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3">
            <label className="text-[9px] font-black text-outline uppercase tracking-widest">Status</label>
            <select 
              className="bg-white border-none rounded-xl py-3 pl-4 pr-10 text-xs font-black uppercase tracking-widest focus:ring-2 focus:ring-primary-custom/10 cursor-pointer shadow-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Ledgers</option>
              <option value="paid">Paid</option>
              <option value="sent">Sent</option>
              <option value="overdue">Overdue</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-[9px] font-black text-outline uppercase tracking-widest">Sort</label>
            <select 
              className="bg-white border-none rounded-xl py-3 pl-4 pr-10 text-xs font-black uppercase tracking-widest focus:ring-2 focus:ring-primary-custom/10 cursor-pointer shadow-sm"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Amount: High to Low</option>
              <option value="lowest">Amount: Low to High</option>
            </select>
          </div>

          <Button variant="ghost" className="h-12 px-4 rounded-xl gap-3 text-outline hover:bg-white hover:text-on-surface transition-all group">
             <Calendar className="h-4 w-4 opacity-40 group-hover:opacity-100" />
             <span className="text-xs font-black uppercase tracking-widest">Last 30 Days</span>
          </Button>
        </div>

        {/* Invoice Table Container */}
        <div className="bg-white rounded-[32px] border border-outline-variant/10 shadow-2xl shadow-on-surface/5 overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-1000">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-surface-container-low/20 border-b border-outline-variant/5">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-12 px-6 py-6"><input type="checkbox" className="rounded-md border-outline-variant/30 text-primary-custom focus:ring-primary-custom" /></TableHead>
                  <TableHead className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-outline">Invoice #</TableHead>
                  <TableHead className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-outline">Client Portfolio</TableHead>
                  <TableHead className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-outline">Total Amount</TableHead>
                  <TableHead className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-outline">Issued Date</TableHead>
                  <TableHead className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-outline text-center">Status</TableHead>
                  <TableHead className="px-6 py-6 text-right w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-64 text-center">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary-custom/40" />
                    </TableCell>
                  </TableRow>
                ) : filteredInvoices.length === 0 ? (
                  <TableRow>
                     <TableCell colSpan={7} className="h-96 text-center">
                        <div className="max-w-xs mx-auto space-y-4 py-12">
                           <div className="w-20 h-20 bg-surface-container-low rounded-3xl flex items-center justify-center mx-auto text-outline/20">
                              <Plus className="h-10 w-10" />
                           </div>
                           <h3 className="text-xl font-black text-on-surface uppercase tracking-tight italic">No Ledgers Found</h3>
                           <p className="text-sm font-semibold text-outline opacity-60 leading-relaxed">Refine your search parameters or manifest a new invoice for a client.</p>
                           <Link href="/dashboard/invoices/new">
                            <Button className="mt-4 bg-primary-custom text-white font-black uppercase tracking-widest text-[10px] h-10 px-6 rounded-xl">Manifest First Ledger</Button>
                           </Link>
                        </div>
                     </TableCell>
                  </TableRow>
                ) : (
                  filteredInvoices.map((inv) => (
                    <TableRow key={inv._id} className="group hover:bg-surface-container-low/10 transition-colors border-b border-outline-variant/5">
                      <TableCell className="px-6 py-6"><input type="checkbox" className="rounded-md border-outline-variant/30 text-primary-custom focus:ring-primary-custom" /></TableCell>
                      <TableCell className="px-6 py-6">
                        <Link href={`/dashboard/invoices/${inv._id}`} className="block">
                          <span className="text-sm font-black text-on-surface tracking-tight group-hover:text-primary-custom transition-colors">{inv.invoiceNumber}</span>
                          <p className="text-[10px] font-black uppercase tracking-[0.1em] text-outline opacity-40 mt-1">Audit Ready</p>
                        </Link>
                      </TableCell>
                      <TableCell className="px-6 py-6">
                        <div className="flex items-center gap-4">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-[10px] font-black tracking-widest shadow-sm ${
                            ['Paid', 'Draft'].includes(inv.status) ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'
                          }`}>
                            {getInitials(inv.clientId?.name || "??")}
                          </div>
                          <div className="space-y-0.5">
                            <p className="text-sm font-black text-on-surface-variant italic tracking-tight">{inv.clientId?.name}</p>
                            <p className="text-[11px] font-semibold text-outline opacity-40">{inv.clientId?.company}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-6">
                        <span className="text-base font-black italic tracking-tighter text-on-surface">${inv.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                      </TableCell>
                      <TableCell className="px-6 py-6">
                        <span className="text-sm font-semibold text-on-surface-variant opacity-60 italic">{format(new Date(inv.createdAt), "MMM dd, yyyy")}</span>
                      </TableCell>
                      <TableCell className="px-6 py-6 text-center">
                        <Badge className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-sm ${statusStyles[inv.status]}`} variant="outline">
                          {inv.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-6 py-6 text-right">
                        <button className="p-3 text-outline/40 hover:text-on-surface hover:bg-surface-container-low rounded-2xl transition-all active:scale-90">
                          <MoreVertical className="h-5 w-5" />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Footer */}
          {!loading && filteredInvoices.length > 0 && (
            <div className="px-10 py-6 bg-surface-container-low/20 flex items-center justify-between border-t border-outline-variant/10">
              <p className="text-[10px] font-black uppercase tracking-[0.15em] text-outline">
                Showing <span className="text-on-surface">1</span> to <span className="text-on-surface">{filteredInvoices.length}</span> of <span className="text-on-surface">{invoices.length}</span> Ledgers
              </p>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-white text-outline disabled:opacity-20" disabled>
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <div className="flex items-center gap-1.5 px-3">
                  <button className="w-9 h-9 rounded-xl bg-primary-custom text-white text-xs font-black shadow-lg shadow-primary-custom/20">1</button>
                  <button className="w-9 h-9 rounded-xl hover:bg-white text-xs font-black text-outline transition-all">2</button>
                  <button className="w-9 h-9 rounded-xl hover:bg-white text-xs font-black text-outline transition-all hidden sm:block">3</button>
                </div>
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-white text-outline">
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
