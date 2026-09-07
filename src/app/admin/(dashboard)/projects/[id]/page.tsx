"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Project } from "@prisma/client";
import { ArrowLeft, Trash2, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { PROJECT_STAGES, PROJECT_STAGE_COLORS, type ProjectStage } from "@/lib/projectStage";

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-sun-500 focus:outline-none focus:ring-2 focus:ring-sun-500/30 transition";
const labelClass = "block text-sm font-medium text-slate-700 mb-1.5";

function toDateInputValue(value: Date | string | null): string {
  if (!value) return "";
  return new Date(value).toISOString().slice(0, 10);
}

export default function ProjectViewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const [project, setProject] = useState<Project | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [capacity, setCapacity] = useState("");
  const [stage, setStage] = useState<string>(PROJECT_STAGES[0]);
  const [installDate, setInstallDate] = useState("");
  const [commissioningDate, setCommissioningDate] = useState("");
  const [subsidyCreditedDate, setSubsidyCreditedDate] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/admin/projects/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Project not found");
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        const p: Project = data.project;
        setProject(p);
        setCapacity(p.capacity);
        setStage(p.stage);
        setInstallDate(toDateInputValue(p.installDate));
        setCommissioningDate(toDateInputValue(p.commissioningDate));
        setSubsidyCreditedDate(toDateInputValue(p.subsidyCreditedDate));
        setNotes(p.notes ?? "");
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Something went wrong");
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  async function handleSave() {
    if (!project) return;
    setError("");
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch(`/api/admin/projects/${project.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stage,
          capacity,
          installDate,
          commissioningDate,
          subsidyCreditedDate,
          notes,
        }),
      });
      if (!res.ok) throw new Error("Failed to save changes");
      const data = await res.json();
      setProject(data.project);
      setSaved(true);
    } catch {
      setError("Failed to save changes");
    } finally {
      setSaving(false);
    }
  }

  async function confirmDeleteProject() {
    if (!project) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/projects/${project.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete project");
      router.push("/admin/projects");
    } catch {
      setError("Failed to delete project");
      setDeleting(false);
    }
  }

  if (error && !project) {
    return (
      <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm">
        <AlertCircle className="h-4 w-4" /> {error}
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex justify-center py-20 text-slate-400">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-5">
      <div className="flex items-center justify-between">
        <Link href="/admin/projects" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-sky-950">
          <ArrowLeft className="h-4 w-4" /> Back to Projects
        </Link>
        <button
          onClick={() => setConfirmDelete(true)}
          className="p-2 rounded-full hover:bg-red-50 text-slate-400 hover:text-red-600"
          aria-label="Delete project"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div className="rounded-2xl bg-white border border-slate-200 p-6 space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900">{project.customerName}</h1>
            <p className="text-sm text-slate-500">{project.customerPhone}</p>
            <p className="text-sm text-slate-500 max-w-sm">{project.customerAddress}</p>
          </div>
          <span
            className={`shrink-0 text-xs font-semibold rounded-full px-3 py-1.5 ${PROJECT_STAGE_COLORS[project.stage as ProjectStage] ?? "bg-slate-100 text-slate-600"}`}
          >
            {project.stage}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-100 pt-6">
          <div>
            <label className={labelClass}>System Capacity</label>
            <input value={capacity} onChange={(e) => setCapacity(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Stage</label>
            <select value={stage} onChange={(e) => setStage(e.target.value)} className={inputClass}>
              {PROJECT_STAGES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Installation Date</label>
            <input type="date" value={installDate} onChange={(e) => setInstallDate(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Commissioning Date</label>
            <input
              type="date"
              value={commissioningDate}
              onChange={(e) => setCommissioningDate(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Subsidy Credited Date</label>
            <input
              type="date"
              value={subsidyCreditedDate}
              onChange={(e) => setSubsidyCreditedDate(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Notes</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} className={inputClass} />
        </div>

        {error && (
          <p className="flex items-center gap-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
            <AlertCircle className="h-4 w-4" /> {error}
          </p>
        )}
        {saved && (
          <p className="flex items-center gap-2 text-sm font-medium text-leaf-700 bg-leaf-500/10 border border-leaf-500/20 rounded-lg px-4 py-2.5">
            <CheckCircle2 className="h-4 w-4" /> Saved.
          </p>
        )}

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-sun-700 px-8 py-3.5 text-sm font-semibold text-white shadow-md hover:bg-sun-800 transition-colors disabled:opacity-70"
        >
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <ConfirmDialog
        open={confirmDelete}
        title="Delete this project?"
        description={`The project for ${project.customerName} will be permanently removed. This cannot be undone.`}
        confirmLabel="Delete"
        destructive
        loading={deleting}
        onConfirm={confirmDeleteProject}
        onCancel={() => setConfirmDelete(false)}
      />
    </div>
  );
}
