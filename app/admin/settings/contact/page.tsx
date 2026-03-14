"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Facebook, 
  Instagram, 
  Twitter,
  Save,
  RefreshCw,
  AlertCircle
} from "lucide-react";
import Link from "next/link";

interface ContactSettings {
  id: number;
  phone: string;
  email: string;
  address: string;
  business_hours: string;
  facebook: string;
  instagram: string;
  twitter: string;
  updated_at: string;
}

export default function AdminContactSettings() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [settings, setSettings] = useState<ContactSettings>({
    id: 1,
    phone: "0938 585 9744",
    email: "febiemosura983@gmail.com",
    address: "Available on FoodPanda & GrabFood",
    business_hours: "Monday - Sunday, 9:00 AM - 9:00 PM",
    facebook: "#",
    instagram: "#",
    twitter: "#",
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
      setError(null);
      const response = await fetch("/api/admin/contact-settings");
      
      if (!response.ok) {
        throw new Error("Failed to fetch settings");
      }
      
      const data = await response.json();
      setSettings({
        id: data.id || 1,
        phone: data.phone || "0938 585 9744",
        email: data.email || "febiemosura983@gmail.com",
        address: data.address || "Available on FoodPanda & GrabFood",
        business_hours: data.business_hours || "Monday - Sunday, 9:00 AM - 9:00 PM",
        facebook: data.facebook || "#",
        instagram: data.instagram || "#",
        twitter: data.twitter || "#",
        updated_at: data.updated_at || new Date().toISOString()
      });
    } catch (error) {
      console.error("Error fetching contact settings:", error);
      setError("Failed to load contact settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch("/api/admin/contact-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings)
      });

      if (!response.ok) {
        throw new Error("Failed to save settings");
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Error saving settings:", error);
      setError("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading contact settings...</p>
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
            <h1 className="text-3xl font-bold text-orange-800">Contact Settings</h1>
            <p className="text-gray-600 mt-1">Configure your business contact information</p>
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

        {/* Error/Success Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center gap-3">
            <div className="w-5 h-5 text-green-500">✓</div>
            <p className="text-green-700">Settings saved successfully!</p>
          </div>
        )}

        {/* Contact Settings Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="space-y-6">
            {/* Phone */}
            <div className="flex items-start gap-4 p-4 bg-orange-50 rounded-xl">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5 text-orange-600" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={settings.phone}
                  onChange={(e) => setSettings({...settings, phone: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="e.g., 0938 585 9744"
                />
                <p className="text-xs text-gray-500 mt-1">Customers will see this number to call or text</p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-4 p-4 bg-orange-50 rounded-xl">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-orange-600" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings({...settings, email: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="e.g., contact@kuyajuns.com"
                />
                <p className="text-xs text-gray-500 mt-1">Customer inquiries will be sent here</p>
              </div>
            </div>

            {/* Address / Delivery Partners */}
            <div className="flex items-start gap-4 p-4 bg-orange-50 rounded-xl">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-orange-600" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address / Delivery Partners
                </label>
                <input
                  type="text"
                  value={settings.address}
                  onChange={(e) => setSettings({...settings, address: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="e.g., Available on FoodPanda & GrabFood"
                />
                <p className="text-xs text-gray-500 mt-1">Your location or delivery partners</p>
              </div>
            </div>

            {/* Business Hours */}
            <div className="flex items-start gap-4 p-4 bg-orange-50 rounded-xl">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Hours
                </label>
                <input
                  type="text"
                  value={settings.business_hours}
                  onChange={(e) => setSettings({...settings, business_hours: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="e.g., Monday - Sunday, 9:00 AM - 9:00 PM"
                />
                <p className="text-xs text-gray-500 mt-1">When you're open for business</p>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Social Media</h3>
              
              <div className="space-y-4">
                {/* Facebook */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Facebook className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Facebook URL
                    </label>
                    <input
                      type="url"
                      value={settings.facebook}
                      onChange={(e) => setSettings({...settings, facebook: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="https://facebook.com/kuyajuns"
                    />
                  </div>
                </div>

                {/* Instagram */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Instagram className="w-5 h-5 text-pink-600" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Instagram URL
                    </label>
                    <input
                      type="url"
                      value={settings.instagram}
                      onChange={(e) => setSettings({...settings, instagram: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="https://instagram.com/kuyajuns"
                    />
                  </div>
                </div>

                {/* Twitter */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Twitter className="w-5 h-5 text-sky-600" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Twitter URL
                    </label>
                    <input
                      type="url"
                      value={settings.twitter}
                      onChange={(e) => setSettings({...settings, twitter: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="https://twitter.com/kuyajuns"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Preview Section */}
            <div className="mt-8 border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Preview</h3>
              <div className="bg-gradient-to-br from-orange-600 to-orange-500 rounded-xl p-6 text-white">
                <h4 className="text-xl font-bold mb-4">How customers will see it</h4>
                <div className="space-y-3">
                  <p><span className="text-orange-200">Phone:</span> {settings.phone}</p>
                  <p><span className="text-orange-200">Email:</span> {settings.email}</p>
                  <p><span className="text-orange-200">Address:</span> {settings.address}</p>
                  <p><span className="text-orange-200">Hours:</span> {settings.business_hours}</p>
                  <div className="flex gap-2 mt-2">
                    {settings.facebook !== '#' && <span className="bg-white/20 px-3 py-1 rounded">f</span>}
                    {settings.instagram !== '#' && <span className="bg-white/20 px-3 py-1 rounded">ig</span>}
                    {settings.twitter !== '#' && <span className="bg-white/20 px-3 py-1 rounded">t</span>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}