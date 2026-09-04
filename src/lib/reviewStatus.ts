export const REVIEW_STATUSES = ["pending", "approved", "rejected"] as const;
export type ReviewStatus = (typeof REVIEW_STATUSES)[number];

export const REVIEW_STATUS_LABELS: Record<ReviewStatus, string> = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
};

export const REVIEW_STATUS_COLORS: Record<ReviewStatus, string> = {
  pending: "bg-amber-100 text-amber-700",
  approved: "bg-leaf-500/15 text-leaf-600",
  rejected: "bg-red-100 text-red-600",
};

export function isReviewStatus(value: string): value is ReviewStatus {
  return (REVIEW_STATUSES as readonly string[]).includes(value);
}
