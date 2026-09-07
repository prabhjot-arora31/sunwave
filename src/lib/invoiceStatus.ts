export const INVOICE_STATUSES = ["Pending", "Paid", "Cancelled"] as const;
export type InvoiceStatus = (typeof INVOICE_STATUSES)[number];

export const INVOICE_STATUS_COLORS: Record<InvoiceStatus, string> = {
  Pending: "bg-amber-100 text-amber-700",
  Paid: "bg-leaf-500/15 text-leaf-600",
  Cancelled: "bg-slate-200 text-slate-600",
};

export function isInvoiceStatus(value: string): value is InvoiceStatus {
  return (INVOICE_STATUSES as readonly string[]).includes(value);
}
