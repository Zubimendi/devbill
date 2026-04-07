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
} from "lucide-react";

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
  createdAt: string;
}

const statusStyles: Record<string, string> = {
  draft: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
  sent: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  paid: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  overdue: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export default function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [invoice, setInvoice] = useState<InvoiceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchInvoice();
  }, [id]);

  const fetchInvoice = async () => {
    try {
      const res = await fetch(`/api/invoices/${id}`);
      if (res.ok) {
        const data = await res.json();
        setInvoice(data);
      }
    } catch (error) {
      console.error("Error fetching invoice:", error);
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
      }
    } catch (error) {
      console.error("Error updating invoice:", error);
    } finally {
      setUpdating(false);
    }
  };

  const deleteInvoice = async () => {
    if (!confirm("Are you sure you want to delete this invoice?")) return;
    try {
      const res = await fetch(`/api/invoices/${id}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/dashboard/invoices");
      }
    } catch (error) {
      console.error("Error deleting invoice:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="p-8 text-center">
        <p className="text-zinc-500">Invoice not found</p>
        <Link href="/dashboard/invoices">
          <Button variant="outline" className="mt-4">
            Back to Invoices
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <Link
            href="/dashboard/invoices"
            className="mb-4 inline-flex items-center gap-2 text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:hover:text-zinc-300"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Invoices
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              {invoice.invoiceNumber}
            </h1>
            <Badge className={`capitalize ${statusStyles[invoice.status]}`} variant="secondary">
              {invoice.status}
            </Badge>
          </div>
        </div>
        <div className="flex gap-2">
          {invoice.status === "draft" && (
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => updateStatus("sent")}
              disabled={updating}
            >
              <Send className="h-4 w-4" />
              Mark as Sent
            </Button>
          )}
          {(invoice.status === "sent" || invoice.status === "overdue") && (
            <Button
              size="sm"
              className="gap-2 bg-emerald-600 hover:bg-emerald-700"
              onClick={() => updateStatus("paid")}
              disabled={updating}
            >
              <CheckCircle2 className="h-4 w-4" />
              Mark as Paid
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive"
            onClick={deleteInvoice}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Invoice Details */}
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <div className="mb-8 grid grid-cols-2 gap-8">
                <div>
                  <p className="mb-1 text-xs font-medium uppercase text-zinc-500">
                    Bill To
                  </p>
                  <p className="font-semibold text-zinc-900 dark:text-zinc-50">
                    {invoice.clientId?.name}
                  </p>
                  {invoice.clientId?.company && (
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      {invoice.clientId.company}
                    </p>
                  )}
                  <p className="text-sm text-zinc-500">
                    {invoice.clientId?.email}
                  </p>
                  {invoice.clientId?.address && (
                    <p className="text-sm text-zinc-500">
                      {invoice.clientId.address}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="mb-1 text-xs font-medium uppercase text-zinc-500">
                    Invoice Details
                  </p>
                  <p className="font-semibold text-zinc-900 dark:text-zinc-50">
                    {invoice.invoiceNumber}
                  </p>
                  <p className="text-sm text-zinc-500">
                    Issued:{" "}
                    {new Date(invoice.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                  <p className="text-sm text-zinc-500">
                    Due:{" "}
                    {new Date(invoice.dueDate).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Qty</TableHead>
                    <TableHead className="text-right">Rate</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoice.items.map((item, i) => (
                    <TableRow key={i}>
                      <TableCell>{item.description}</TableCell>
                      <TableCell className="text-right">
                        {item.quantity}
                      </TableCell>
                      <TableCell className="text-right">
                        ${item.rate.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        ${item.amount.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="mt-6 flex justify-end">
                <div className="w-64 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Subtotal</span>
                    <span>${invoice.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">
                      Tax ({invoice.taxRate}%)
                    </span>
                    <span>${invoice.taxAmount.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${invoice.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {invoice.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap">
                  {invoice.notes}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Side info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Status Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-sm">
                  Created on{" "}
                  {new Date(invoice.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
              {invoice.status !== "draft" && (
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-blue-500" />
                  <span className="text-sm">Sent to client</span>
                </div>
              )}
              {invoice.status === "paid" && (
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="text-sm">Payment received</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Amount Due</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                ${invoice.total.toFixed(2)}
              </p>
              <p className="text-sm text-zinc-500">
                Due{" "}
                {new Date(invoice.dueDate).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
