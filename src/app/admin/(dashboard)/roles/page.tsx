"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, Plus, Trash2, ShieldCheck, AlertCircle, CheckCircle2 } from "lucide-react";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { PERMISSION_GROUPS, NO_PERMISSIONS, ROLE_PRESETS, type PermissionKey, type PermissionMap } from "@/lib/permissions";

type RoleRow = {
  id: number;
  name: string;
  permissions: PermissionMap;
  isSystem: boolean;
  _count: { adminUsers: number };
};

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-sun-500 focus:outline-none focus:ring-2 focus:ring-sun-500/30 transition";

function PermissionGrid({
  permissions,
  onChange,
}: {
  permissions: PermissionMap;
  onChange: (key: PermissionKey, value: boolean) => void;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {PERMISSION_GROUPS.map((group) => (
        <div key={group.label} className="rounded-lg border border-slate-200 p-3.5">
          <p className="text-sm font-semibold text-slate-800 mb-2">{group.label}</p>
          <div className="flex flex-wrap gap-3">
            {group.keys.map(({ key, label }) => (
              <label key={key} className="flex items-center gap-1.5 text-sm text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={permissions[key]}
                  onChange={(e) => onChange(key, e.target.checked)}
                  className="accent-sun-500"
                />
                {label}
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AdminRolesPage() {
  const [roles, setRoles] = useState<RoleRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [permissions, setPermissions] = useState<PermissionMap>(NO_PERMISSIONS);
  const [saving, setSaving] = useState(false);

  const [pendingDelete, setPendingDelete] = useState<RoleRow | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  function load() {
    setLoading(true);
    fetch("/api/admin/roles")
      .then((res) => res.json())
      .then((data) => setRoles(data.roles ?? []))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  function startCreate() {
    setEditingId(null);
    setName("");
    setPermissions(NO_PERMISSIONS);
    setShowForm(true);
  }

  function startEdit(role: RoleRow) {
    setEditingId(role.id);
    setName(role.name);
    setPermissions({ ...NO_PERMISSIONS, ...role.permissions });
    setShowForm(true);
  }

  function applyPreset(preset: (typeof ROLE_PRESETS)[number]) {
    setName(preset.name);
    setPermissions({ ...NO_PERMISSIONS, ...preset.permissions });
  }

  async function handleSave() {
    setError("");
    if (name.trim().length < 2) {
      setError("Role name must be at least 2 characters.");
      return;
    }
    setSaving(true);
    try {
      const res = editingId
        ? await fetch(`/api/admin/roles/${editingId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, permissions }),
          })
        : await fetch("/api/admin/roles", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, permissions }),
          });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Failed to save role");
      }
      setShowForm(false);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  async function confirmDeleteRole() {
    if (!pendingDelete) return;
    setDeleting(true);
    setDeleteError("");
    try {
      const res = await fetch(`/api/admin/roles/${pendingDelete.id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Failed to delete role");
      }
      setRoles((prev) => prev.filter((r) => r.id !== pendingDelete.id));
      setPendingDelete(null);
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Failed to delete role");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="max-w-3xl space-y-5">
      <Link href="/admin/users" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-sky-950">
        <ArrowLeft className="h-4 w-4" /> Back to Admin Users
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Roles & Permissions</h1>
          <p className="text-sm text-slate-500 mt-1">Create custom roles with exactly the access each person needs.</p>
        </div>
        <button
          onClick={startCreate}
          className="shrink-0 whitespace-nowrap inline-flex items-center justify-center gap-2 rounded-full bg-sun-700 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-sun-800 transition-colors"
        >
          <Plus className="h-4 w-4" /> New Role
        </button>
      </div>

      {showForm && (
        <div className="rounded-2xl bg-white border border-slate-200 p-6 space-y-5">
          {!editingId && (
            <div>
              <p className="text-xs font-medium text-slate-500 mb-2">Quick start (fully editable after)</p>
              <div className="flex flex-wrap gap-2">
                {ROLE_PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => applyPreset(preset)}
                    className="rounded-full border border-slate-300 px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:border-sun-400 hover:text-sun-700"
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Role Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Sales" className={inputClass} />
          </div>

          <PermissionGrid
            permissions={permissions}
            onChange={(key, value) => setPermissions((prev) => ({ ...prev, [key]: value }))}
          />

          {error && (
            <p className="flex items-center gap-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
              <AlertCircle className="h-4 w-4" /> {error}
            </p>
          )}

          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-full bg-sun-700 px-6 py-2.5 text-sm font-semibold text-white hover:bg-sun-800 transition-colors disabled:opacity-70"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {saving ? "Saving..." : editingId ? "Save Changes" : "Create Role"}
            </button>
            <button onClick={() => setShowForm(false)} className="text-sm font-semibold text-slate-500 hover:text-slate-700">
              Cancel
            </button>
          </div>
        </div>
      )}

      {deleteError && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm">
          <AlertCircle className="h-4 w-4" /> {deleteError}
        </div>
      )}

      <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-slate-500 uppercase tracking-wide border-b border-slate-100 bg-slate-50">
              <th className="px-5 py-3 font-semibold">Role</th>
              <th className="px-5 py-3 font-semibold">Permissions Granted</th>
              <th className="px-5 py-3 font-semibold">Users</th>
              <th className="px-5 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="px-5 py-12 text-center text-slate-400">
                  <Loader2 className="h-5 w-5 animate-spin inline" />
                </td>
              </tr>
            ) : (
              roles.map((role) => {
                const grantedCount = Object.values(role.permissions).filter(Boolean).length;
                return (
                  <tr key={role.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60 align-top">
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center gap-1.5 font-semibold text-slate-900">
                        {role.isSystem && <ShieldCheck className="h-3.5 w-3.5 text-sun-600" />}
                        {role.name}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600">
                      {role.isSystem ? "Full access (all permissions)" : `${grantedCount} of 14 permissions`}
                    </td>
                    <td className="px-5 py-3.5 text-slate-600">{role._count.adminUsers}</td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {!role.isSystem && (
                          <button
                            onClick={() => startEdit(role)}
                            className="px-2.5 py-1 rounded-lg hover:bg-slate-100 text-xs font-semibold text-slate-600"
                          >
                            Edit
                          </button>
                        )}
                        {!role.isSystem && (
                          <button
                            onClick={() => setPendingDelete(role)}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600"
                            aria-label={`Delete ${role.name}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete this role?"
        description={
          pendingDelete
            ? pendingDelete._count.adminUsers > 0
              ? `${pendingDelete._count.adminUsers} user(s) currently have this role - reassign them first.`
              : `"${pendingDelete.name}" will be permanently removed.`
            : ""
        }
        confirmLabel="Delete"
        destructive
        loading={deleting}
        onConfirm={confirmDeleteRole}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
