import { notFound } from "next/navigation";
import connectDB from "@/lib/mongodb";
import Invoice from "@/models/Invoice";
import User from "@/models/User";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileText, Calendar, Building2, User as UserIcon } from "lucide-react";
import { DownloadButton } from "./DownloadButton";

async function getInvoiceByToken(token: string) {
  await connectDB();
  const invoice = await Invoice.findOne({ secureToken: token })
    .populate("clientId", "name email company address phone")
    .lean();

  if (!invoice) return null;

  const user = await User.findById(invoice.userId)
    .select("name email businessName businessAddress businessTaxId")
    .lean();

  return {
    invoice: JSON.parse(JSON.stringify(invoice)),
    user: JSON.parse(JSON.stringify(user)),
  };
}

export default async function PublicInvoicePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const data = await getInvoiceByToken(token);

  if (!data) {
    notFound();
  }

  const { invoice, user } = data;

  const statusStyles: Record<string, string> = {
    draft: "bg-zinc-100 text-zinc-700",
    sent: "bg-blue-100 text-blue-700",
    paid: "bg-emerald-100 text-emerald-700",
    overdue: "bg-red-100 text-red-700",
  };

  return (
    <div className="min-h-screen bg-zinc-50/50 py-12 px-4 dark:bg-zinc-950">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Top bar with Download */}
        <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-zinc-200/50 shadow-sm dark:bg-zinc-900 dark:border-zinc-800/50">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                Invoice {invoice.invoiceNumber}
              </p>
              <p className="text-xs text-zinc-500">
                View and download your invoice
              </p>
            </div>
          </div>
          <DownloadButton invoice={invoice} user={user} />
        </div>

        {/* Invoice Page Card */}
        <Card className="border-none shadow-xl overflow-hidden bg-white dark:bg-zinc-900">
          <CardContent className="p-0">
            {/* Header / Brand */}
            <div className="bg-zinc-900 p-12 text-white dark:bg-zinc-950">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <h1 className="text-4xl font-bold tracking-tight">INVOICE</h1>
                  <p className="mt-2 text-zinc-400 font-mono text-sm uppercase tracking-widest">
                    {invoice.invoiceNumber}
                  </p>
                </div>
                <div className="text-right">
                  <div
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusStyles[invoice.status]}`}
                  >
                    {invoice.status}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-12 space-y-12">
              {/* Billing Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-400">
                    <Building2 className="h-3.5 w-3.5" />
                    From
                  </div>
                  <div className="space-y-1">
                    <p className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                      {user.businessName || user.name}
                    </p>
                    <p className="text-zinc-500 text-sm leading-relaxed">
                      {user.businessAddress}
                    </p>
                    <p className="text-zinc-500 text-sm">{user.email}</p>
                    {user.businessTaxId && (
                      <p className="text-xs text-zinc-400 mt-2">
                        Tax ID: {user.businessTaxId}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-4 md:text-right">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-400 md:justify-end">
                    <UserIcon className="h-3.5 w-3.5" />
                    Bill To
                  </div>
                  <div className="space-y-1">
                    <p className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                      {invoice.clientId.name}
                    </p>
                    {invoice.clientId.company && (
                      <p className="text-zinc-600 dark:text-zinc-400">
                        {invoice.clientId.company}
                      </p>
                    )}
                    <p className="text-zinc-500 text-sm leading-relaxed">
                      {invoice.clientId.address}
                    </p>
                    <p className="text-zinc-500 text-sm">
                      {invoice.clientId.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Date / Total Info */}
              <div className="flex flex-col md:flex-row gap-8 bg-zinc-50 p-6 rounded-xl dark:bg-zinc-800/50">
                <div className="flex-1 space-y-1">
                  <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                    Date Issued
                  </p>
                  <p className="font-semibold">
                    {new Date(invoice.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-400 uppercase tracking-wider">
                    <Calendar className="h-3.5 w-3.5" />
                    Due Date
                  </div>
                  <p className="font-semibold text-zinc-900 dark:text-zinc-50">
                    {new Date(invoice.dueDate).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="flex-1 space-y-1 md:text-right">
                  <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                    Total Amount
                  </p>
                  <p className="text-2xl font-black text-primary">
                    $
                    {invoice.total.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                </div>
              </div>

              {/* Items Table */}
              <div className="rounded-xl border border-zinc-200 overflow-hidden dark:border-zinc-800">
                <Table>
                  <TableHeader className="bg-zinc-50 dark:bg-zinc-800/50">
                    <TableRow>
                      <TableHead className="py-4">Description</TableHead>
                      <TableHead className="text-right">Qty</TableHead>
                      <TableHead className="text-right">Rate</TableHead>
                      <TableHead className="text-right font-bold">
                        Amount
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoice.items.map((item: any, i: number) => (
                      <TableRow key={i}>
                        <TableCell className="py-4 font-medium">
                          {item.description}
                        </TableCell>
                        <TableCell className="text-right">
                          {item.quantity}
                        </TableCell>
                        <TableCell className="text-right text-zinc-500">
                          ${item.rate.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right font-bold">
                          ${item.amount.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Summary */}
              <div className="flex justify-end pt-6">
                <div className="w-80 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Subtotal</span>
                    <span className="font-medium">
                      ${invoice.subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">
                      Tax ({invoice.taxRate}%)
                    </span>
                    <span className="font-medium text-zinc-900 dark:text-zinc-50">
                      ${invoice.taxAmount.toFixed(2)}
                    </span>
                  </div>
                  <Separator className="bg-zinc-200 dark:bg-zinc-800" />
                  <div className="flex justify-between items-center text-xl font-bold">
                    <span className="text-zinc-900 dark:text-zinc-50">
                      Total
                    </span>
                    <span className="text-primary tracking-tight">
                      $
                      {invoice.total.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {invoice.notes && (
                <div className="pt-12 border-t border-zinc-100 dark:border-zinc-800">
                  <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">
                    Notes & Terms
                  </h3>
                  <div className="text-sm text-zinc-500 leading-relaxed max-w-2xl whitespace-pre-wrap italic">
                    &ldquo;{invoice.notes}&rdquo;
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="bg-zinc-50 p-12 text-center border-t border-zinc-100 dark:bg-zinc-900/50 dark:border-zinc-800">
              <p className="text-xs font-medium text-zinc-400 uppercase tracking-widest">
                Thank you for your business.
              </p>
              <p className="mt-2 text-[10px] text-zinc-300 dark:text-zinc-600">
                Generated securely by devbill
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
