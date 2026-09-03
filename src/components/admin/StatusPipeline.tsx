import { LEAD_STATUS_COLORS, type LeadStatus } from "@/lib/leadStatus";

export default function StatusPipeline({
  data,
}: {
  data: { key: LeadStatus; label: string; value: number }[];
}) {
  const max = Math.max(1, ...data.map((d) => d.value));

  return (
    <div className="space-y-3.5">
      {data.map((d) => (
        <div key={d.key} className="flex items-center gap-3">
          <span
            className={`w-24 shrink-0 text-xs font-semibold text-center rounded-full py-1 ${LEAD_STATUS_COLORS[d.key]}`}
          >
            {d.label}
          </span>
          <div className="flex-1 h-2.5 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-sky-700/80"
              style={{ width: `${Math.max(4, (d.value / max) * 100)}%` }}
            />
          </div>
          <span className="w-8 text-right text-sm font-semibold text-slate-700 tabular-nums">
            {d.value}
          </span>
        </div>
      ))}
    </div>
  );
}
