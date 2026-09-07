"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, Plus, Trash2, AlertCircle, ShieldCheck, Settings2 } from "lucide-react";
import ConfirmDialog from "@/components/admin/ConfirmDialog";

type AdminUserRow = { id: number; username: string; createdAt: string; role: { id: number; name: string } };
type RoleOption = { id: number; name: string; isSystem: boolean };

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sun-500 focus:outline-none focus:ring-2 focus:ring-sun-500/30 transition";
const labelClass = "block text-sm font-medium text-slate-700 mb-1.5";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUserRow[]>([]);
  const [roleOptions, setRoleOptions] = useState<RoleOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [roleId, setRoleId] = useState<number | null>(null);
  const [creating, setCreating] = useState(false);

  const [pendingDelete, setPendingDelete] = useState<AdminUserRow | null>(null);
  const [deleting, setDeleting] = useState(false);

  function load() {
    setLoading(true);
    Promise.all([
      fetch("/api/admin/users").then((res) => res.json()),
      fetch("/api/admin/roles").then((res) => res.json()),
    ])
      .then(([usersData, rolesData]) => {
        setUsers(usersData.users ?? []);
        const roles: RoleOption[] = rolesData.roles ?? [];
        setRoleOptions(roles);
        setRoleId((prev) => prev ?? roles[0]?.id ?? null);
      })
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleCreate() {
    setError("");
    if (username.trim().length < 3 || password.length < 8 || !roleId) {
      setError("Username needs 3+ characters, password needs 8+ characters, and a role must be selected.");
      return;
    }
    setCreating(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, roleId }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Failed to create user");
      }
      setUsername("");
      setPassword("");
      setShowForm(false);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setCreating(false);
    }
  }

  async function confirmDeleteUser() {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/users/${pendingDelete.id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Failed to delete user");
      }
      setUsers((prev) => prev.filter((u) => u.id !== pendingDelete.id));
      setPendingDelete(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete user");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Users</h1>
          <p className="text-sm text-slate-500 mt-1">
            Each user has a role that determines what they can access.
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <Link
            href="/admin/roles"
            className="whitespace-nowrap inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Settings2 className="h-4 w-4" /> Manage Roles
          </Link>
          <button
            onClick={() => setShowForm((v) => !v)}
            className="whitespace-nowrap inline-flex items-center justify-center gap-2 rounded-full bg-sun-700 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-sun-800 transition-colors"
          >
            <Plus className="h-4 w-4" /> New User
          </button>
        </div>
      </div>

      {showForm && (
        <div className="rounded-2xl bg-white border border-slate-200 p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Username</label>
              <input value={username} onChange={(e) => setUsername(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Role</label>
              <select
                value={roleId ?? ""}
                onChange={(e) => setRoleId(Number(e.target.value))}
                className={inputClass}
              >
                {roleOptions.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                    {r.isSystem ? " (full access)" : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button
            onClick={handleCreate}
            disabled={creating}
            className="inline-flex items-center gap-2 rounded-full bg-sun-700 px-6 py-2.5 text-sm font-semibold text-white hover:bg-sun-800 transition-colors disabled:opacity-70"
          >
            {creating && <Loader2 className="h-4 w-4 animate-spin" />}
            {creating ? "Creating..." : "Create User"}
          </button>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm">
          <AlertCircle className="h-4 w-4" /> {error}
        </div>
      )}

      <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-slate-500 uppercase tracking-wide border-b border-slate-100 bg-slate-50">
              <th className="px-5 py-3 font-semibold">Username</th>
              <th className="px-5 py-3 font-semibold">Role</th>
              <th className="px-5 py-3 font-semibold">Created</th>
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
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-5 py-12 text-center text-slate-500">
                  No additional admin users yet.
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60">
                  <td className="px-5 py-3.5 font-semibold text-slate-900">{u.username}</td>
                  <td className="px-5 py-3.5">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold rounded-full px-2.5 py-1 bg-slate-100 text-slate-600">
                      <ShieldCheck className="h-3 w-3" />
                      {u.role.name}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-600 whitespace-nowrap">
                    {new Date(u.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={() => setPendingDelete(u)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600"
                      aria-label={`Delete ${u.username}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-slate-400">
        Your original login (from the environment variables) always still works regardless of what's
        listed here - it's a permanent fallback so you can never be locked out.
      </p>

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete this user?"
        description={pendingDelete ? `${pendingDelete.username} will no longer be able to log in.` : ""}
        confirmLabel="Delete"
        destructive
        loading={deleting}
        onConfirm={confirmDeleteUser}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
