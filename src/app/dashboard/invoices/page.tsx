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
  draft:
    "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
  sent: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  paid: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  overdue:
    "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
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
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Invoices
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            Manage and track all your invoices
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
      <div className="mb-6 flex gap-2">
        {["all", "draft", "sent", "paid", "overdue"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium capitalize transition-colors ${
              filter === status
                ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
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
        <div className="rounded-xl border border-zinc-200/50 bg-white dark:border-zinc-800/50 dark:bg-zinc-900/50">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
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
