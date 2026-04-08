"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowLeft,
  Loader2,
  Send,
  CheckCircle2,
  Trash2,
  Download,
  Link2,
} from "lucide-react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { InvoicePDF } from "@/components/invoice/InvoicePDF";
import { SendInvoiceModal } from "@/components/invoice/SendInvoiceModal";
import { toast } from "sonner";

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

const statusStyles: Record<string, string> = {
  draft: "bg-surface-container-high text-on-surface-variant border-outline-variant/20",
  sent: "bg-primary-custom/10 text-primary-custom border-primary-custom/20",
  paid: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  overdue: "bg-destructive/10 text-destructive border-destructive/20",
};

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

      if (invoiceRes.ok) {
        const data = await invoiceRes.json();
        setInvoice(data);
      }
      if (userRes.ok) {
        const userData = await userRes.json();
        setUser(userData);
      }
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
        const data = await res.json();
        setInvoice(data);
        toast.success(`Invoice marked as ${newStatus}`);
      }
    } catch (error) {
      console.error("Error updating invoice:", error);
      toast.error("Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  const sendInvoice = async () => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/invoices/${id}/send`, {
        method: "POST",
      });
      if (res.ok) {
        toast.success("Invoice sent successfully!");
        fetchData();
      } else {
        const data = await res.json();
        toast.error(data.message || "Failed to send invoice");
      }
    } catch (error) {
      console.error("Error sending invoice:", error);
      toast.error("An error occurred. Please check your settings.");
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
    if (!confirm("Are you sure you want to delete this invoice?")) return;
    try {
      const res = await fetch(`/api/invoices/${id}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/dashboard/invoices");
        toast.success("Invoice deleted");
      }
    } catch (error) {
      console.error("Error deleting invoice:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary-custom" />
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <p className="text-on-surface-variant text-xl font-semibold opacity-60">Invoice not found</p>
        <Link href="/dashboard/invoices">
          <Button variant="outline" className="h-12 px-8 rounded-xl font-bold">
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Invoices
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Top Header Actions */}
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between border-b pb-8 border-outline-variant/10">
        <div className="space-y-4">
          <Link
            href="/dashboard/invoices"
            className="group inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest text-outline hover:text-primary-custom transition-colors"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Invoices
          </Link>
          <div className="flex items-center gap-4">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-on-surface">
              {invoice.invoiceNumber}
            </h1>
            <Badge className={`px-4 py-1.5 rounded-full text-sm font-black uppercase tracking-wider border shadow-sm ${statusStyles[invoice.status]}`} variant="outline">
              {invoice.status}
            </Badge>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-3">
          {invoice.status === "draft" && (
            <Button
              variant="default"
              className="h-13 px-6 rounded-2xl font-black gap-2 bg-primary-custom hover:bg-primary-container shadow-lg shadow-primary-custom/20 transition-all active:scale-95"
              onClick={() => setIsSendModalOpen(true)}
              disabled={updating}
            >
              <Send className="h-5 w-5" />
              Send Invoice
            </Button>
          )}
          
          <SendInvoiceModal 
            isOpen={isSendModalOpen}
            onClose={() => setIsSendModalOpen(false)}
            invoice={invoice}
            user={user}
            onSent={fetchData}
          />
          
          {isClient && invoice && user && (
            <PDFDownloadLink
              document={<InvoicePDF invoice={invoice} user={user} />}
              fileName={`${invoice.invoiceNumber}.pdf`}
            >
              {({ loading }) => (
                <Button variant="outline" className="h-13 px-6 rounded-2xl font-black gap-2 border-outline-variant/20 hover:bg-surface-container-low transition-all active:scale-95" disabled={loading}>
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin text-primary-custom" />
                  ) : (
                    <Download className="h-5 w-5" />
                  )}
                  Export PDF
                </Button>
              )}
            </PDFDownloadLink>
          )}

          {(invoice.status === "sent" || invoice.status === "overdue") && (
            <Button
              className="h-13 px-6 rounded-2xl font-black gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
              onClick={() => updateStatus("paid")}
              disabled={updating}
            >
              <CheckCircle2 className="h-5 w-5" />
              Mark as Paid
            </Button>
          )}

          <Button
            variant="ghost"
            className="h-13 w-13 p-0 rounded-2xl hover:bg-surface-container-low transition-all"
            onClick={copyPublicLink}
            title="Copy Public Link"
          >
            <Link2 className="h-6 w-6 text-on-surface-variant" />
          </Button>

          <Button
            variant="ghost"
            className="h-13 w-13 p-0 rounded-2xl hover:bg-destructive/5 group transition-all"
            onClick={deleteInvoice}
            title="Delete Invoice"
          >
            <Trash2 className="h-6 w-6 text-on-surface-variant group-hover:text-destructive" />
          </Button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Invoice Section */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none bg-surface-container-lowest shadow-2xl shadow-on-surface/5 rounded-3xl overflow-hidden">
            <CardContent className="p-8 md:p-12">
              <div className="flex flex-col md:flex-row md:justify-between gap-12 mb-16">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-outline mb-4">
                    Bill To
                  </p>
                  <div className="space-y-1">
                    <p className="text-2xl font-extrabold text-on-surface tracking-tight">
                      {invoice.clientId?.name}
                    </p>
                    {invoice.clientId?.company && (
                      <p className="text-lg font-semibold text-on-surface-variant opacity-80">
                        {invoice.clientId.company}
                      </p>
                    )}
                    <p className="text-on-surface-variant font-medium">
                      {invoice.clientId?.email}
                    </p>
                    {invoice.clientId?.address && (
                      <p className="text-on-surface-variant/70 text-sm max-w-xs mt-2 leading-relaxed">
                        {invoice.clientId.address}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="md:text-right">
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-outline mb-4">
                    Invoice Details
                  </p>
                  <div className="space-y-2">
                    <p className="text-2xl font-extrabold text-on-surface tracking-tight">
                      {invoice.invoiceNumber}
                    </p>
                    <div className="space-y-0.5">
                      <p className="text-sm font-semibold text-on-surface-variant">
                        <span className="opacity-40 font-black uppercase text-[10px] mr-2">Issued:</span>
                        {new Date(invoice.createdAt).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                      <p className="text-sm font-semibold text-on-surface-variant">
                        <span className="opacity-40 font-black uppercase text-[10px] mr-2">Due Date:</span>
                        {new Date(invoice.dueDate).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto -mx-8 px-8">
                <Table>
                  <TableHeader className="bg-surface-container-low/30">
                    <TableRow className="hover:bg-transparent border-outline-variant/10">
                      <TableHead className="py-5 font-black uppercase tracking-widest text-[10px] text-outline h-auto">Description</TableHead>
                      <TableHead className="py-5 text-right font-black uppercase tracking-widest text-[10px] text-outline h-auto">Qty</TableHead>
                      <TableHead className="py-5 text-right font-black uppercase tracking-widest text-[10px] text-outline h-auto">Rate</TableHead>
                      <TableHead className="py-5 text-right font-black uppercase tracking-widest text-[10px] text-outline h-auto">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoice.items.map((item, i) => (
                      <TableRow key={i} className="hover:bg-surface-container-low/10 border-outline-variant/5">
                        <TableCell className="py-6 font-semibold text-on-surface">{item.description}</TableCell>
                        <TableCell className="py-6 text-right font-medium text-on-surface-variant">{item.quantity}</TableCell>
                        <TableCell className="py-6 text-right font-medium text-on-surface-variant">
                          ${item.rate.toFixed(2)}
                        </TableCell>
                        <TableCell className="py-6 text-right font-bold text-on-surface">
                          ${item.amount.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="mt-12 flex justify-end">
                <div className="w-full md:w-80 space-y-4 p-8 bg-surface-container-low/20 rounded-3xl border border-outline-variant/10">
                  <div className="flex justify-between items-center px-1">
                    <span className="text-sm font-bold opacity-40 uppercase tracking-widest">Subtotal</span>
                    <span className="text-lg font-bold text-on-surface">${invoice.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center px-1">
                    <span className="text-sm font-bold opacity-40 uppercase tracking-widest">
                      Tax ({invoice.taxRate}%)
                    </span>
                    <span className="text-lg font-bold text-on-surface">${invoice.taxAmount.toFixed(2)}</span>
                  </div>
                  <Separator className="bg-outline-variant/15 my-2" />
                  <div className="flex justify-between items-center px-1">
                    <span className="text-xl font-black tracking-tighter text-on-surface uppercase">Total Due</span>
                    <span className="text-3xl font-black tracking-tighter text-primary-custom">
                      ${invoice.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {invoice.notes && (
            <Card className="border-none bg-surface-container-lowest shadow-xl shadow-on-surface/5 rounded-3xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500 delay-200">
              <CardHeader className="bg-surface-container-low/20 border-b border-outline-variant/5">
                <CardTitle className="text-sm font-black uppercase tracking-[0.2em] text-outline">Notes</CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <p className="text-lg font-medium text-on-surface-variant whitespace-pre-wrap leading-relaxed opacity-80">
                  {invoice.notes}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <Card className="border-none bg-surface-container-lowest shadow-xl shadow-on-surface/5 rounded-3xl overflow-hidden">
            <CardHeader className="bg-surface-container-low/20 border-b border-outline-variant/5">
              <CardTitle className="text-sm font-black uppercase tracking-[0.2em] text-outline">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="p-8 flex flex-col items-center text-center space-y-2">
              <p className="text-sm font-bold opacity-40 uppercase tracking-[0.15em] mb-2">Total Amount</p>
              <p className="text-5xl font-black tracking-tighter text-on-surface">
                ${invoice.total.toFixed(2)}
              </p>
              <p className="text-base font-bold text-on-surface-variant opacity-60">
                Due on {new Date(invoice.dueDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </CardContent>
          </Card>

          <Card className="border-none bg-surface-container-lowest shadow-xl shadow-on-surface/5 rounded-3xl overflow-hidden">
            <CardHeader className="bg-surface-container-low/20 border-b border-outline-variant/5">
              <CardTitle className="text-sm font-black uppercase tracking-[0.2em] text-outline">Timeline</CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div className="relative space-y-8 before:absolute before:inset-0 before:left-2 before:w-0.5 before:bg-outline-variant/10 after:clear-both">
                <div className="relative pl-10 flex flex-col gap-1">
                  <div className="absolute left-0 top-1.5 h-4 w-4 rounded-full border-4 border-surface bg-emerald-500 shadow-sm transition-transform hover:scale-125 duration-300" />
                  <p className="text-sm font-black uppercase tracking-widest text-on-surface">Invoice Created</p>
                  <p className="text-sm font-semibold text-outline">
                    {new Date(invoice.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>

                {invoice.status !== "draft" && (
                  <div className="relative pl-10 flex flex-col gap-1 animate-in fade-in slide-in-from-left-2 duration-500">
                    <div className="absolute left-0 top-1.5 h-4 w-4 rounded-full border-4 border-surface bg-primary-custom shadow-sm" />
                    <p className="text-sm font-black uppercase tracking-widest text-on-surface">Sent to Client</p>
                    <p className="text-sm font-semibold text-outline italic">Professional delivery via Resend</p>
                  </div>
                )}

                {invoice.status === "paid" && (
                  <div className="relative pl-10 flex flex-col gap-1 animate-in fade-in slide-in-from-left-2 duration-700 delay-200">
                    <div className="absolute left-0 top-1.5 h-4 w-4 rounded-full border-4 border-surface bg-emerald-500 shadow-sm" />
                    <p className="text-sm font-black uppercase tracking-widest text-emerald-600">Payment Resolved</p>
                    <p className="text-sm font-semibold text-emerald-600 opacity-60">Full amount received</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Trust Banner */}
          <div className="p-8 rounded-3xl bg-primary-custom/5 border border-primary-custom/10 text-center space-y-4">
             <div className="w-12 h-12 bg-primary-custom/10 rounded-2xl flex items-center justify-center mx-auto text-primary-custom">
               <span className="material-symbols-outlined text-2xl font-bold">verified_user</span>
             </div>
             <div>
               <p className="text-sm font-black text-on-surface uppercase tracking-widest">Bank-Grade PDF</p>
               <p className="text-xs font-semibold text-on-surface-variant opacity-60 leading-relaxed mt-2">
                 Every invoice generated is legally compliant and professional by default.
               </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

