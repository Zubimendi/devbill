"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Loader2,
  Save,
  Building2,
  Settings2,
  Bell,
  User as UserIcon,
  ChevronRight,
  CloudUpload,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "@/components/providers/ThemeProvider";

interface UserSettings {
  name: string;
  email: string;
  businessName: string;
  businessAddress: string;
  businessTaxId: string;
  businessEmail: string;
  businessPhone: string;
  businessWebsite: string;
  currency: string;
  taxRate: number;
  paymentTerms: string;
  themeColor: string;
  defaultNotes: string;
}

type TabType = "profile" | "invoice" | "notifications" | "account";

export default function SettingsPage() {
  const { themeColor: globalThemeColor, setThemeColor: setGlobalThemeColor } = useTheme();
  const [activeTab, setActiveTab] = useState<TabType>("profile");
  const [settings, setSettings] = useState<UserSettings>({
    name: "",
    email: "",
    businessName: "",
    businessAddress: "",
    businessTaxId: "",
    businessEmail: "",
    businessPhone: "",
    businessWebsite: "",
    currency: "USD",
    taxRate: 0,
    paymentTerms: "Net 30",
    themeColor: "#4648d4",
    defaultNotes: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      if (res.ok) {
        const data = await res.json();
        setSettings({
          name: data.name || "",
          email: data.email || "",
          businessName: data.businessName || "",
          businessAddress: data.businessAddress || "",
          businessTaxId: data.businessTaxId || "",
          businessEmail: data.businessEmail || "",
          businessPhone: data.businessPhone || "",
          businessWebsite: data.businessWebsite || "",
          currency: data.currency || "USD",
          taxRate: data.taxRate || 0,
          paymentTerms: data.paymentTerms || "Net 30",
          themeColor: data.themeColor || "#4648d4",
          defaultNotes: data.defaultNotes || "",
        });
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        toast.success("Workspace preferences updated");
        setGlobalThemeColor(settings.themeColor);
      } else {
        const data = await res.json();
        const message = data.message || "Failed to save settings";
        setError(message);
        toast.error(message);
      }
    } catch (err) {
      setError("An network error occurred");
      toast.error("An error occurred while saving your preferences.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary-custom" />
      </div>
    );
  }

  const sidebarTabs = [
    { id: "profile", label: "Business Profile", icon: Building2 },
    { id: "invoice", label: "Invoice Defaults", icon: Settings2 },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "account", label: "Account", icon: UserIcon },
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 lg:p-12 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-on-surface">
          Workspace Preferences
        </h1>
        <p className="text-on-surface-variant text-lg font-medium max-w-2xl opacity-70">
          Configure your business identity and default financial behaviors for a seamless invoicing experience.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Settings Sidebar Tabs */}
        <nav className="lg:w-1/4 flex flex-col space-y-2">
          {sidebarTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center justify-between px-5 py-4 rounded-2xl transition-all group ${
                  isActive
                    ? "bg-surface-container-lowest shadow-lg shadow-on-surface/5 border-l-4 border-primary-custom text-primary-custom font-black"
                    : "hover:bg-surface-container-high text-on-surface-variant font-bold"
                }`}
              >
                <span className="flex items-center gap-4">
                  <Icon className={`h-5 w-5 ${isActive ? "fill-primary-custom/10" : ""}`} />
                  {tab.label}
                </span>
                <ChevronRight className={`h-4 w-4 transition-all ${isActive ? "opacity-100 translate-x-1" : "opacity-0 group-hover:opacity-40"}`} />
              </button>
            );
          })}
        </nav>

        {/* Settings Content Area */}
        <div className="flex-1 space-y-8">
          {activeTab === "profile" && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <Card className="border-none bg-surface-container-lowest shadow-2xl shadow-on-surface/5 rounded-3xl overflow-hidden">
                <CardHeader className="bg-surface-container-low/20 border-b border-outline-variant/5 p-8">
                  <div className="flex items-center gap-4">
                    <div className="w-1.5 h-6 bg-primary-custom rounded-full" />
                    <CardTitle className="text-2xl font-black text-on-surface tracking-tighter uppercase italic">Organization Details</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-8 space-y-10">
                  <form onSubmit={handleSubmit} className="space-y-10">
                    {/* Logo Upload Area */}
                    <div className="space-y-4">
                      <Label className="text-[11px] font-black uppercase tracking-[0.2em] text-outline ml-1">Business Logo</Label>
                      <div className="border-2 border-dashed border-outline-variant/30 rounded-3xl p-12 flex flex-col items-center justify-center bg-surface-container-low/10 hover:bg-surface-container-low/30 hover:border-primary-custom/30 transition-all group cursor-pointer">
                        <div className="w-20 h-20 rounded-3xl bg-surface-container-lowest shadow-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform">
                          <CloudUpload className="h-10 w-10 text-primary-custom" />
                        </div>
                        <p className="text-on-surface font-black text-lg">Click or drag logo to upload</p>
                        <p className="text-on-surface-variant text-sm font-semibold opacity-60 mt-2">PNG, JPG or SVG (Max. 800x400px)</p>
                      </div>
                    </div>

                    {/* Fields Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2.5">
                        <Label className="text-[11px] font-black uppercase tracking-[0.2em] text-outline ml-1" htmlFor="businessName">Business Name</Label>
                        <Input
                          id="businessName"
                          className="h-14 bg-surface-container-low/20 border-outline-variant/15 font-bold rounded-2xl focus:ring-primary-custom"
                          value={settings.businessName}
                          onChange={(e) => setSettings({ ...settings, businessName: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2.5">
                        <Label className="text-[11px] font-black uppercase tracking-[0.2em] text-outline ml-1" htmlFor="businessTaxId">Tax ID / VAT Number</Label>
                        <Input
                          id="businessTaxId"
                          placeholder="e.g. DE123456789"
                          className="h-14 bg-surface-container-low/20 border-outline-variant/15 font-bold rounded-2xl focus:ring-primary-custom"
                          value={settings.businessTaxId}
                          onChange={(e) => setSettings({ ...settings, businessTaxId: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2.5 md:col-span-2">
                        <Label className="text-[11px] font-black uppercase tracking-[0.2em] text-outline ml-1" htmlFor="businessAddress">Office Address</Label>
                        <Input
                          id="businessAddress"
                          className="h-14 bg-surface-container-low/20 border-outline-variant/15 font-bold rounded-2xl focus:ring-primary-custom"
                          value={settings.businessAddress}
                          onChange={(e) => setSettings({ ...settings, businessAddress: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2.5">
                        <Label className="text-[11px] font-black uppercase tracking-[0.2em] text-outline ml-1" htmlFor="businessEmail">Business Email</Label>
                        <Input
                          id="businessEmail"
                          type="email"
                          className="h-14 bg-surface-container-low/20 border-outline-variant/15 font-bold rounded-2xl focus:ring-primary-custom"
                          value={settings.businessEmail}
                          onChange={(e) => setSettings({ ...settings, businessEmail: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2.5">
                        <Label className="text-[11px] font-black uppercase tracking-[0.2em] text-outline ml-1" htmlFor="businessPhone">Phone Number</Label>
                        <Input
                          id="businessPhone"
                          className="h-14 bg-surface-container-low/20 border-outline-variant/15 font-bold rounded-2xl focus:ring-primary-custom"
                          value={settings.businessPhone}
                          onChange={(e) => setSettings({ ...settings, businessPhone: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2.5">
                        <Label className="text-[11px] font-black uppercase tracking-[0.2em] text-outline ml-1" htmlFor="businessWebsite">Website</Label>
                        <Input
                          id="businessWebsite"
                          type="url"
                          className="h-14 bg-surface-container-low/20 border-outline-variant/15 font-bold rounded-2xl focus:ring-primary-custom"
                          value={settings.businessWebsite}
                          onChange={(e) => setSettings({ ...settings, businessWebsite: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2.5">
                        <Label className="text-[11px] font-black uppercase tracking-[0.2em] text-outline ml-1">Default Currency</Label>
                        <Select
                          value={settings.currency}
                          onValueChange={(val) => setSettings({ ...settings, currency: val as string })}
                        >
                          <SelectTrigger className="h-14 bg-surface-container-low/20 border-outline-variant/15 font-bold rounded-2xl">
                            <SelectValue placeholder="Select currency" />
                          </SelectTrigger>
                          <SelectContent className="rounded-2xl border-outline-variant/10">
                            <SelectItem value="USD">USD ($) - US Dollar</SelectItem>
                            <SelectItem value="EUR">EUR (€) - Euro</SelectItem>
                            <SelectItem value="GBP">GBP (£) - British Pound</SelectItem>
                            <SelectItem value="JPY">JPY (¥) - Japanese Yen</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="pt-10 border-t border-outline-variant/5 flex justify-end gap-6">
                      <Button
                        type="button"
                        variant="ghost"
                        className="h-14 px-8 rounded-2xl font-black uppercase tracking-widest text-on-surface-variant hover:bg-surface-container-high transition-all"
                        onClick={() => fetchSettings()}
                      >
                        Discard
                      </Button>
                      <Button
                        type="submit"
                        className="h-14 px-10 rounded-2xl font-black uppercase tracking-widest bg-gradient-to-r from-primary-custom to-primary-container text-white shadow-2xl shadow-primary-custom/30 hover:shadow-primary-custom/50 active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50"
                        disabled={saving}
                      >
                        {saving ? <Loader2 className="h-6 w-6 animate-spin" /> : <Save className="h-6 w-6" />}
                        Save Changes
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* Invoice Defaults Tab Teaser (Visual only as per mockup) */}
              <div className="bg-surface-container-low/50 rounded-3xl p-10 border border-outline-variant/10 space-y-8">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="text-2xl font-black tracking-tight uppercase italic italic">Invoice Defaults</h3>
                    <p className="text-on-surface-variant font-semibold opacity-60 italic italic">Preset your billing logic for new invoices.</p>
                  </div>
                  <Button
                    variant="link"
                    className="text-primary-custom font-black flex items-center gap-2 group p-0 italic italic"
                    onClick={() => setActiveTab("invoice")}
                  >
                    Edit Settings <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="bg-surface-container-lowest p-8 rounded-3xl shadow-xl shadow-on-surface/5 border border-outline-variant/5 text-center space-y-2 transform hover:-translate-y-1 transition-transform">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-outline">Payment Terms</p>
                    <p className="text-3xl font-black tracking-tighter text-on-surface">{settings.paymentTerms}</p>
                  </div>
                  <div className="bg-surface-container-lowest p-8 rounded-3xl shadow-xl shadow-on-surface/5 border border-outline-variant/5 text-center space-y-2 transform hover:-translate-y-1 transition-transform">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-outline">Tax Rate</p>
                    <p className="text-3xl font-black tracking-tighter text-on-surface">{settings.taxRate.toFixed(1)}%</p>
                  </div>
                  <div className="bg-surface-container-lowest p-8 rounded-3xl shadow-xl shadow-on-surface/5 border border-outline-variant/5 text-center space-y-4 transform hover:-translate-y-1 transition-transform">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-outline">Theme Accent</p>
                    <div className="flex justify-center gap-3">
                      {[ 
                        { name: "Indigo", color: "#4648d4" },
                        { name: "Rose", color: "#f43f5e" },
                        { name: "Emerald", color: "#10b981" },
                        { name: "Amber", color: "#f59e0b" },
                        { name: "Cyan", color: "#06b6d4" }
                      ].map((c) => (
                        <button
                          key={c.color}
                          type="button"
                          onClick={() => {
                            setSettings({ ...settings, themeColor: c.color });
                            setGlobalThemeColor(c.color); // Live preview
                          }}
                          className={`w-10 h-10 rounded-full transition-all hover:scale-110 active:scale-95 ${
                            settings.themeColor === c.color 
                              ? "ring-4 ring-offset-2 ring-primary-custom shadow-lg" 
                              : "opacity-40 hover:opacity-100"
                          }`}
                          style={{ backgroundColor: c.color }}
                          title={c.name}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Notes Mockup */}
                <div className="bg-surface-container-lowest p-8 rounded-3xl shadow-xl shadow-on-surface/5 border border-outline-variant/5 space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-outline">Default Invoice Notes</p>
                  <div className="space-y-3">
                    <div className="h-2 w-full bg-surface-container-high/50 rounded-full" />
                    <div className="h-2 w-3/4 bg-surface-container-high/50 rounded-full" />
                    <div className="h-2 w-1/2 bg-surface-container-high/50 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab !== "profile" && (
            <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-6 animate-in fade-in duration-500">
               <div className="w-20 h-20 bg-surface-container-low rounded-3xl flex items-center justify-center">
                  <Settings2 className="h-10 w-10 text-outline animate-pulse" />
               </div>
               <div className="space-y-2">
                 <h3 className="text-2xl font-black tracking-tight text-on-surface">Tab under construction</h3>
                 <p className="text-on-surface-variant font-semibold opacity-60">The {activeTab} section will be available in the next release.</p>
               </div>
               <Button
                 variant="outline"
                 className="h-14 px-8 rounded-2xl font-black uppercase tracking-widest border-outline-variant/20"
                 onClick={() => setActiveTab("profile")}
               >
                 Go back to Business Profile
               </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


