"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Users, Mail, Building2, Loader2, Trash2 } from "lucide-react";

interface Client {
  _id: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  createdAt: string;
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClients();
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
    } finally {
      setLoading(false);
    }
  };

  const deleteClient = async (id: string) => {
    if (!confirm("Are you sure you want to delete this client?")) return;
    try {
      const res = await fetch(`/api/clients/${id}`, { method: "DELETE" });
      if (res.ok) {
        setClients(clients.filter((c) => c._id !== id));
      }
    } catch (error) {
      console.error("Error deleting client:", error);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Clients
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            Manage your client contacts
          </p>
        </div>
        <Link href="/dashboard/clients/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Client
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
        </div>
      ) : clients.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700">
          <Users className="mb-4 h-12 w-12 text-zinc-300 dark:text-zinc-600" />
          <p className="mb-2 text-lg font-medium text-zinc-900 dark:text-zinc-50">
            No clients yet
          </p>
          <p className="mb-4 text-sm text-zinc-500">
            Add your first client to start creating invoices
          </p>
          <Link href="/dashboard/clients/new">
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Add Client
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {clients.map((client) => (
            <Card
              key={client._id}
              className="group border-zinc-200/50 transition-all hover:border-zinc-300 hover:shadow-md dark:border-zinc-800/50 dark:hover:border-zinc-700"
            >
              <CardContent className="p-5">
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-sm font-bold text-white">
                      {client.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-zinc-900 dark:text-zinc-50">
                        {client.name}
                      </p>
                      {client.company && (
                        <p className="text-xs text-zinc-500">{client.company}</p>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="opacity-0 transition-opacity group-hover:opacity-100 text-zinc-400 hover:text-destructive"
                    onClick={() => deleteClient(client._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-zinc-500">
                    <Mail className="h-3.5 w-3.5" />
                    {client.email}
                  </div>
                  {client.company && (
                    <div className="flex items-center gap-2 text-zinc-500">
                      <Building2 className="h-3.5 w-3.5" />
                      {client.company}
                    </div>
                  )}
                </div>

                <div className="mt-4 flex gap-2">
                  <Link href={`/dashboard/invoices/new?client=${client._id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full text-xs">
                      Create Invoice
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
