"use client";

import type { Lead } from "@prisma/client";
import { X, Phone, Home, Zap } from "lucide-react";

function Field({ label, value }: { label: string; value?: string | number | null }) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div>
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-sm font-medium text-slate-900">{value}</p>
    </div>
  );
}

export default function LeadDetailModal({ lead, onClose }: { lead: Lead; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-slate-100 sticky top-0 bg-white">
          <h2 className="text-lg font-bold text-slate-900">{lead.fullName}</h2>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-slate-100" aria-label="Close">
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-6">
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3 flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5" /> Contact
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Mobile" value={lead.mobile} />
              <Field label="WhatsApp" value={lead.whatsapp} />
              <Field label="Email" value={lead.email} />
              <Field label="City" value={lead.city} />
              <Field label="Pincode" value={lead.pincode} />
            </div>
            <div className="mt-3">
              <Field label="Address" value={lead.address} />
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3 flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5" /> Solar Requirement
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Property Type" value={lead.propertyType} />
              <Field label="Preferred Capacity" value={lead.capacity} />
              <Field label="Monthly Bill" value={lead.monthlyBill ? `₹${lead.monthlyBill}` : null} />
              <Field label="Monthly Units" value={lead.monthlyUnits} />
              <Field label="Connection Type" value={lead.connectionType} />
              <Field label="Roof Type" value={lead.roofType} />
              <Field label="Battery Required" value={lead.battery} />
              <Field label="Finance Required" value={lead.finance} />
              <Field label="Subsidy Required" value={lead.subsidy} />
              <Field
                label="Preferred Installation Date"
                value={lead.installDate ? new Date(lead.installDate).toLocaleDateString("en-IN") : null}
              />
            </div>
          </div>

          {lead.message && (
            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <Home className="h-3.5 w-3.5" /> Message
              </h3>
              <p className="text-sm text-slate-700 bg-slate-50 rounded-lg p-3.5">{lead.message}</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
            <Field label="Source" value={lead.source} />
            <Field
              label="Submitted"
              value={new Date(lead.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
