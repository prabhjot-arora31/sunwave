export type PermissionKey =
  | "leads.view"
  | "leads.edit"
  | "leads.delete"
  | "customers.view"
  | "customers.edit"
  | "customers.delete"
  | "projects.view"
  | "projects.edit"
  | "projects.delete"
  | "invoices.view"
  | "invoices.edit"
  | "invoices.delete"
  | "reviews.manage"
  | "gallery.manage"
  | "gallery.delete"
  | "blog.manage"
  | "blog.delete"
  | "settings.manage"
  | "users.manage";

export type PermissionMap = Record<PermissionKey, boolean>;

// Grouped for the role-editor checkbox UI - each group is one row/section.
export const PERMISSION_GROUPS: { label: string; keys: { key: PermissionKey; label: string }[] }[] = [
  {
    label: "Leads",
    keys: [
      { key: "leads.view", label: "View" },
      { key: "leads.edit", label: "Edit" },
      { key: "leads.delete", label: "Delete" },
    ],
  },
  {
    label: "Customers",
    keys: [
      { key: "customers.view", label: "View" },
      { key: "customers.edit", label: "Edit" },
      { key: "customers.delete", label: "Delete" },
    ],
  },
  {
    label: "Projects",
    keys: [
      { key: "projects.view", label: "View" },
      { key: "projects.edit", label: "Edit" },
      { key: "projects.delete", label: "Delete" },
    ],
  },
  {
    label: "Invoices & Payments",
    keys: [
      { key: "invoices.view", label: "View" },
      { key: "invoices.edit", label: "Edit" },
      { key: "invoices.delete", label: "Delete" },
    ],
  },
  { label: "Reviews", keys: [{ key: "reviews.manage", label: "Manage" }] },
  {
    label: "Gallery",
    keys: [
      { key: "gallery.manage", label: "Manage" },
      { key: "gallery.delete", label: "Delete" },
    ],
  },
  {
    label: "Blog",
    keys: [
      { key: "blog.manage", label: "Manage" },
      { key: "blog.delete", label: "Delete" },
    ],
  },
  { label: "Site Settings", keys: [{ key: "settings.manage", label: "Manage" }] },
  { label: "Admin Users & Roles", keys: [{ key: "users.manage", label: "Manage" }] },
];

export const ALL_PERMISSION_KEYS: PermissionKey[] = PERMISSION_GROUPS.flatMap((g) => g.keys.map((k) => k.key));

export const NO_PERMISSIONS: PermissionMap = Object.fromEntries(
  ALL_PERMISSION_KEYS.map((k) => [k, false])
) as PermissionMap;

export const ALL_PERMISSIONS: PermissionMap = Object.fromEntries(
  ALL_PERMISSION_KEYS.map((k) => [k, true])
) as PermissionMap;

// Quick-start templates for the "New Role" form - fully editable before
// saving, not fixed/forced roles.
export const ROLE_PRESETS: { name: string; permissions: Partial<PermissionMap> }[] = [
  {
    name: "Sales",
    permissions: {
      "leads.view": true,
      "leads.edit": true,
      "customers.view": true,
      "customers.edit": true,
      "projects.view": true,
      "projects.edit": true,
      "reviews.manage": true,
    },
  },
  {
    name: "Installation",
    permissions: {
      "leads.view": true,
      "customers.view": true,
      "projects.view": true,
      "projects.edit": true,
      "gallery.manage": true,
    },
  },
  {
    name: "Accounting",
    permissions: {
      "leads.view": true,
      "customers.view": true,
      "invoices.view": true,
      "invoices.edit": true,
      "invoices.delete": true,
    },
  },
];

export function normalizePermissions(input: unknown): PermissionMap {
  const result = { ...NO_PERMISSIONS };
  if (input && typeof input === "object") {
    for (const key of ALL_PERMISSION_KEYS) {
      if ((input as Record<string, unknown>)[key] === true) result[key] = true;
    }
  }
  return result;
}
