import { Building2, Save } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../context/AuthContext";
import {
  getBusinessSetting,
  saveBusinessSettings,
} from "../services/firestoreService";

const Settings = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    companyName: "StockFlow",
    tagline: "Invoice & Inventory Solutions",
    phone: "",
    email: "",
    gstin: "",
    address: "",
    defaultNotes: "",
  });

  useEffect(() => {
    const loadSettings = async () => {
      if (!currentUser?.uid) return;
      try {
        setLoading(true);
        const saved = await getBusinessSetting(currentUser.uid);
        if (saved) {
          setFormData((prev) => ({
            ...prev,
            ...saved,
          }));
        }
      } catch (err) {
        console.error("Failed to load settings:", err)
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "gstin" ? value.toUpperCase() : value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!currentUser?.uid || saving) return;

    try {
      setSaving(true);
      await saveBusinessSettings(currentUser.uid, formData);
      if (formData.defaultNotes) {
        localStorage.setItem("defaultInvoiceNotes", formData.defaultNotes);
      }
      alert("Business settings saved!");
    } catch (err) {
      console.error("Failed to save settings:", err);
      alert("Error saving settings: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <p className="text-sm text-gray-500">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <Link
          to="/dashboard"
          className="text-sm text-gray-500 hover:text-gray-900"
        >
          ← Back to Dashboard
        </Link>

        <div className="mt-2 mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            Business Settings
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Configure your company profile and default invoice details
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Company Profile */}
          <section className="bg-white border border-gray-200 rounded-xl p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-5">
              <Building2 size={18} className="text-gray-600" />
              <h2 className="text-base font-semibold text-gray-900">
                Company Profile (Printed on Invoices & Pro Formas)
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-700">
                  Business / Store Name *
                </label>
                <input
                  type="text"
                  name="companyName"
                  required
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="e.g. Apex Electronics Pvt Ltd"
                  className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-700">
                  Tagline / Subtitle
                </label>
                <input
                  type="text"
                  name="tagline"
                  value={formData.tagline}
                  onChange={handleChange}
                  placeholder="e.g. IT Hardware & Networking Solutions"
                  className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-700">
                  Business Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="billing@yourcompany.com"
                  className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-700">
                  Company GSTIN
                </label>
                <input
                  type="text"
                  name="gstin"
                  value={formData.gstin}
                  onChange={handleChange}
                  placeholder="07AAAAA0000A1Z5"
                  className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono outline-none focus:border-gray-400 uppercase"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-medium text-gray-700">
                  Registered Address
                </label>
                <textarea
                  rows={2}
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Shop/Office No., Street, City, State, PIN"
                  className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400 resize-none"
                />
              </div>
            </div>
          </section>

          {/* Default Notes & Bank Details */}
          <section className="bg-white border border-gray-200 rounded-xl p-5 sm:p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-1">
              Default Invoice Terms & Bank Details
            </h2>
            <p className="text-xs text-gray-500 mb-4">
              Automatically pre-fills the Notes section when creating new
              Invoices or Pro Formas
            </p>

            <textarea
              rows={4}
              name="defaultNotes"
              value={formData.defaultNotes}
              onChange={handleChange}
              placeholder="Bank Name: HDFC Bank | A/C: 1234567890 | IFSC: HDFC0001234&#10;Goods once sold will not be taken back."
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-gray-400 resize-none"
            />
          </section>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition cursor-pointer disabled:opacity-50"
            >
              <Save size={16} />
              {saving ? "Saving..." : "Save Settings"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
