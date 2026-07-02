"use client";

import { useMemo, useState } from "react";

import { CANDIDATE_STAGES, CANDIDATE_STATUSES, type Candidate } from "@/types/candidates";

interface CandidateFormValues {
  full_name: string;
  email: string;
  phone: string;
  position: string;
  linkedin_url: string;
  cv_url: string;
  status: string;
  stage: string;
  experience_years: string;
}

interface CandidateFormProps {
  initialCandidate?: Candidate;
  submitLabel: string;
  onSubmit: (values: CandidateFormValues) => Promise<void>;
  onCancel?: () => void;
}

export type { CandidateFormValues };

export function CandidateForm({ initialCandidate, submitLabel, onSubmit, onCancel }: CandidateFormProps) {
  const [formValues, setFormValues] = useState<CandidateFormValues>(() => ({
    full_name: initialCandidate?.full_name ?? "",
    email: initialCandidate?.email ?? "",
    phone: initialCandidate?.phone ?? "",
    position: initialCandidate?.position ?? "",
    linkedin_url: initialCandidate?.linkedin_url ?? "",
    cv_url: initialCandidate?.cv_url ?? "",
    status: initialCandidate?.status ?? CANDIDATE_STATUSES[0],
    stage: initialCandidate?.stage ?? CANDIDATE_STAGES[0],
    experience_years: initialCandidate?.experience_years?.toString() ?? "0",
  }));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValid = useMemo(() => {
    return (
      formValues.full_name.trim().length > 0 &&
      formValues.email.trim().length > 0 &&
      formValues.position.trim().length > 0 &&
      formValues.phone.trim().length > 0 &&
      Number.isFinite(Number(formValues.experience_years))
    );
  }, [formValues]);

  function updateField(field: keyof CandidateFormValues, value: string) {
    setFormValues((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!isValid) {
      setError("Please complete all required fields with valid values.");
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit(formValues);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save candidate.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <label className="space-y-1 text-sm font-medium text-zinc-800">
          Full name *
          <input
            value={formValues.full_name}
            onChange={(event) => updateField("full_name", event.target.value)}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-500"
          />
        </label>

        <label className="space-y-1 text-sm font-medium text-zinc-800">
          Email *
          <input
            type="email"
            value={formValues.email}
            onChange={(event) => updateField("email", event.target.value)}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-500"
          />
        </label>

        <label className="space-y-1 text-sm font-medium text-zinc-800">
          Phone *
          <input
            value={formValues.phone}
            onChange={(event) => updateField("phone", event.target.value)}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-500"
          />
        </label>

        <label className="space-y-1 text-sm font-medium text-zinc-800">
          Position *
          <input
            value={formValues.position}
            onChange={(event) => updateField("position", event.target.value)}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-500"
          />
        </label>

        <label className="space-y-1 text-sm font-medium text-zinc-800">
          LinkedIn URL
          <input
            value={formValues.linkedin_url}
            onChange={(event) => updateField("linkedin_url", event.target.value)}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-500"
          />
        </label>

        <label className="space-y-1 text-sm font-medium text-zinc-800">
          CV URL
          <input
            value={formValues.cv_url}
            onChange={(event) => updateField("cv_url", event.target.value)}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-500"
          />
        </label>

        <label className="space-y-1 text-sm font-medium text-zinc-800">
          Status
          <select
            value={formValues.status}
            onChange={(event) => updateField("status", event.target.value)}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900"
          >
            {CANDIDATE_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status.replace(/_/g, " ")}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1 text-sm font-medium text-zinc-800">
          Stage
          <select
            value={formValues.stage}
            onChange={(event) => updateField("stage", event.target.value)}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900"
          >
            {CANDIDATE_STAGES.map((stage) => (
              <option key={stage} value={stage}>
                {stage.replace(/_/g, " ")}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1 text-sm font-medium text-zinc-800">
          Experience years
          <input
            type="number"
            min="0"
            value={formValues.experience_years}
            onChange={(event) => updateField("experience_years", event.target.value)}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-500"
          />
        </label>
      </div>

      {error ? <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p> : null}

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-700 disabled:opacity-60"
        >
          {isSubmitting ? "Saving..." : submitLabel}
        </button>
        {onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700"
          >
            Cancel
          </button>
        ) : null}
      </div>
    </form>
  );
}