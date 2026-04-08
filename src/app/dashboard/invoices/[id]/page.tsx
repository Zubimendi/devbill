"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Loader2,
  Send,
  CheckCircle2,
  Trash2,
  Download,
  Link2,
  Edit3,
  Mail,
  FileText,
  BadgeCheck,
  Terminal,
} from "lucide-react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { InvoicePDF } from "@/components/invoice/InvoicePDF";
import { SendInvoiceModal } from "@/components/invoice/SendInvoiceModal";
import { toast } from "sonner";
import { format } from "date-fns";

interface InvoiceData {
  _id: string;
  invoiceNumber: string;
  clientId: {
    _id: string;
    name: string;
    email: string;
    company: string;
    address: string;
    phone: string;
  };
  items: { description: string; quantity: number; rate: number; amount: number }[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  status: "draft" | "sent" | "paid" | "overdue";
  dueDate: string;
  notes: string;
  currency: string;
  secureToken: string;
  createdAt: string;
}

export default function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [invoice, setInvoice] = useState<InvoiceData | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);

  useEffect(() => {
    setIsClient(true);
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [invoiceRes, userRes] = await Promise.all([
        fetch(`/api/invoices/${id}`),
        fetch("/api/settings"),
      ]);
      if (invoiceRes.ok) setInvoice(await invoiceRes.json());
      if (userRes.ok) setUser(await userRes.json());
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus: string) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/invoices/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setInvoice(await res.json());
        toast.success(`Invoice marked as ${newStatus}`);
      }
    } catch (err) {
      toast.error("Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  const copyPublicLink = () => {
    const publicUrl = `${window.location.origin}/view/invoice/${invoice?.secureToken}`;
    navigator.clipboard.writeText(publicUrl);
    toast.success("Public link copied to clipboard!");
  };

  const deleteInvoice = async () => {
    if (!confirm("Are you sure? This will permanently delete the invoice data.")) return;
    try {
      const res = await fetch(`/api/invoices/${id}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/dashboard/invoices");
        toast.success("Invoice deleted from ledger");
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary-custom/40" />
      </div>
    );
  }

  if (!invoice) return <div className="p-20 text-center">Invoice not found.</div>;

  return (
    <div className="min-h-screen bg-[#f7f9fb] pb-40">
      {/* Top Breadcrumb Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-outline-variant/10 px-8 py-4 sticky top-0 z-40">
        <div className="max-w-[1200px] mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
             <Link href="/dashboard/invoices" className="h-10 w-10 rounded-full bg-surface-container-low flex items-center justify-center hover:bg-surface-container-high transition-all group">
                <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
             </Link>
             <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-outline">Back to Ledger</p>
                <h1 className="text-xl font-black text-on-surface tracking-tighter">Invoice {invoice.invoiceNumber}</h1>
             </div>
          </div>
          <div className="flex items-center gap-3">
             <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${
               invoice.status === 'paid' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 
               invoice.status === 'sent' ? 'bg-primary-custom/10 text-primary-custom border-primary-custom/20' : 
               'bg-surface-container-high text-outline border-outline-variant/20'
             }`}>
               {invoice.status} status
             </div>
             <Button variant="ghost" size="icon" className="rounded-xl hover:bg-destructive/5 hover:text-destructive transition-all" onClick={deleteInvoice}>
                <Trash2 className="h-5 w-5" />
             </Button>
          </div>
        </div>
      </header>

      {/* The A4 Canvas Document */}
      <main className="max-w-[1200px] mx-auto px-4 pt-12">
        <div className="w-full max-w-[850px] mx-auto bg-white shadow-[0_0_100px_rgba(0,0,0,0.04)] rounded-sm border border-outline-variant/10 p-16 md:p-24 min-h-[1100px] flex flex-col animate-in fade-in slide-in-from-bottom-8 duration-1000">
          
          {/* Document Header */}
          <div className="flex justify-between items-start mb-20">
            <div className="space-y-6">
              <div className="w-20 h-20 bg-primary-custom rounded-2xl flex items-center justify-center text-white shadow-xl shadow-primary-custom/20">
                <Terminal className="h-10 w-10 stroke-[2.5px]" />
              </div>
              <div className="space-y-1">
                <h2 className="text-2xl font-black italic tracking-tighter text-on-surface">{user?.businessName || "DevBill Agency"}</h2>
                <p className="text-sm font-semibold text-on-surface-variant opacity-60 leading-relaxed uppercase tracking-wider">{user?.businessAddress || "Silicon Valley, CA"}</p>
                <p className="text-sm font-semibold text-on-surface-variant opacity-60">{user?.businessEmail}</p>
              </div>
            </div>
            <div className="text-right flex flex-col gap-4">
              <h1 className="text-5xl font-black italic tracking-tighter text-primary-custom uppercase">Invoice</h1>
              <div className="space-y-2">
                <div className="flex justify-end gap-6">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-outline">Number</span>
                  <span className="text-sm font-bold">{invoice.invoiceNumber}</span>
                </div>
                <div className="flex justify-end gap-6">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-outline">Date</span>
                  <span className="text-sm font-bold">{format(new Date(invoice.createdAt), "MMM dd, yyyy")}</span>
                </div>
                <div className="flex justify-end gap-6">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-outline">Due Date</span>
                  <span className="text-sm font-bold">{format(new Date(invoice.dueDate), "MMM dd, yyyy")}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Billing Section */}
          <div className="mb-20">
            <label className="text-[11px] font-black uppercase tracking-[0.2em] text-outline block mb-4 ml-1">Bill To</label>
            <div className="bg-surface-container-low/30 p-8 rounded-3xl border border-outline-variant/10">
              <h3 className="text-xl font-black italic text-on-surface mb-1">{invoice.clientId.name}</h3>
              <p className="text-sm font-semibold text-on-surface-variant opacity-70 leading-relaxed">
                {invoice.clientId.company && <><span className="font-bold">{invoice.clientId.company}</span><br/></>}
                {invoice.clientId.address || "No address provided"}
              </p>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="flex-1 mb-20 overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b-2 border-on-surface">
                  <th className="pb-6 text-[10px] font-black uppercase tracking-[0.3em] text-outline">Description</th>
                  <th className="pb-6 text-[10px] font-black uppercase tracking-[0.3em] text-outline text-center">Qty</th>
                  <th className="pb-6 text-[10px] font-black uppercase tracking-[0.3em] text-outline text-right">Price</th>
                  <th className="pb-6 text-[10px] font-black uppercase tracking-[0.3em] text-outline text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {invoice.items.map((item, i) => (
                  <tr key={i}>
                    <td className="py-8">
                      <div className="text-base font-black italic tracking-tight text-on-surface">{item.description}</div>
                      <div className="text-[11px] font-semibold text-outline tracking-wide uppercase opacity-60 mt-1">Professional Deliverable</div>
                    </td>
                    <td className="py-8 text-center text-sm font-bold text-on-surface-variant">{item.quantity}</td>
                    <td className="py-8 text-right text-sm font-bold text-on-surface-variant">${item.rate.toLocaleString()}</td>
                    <td className="py-8 text-right text-base font-black italic text-on-surface tracking-tighter">${item.amount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Section */}
          <div className="flex justify-end mb-24">
            <div className="w-72 space-y-4">
              <div className="flex justify-between items-center px-2">
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-outline">Subtotal</span>
                <span className="text-base font-bold text-on-surface">${invoice.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center px-2">
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-outline">Tax ({invoice.taxRate}%)</span>
                <span className="text-base font-bold text-on-surface">${invoice.taxAmount.toLocaleString()}</span>
              </div>
              <div className="pt-6 border-t-[3px] border-on-surface flex justify-between items-center px-2">
                <span className="text-lg font-black italic text-on-surface uppercase tracking-tight">Total Due</span>
                <span className="text-3xl font-black tracking-tighter text-primary-custom italic">${invoice.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>

          {/* Document Footer */}
          <div className="pt-12 border-t border-outline-variant/10 flex justify-between items-end">
            <div className="space-y-2">
               <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-outline italic">Payment Info</h4>
               <p className="text-[11px] font-semibold text-on-surface-variant opacity-60">Bank: Sovereign International</p>
               <p className="text-[11px] font-semibold text-on-surface-variant opacity-60 italic uppercase tracking-widest">{invoice.secureToken.slice(0, 12)}... (id: ledger_cert)</p>
            </div>
            <div className="text-right">
              <p className="text-base font-black italic tracking-tight text-on-surface-variant opacity-40">Thank you for your business.</p>
              <div className="mt-4 flex items-center justify-end gap-2 text-primary-custom/60">
                <BadgeCheck className="h-4 w-4" />
                <span className="text-[9px] font-black uppercase tracking-[0.2em]">Certified via DevBill Ledger</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Action Bar */}
      <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50">
        <div className="bg-white/80 backdrop-blur-3xl border border-outline-variant/20 px-8 py-5 rounded-[40px] shadow-[0_32px_100px_rgba(0,0,0,0.15)] flex items-center gap-6 ring-1 ring-on-surface/5 animate-in slide-in-from-bottom-12 duration-1000">
          
          {isClient && user && (
            <PDFDownloadLink
              document={<InvoicePDF invoice={invoice} user={user} />}
              fileName={`${invoice.invoiceNumber}.pdf`}
            >
              <button className="flex items-center gap-2.5 px-6 h-12 rounded-2xl hover:bg-surface-container-low transition-all text-on-surface font-black uppercase tracking-widest text-[11px] active:scale-95">
                <Download className="h-5 w-5 text-primary-custom" />
                Export PDF
              </button>
            </PDFDownloadLink>
          )}

          <div className="w-px h-8 bg-outline-variant/20" />

          <button 
            className="flex items-center gap-2.5 px-6 h-12 rounded-2xl hover:bg-surface-container-low transition-all text-on-surface font-black uppercase tracking-widest text-[11px] active:scale-95"
            onClick={() => setIsSendModalOpen(true)}
          >
            <Mail className="h-5 w-5 text-primary-custom" />
            Send to Client
          </button>

          <div className="w-px h-8 bg-outline-variant/20" />

          <Link href={`/dashboard/invoices/new?edit=${invoice._id}`}>
            <button className="flex items-center gap-2.5 px-6 h-12 rounded-2xl hover:bg-surface-container-low transition-all text-on-surface font-black uppercase tracking-widest text-[11px] active:scale-95">
              <Edit3 className="h-5 w-5 text-primary-custom" />
              Modify
            </button>
          </Link>

          {(invoice.status !== 'paid') && (
            <button 
              className="flex items-center gap-3.5 px-10 h-14 rounded-full bg-gradient-to-tr from-primary-custom to-primary-container text-white font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-primary-custom/40 active:scale-[0.98] transition-all"
              onClick={() => updateStatus("paid")}
              disabled={updating}
            >
              {updating ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                <>
                  <CheckCircle2 className="h-5 w-5" />
                  Mark as Paid
                </>
              )}
            </button>
          )}

          <div className="w-px h-8 bg-outline-variant/20" />
          
          <button 
            className="flex items-center gap-2.5 px-6 h-12 rounded-2xl hover:bg-surface-container-low transition-all text-on-surface font-black uppercase tracking-widest text-[11px] active:scale-95"
            onClick={copyPublicLink}
          >
            <Link2 className="h-5 w-5 text-primary-custom opacity-40" />
          </button>
        </div>
      </div>

      <SendInvoiceModal 
        isOpen={isSendModalOpen}
        onClose={() => setIsSendModalOpen(false)}
        invoice={invoice}
        user={user}
        onSent={fetchData}
      />
    </div>
  );
}
