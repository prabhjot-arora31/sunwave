export const INVOICE_STATUSES = ["Pending", "Partially Paid", "Paid", "Cancelled"] as const;
export type InvoiceStatus = (typeof INVOICE_STATUSES)[number];

export const INVOICE_STATUS_COLORS: Record<InvoiceStatus, string> = {
  Pending: "bg-amber-100 text-amber-700",
  "Partially Paid": "bg-violet-100 text-violet-700",
  Paid: "bg-leaf-500/15 text-leaf-600",
  Cancelled: "bg-slate-200 text-slate-600",
};

// Derives the status from what's actually been paid so far. A Cancelled
// invoice is a deliberate admin action, not a payment-derived state, so it's
// left alone here - callers should only apply this when status isn't
// Cancelled.
export function deriveInvoiceStatus(totalPaid: number, invoiceTotal: number): InvoiceStatus {
  if (totalPaid <= 0) return "Pending";
  if (totalPaid >= invoiceTotal) return "Paid";
  return "Partially Paid";
}

export function isInvoiceStatus(value: string): value is InvoiceStatus {
  return (INVOICE_STATUSES as readonly string[]).includes(value);
}
