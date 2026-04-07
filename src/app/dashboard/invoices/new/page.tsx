"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [selectedClient, setSelectedClient] = useState("");
  const [items, setItems] = useState<InvoiceItem[]>([
    { description: "", quantity: 1, rate: 0, amount: 0 },
  ]);
  const [taxRate, setTaxRate] = useState(0);
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("draft");

  useEffect(() => {
    fetchClients();
    // Set default due date to 30 days from now
    const defaultDue = new Date();
    defaultDue.setDate(defaultDue.getDate() + 30);
    setDueDate(defaultDue.toISOString().split("T")[0]);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!selectedClient) {
      setError("Please select a client");
      setIsLoading(false);
      return;
    }

    if (items.some((item) => !item.description || item.rate <= 0)) {
      setError("Please fill in all item details");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId: selectedClient,
          items,
          taxRate,
          dueDate,
          notes,
          status,
        }),
      });

      if (res.ok) {
        const invoice = await res.json();
        router.push(`/dashboard/invoices/${invoice._id}`);
      } else {
        const data = await res.json();
        setError(data.message || "Failed to create invoice");
      }
    } catch (err) {
      setError("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <Link
          href="/dashboard/invoices"
          className="mb-4 inline-flex items-center gap-2 text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:hover:text-zinc-300"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Invoices
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Create New Invoice
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          Fill in the details below to create a new invoice
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main form */}
          <div className="space-y-6 lg:col-span-2">
            {error && (
              <div className="rounded-lg bg-destructive/15 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            {/* Client Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Client</CardTitle>
              </CardHeader>
              <CardContent>
                {clients.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-sm text-zinc-500 mb-2">No clients yet</p>
                    <Link href="/dashboard/clients/new">
                      <Button variant="outline" size="sm">
                        Add your first client
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <Select value={selectedClient} onValueChange={setSelectedClient}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a client" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client._id} value={client._id}>
                          {client.name}{" "}
                          {client.company && `(${client.company})`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </CardContent>
            </Card>

            {/* Line Items */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">Line Items</CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addItem}
                  className="gap-1"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Item
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-12 gap-3 items-end"
                  >
                    <div className="col-span-5">
                      {index === 0 && (
                        <Label className="text-xs text-zinc-500">
                          Description
                        </Label>
                      )}
                      <Input
                        placeholder="Service description"
                        value={item.description}
                        onChange={(e) =>
                          updateItem(index, "description", e.target.value)
                        }
                      />
                    </div>
                    <div className="col-span-2">
                      {index === 0 && (
                        <Label className="text-xs text-zinc-500">Qty</Label>
                      )}
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          updateItem(index, "quantity", Number(e.target.value))
                        }
                      />
                    </div>
                    <div className="col-span-2">
                      {index === 0 && (
                        <Label className="text-xs text-zinc-500">Rate ($)</Label>
                      )}
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.rate}
                        onChange={(e) =>
                          updateItem(index, "rate", Number(e.target.value))
                        }
                      />
                    </div>
                    <div className="col-span-2">
                      {index === 0 && (
                        <Label className="text-xs text-zinc-500">Amount</Label>
                      )}
                      <div className="flex h-9 items-center rounded-md bg-zinc-50 px-3 text-sm font-medium dark:bg-zinc-800">
                        ${item.amount.toFixed(2)}
                      </div>
                    </div>
                    <div className="col-span-1">
                      {items.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(index)}
                          className="text-zinc-400 hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Notes */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Payment terms, additional notes..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar summary */}
          <div className="space-y-6">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="text-base">Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <Label className="text-xs text-zinc-500">Due Date</Label>
                    <Input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-zinc-500">Tax Rate (%)</Label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      step="0.5"
                      value={taxRate}
                      onChange={(e) => setTaxRate(Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-zinc-500">Status</Label>
                    <Select value={status} onValueChange={setStatus}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="sent">Sent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Subtotal</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Tax ({taxRate}%)</span>
                    <span className="font-medium">${taxAmount.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full gap-2"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Invoice"
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
