export const PROJECT_STAGES = [
  "Site Survey",
  "Design & Quote",
  "Subsidy & Loan Assistance",
  "Installation In Progress",
  "Installed",
  "Net Meter & Commissioning",
  "Subsidy Credited",
  "Completed",
] as const;

export type ProjectStage = (typeof PROJECT_STAGES)[number];

export const PROJECT_STAGE_COLORS: Record<ProjectStage, string> = {
  "Site Survey": "bg-sky-100 text-sky-700",
  "Design & Quote": "bg-violet-100 text-violet-700",
  "Subsidy & Loan Assistance": "bg-indigo-100 text-indigo-700",
  "Installation In Progress": "bg-amber-100 text-amber-700",
  Installed: "bg-teal-100 text-teal-700",
  "Net Meter & Commissioning": "bg-cyan-100 text-cyan-700",
  "Subsidy Credited": "bg-leaf-500/15 text-leaf-600",
  Completed: "bg-slate-200 text-slate-600",
};

export function isProjectStage(value: string): value is ProjectStage {
  return (PROJECT_STAGES as readonly string[]).includes(value);
}
