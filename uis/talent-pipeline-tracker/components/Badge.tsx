import type { CandidateStage, CandidateStatus } from "@/types/candidates";

function toDisplayLabel(value: string): string {
  return value
    .replace(/_/g, " ")
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

const statusStyles: Record<string, string> = {
  received: "bg-sky-100 text-sky-800 ring-sky-200",
  in_progress: "bg-amber-100 text-amber-900 ring-amber-200",
  discarded: "bg-rose-100 text-rose-900 ring-rose-200",
};

const stageStyles: Record<string, string> = {
  pending: "bg-slate-100 text-slate-800 ring-slate-200",
  review: "bg-indigo-100 text-indigo-900 ring-indigo-200",
  personal_interview: "bg-emerald-100 text-emerald-900 ring-emerald-200",
  technical_interview: "bg-orange-100 text-orange-900 ring-orange-200",
};

interface BadgeProps {
  value: CandidateStatus | CandidateStage;
  kind: "status" | "stage";
}

export function Badge({ value, kind }: BadgeProps) {
  const palette = kind === "status" ? statusStyles : stageStyles;
  const style = palette[value] ?? "bg-zinc-100 text-zinc-800 ring-zinc-200";

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${style}`}>
      {toDisplayLabel(value)}
    </span>
  );
}