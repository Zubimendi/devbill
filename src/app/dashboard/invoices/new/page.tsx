"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Trash2,
  Loader2,
  ArrowLeft,
  ChevronRight,
  Send,
  Save,
  Download,
  Eye,
  Info,
  PlusCircle,
  Building2,
  Image as ImageIcon,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface Client {
  _id: string;
  name: string;
  email: string;
  company: string;
}

interface InvoiceItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export default function NewInvoicePage() {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState("");

  const [selectedClient, setSelectedClient] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState(`INV-${format(new Date(), "yyyy")}-001`);
  const [items, setItems] = useState<InvoiceItem[]>([
    { description: "", quantity: 1, rate: 0, amount: 0 },
  ]);
  const [businessName, setBusinessName] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [businessPhone, setBusinessPhone] = useState("");
  const [businessEmail, setBusinessEmail] = useState("");
  const [taxRate, setTaxRate] = useState(0);
  const [dueDate, setDueDate] = useState("");
  const [invoiceDate, setInvoiceDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [currency, setCurrency] = useState("USD");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("draft");

  useEffect(() => {
    fetchInitialData();
    const defaultDue = new Date();
    defaultDue.setDate(defaultDue.getDate() + 14);
    setDueDate(format(defaultDue, "yyyy-MM-dd"));
  }, []);

  const fetchInitialData = async () => {
    try {
      const [clientsRes, userRes] = await Promise.all([
        fetch("/api/clients"),
        fetch("/api/settings"),
      ]);
      if (clientsRes.ok) setClients(await clientsRes.json());
      if (userRes.ok) {
        const userData = await userRes.json();
        setUser(userData);
        if (userData.businessName) setBusinessName(userData.businessName);
        if (userData.businessAddress) setBusinessAddress(userData.businessAddress);
        if (userData.businessPhone) setBusinessPhone(userData.businessPhone);
        if (userData.businessEmail) setBusinessEmail(userData.businessEmail);
        if (userData.defaultTaxRate) setTaxRate(userData.defaultTaxRate);
        if (userData.defaultCurrency) setCurrency(userData.defaultCurrency);
        if (userData.defaultNotes) setNotes(userData.defaultNotes);
      }
    } catch (error) {
      console.error("Error fetching initial data:", error);
    } finally {
      setIsFetching(false);
    }
  };

  const updateItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const updated = [...items];
    (updated[index] as any)[field] = value;
    updated[index].amount = updated[index].quantity * updated[index].rate;
    setItems(updated);
  };

  const addItem = () => {
    setItems([...items, { description: "", quantity: 1, rate: 0, amount: 0 }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const taxAmount = subtotal * (taxRate / 100);
  const total = subtotal + taxAmount;

  const handleSubmit = async (draft: boolean = false) => {
    setIsLoading(true);
    setError("");

    // Only require client if not saving as draft
    if (!selectedClient && !draft) {
      setError("Please select a client to create a formal invoice.");
      toast.error("Client selection is required for non-drafts.");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId: selectedClient,
          invoiceNumber,
          items,
          taxRate,
          dueDate,
          createdAt: invoiceDate,
          currency,
          notes,
          status: draft ? "draft" : "sent",
          fromBusinessName: businessName,
          fromBusinessAddress: businessAddress,
          fromBusinessPhone: businessPhone,
          fromBusinessEmail: businessEmail,
        }),
      });

      if (res.ok) {
        const invoiceData = await res.json();
        toast.success(draft ? "Invoice saved as draft" : "Invoice created and ready to send");
        router.push(`/dashboard/invoices/${invoiceData._id}`);
      } else {
        const data = await res.json();
        setError(data.message || "Failed to create invoice");
        toast.error(data.message || "Failed to create invoice");
      }
    } catch (err) {
      setError("An error occurred");
      toast.error("Network error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const currentClient = clients.find(c => c._id === selectedClient);

  if (isFetching) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary-custom/40" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* Editorial Top Bar */}
      <header className="bg-white/80 backdrop-blur-xl sticky top-0 z-50 border-b border-outline-variant/10 px-8 py-4 flex justify-between items-center">
        <div className="flex flex-col">
          <nav className="flex items-center gap-2 text-[10px] font-black text-outline uppercase tracking-[0.2em] mb-1">
            <Link href="/dashboard" className="hover:text-primary-custom transition-colors">Dashboard</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/dashboard/invoices" className="hover:text-primary-custom transition-colors">Invoices</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-on-surface">New Invoice</span>
          </nav>
          <h2 className="text-2xl font-black tracking-tighter text-on-surface uppercase italic">New Invoice</h2>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            className="h-12 px-6 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-surface-container-low transition-all"
            onClick={() => handleSubmit(true)}
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save as Draft"}
          </Button>
          <Button 
            className="h-12 px-8 rounded-xl font-black uppercase tracking-widest text-xs bg-gradient-to-tr from-primary-custom to-primary-container text-white shadow-xl shadow-primary-custom/20 hover:shadow-primary-custom/40 active:scale-95 transition-all"
            onClick={() => handleSubmit(false)}
            disabled={isLoading}
          >
            Send to Client
          </Button>
        </div>
      </header>

      <div className="p-8 lg:p-12 max-w-[1600px] w-full mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* LEFT COLUMN: The Form */}
          <div className="lg:col-span-8 space-y-12">
            {error && (
              <div className="rounded-2xl bg-destructive/10 border border-destructive/20 p-6 text-sm text-destructive font-black uppercase tracking-widest flex items-center gap-3">
                <Info className="h-5 w-5" />
                {error}
              </div>
            )}

            {/* Business Details Section */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <label className="text-[11px] font-black uppercase tracking-[0.3em] text-outline ml-1">From</label>
                <div className="bg-surface-container-lowest p-8 rounded-[32px] border border-outline-variant/10 shadow-2xl shadow-on-surface/5 space-y-6">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-surface-container-high rounded-3xl flex items-center justify-center overflow-hidden border border-outline-variant/5">
                      {user?.logo ? (
                        <img src={user.logo} className="w-full h-full object-cover" alt="Business Logo" />
                      ) : (
                        <ImageIcon className="h-6 w-6 text-outline/40" />
                      )}
                    </div>
                    <button className="text-[12px] font-black text-primary-custom uppercase tracking-widest hover:underline">Change Logo</button>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <Input 
                        className="text-xl font-black text-on-surface tracking-tight italic bg-transparent border-none px-2 py-1 h-auto focus:ring-0 placeholder:opacity-20 select-all hover:bg-surface-container-low/50 rounded-lg transition-colors"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        placeholder="Your Business Name"
                      />
                    </div>
                    <div className="space-y-2">
                       <Textarea 
                        className="text-sm font-semibold text-on-surface-variant opacity-60 leading-relaxed bg-transparent border-none px-2 py-2 h-auto focus:ring-0 resize-none min-h-[80px] placeholder:opacity-20 hover:bg-surface-container-low/50 rounded-lg transition-colors"
                        value={businessAddress}
                        onChange={(e) => setBusinessAddress(e.target.value)}
                        placeholder="Business Address"
                      />
                      <div className="flex flex-col gap-1 w-full">
                        <div className="flex items-center gap-2 group/field">
                          <span className="text-[10px] font-black uppercase text-outline/30 w-12 shrink-0">Phone</span>
                          <Input 
                            className="text-[13px] font-bold text-on-surface-variant/60 bg-transparent border-none px-2 py-1 h-auto focus:ring-0 hover:bg-surface-container-low/50 rounded-lg transition-colors w-full"
                            value={businessPhone}
                            onChange={(e) => setBusinessPhone(e.target.value)}
                            placeholder="+1 (555) 000-0000"
                          />
                        </div>
                        <div className="flex items-center gap-2 group/field">
                          <span className="text-[10px] font-black uppercase text-outline/30 w-12 shrink-0">Email</span>
                          <Input 
                            className="text-[13px] font-bold text-on-surface-variant/60 bg-transparent border-none px-2 py-1 h-auto focus:ring-0 hover:bg-surface-container-low/50 rounded-lg transition-colors w-full"
                            value={businessEmail}
                            onChange={(e) => setBusinessEmail(e.target.value)}
                            placeholder="billing@yourfirm.io"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center pr-2">
                  <label className="text-[11px] font-black uppercase tracking-[0.3em] text-outline ml-1">Bill To</label>
                  <Link href="/dashboard/clients/new" className="text-[11px] font-black text-primary-custom uppercase tracking-widest flex items-center gap-1 hover:underline">
                    <PlusCircle className="h-4 w-4" /> Add New Client
                  </Link>
                </div>
                <div className="bg-surface-container-lowest p-8 rounded-[32px] border border-outline-variant/10 shadow-2xl shadow-on-surface/5 min-h-[212px] flex flex-col justify-center gap-6">
                  <div className="space-y-1">
                     <Select value={selectedClient} onValueChange={(val) => setSelectedClient(val ?? "")}>
                        <SelectTrigger className="h-14 bg-surface-container-low/30 border-none font-bold rounded-2xl focus:ring-primary-custom shadow-none">
                          <SelectValue placeholder="Select a Partner" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border-outline-variant/10 shadow-2xl">
                          {clients.map((client) => (
                            <SelectItem key={client._id} value={client._id} className="rounded-xl font-semibold m-1">
                              {client.name} {client.company && `— ${client.company}`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                  </div>
                  {currentClient && (
                    <div className="text-sm font-semibold text-on-surface-variant pl-2 animate-in fade-in slide-in-from-top-2">
                      <p className="text-on-surface font-black italic">{currentClient.name}</p>
                      <p className="opacity-60">{currentClient.email}</p>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Invoice Meta Details */}
            <section className="bg-surface-container-low/40 rounded-[32px] p-8 grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-outline ml-1">Invoice ID</label>
                <Input 
                  className="h-12 bg-surface-container-lowest border-outline-variant/15 rounded-xl font-black text-sm focus:ring-primary-custom shadow-sm"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-outline ml-1">Issued On</label>
                <Input 
                  type="date"
                  className="h-12 bg-surface-container-lowest border-outline-variant/15 rounded-xl font-bold text-sm focus:ring-primary-custom shadow-sm"
                  value={invoiceDate}
                  onChange={(e) => setInvoiceDate(e.target.value)}
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-outline ml-1">Due Date</label>
                <Input 
                  type="date"
                  className="h-12 bg-surface-container-lowest border-outline-variant/15 rounded-xl font-bold text-sm focus:ring-primary-custom shadow-sm"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-outline ml-1">Currency</label>
                <Select value={currency} onValueChange={(val) => setCurrency(val ?? "")}>
                   <SelectTrigger className="h-12 bg-surface-container-lowest border-outline-variant/15 rounded-xl font-bold text-sm focus:ring-primary-custom shadow-sm">
                      <SelectValue />
                   </SelectTrigger>
                   <SelectContent className="rounded-xl">
                      <SelectItem value="USD" className="font-bold">USD ($)</SelectItem>
                      <SelectItem value="EUR" className="font-bold">EUR (€)</SelectItem>
                      <SelectItem value="GBP" className="font-bold">GBP (£)</SelectItem>
                   </SelectContent>
                </Select>
              </div>
            </section>

            {/* Line Items Table */}
            <section className="space-y-6">
              <label className="text-[11px] font-black uppercase tracking-[0.3em] text-outline ml-1">Portfolio Services & Deliverables</label>
              <div className="bg-surface-container-lowest rounded-[40px] border border-outline-variant/10 shadow-2xl shadow-on-surface/5 overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container-low/30 border-b border-outline-variant/5">
                      <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-outline">Description</th>
                      <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-outline w-24 text-center">Qty</th>
                      <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-outline w-32 text-right">Rate</th>
                      <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-outline w-32 text-right">Amount</th>
                      <th className="px-8 py-6 w-12 text-center text-outline opacity-40">
                         <span className="material-symbols-outlined text-[14px]">tune</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/5">
                    {items.map((item, index) => (
                      <tr key={index} className="group hover:bg-surface-container-low/10 transition-colors">
                        <td className="px-10 py-6">
                          <Input 
                            value={item.description}
                            onChange={(e) => updateItem(index, "description", e.target.value)}
                            placeholder="Deliverable description"
                            className="bg-transparent border-none p-0 text-base font-black italic focus:ring-0 placeholder:opacity-20"
                          />
                        </td>
                        <td className="px-6 py-6 text-center">
                          <Input 
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateItem(index, "quantity", Number(e.target.value))}
                            className="h-10 w-16 bg-surface-container-low/40 border-none rounded-xl text-sm font-black text-center focus:ring-primary-custom"
                          />
                        </td>
                        <td className="px-6 py-6 text-right">
                          <Input 
                            type="number"
                            value={item.rate}
                            onChange={(e) => updateItem(index, "rate", Number(e.target.value))}
                            className="bg-transparent border-none p-0 text-base font-black text-right focus:ring-0"
                          />
                        </td>
                        <td className="px-6 py-6 text-right font-black text-base italic tracking-tighter">
                          ${item.amount.toLocaleString()}
                        </td>
                        <td className="px-8 py-6 text-center">
                          <button 
                             onClick={() => removeItem(index)}
                             className="text-outline/40 hover:text-error transition-all hover:scale-125 disabled:opacity-0"
                             disabled={items.length === 1}
                           >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="p-8 bg-surface-container-low/20">
                  <button 
                    onClick={addItem}
                    className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-primary-custom hover:text-primary-container transition-all group"
                  >
                    <PlusCircle className="h-5 w-5 transition-transform group-hover:rotate-90" />
                    Expand Project Ledger
                  </button>
                </div>
              </div>
            </section>

            {/* Notes & Totals */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-4">
                <label className="text-[11px] font-black uppercase tracking-[0.3em] text-outline ml-1">Editorial Notes & Terms</label>
                <Textarea 
                  className="w-full bg-surface-container-lowest border border-outline-variant/10 rounded-[32px] p-8 text-base font-semibold text-on-surface-variant leading-relaxed focus:ring-primary-custom shadow-2xl shadow-on-surface/5 resize-none"
                  placeholder="Terms of payment, grateful closing, etc."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={6}
                />
              </div>
              <div className="bg-surface-container-low/20 rounded-[40px] p-10 space-y-6 border border-outline-variant/5">
                <div className="flex justify-between items-center px-2">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-outline">Subtotal</span>
                  <span className="text-xl font-bold text-on-surface">${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center px-2">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-outline">Applied Tax</span>
                    <Input 
                      type="number" 
                      value={taxRate}
                      onChange={(e) => setTaxRate(Number(e.target.value))}
                      className="w-12 h-8 bg-transparent border-b border-outline-variant/20 rounded-none p-0 text-center font-black text-xs focus:ring-0"
                    />
                    <span className="text-[10px] font-black text-outline">%</span>
                  </div>
                  <span className="text-xl font-bold text-on-surface">${taxAmount.toLocaleString()}</span>
                </div>
                <div className="pt-8 border-t border-outline-variant/10 flex justify-between items-center px-2">
                  <span className="text-xl font-black italic tracking-tighter uppercase">Total Ledger</span>
                  <span className="text-4xl font-black tracking-tighter text-primary-custom">
                    ${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN: The Preview & Actions */}
          <aside className="lg:col-span-4 sticky top-32 space-y-8 animate-in fade-in slide-in-from-right-4 duration-1000">
            <div className="bg-surface-container-lowest rounded-[40px] border border-outline-variant/15 shadow-[0_0_100px_rgba(0,0,0,0.05)] overflow-hidden scale-90 -mt-12 group">
              <div className="bg-on-surface px-8 py-4 flex items-center justify-between">
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-surface/40">Live Audit Preview</span>
                <div className="flex gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-surface/10" />
                  <div className="w-1.5 h-1.5 rounded-full bg-surface/10" />
                  <div className="w-1.5 h-1.5 rounded-full bg-surface/10" />
                </div>
              </div>
              {/* Mini Preview Canvas */}
              <div className="p-10 bg-white aspect-[1/1.41] relative flex flex-col text-[10px] opacity-90 group-hover:opacity-100 transition-opacity">
                <div className="flex justify-between items-start mb-12">
                  <div className="w-12 h-12 bg-surface-container-low rounded-xl" />
                  <div className="text-right space-y-1">
                    <p className="font-black text-[18px] italic tracking-tighter uppercase">INVOICE</p>
                    <p className="text-outline font-black tracking-widest">{invoiceNumber}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-8 mb-12">
                  <div className="space-y-1">
                    <p className="font-black text-outline uppercase tracking-widest text-[8px] mb-2">SENDER</p>
                    <p className="font-black text-on-surface italic">{user?.businessName || "Your Firm"}</p>
                    <p className="opacity-40">{user?.businessAddress?.slice(0, 20)}...</p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="font-black text-outline uppercase tracking-widest text-[8px] mb-2">RECIPIENT</p>
                    <p className="font-black text-on-surface italic">{currentClient?.name || "Target Client"}</p>
                    <p className="opacity-40">{currentClient?.email || "pending selection"}</p>
                  </div>
                </div>
                <div className="flex-1 space-y-3">
                  <div className="border-b border-outline-variant/10 pb-2 flex justify-between font-black text-outline uppercase tracking-widest text-[8px]">
                    <span>LEDGER ITEM</span>
                    <span>TOTAL</span>
                  </div>
                  {items.slice(0, 3).map((it, i) => (
                    <div key={i} className="flex justify-between font-bold">
                      <span className="truncate pr-4">{it.description || "Drafting Service..."}</span>
                      <span className="font-black tracking-tight">${it.amount.toLocaleString()}</span>
                    </div>
                  ))}
                  {items.length > 3 && <p className="text-center italic opacity-30 mt-2">Plus {items.length - 3} more items...</p>}
                </div>
                <div className="mt-12 pt-6 border-t-[3px] border-on-surface flex justify-between items-end">
                  <div className="space-y-1">
                    <p className="font-black text-outline uppercase tracking-widest text-[8px]">DUE ON</p>
                    <p className="font-black">{format(new Date(dueDate || new Date()), "MMM dd, yyyy")}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="font-black text-outline uppercase tracking-widest text-[8px]">TOTAL DUE</p>
                    <p className="text-2xl font-black text-primary-custom tracking-tighter italic">${total.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <Button 
                onClick={() => handleSubmit(false)}
                disabled={isLoading}
                className="w-full h-20 bg-gradient-to-tr from-primary-custom to-primary-container text-white font-black text-xl uppercase tracking-widest rounded-[28px] shadow-2xl shadow-primary-custom/20 flex items-center justify-center gap-4 hover:-translate-y-1 active:scale-95 transition-all"
              >
                {isLoading ? <Loader2 className="h-8 w-8 animate-spin" /> : <><Send className="h-8 w-8" /> Send Invoice</>}
              </Button>
              <div className="grid grid-cols-2 gap-4">
                 <Button variant="ghost" className="h-14 font-black uppercase tracking-widest text-[10px] bg-surface-container-low/40 rounded-2xl gap-2 hover:bg-surface-container-low">
                    <Download className="h-4 w-4" /> Export
                 </Button>
                 <Button variant="ghost" className="h-14 font-black uppercase tracking-widest text-[10px] bg-surface-container-low/40 rounded-2xl gap-2 hover:bg-surface-container-low">
                    <Eye className="h-4 w-4" /> Portal
                 </Button>
              </div>
            </div>

            {/* Assistant / Tip */}
            <div className="bg-primary-custom/5 border border-primary-custom/10 p-8 rounded-[32px] flex gap-4 ring-1 ring-primary-custom/10 shadow-2xl shadow-primary-custom/5">
              <Info className="h-6 w-6 text-primary-custom shrink-0 mt-0.5" />
              <p className="text-xs font-semibold text-primary-custom uppercase tracking-wide leading-relaxed">
                <span className="font-black underline underline-offset-4">Pro-tip:</span> Configure <span className="font-black">Automatic Reminders</span> in settings to reduce payment friction by up to 35%.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
