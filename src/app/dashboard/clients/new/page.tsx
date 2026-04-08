"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowLeft,
  Loader2,
  UserPlus,
  Save,
  Building2,
  Phone,
  MapPin,
} from "lucide-react";
import { toast } from "sonner";

export default function NewClientPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      company: formData.get("company"),
      address: formData.get("address"),
      phone: formData.get("phone"),
    };

    try {
      const res = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        toast.success("Client added to your network");
        router.push("/dashboard/clients");
      } else {
        const result = await res.json();
        setError(result.message || "Failed to create client");
        toast.error(result.message || "Failed to add client");
      }
    } catch (err) {
      setError("An network error occurred");
      toast.error("Could not connect to server");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-12 lg:p-16 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-6">
        <Link
          href="/dashboard/clients"
          className="group inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.2em] text-outline transition-colors hover:text-primary-custom"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Network
        </Link>
        <div className="space-y-2">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter text-on-surface italic uppercase">
            Add New Client
          </h1>
          <p className="text-on-surface-variant font-semibold text-xl opacity-60 italic">
            Expand your professional circle and organize your billing sources.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-8">
          <Card className="border-none bg-surface-container-lowest shadow-2xl shadow-on-surface/5 rounded-[40px] overflow-hidden">
            <CardHeader className="bg-surface-container-low/20 border-b border-outline-variant/5 p-10">
              <div className="flex items-center gap-4">
                <div className="w-1.5 h-6 bg-primary-custom rounded-full" />
                <CardTitle className="text-2xl font-black text-on-surface tracking-tighter uppercase italic">Client Profile</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-10 space-y-10">
              {error && (
                <div className="rounded-2xl bg-destructive/10 border border-destructive/20 p-6 text-sm text-destructive font-black uppercase tracking-widest flex items-center gap-3">
                  <span className="material-symbols-outlined font-variation-settings-['FILL'_1]">error</span>
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2.5">
                  <Label className="text-[11px] font-black uppercase tracking-[0.2em] text-outline ml-1" htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Representative Name"
                    required
                    disabled={isLoading}
                    className="h-14 bg-surface-container-low/20 border-outline-variant/15 font-bold rounded-2xl focus:ring-primary-custom"
                  />
                </div>
                <div className="space-y-2.5">
                  <Label className="text-[11px] font-black uppercase tracking-[0.2em] text-outline ml-1" htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="billing@client.com"
                    required
                    disabled={isLoading}
                    className="h-14 bg-surface-container-low/20 border-outline-variant/15 font-bold rounded-2xl focus:ring-primary-custom"
                  />
                </div>
                <div className="space-y-2.5">
                  <Label className="text-[11px] font-black uppercase tracking-[0.2em] text-outline ml-1" htmlFor="company">Company Name</Label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-outline opacity-40" />
                    <Input
                      id="company"
                      name="company"
                      placeholder="Organization Ltd."
                      disabled={isLoading}
                      className="h-14 pl-12 bg-surface-container-low/20 border-outline-variant/15 font-bold rounded-2xl focus:ring-primary-custom"
                    />
                  </div>
                </div>
                <div className="space-y-2.5">
                  <Label className="text-[11px] font-black uppercase tracking-[0.2em] text-outline ml-1" htmlFor="phone">Contact Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-outline opacity-40" />
                    <Input
                      id="phone"
                      name="phone"
                      placeholder="+1 (555) 000-0000"
                      disabled={isLoading}
                      className="h-14 pl-12 bg-surface-container-low/20 border-outline-variant/15 font-bold rounded-2xl focus:ring-primary-custom"
                    />
                  </div>
                </div>
                <div className="space-y-2.5 md:col-span-2">
                  <Label className="text-[11px] font-black uppercase tracking-[0.2em] text-outline ml-1" htmlFor="address">Billing Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-outline opacity-40" />
                    <Input
                      id="address"
                      name="address"
                      placeholder="123 Financial District, City, Country"
                      disabled={isLoading}
                      className="h-14 pl-12 bg-surface-container-low/20 border-outline-variant/15 font-bold rounded-2xl focus:ring-primary-custom"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-4 space-y-8">
           <div className="p-10 rounded-[40px] bg-primary-custom/5 border border-primary-custom/10 space-y-6">
              <div className="w-20 h-20 bg-primary-custom/10 rounded-3xl flex items-center justify-center">
                 <UserPlus className="h-10 w-10 text-primary-custom" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black text-on-surface tracking-tight uppercase">Quick Info</h3>
                <p className="text-sm font-semibold text-on-surface-variant opacity-60 leading-relaxed">
                  Adding a client allows you to instantly generate professional invoices and track billing history for this entity.
                </p>
              </div>
              <ul className="space-y-3">
                 {['Private Records', 'Auto-Suggestions', 'Multi-currency ready'].map((item) => (
                   <li key={item} className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-primary-custom/70">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary-custom" />
                      {item}
                   </li>
                 ))}
              </ul>
           </div>

           <div className="flex flex-col gap-4">
              <Button
                type="submit"
                className="h-20 w-full rounded-3xl font-black text-xl uppercase tracking-widest bg-gradient-to-tr from-primary-custom to-primary-container text-white shadow-2xl shadow-primary-custom/30 hover:shadow-primary-custom/50 active:scale-[0.98] transition-all flex items-center justify-center gap-4 disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-8 w-8 animate-spin" />
                ) : (
                  <>
                    <Save className="h-8 w-8" />
                    Save Client
                  </>
                )}
              </Button>
              <Link href="/dashboard/clients" className="w-full">
                <Button
                  variant="outline"
                  type="button"
                  className="h-16 w-full rounded-2xl font-black uppercase tracking-widest border-outline-variant/20 hover:bg-surface-container-low transition-all"
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              </Link>
           </div>
        </div>
      </form>
    </div>
  );
}
