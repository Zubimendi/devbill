"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  X,
  Send,
  Loader2,
  Mail,
  FileText,
  Rocket,
  Wand2,
} from "lucide-react";
import { toast } from "sonner";

interface SendInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: any;
  user: any;
  onSent: () => void;
}

export function SendInvoiceModal({
  isOpen,
  onClose,
  invoice,
  user,
  onSent,
}: SendInvoiceModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    to: invoice?.clientId?.email || "",
    subject: `Invoice ${invoice?.invoiceNumber} from ${user?.businessName || user?.name || "DevBill"}`,
    message: `Hi ${invoice?.clientId?.name?.split(" ")[0] || "there"},\n\nPlease find attached invoice ${invoice?.invoiceNumber} for the recent project work.\n\nThe total due is $${invoice?.total?.toLocaleString()} by ${new Date(invoice?.dueDate).toLocaleDateString("en-US", { month: "long", day: "numeric" })}. Let me know if you have any questions.\n\nBest regards,\n${user?.name}`,
  });

  useEffect(() => {
    if (invoice) {
        setFormData({
            to: invoice.clientId?.email || "",
            subject: `Invoice ${invoice.invoiceNumber} from ${user?.businessName || user?.name || "DevBill"}`,
            message: `Hi ${invoice.clientId?.name?.split(" ")[0] || "there"},\n\nPlease find attached invoice ${invoice.invoiceNumber} for the recent project work.\n\nThe total due is $${invoice.total?.toLocaleString()} by ${new Date(invoice.dueDate).toLocaleDateString("en-US", { month: "long", day: "numeric" })}. Let me know if you have any questions.\n\nBest regards,\n${user?.name}`,
          });
    }
  }, [invoice, user]);

  const handleSend = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/invoices/${invoice._id}/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success("Invoice sent successfully via Resend!");
        onSent();
        onClose();
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || "Failed to send invoice");
      }
    } catch (error) {
      console.error("Error sending invoice:", error);
      toast.error("An error occurred while sending");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden border-none bg-surface-container-lowest rounded-3xl shadow-[0_0_100px_rgba(0,0,0,0.1)]">
        {/* Modal Header */}
        <div className="px-10 py-10 bg-surface-container-low/50 border-b border-outline-variant/10 flex justify-between items-center relative">
          <div className="space-y-1.5">
            <DialogTitle className="text-3xl font-black text-on-surface tracking-tighter italic uppercase">
              Send Invoice {invoice?.invoiceNumber}
            </DialogTitle>
            <p className="text-sm font-semibold text-on-surface-variant opacity-60">
              Recipient: <span className="text-on-surface">{invoice?.clientId?.name} {invoice?.clientId?.company ? `(${invoice.clientId.company})` : ""}</span>
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-3 hover:bg-surface-container-high rounded-2xl transition-all group active:scale-95"
          >
            <X className="h-6 w-6 text-on-surface-variant group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-10 space-y-10">
          {/* Recipient Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="block text-[10px] font-black text-outline uppercase tracking-[0.2em] ml-1">From</label>
              <div className="w-full px-5 py-4 bg-surface-container-low/50 text-on-surface-variant/80 text-sm font-bold rounded-2xl border border-outline-variant/10 flex items-center gap-3">
                <Mail className="h-4 w-4 opacity-50" />
                {user?.email || "billing@devbill.com"}
              </div>
            </div>
            <div className="space-y-3">
              <label className="block text-[10px] font-black text-outline uppercase tracking-[0.2em] ml-1">To</label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-outline group-focus-within:text-primary-custom transition-colors" />
                <Input
                  className="w-full pl-13 pr-4 h-14 bg-surface-container-lowest text-on-surface text-sm font-bold rounded-2xl border-outline-variant/30 focus:border-primary-custom focus:ring-4 focus:ring-primary-custom/10 outline-none transition-all"
                  value={formData.to}
                  onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                  placeholder="recipient@email.com"
                />
              </div>
            </div>
          </div>

          {/* Subject Line */}
          <div className="space-y-3">
            <label className="block text-[10px] font-black text-outline uppercase tracking-[0.2em] ml-1">Subject</label>
            <Input
              className="w-full px-5 h-14 bg-surface-container-lowest text-on-surface text-sm font-bold rounded-2xl border-outline-variant/30 focus:border-primary-custom focus:ring-4 focus:ring-primary-custom/10 outline-none transition-all"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            />
          </div>

          {/* Message Body */}
          <div className="space-y-3">
            <label className="block text-[10px] font-black text-outline uppercase tracking-[0.2em] ml-1">Personal Personalized Message</label>
            <div className="relative group">
              <Textarea
                className="w-full px-6 py-6 bg-surface-container-lowest text-on-surface text-sm leading-relaxed font-semibold rounded-3xl border-outline-variant/30 focus:border-primary-custom focus:ring-4 focus:ring-primary-custom/10 outline-none transition-all resize-none min-h-[160px]"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={6}
              />
              <div className="absolute bottom-4 right-4 flex gap-2">
                <button className="p-3 text-outline hover:text-primary-custom bg-surface-container-low/50 hover:bg-primary-custom/10 transition-all rounded-xl active:scale-95 group/btn" title="Refine with AI">
                  <Wand2 className="h-5 w-5 transition-transform group-hover/btn:rotate-12" />
                </button>
              </div>
            </div>
          </div>

          {/* Attachment Preview Section */}
          <div className="p-6 bg-surface-container-low/30 rounded-[28px] flex items-center justify-between border border-outline-variant/10 group/att hover:bg-surface-container-low/50 transition-all">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-error-container/10 flex items-center justify-center rounded-[20px] shadow-sm transform group-hover/att:scale-105 transition-transform">
                <FileText className="h-7 w-7 text-error" />
              </div>
              <div className="space-y-1">
                <p className="text-base font-black text-on-surface tracking-tight leading-none uppercase italic">{invoice?.invoiceNumber}.pdf</p>
                <p className="text-[11px] font-black uppercase tracking-widest text-on-surface-variant opacity-40">System-Generated Audit Ready PDF</p>
              </div>
            </div>
            <button className="text-primary-custom hover:underline transition-all flex items-center gap-2 text-xs font-black uppercase tracking-widest">
              Preview
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-10 py-8 bg-surface-container-low/20 border-t border-outline-variant/10 flex items-center justify-end gap-6">
          <button 
            disabled={loading}
            onClick={onClose}
            className="px-8 py-3 text-sm font-black uppercase tracking-widest text-outline hover:text-on-surface transition-all active:scale-95 disabled:opacity-50"
          >
            Discard
          </button>
          <Button 
            disabled={loading}
            onClick={handleSend}
            className="h-16 px-10 gap-3 rounded-[24px] bg-gradient-to-tr from-primary-custom to-primary-container font-black text-sm uppercase tracking-widest text-white shadow-2xl shadow-primary-custom/20 hover:shadow-primary-custom/40 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                Confirm and Send
                <Rocket className="h-5 w-5" />
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
