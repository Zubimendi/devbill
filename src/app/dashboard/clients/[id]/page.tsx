"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Mail,
  Phone,
  Building2,
  MapPin,
  Plus,
  Trash2,
} from "lucide-react";

interface ClientData {
  _id: string;
  name: string;
  email: string;
  company: string;
  address: string;
  phone: string;
}

interface InvoiceData {
  _id: string;
  invoiceNumber: string;
  total: number;
  status: string;
  dueDate: string;
  createdAt: string;
}

const statusStyles: Record<string, string> = {
  draft: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
  sent: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  paid: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  overdue: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export default function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [client, setClient] = useState<ClientData | null>(null);
  const [invoices, setInvoices] = useState<InvoiceData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [clientRes, invoicesRes] = await Promise.all([
        fetch(`/api/clients/${id}`),
        fetch(`/api/invoices?clientId=${id}`),
      ]);

      if (clientRes.ok) {
        setClient(await clientRes.json());
      }
      if (invoicesRes.ok) {
        setInvoices(await invoicesRes.json());
      }
    } catch (error) {
      console.error("Error fetching client data:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteClient = async () => {
    if (!confirm("Are you sure? This will not delete their invoices but will orphan them.")) return;
    try {
      const res = await fetch(`/api/clients/${id}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/dashboard/clients");
      }
    } catch (error) {
      console.error("Error deleting client:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  if (!client) {
    return (
      <div className="p-8 text-center">
        <p className="text-zinc-500">Client not found</p>
        <Link href="/dashboard/clients">
          <Button variant="outline" className="mt-4">
            Back to Clients
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
            href="/dashboard/clients"
            className="mb-4 inline-flex items-center gap-2 text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:hover:text-zinc-300"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Clients
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            {client.name}
          </h1>
        </div>
        <div className="flex gap-2">
          <Link href={`/dashboard/invoices/new?client=${client._id}`}>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Invoice
            </Button>
          </Link>
          <Button variant="ghost" className="text-destructive" onClick={deleteClient}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Client Info Card */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <Mail className="mt-0.5 h-4 w-4 text-zinc-400" />
              <div>
                <p className="text-xs font-medium text-zinc-500">Email</p>
                <p className="text-sm">{client.email}</p>
              </div>
            </div>
            {client.phone && (
              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 text-zinc-400" />
                <div>
                  <p className="text-xs font-medium text-zinc-500">Phone</p>
                  <p className="text-sm">{client.phone}</p>
                </div>
              </div>
            )}
            {client.company && (
              <div className="flex items-start gap-3">
                <Building2 className="mt-0.5 h-4 w-4 text-zinc-400" />
                <div>
                  <p className="text-xs font-medium text-zinc-500">Company</p>
                  <p className="text-sm">{client.company}</p>
                </div>
              </div>
            )}
            {client.address && (
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 text-zinc-400" />
                <div>
                  <p className="text-xs font-medium text-zinc-500">Address</p>
                  <p className="text-sm whitespace-pre-wrap">{client.address}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Invoices List for this Client */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            {invoices.length === 0 ? (
              <div className="py-8 text-center text-sm text-zinc-500">
                No invoices found for this client.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((inv) => (
                    <TableRow key={inv._id}>
                      <TableCell>
                        <Link
                          href={`/dashboard/invoices/${inv._id}`}
                          className="font-medium text-zinc-900 hover:underline dark:text-zinc-50"
                        >
                          {inv.invoiceNumber}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Badge className={`capitalize ${statusStyles[inv.status]}`} variant="secondary">
                          {inv.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-zinc-500">
                        {new Date(inv.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        ${inv.total.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
