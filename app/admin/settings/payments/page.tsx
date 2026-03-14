"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { 
  Wallet, 
  Landmark, 
  CreditCard, 
  Save, 
  Smartphone,
  Building2,
  DollarSign,
  RefreshCw
} from "lucide-react";
import Link from "next/link";

interface PaymentSettings {
  id: number;
  gcash_number: string;
  gcash_name: string;
  bank_name: string;
  bank_account_name: string;
  bank_account_number: string;
  bank_account_type: string;
  cod_available: boolean;
  updated_at: string;
}

export default function AdminPaymentSettings() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<PaymentSettings>({
    id: 1,
    gcash_number: "0938 585 9744",
    gcash_name: "Febie M.",
    bank_name: "BDO",
    bank_account_name: "Kuya Jun's Atchup Sabaw",
    bank_account_number: "1234-5678-9012",
    bank_account_type: "Savings",
    cod_available: true,
    updated_at: new Date().toISOString()
  });

  useEffect(() => {
    if (status === "loading") return;

    if (!session || session?.user?.role !== 'admin') {
      router.push("/");
      return;
    }

    fetchSettings();
  }, [session, status, router]);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/payment-settings");
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error("Error fetching payment settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/admin/payment-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings)
      });

      if (response.ok) {
        alert("Payment settings updated successfully!");
      } else {
        alert("Failed to update settings");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Error saving settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payment settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-orange-800">Payment Settings</h1>
            <p className="text-gray-600 mt-1">Configure payment methods for your customers</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={fetchSettings}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        {/* GCash Settings */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">GCash Settings</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                GCash Number
              </label>
              <input
                type="text"
                value={settings.gcash_number}
                onChange={(e) => setSettings({...settings, gcash_number: e.target.value})}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="0917 123 4567"
              />
              <p className="text-xs text-gray-500 mt-1">Format: 0917 123 4567</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                GCash Account Name
              </label>
              <input
                type="text"
                value={settings.gcash_name}
                onChange={(e) => setSettings({...settings, gcash_name: e.target.value})}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Account Name"
              />
            </div>
          </div>

          {/* Preview */}
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-2">Customer will see:</p>
            <div className="bg-white p-3 rounded border border-blue-200">
              <p className="text-sm"><span className="font-medium">GCash Number:</span> {settings.gcash_number}</p>
              <p className="text-sm"><span className="font-medium">Account Name:</span> {settings.gcash_name}</p>
            </div>
          </div>
        </div>

        {/* Bank Transfer Settings */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Bank Transfer Settings</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bank Name
              </label>
              <input
                type="text"
                value={settings.bank_name}
                onChange={(e) => setSettings({...settings, bank_name: e.target.value})}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="e.g., BDO, BPI, Metrobank"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account Type
              </label>
              <select
                value={settings.bank_account_type}
                onChange={(e) => setSettings({...settings, bank_account_type: e.target.value})}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="Savings">Savings</option>
                <option value="Checking">Checking</option>
                <option value="Current">Current</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account Name
              </label>
              <input
                type="text"
                value={settings.bank_account_name}
                onChange={(e) => setSettings({...settings, bank_account_name: e.target.value})}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Account Name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account Number
              </label>
              <input
                type="text"
                value={settings.bank_account_number}
                onChange={(e) => setSettings({...settings, bank_account_number: e.target.value})}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Account Number"
              />
            </div>
          </div>

          {/* Preview */}
          <div className="mt-4 p-4 bg-green-50 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-2">Customer will see:</p>
            <div className="bg-white p-3 rounded border border-green-200">
              <p className="text-sm"><span className="font-medium">Bank:</span> {settings.bank_name}</p>
              <p className="text-sm"><span className="font-medium">Account Type:</span> {settings.bank_account_type}</p>
              <p className="text-sm"><span className="font-medium">Account Name:</span> {settings.bank_account_name}</p>
              <p className="text-sm"><span className="font-medium">Account Number:</span> {settings.bank_account_number}</p>
            </div>
          </div>
        </div>

        {/* Cash on Delivery Settings */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-orange-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Cash on Delivery</h2>
          </div>

          <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-lg">
            <input
              type="checkbox"
              id="cod_available"
              checked={settings.cod_available}
              onChange={(e) => setSettings({...settings, cod_available: e.target.checked})}
              className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500"
            />
            <label htmlFor="cod_available" className="text-sm font-medium text-gray-700">
              Enable Cash on Delivery
            </label>
          </div>

          <p className="text-xs text-gray-500 mt-2">
            When enabled, customers can choose to pay cash upon delivery.
          </p>
        </div>

        {/* Last Updated */}
        <div className="mt-4 text-right text-sm text-gray-500">
          Last updated: {new Date(settings.updated_at).toLocaleString()}
        </div>
      </div>
    </div>
  );
}