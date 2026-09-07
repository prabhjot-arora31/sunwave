"use client";

import { useEffect, useState } from "react";
import { Loader2, Plus, Trash2, CheckCircle2, AlertCircle } from "lucide-react";
import type { SiteSettingsData } from "@/lib/siteSettings";

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sun-500 focus:outline-none focus:ring-2 focus:ring-sun-500/30 transition";
const labelClass = "block text-sm font-medium text-slate-700 mb-1.5";

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const [settings, setSettings] = useState<SiteSettingsData | null>(null);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => setSettings(data.settings))
      .finally(() => setLoading(false));
  }, []);

  function updateField<K extends keyof SiteSettingsData>(key: K, value: SiteSettingsData[K]) {
    setSettings((prev) => (prev ? { ...prev, [key]: value } : prev));
    setSaved(false);
  }

  function updatePartner(index: number, value: string) {
    if (!settings) return;
    const next = [...settings.financePartners];
    next[index] = value;
    updateField("financePartners", next);
  }

  function addPartner() {
    if (!settings) return;
    updateField("financePartners", [...settings.financePartners, ""]);
  }

  function removePartner(index: number) {
    if (!settings) return;
    updateField(
      "financePartners",
      settings.financePartners.filter((_, i) => i !== index)
    );
  }

  function updateSlab(index: number, field: "capacity" | "subsidy", value: string) {
    if (!settings) return;
    const next = settings.subsidySlabs.map((s, i) => (i === index ? { ...s, [field]: value } : s));
    updateField("subsidySlabs", next);
  }

  function addSlab() {
    if (!settings) return;
    updateField("subsidySlabs", [...settings.subsidySlabs, { capacity: "", subsidy: "" }]);
  }

  function removeSlab(index: number) {
    if (!settings) return;
    updateField(
      "subsidySlabs",
      settings.subsidySlabs.filter((_, i) => i !== index)
    );
  }

  async function handleSave() {
    if (!settings) return;
    setError("");
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Failed to save settings");
      }
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  if (loading || !settings) {
    return (
      <div className="flex justify-center py-20 text-slate-400">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Site Settings</h1>
        <p className="text-sm text-slate-500 mt-1">
          Edit the marketing figures shown across the public site - changes go live within the hour
          (or immediately on your next visit to a page, thanks to cache invalidation).
        </p>
      </div>

      <div className="rounded-2xl bg-white border border-slate-200 p-6 space-y-8">
        <div>
          <h3 className="text-lg font-bold text-sky-950 mb-4">Company Stats</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Years of Experience</label>
              <input
                value={settings.yearsExperience}
                onChange={(e) => updateField("yearsExperience", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Happy Customers</label>
              <input
                value={settings.happyCustomers}
                onChange={(e) => updateField("happyCustomers", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>MW Installed Capacity</label>
              <input
                value={settings.mwCapacity}
                onChange={(e) => updateField("mwCapacity", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Cities Served</label>
              <input
                value={settings.citiesServed}
                onChange={(e) => updateField("citiesServed", e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-6">
          <h3 className="text-lg font-bold text-sky-950 mb-4">Finance</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            <div>
              <label className={labelClass}>Loan Amount</label>
              <input
                value={settings.loanAmount}
                onChange={(e) => updateField("loanAmount", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Interest Rate</label>
              <input
                value={settings.interestRate}
                onChange={(e) => updateField("interestRate", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Tenure</label>
              <input
                value={settings.loanTenure}
                onChange={(e) => updateField("loanTenure", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Processing</label>
              <input
                value={settings.loanProcessing}
                onChange={(e) => updateField("loanProcessing", e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <label className={labelClass}>Financing Partners</label>
          <div className="space-y-2">
            {settings.financePartners.map((p, i) => (
              <div key={i} className="flex gap-2">
                <input value={p} onChange={(e) => updatePartner(i, e.target.value)} className={inputClass} />
                <button
                  onClick={() => removePartner(i)}
                  disabled={settings.financePartners.length === 1}
                  className="p-2.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 disabled:opacity-30"
                  aria-label="Remove partner"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
          <button onClick={addPartner} className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-sun-700 hover:text-sun-800">
            <Plus className="h-4 w-4" /> Add Partner
          </button>
        </div>

        <div className="border-t border-slate-100 pt-6">
          <h3 className="text-lg font-bold text-sky-950 mb-4">Subsidy Slabs</h3>
          <div className="space-y-2">
            {settings.subsidySlabs.map((slab, i) => (
              <div key={i} className="grid grid-cols-12 gap-2">
                <input
                  value={slab.capacity}
                  onChange={(e) => updateSlab(i, "capacity", e.target.value)}
                  placeholder="e.g. 3 kW and above"
                  className={`${inputClass} col-span-6`}
                />
                <input
                  value={slab.subsidy}
                  onChange={(e) => updateSlab(i, "subsidy", e.target.value)}
                  placeholder="e.g. ₹78,000"
                  className={`${inputClass} col-span-5`}
                />
                <button
                  onClick={() => removeSlab(i)}
                  disabled={settings.subsidySlabs.length === 1}
                  className="col-span-1 p-2.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 disabled:opacity-30"
                  aria-label="Remove slab"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
          <button onClick={addSlab} className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-sun-700 hover:text-sun-800">
            <Plus className="h-4 w-4" /> Add Slab
          </button>
        </div>

        {error && (
          <p className="flex items-center gap-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
            <AlertCircle className="h-4 w-4" /> {error}
          </p>
        )}
        {saved && (
          <p className="flex items-center gap-2 text-sm font-medium text-leaf-700 bg-leaf-500/10 border border-leaf-500/20 rounded-lg px-4 py-2.5">
            <CheckCircle2 className="h-4 w-4" /> Saved. Public pages will reflect this within the hour.
          </p>
        )}

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-sun-700 px-8 py-3.5 text-sm font-semibold text-white shadow-md hover:bg-sun-800 transition-colors disabled:opacity-70"
        >
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </div>
  );
}
