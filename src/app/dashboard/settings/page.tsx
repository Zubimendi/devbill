"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2, Save, CheckCircle2 } from "lucide-react";
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
        <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Settings
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          Manage your account and business profile
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        {error && (
          <div className="rounded-lg bg-destructive/15 p-3 text-sm text-destructive font-medium">
            {error}
          </div>
        )}

        {/* Account Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Account</CardTitle>
            <CardDescription>Your personal account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={settings.name}
                onChange={(e) =>
                  setSettings({ ...settings, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={settings.email}
                disabled
                className="bg-zinc-50 dark:bg-zinc-800"
              />
              <p className="text-xs text-zinc-500">
                Email cannot be changed
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Business Profile */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Business Profile</CardTitle>
            <CardDescription>
              This information appears on your invoices
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="businessName">Business Name</Label>
              <Input
                id="businessName"
                placeholder="Your Company LLC"
                value={settings.businessName}
                onChange={(e) =>
                  setSettings({ ...settings, businessName: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="businessAddress">Business Address</Label>
              <Input
                id="businessAddress"
                placeholder="123 Main St, City, State ZIP"
                value={settings.businessAddress}
                onChange={(e) =>
                  setSettings({ ...settings, businessAddress: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="businessTaxId">Tax ID / VAT Number</Label>
              <Input
                id="businessTaxId"
                placeholder="XX-XXXXXXX"
                value={settings.businessTaxId}
                onChange={(e) =>
                  setSettings({ ...settings, businessTaxId: e.target.value })
                }
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" className="gap-2" disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
