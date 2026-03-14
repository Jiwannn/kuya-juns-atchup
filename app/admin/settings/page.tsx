"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { 
  Settings, 
  Save, 
  RefreshCw,
  Phone,
  Mail,
  MapPin,
  Clock,
  Facebook,
  Instagram,
  Twitter,
  AlertCircle
} from "lucide-react";
import Link from "next/link";

interface ContactSettings {
  phone: string;
  email: string;
  address: string;
  business_hours: string;
  facebook: string;
  instagram: string;
  twitter: string;
}

export default function AdminSettings() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [contactSettings, setContactSettings] = useState<ContactSettings>({
    phone: "0938 585 9744",
    email: "febiemosura983@gmail.com",
    address: "Available on FoodPanda & GrabFood",
    business_hours: "Monday - Sunday, 9:00 AM - 9:00 PM",
    facebook: "#",
    instagram: "#",
    twitter: "#"
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
      console.log("Fetched settings:", data);
      
      setContactSettings({
        phone: data.phone || "0938 585 9744",
        email: data.email || "febiemosura983@gmail.com",
        address: data.address || "Available on FoodPanda & GrabFood",
        business_hours: data.business_hours || "Monday - Sunday, 9:00 AM - 9:00 PM",
        facebook: data.facebook || "#",
        instagram: data.instagram || "#",
        twitter: data.twitter || "#"
      });
    } catch (error) {
      console.error("Error fetching settings:", error);
      setError("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      console.log("Saving contact settings:", contactSettings);
      
      const response = await fetch("/api/admin/contact-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactSettings)
      });

      const result = await response.json();
      console.log("Save response:", result);

      if (!response.ok) {
        throw new Error(result.error || "Failed to save settings");
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      
      // Refresh the data
      await fetchSettings();
      
    } catch (error) {
      console.error("Error saving settings:", error);
      setError(error instanceof Error ? error.message : "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading settings...</p>
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
                  value={contactSettings.phone}
                  onChange={(e) => setContactSettings({...contactSettings, phone: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="e.g., 0938 585 9744"
                />
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
                  value={contactSettings.email}
                  onChange={(e) => setContactSettings({...contactSettings, email: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="e.g., contact@kuyajuns.com"
                />
              </div>
            </div>

            {/* Address */}
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
                  value={contactSettings.address}
                  onChange={(e) => setContactSettings({...contactSettings, address: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="e.g., Available on FoodPanda & GrabFood"
                />
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
                  value={contactSettings.business_hours}
                  onChange={(e) => setContactSettings({...contactSettings, business_hours: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="e.g., Monday - Sunday, 9:00 AM - 9:00 PM"
                />
              </div>
            </div>

            {/* Social Media */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Social Media Links</h3>
              
              {/* Facebook */}
              <div className="flex items-start gap-4 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Facebook className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Facebook URL
                  </label>
                  <input
                    type="url"
                    value={contactSettings.facebook}
                    onChange={(e) => setContactSettings({...contactSettings, facebook: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="https://facebook.com/kuyajuns"
                  />
                </div>
              </div>

              {/* Instagram */}
              <div className="flex items-start gap-4 mb-4">
                <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Instagram className="w-5 h-5 text-pink-600" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Instagram URL
                  </label>
                  <input
                    type="url"
                    value={contactSettings.instagram}
                    onChange={(e) => setContactSettings({...contactSettings, instagram: e.target.value})}
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
                    value={contactSettings.twitter}
                    onChange={(e) => setContactSettings({...contactSettings, twitter: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="https://twitter.com/kuyajuns"
                  />
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="mt-8 border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Preview</h3>
              <div className="bg-gradient-to-br from-orange-600 to-orange-500 rounded-xl p-6 text-white">
                <h4 className="text-xl font-bold mb-4">How customers will see it</h4>
                <div className="space-y-2">
                  <p><span className="text-orange-200">Phone:</span> {contactSettings.phone}</p>
                  <p><span className="text-orange-200">Email:</span> {contactSettings.email}</p>
                  <p><span className="text-orange-200">Address:</span> {contactSettings.address}</p>
                  <p><span className="text-orange-200">Hours:</span> {contactSettings.business_hours}</p>
                  <div className="flex gap-2 mt-4">
                    {contactSettings.facebook !== '#' && (
                      <span className="bg-white/20 px-3 py-1 rounded">Facebook</span>
                    )}
                    {contactSettings.instagram !== '#' && (
                      <span className="bg-white/20 px-3 py-1 rounded">Instagram</span>
                    )}
                    {contactSettings.twitter !== '#' && (
                      <span className="bg-white/20 px-3 py-1 rounded">Twitter</span>
                    )}
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