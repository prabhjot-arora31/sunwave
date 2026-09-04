"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, CalendarDays, TrendingUp, BarChart3, Loader2, AlertCircle, Star, ArrowRight } from "lucide-react";
import StatCard from "@/components/admin/StatCard";
import TrendChart from "@/components/admin/charts/TrendChart";
import SimpleBarChart from "@/components/admin/charts/SimpleBarChart";
import StatusPipeline from "@/components/admin/StatusPipeline";
import type { LeadStatus } from "@/lib/leadStatus";

type Stats = {
  totals: { allTime: number; today: number; last7Days: number; last30Days: number };
  byPropertyType: { label: string; value: number }[];
  byStatus: { label: string; value: number; key: LeadStatus }[];
  bySource: { label: string; value: number }[];
  byCapacity: { label: string; value: number }[];
  trend: { date: string; count: number }[];
  pendingReviews: number;
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/stats")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load statistics");
        return res.json();
      })
      .then((data) => {
        if (!cancelled) setStats(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Something went wrong");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return (
      <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm">
        <AlertCircle className="h-4 w-4" /> {error}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">Overview of incoming solar leads.</p>
      </div>

      {stats.pendingReviews > 0 && (
        <Link
          href="/admin/reviews"
          className="flex items-center justify-between gap-3 rounded-2xl bg-amber-50 border border-amber-200 px-5 py-4 hover:bg-amber-100 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700">
              <Star className="h-4 w-4" />
            </span>
            <p className="text-sm font-semibold text-amber-800">
              {stats.pendingReviews} review{stats.pendingReviews > 1 ? "s" : ""} awaiting moderation
            </p>
          </div>
          <ArrowRight className="h-4 w-4 text-amber-700 shrink-0" />
        </Link>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Leads"
          value={stats.totals.allTime}
          icon={Users}
          accent="text-sun-700 bg-sun-100"
        />
        <StatCard
          label="Today"
          value={stats.totals.today}
          icon={CalendarDays}
          accent="text-leaf-600 bg-leaf-500/15"
        />
        <StatCard
          label="Last 7 Days"
          value={stats.totals.last7Days}
          icon={TrendingUp}
          accent="text-sky-700 bg-sky-100"
        />
        <StatCard
          label="Last 30 Days"
          value={stats.totals.last30Days}
          icon={BarChart3}
          accent="text-violet-700 bg-violet-100"
        />
      </div>

      <div className="rounded-2xl bg-white border border-slate-200 p-5 sm:p-6">
        <h2 className="text-sm font-bold text-slate-900 mb-1">Leads - Last 14 Days</h2>
        <p className="text-xs text-slate-500 mb-2">Daily submissions across the whole site.</p>
        <TrendChart data={stats.trend} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-2xl bg-white border border-slate-200 p-5 sm:p-6">
          <h2 className="text-sm font-bold text-slate-900 mb-1">Leads by Property Type</h2>
          <p className="text-xs text-slate-500 mb-2">Residential vs. commercial vs. industrial demand.</p>
          <SimpleBarChart data={stats.byPropertyType} />
        </div>

        <div className="rounded-2xl bg-white border border-slate-200 p-5 sm:p-6">
          <h2 className="text-sm font-bold text-slate-900 mb-1">Leads by Source</h2>
          <p className="text-xs text-slate-500 mb-2">Which page each enquiry came from.</p>
          <SimpleBarChart data={stats.bySource} />
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-2xl bg-white border border-slate-200 p-5 sm:p-6">
          <h2 className="text-sm font-bold text-slate-900 mb-1">Pipeline by Status</h2>
          <p className="text-xs text-slate-500 mb-4">Where leads stand in the follow-up process.</p>
          <StatusPipeline data={stats.byStatus} />
        </div>

        <div className="rounded-2xl bg-white border border-slate-200 p-5 sm:p-6">
          <h2 className="text-sm font-bold text-slate-900 mb-1">Requested Capacity</h2>
          <p className="text-xs text-slate-500 mb-2">Most-requested system sizes.</p>
          <SimpleBarChart data={stats.byCapacity} />
        </div>
      </div>
    </div>
  );
}
