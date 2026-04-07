"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";

interface UserSettings {
  name: string;
  email: string;
  businessName: string;
  businessAddress: string;
  businessTaxId: string;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings>({
    name: "",
    email: "",
    businessName: "",
    businessAddress: "",
    businessTaxId: "",
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
        body: JSON.stringify({
          name: settings.name,
          businessName: settings.businessName,
          businessAddress: settings.businessAddress,
          businessTaxId: settings.businessTaxId,
        }),
      });

      if (res.ok) {
        toast.success("Settings saved successfully");
      } else {
        const data = await res.json();
        const message = data.message || "Failed to save settings";
        setError(message);
        toast.error(message);
      }
    } catch (err) {
      setError("An error occurred");
      toast.error("An error occurred");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary-custom/40" />
      </div>
    );
  }

  return (
    <div className="p-8 lg:p-12">
      <div className="mb-10 max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight text-on-surface mb-2">
          Settings
        </h1>
        <p className="text-on-surface-variant font-medium">
          Manage your account and professional business profile.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-8">
        {error && (
          <div className="rounded-xl bg-error/10 border border-error/20 p-4 text-sm text-error font-semibold">
            {error}
          </div>
        )}

        {/* Account Settings */}
        <Card className="border-outline-variant/15 bg-surface-container-lowest shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="border-b border-outline-variant/5 bg-surface-container-low/20">
            <CardTitle className="text-lg font-bold text-on-surface">Account</CardTitle>
            <CardDescription className="font-medium text-on-surface-variant/80">Your personal account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-outline ml-1" htmlFor="name">Full Name</Label>
              <Input
                id="name"
                className="bg-surface-container-low/30 border-outline-variant/10 font-medium focus:ring-primary-custom"
                value={settings.name}
                onChange={(e) =>
                  setSettings({ ...settings, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-outline ml-1" htmlFor="email">Email</Label>
              <Input
                id="email"
                value={settings.email}
                disabled
                className="bg-surface-container-low/50 border-outline-variant/10 font-medium opacity-70"
              />
              <p className="px-1 text-[10px] font-bold text-outline-variant/80 uppercase tracking-wider">
                Note: Email cannot be changed
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Business Profile */}
        <Card className="border-outline-variant/15 bg-surface-container-lowest shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="border-b border-outline-variant/5 bg-surface-container-low/20">
            <CardTitle className="text-lg font-bold text-on-surface">Business Profile</CardTitle>
            <CardDescription className="font-medium text-on-surface-variant/80">
              This information appears on your professional invoices
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-outline ml-1" htmlFor="businessName">Business Name</Label>
              <Input
                id="businessName"
                placeholder="Your Company LLC"
                className="bg-surface-container-low/30 border-outline-variant/10 font-medium focus:ring-primary-custom"
                value={settings.businessName}
                onChange={(e) =>
                  setSettings({ ...settings, businessName: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-outline ml-1" htmlFor="businessAddress">Business Address</Label>
              <Input
                id="businessAddress"
                placeholder="123 Main St, City, State ZIP"
                className="bg-surface-container-low/30 border-outline-variant/10 font-medium focus:ring-primary-custom"
                value={settings.businessAddress}
                onChange={(e) =>
                  setSettings({ ...settings, businessAddress: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-outline ml-1" htmlFor="businessTaxId">Tax ID / VAT Number</Label>
              <Input
                id="businessTaxId"
                placeholder="XX-XXXXXXX"
                className="bg-surface-container-low/30 border-outline-variant/10 font-medium focus:ring-primary-custom"
                value={settings.businessTaxId}
                onChange={(e) =>
                  setSettings({ ...settings, businessTaxId: e.target.value })
                }
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end pt-4 pb-12">
          <Button type="submit" className="px-8 py-6 rounded-xl font-bold gap-3 shadow-lg shadow-primary-custom/20 active:scale-95 transition-transform" disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Saving Ledger...</span>
              </>
            ) : (
              <>
                <Save className="h-5 w-5" />
                <span>Save Changes</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
