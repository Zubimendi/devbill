"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Search,
  Filter,
  Plus,
  MoreVertical,
  X,
  CreditCard,
  History,
  MapPin,
  Building2,
  Mail,
  ChevronRight,
  Loader2,
  ArrowUpRight,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface Client {
  _id: string;
  name: string;
  email: string;
  company: string;
  address: string;
  phone: string;
  invoiceCount: number;
  totalBilled: number;
  lastInvoiceDate?: string;
}

interface ClientDetail extends Client {
  totalPaid: number;
  totalOutstanding: number;
  recentInvoices: any[];
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClient, setSelectedClient] = useState<ClientDetail | null>(null);
  const [drawerLoading, setDrawerLoading] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const res = await fetch("/api/clients");
      if (res.ok) {
        const data = await res.json();
        setClients(data);
      }
    } catch (error) {
      console.error("Error fetching clients:", error);
    } finally {
      setLoading(false);
    }
  };

  const openClientDetails = async (id: string) => {
    setDrawerLoading(true);
    setIsDrawerOpen(true);
    try {
      const res = await fetch(`/api/clients/${id}`);
      if (res.ok) {
        const data = await res.json();
        setSelectedClient(data);
      }
    } catch (error) {
      console.error("Error fetching client details:", error);
      toast.error("Failed to load client details");
    } finally {
      setDrawerLoading(false);
    }
  };

  const filteredClients = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative flex flex-col min-w-0 min-h-screen bg-surface overflow-x-hidden">
      {/* Page Header */}
      <section className="px-6 lg:px-12 py-12 max-w-7xl w-full mx-auto space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <h2 className="text-5xl font-black tracking-tighter text-on-surface italic">
              Clients
            </h2>
            <p className="text-on-surface-variant font-semibold text-lg opacity-70">
              Manage your professional network and revenue sources.
            </p>
          </div>
          <Link href="/dashboard/clients/new">
            <Button className="h-16 px-8 rounded-2xl font-black uppercase tracking-widest bg-gradient-to-tr from-primary-custom to-primary-container text-white shadow-2xl shadow-primary-custom/20 hover:shadow-primary-custom/40 active:scale-95 transition-all text-sm gap-3">
              <Plus className="h-5 w-5" />
              New Client
            </Button>
          </Link>
        </div>

        {/* Search/Filter Bar */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="relative flex-1 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary-custom transition-colors h-5 w-5" />
            <input
              className="w-full pl-14 pr-6 py-5 bg-surface-container-lowest border-none ring-2 ring-outline-variant/10 rounded-3xl focus:ring-primary-custom outline-none transition-all placeholder:text-on-surface-variant/50 text-base font-bold shadow-xl shadow-on-surface/5"
              placeholder="Search clients by name, email, or region..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="h-[68px] px-8 bg-surface-container-low border-none font-black uppercase tracking-widest rounded-3xl flex items-center gap-3 hover:bg-surface-container-high transition-colors text-sm shadow-xl shadow-on-surface/5">
            <Filter className="h-5 w-5" />
            Filters
          </Button>
        </div>

        {/* Client Grid */}
        {loading ? (
          <div className="flex h-[40vh] items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary-custom/40" />
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[40vh] space-y-6 bg-surface-container-low/30 rounded-[40px] border-2 border-dashed border-outline-variant/10 italic">
            <Users className="h-16 w-16 text-outline opacity-20" />
            <p className="text-xl font-black text-outline opacity-50">No clients matched your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredClients.map((client) => (
              <div
                key={client._id}
                onClick={() => openClientDetails(client._id)}
                className="group bg-surface-container-lowest rounded-3xl p-8 shadow-2xl shadow-on-surface/5 border border-outline-variant/10 hover:border-primary-custom/30 hover:-translate-y-1 transition-all duration-500 cursor-pointer flex flex-col"
              >
                <div className="flex items-start justify-between mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-primary-custom/10 text-primary-custom flex items-center justify-center text-2xl font-black">
                    {client.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-[10px] text-on-surface-variant uppercase font-black tracking-[0.2em] opacity-40">Total Billed</p>
                    <p className="text-2xl font-black text-on-surface tracking-tighter">
                      ${client.totalBilled.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
                <div className="mb-8 flex-1 space-y-2">
                  <h3 className="text-2xl font-black text-on-surface tracking-tighter italic">
                    {client.name}
                  </h3>
                  <p className="text-on-surface-variant font-bold opacity-60 truncate">
                    {client.email}
                  </p>
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="bg-surface-container-low/40 p-4 rounded-2xl space-y-1">
                      <p className="text-[9px] text-on-surface-variant font-black uppercase tracking-widest opacity-40">Company</p>
                      <p className="text-xs font-black truncate">{client.company || "Individual"}</p>
                    </div>
                    <div className="bg-surface-container-low/40 p-4 rounded-2xl space-y-1">
                      <p className="text-[9px] text-on-surface-variant font-black uppercase tracking-widest opacity-40">Projects</p>
                      <p className="text-xs font-black">{client.invoiceCount} invoices</p>
                    </div>
                  </div>
                </div>
                <div className="pt-6 border-t border-outline-variant/5 flex items-center justify-between">
                  {client.lastInvoiceDate ? (
                    <p className="text-[10px] text-on-surface-variant font-black uppercase tracking-widest italic opacity-40">
                      Last: {format(new Date(client.lastInvoiceDate), "MMM dd, yyyy")}
                    </p>
                  ) : (
                    <p className="text-[10px] text-on-surface-variant font-black uppercase tracking-widest italic opacity-40">New Client</p>
                  )}
                  <div className="flex gap-6">
                    <button className="text-sm font-black text-primary-custom uppercase tracking-widest hover:underline">View Detail</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Contextual Detail Drawer (Overlayed) */}
      <div
        className={`fixed inset-y-0 right-0 w-full max-w-2xl bg-white shadow-[0_0_100px_rgba(0,0,0,0.1)] z-[100] flex flex-col border-l border-outline-variant/20 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {isDrawerOpen && (
          <div className="h-full flex flex-col">
            <div className="p-10 border-b border-outline-variant/5 flex justify-between items-start">
              {drawerLoading ? (
                <div className="flex items-center gap-4 animate-pulse">
                  <div className="w-16 h-16 rounded-2xl bg-surface-container-low" />
                  <div className="space-y-2">
                    <div className="h-6 w-48 bg-surface-container-low rounded" />
                    <div className="h-4 w-24 bg-surface-container-low rounded" />
                  </div>
                </div>
              ) : selectedClient && (
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-3xl bg-primary-custom/10 text-primary-custom flex items-center justify-center text-3xl font-black">
                    {selectedClient.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-3xl font-black text-on-surface tracking-tighter italic">
                      {selectedClient.name}
                    </h2>
                    <Badge variant="secondary" className="bg-tertiary-container/10 text-on-tertiary-fixed-variant border-none font-black uppercase tracking-widest px-3 py-1 text-[10px]">
                      Active Client
                    </Badge>
                  </div>
                </div>
              )}
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-3 hover:bg-surface-container-low rounded-2xl transition-all group active:scale-95"
              >
                <X className="h-6 w-6 text-on-surface-variant group-hover:rotate-90 transition-transform duration-300" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar p-10 space-y-12">
              {drawerLoading ? (
                <div className="space-y-10">
                  <div className="grid grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-28 bg-surface-container-low rounded-3xl animate-pulse" />
                    ))}
                  </div>
                  <div className="h-64 bg-surface-container-low rounded-[40px] animate-pulse" />
                </div>
              ) : selectedClient && (
                <>
                  <div className="grid grid-cols-3 gap-6">
                    <div className="bg-surface-container-low/30 p-6 rounded-3xl space-y-2 border border-outline-variant/10">
                      <p className="text-[10px] text-on-surface-variant font-black uppercase tracking-[0.2em] opacity-40">Billed</p>
                      <p className="text-2xl font-black text-on-surface tracking-tighter">${(selectedClient.totalBilled / 1000).toFixed(1)}k</p>
                    </div>
                    <div className="bg-tertiary-container/5 p-6 rounded-3xl space-y-2 border border-tertiary-container/10">
                      <p className="text-[10px] text-on-tertiary-fixed-variant font-black uppercase tracking-[0.2em] opacity-40">Paid</p>
                      <p className="text-2xl font-black text-tertiary tracking-tighter">${(selectedClient.totalPaid / 1000).toFixed(1)}k</p>
                    </div>
                    <div className="bg-error-container/10 p-6 rounded-3xl space-y-2 border border-error-container/20">
                      <p className="text-[10px] text-on-error-container font-black uppercase tracking-[0.2em] opacity-40">Due</p>
                      <p className="text-2xl font-black text-error tracking-tighter">${(selectedClient.totalOutstanding / 1000).toFixed(1)}k</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-on-surface-variant opacity-40 italic">Client Portfolio Data</h3>
                    <div className="grid grid-cols-2 gap-8 ring-1 ring-outline-variant/10 p-8 rounded-[40px] bg-surface-container-lowest shadow-2xl shadow-on-surface/5">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-outline uppercase tracking-[0.2em]">Primary Representative</label>
                        <p className="text-base font-black italic">{selectedClient.name}</p>
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-outline uppercase tracking-[0.2em]">Contact Email</label>
                        <p className="text-base font-black">{selectedClient.email}</p>
                      </div>
                      <div className="space-y-3 col-span-2">
                        <label className="text-[10px] font-black text-outline uppercase tracking-[0.2em]">Billing Location</label>
                        <p className="text-base font-black leading-relaxed opacity-70">
                          {selectedClient.address || "No address provided"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div className="flex items-center justify-between">
                      <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-on-surface-variant opacity-40 italic">Recent Project History</h3>
                      <Link href={`/dashboard/invoices?client=${selectedClient._id}`}>
                        <Button variant="link" className="text-xs font-black uppercase tracking-widest text-primary-custom group flex items-center gap-2">
                          View Ledger <ArrowUpRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </Button>
                      </Link>
                    </div>
                    <div className="space-y-4">
                      {selectedClient.recentInvoices.length === 0 ? (
                        <p className="text-sm font-bold opacity-30 italic text-center py-10">No invoices generated yet.</p>
                      ) : (
                        selectedClient.recentInvoices.map((inv: any) => (
                          <div
                            key={inv._id}
                            className="flex items-center justify-between p-6 bg-surface-container-low/20 hover:bg-surface-container-low/50 rounded-3xl group transition-all cursor-pointer border border-outline-variant/5"
                          >
                            <div className="flex items-center gap-5">
                              <div className="w-12 h-12 rounded-2xl bg-surface-container-lowest shadow-sm flex items-center justify-center ring-1 ring-outline-variant/10">
                                <History className="h-5 w-5 text-on-surface-variant opacity-40" />
                              </div>
                              <div>
                                <p className="text-sm font-black uppercase tracking-tighter">#{inv.invoiceNumber}</p>
                                <p className="text-[10px] font-black uppercase tracking-widest opacity-40">
                                  {format(new Date(inv.createdAt), "MMM dd, yyyy")}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-8">
                              <div className="text-right">
                                <p className="text-base font-black tracking-tight">${inv.total.toLocaleString()}</p>
                                <p className={`text-[9px] font-black uppercase tracking-[0.2em] ${
                                  inv.status === 'paid' ? 'text-on-tertiary-fixed-variant' :
                                  inv.status === 'overdue' ? 'text-error' : 'text-on-surface-variant'
                                }`}>
                                  {inv.status}
                                </p>
                              </div>
                              <ChevronRight className="h-5 w-5 text-on-surface-variant opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0" />
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="p-10 bg-surface-container-low/30 border-t border-outline-variant/5 flex gap-6">
              <Button
                className="flex-1 h-16 rounded-[24px] font-black uppercase tracking-widest bg-gradient-to-tr from-primary-custom to-primary-container text-white shadow-2xl shadow-primary-custom/20 active:scale-95 transition-all"
                disabled={drawerLoading}
              >
                Edit Records
              </Button>
              <Button
                variant="outline"
                className="h-16 px-10 rounded-[24px] font-black uppercase tracking-widest border-outline-variant/20 hover:bg-error/5 hover:text-error hover:border-error/20 transition-all"
                disabled={drawerLoading}
              >
                Archive
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Drawer Overlay Backdrop */}
      {isDrawerOpen && (
        <div
          onClick={() => setIsDrawerOpen(false)}
          className="fixed inset-0 bg-on-surface/20 backdrop-blur-sm z-[90] transition-opacity duration-700 animate-in fade-in"
        />
      )}
    </div>
  );
}
