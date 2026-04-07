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
import { Plus, FileText, Loader2 } from "lucide-react";

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
  draft: "bg-surface-container-highest text-on-surface-variant/80 border-outline-variant/30",
  sent: "bg-primary-custom/10 text-primary-custom border-primary-custom/20",
  paid: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  overdue: "bg-error/10 text-error border-error/20",
};

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchInvoices();
  }, [filter]);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/invoices${filter !== "all" ? `?status=${filter}` : ""}`
      );
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

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-on-surface mb-2">
            Invoices
          </h1>
          <p className="text-on-surface-variant font-medium">
            Manage and track your professional ledger entries.
          </p>
        </div>
        <Link href="/dashboard/invoices/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Invoice
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {["all", "draft", "sent", "paid", "overdue"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all ${
              filter === status
                ? "bg-primary-custom text-white shadow-lg shadow-primary-custom/20"
                : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
        </div>
      ) : invoices.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700">
          <FileText className="mb-4 h-12 w-12 text-zinc-300 dark:text-zinc-600" />
          <p className="mb-2 text-lg font-medium text-zinc-900 dark:text-zinc-50">
            No invoices yet
          </p>
          <p className="mb-4 text-sm text-zinc-500">
            Create your first invoice to get started
          </p>
          <Link href="/dashboard/invoices/new">
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Create Invoice
            </Button>
          </Link>
        </div>
      ) : (
        <div className="rounded-2xl border border-outline-variant/15 bg-surface-container-lowest shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-surface-container-low/50">
              <TableRow className="hover:bg-transparent border-outline-variant/10">
                <TableHead className="text-[10px] font-bold uppercase tracking-widest text-outline py-4">Invoice</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-widest text-outline py-4">Client</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-widest text-outline py-4">Amount</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-widest text-outline py-4">Status</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-widest text-outline py-4">Due Date</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-widest text-outline py-4 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice._id}>
                  <TableCell className="font-medium">
                    {invoice.invoiceNumber}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{invoice.clientId?.name}</p>
                      <p className="text-xs text-zinc-500">
                        {invoice.clientId?.company}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold">
                    ${invoice.total.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`capitalize ${statusStyles[invoice.status]}`}
                      variant="secondary"
                    >
                      {invoice.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(invoice.dueDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/dashboard/invoices/${invoice._id}`}>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
