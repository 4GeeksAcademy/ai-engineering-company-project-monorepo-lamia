"use client";

import Link from "next/link";
import { useState } from "react";

import { Badge } from "@/components/Badge";
import { CandidateForm, type CandidateFormValues } from "@/components/CandidateForm";
import { NotesPanel } from "@/components/NotesPanel";
import { StateMessage } from "@/components/StateMessage";
import {
  patchCandidateStatusAndStage,
  updateCandidate,
} from "@/services/candidates";
import {
  CANDIDATE_STAGES,
  CANDIDATE_STATUSES,
  type Candidate,
  type CandidateNote,
} from "@/types/candidates";

interface CandidateDetailClientProps {
  candidateId: string;
  initialCandidate: Candidate | null;
  initialNotes: CandidateNote[];
  initialError: string | null;
  notesError: string | null;
}

function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleString();
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">{label}</p>
      <p className="mt-1 break-all text-sm text-zinc-900">{value || "-"}</p>
    </div>
  );
}

export function CandidateDetailClient({
  candidateId,
  initialCandidate,
  initialNotes,
  initialError,
  notesError,
}: CandidateDetailClientProps) {
  const [candidate, setCandidate] = useState<Candidate | null>(initialCandidate);
  const [error, setError] = useState<string | null>(initialError);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isPatching, setIsPatching] = useState(false);

  async function handlePatch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!candidate) {
      return;
    }

    const formData = new FormData(event.currentTarget);
    const status = String(formData.get("status") ?? candidate.status);
    const stage = String(formData.get("stage") ?? candidate.stage);

    setError(null);
    setSuccessMessage(null);
    setIsPatching(true);

    try {
      const updated = await patchCandidateStatusAndStage(candidateId, { status, stage });
      setCandidate(updated);
      setSuccessMessage("Status and stage updated successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status and stage.");
    } finally {
      setIsPatching(false);
    }
  }

  async function handleFullUpdate(values: CandidateFormValues) {
    if (!candidate) {
      return;
    }

    setError(null);
    setSuccessMessage(null);

    const updated = await updateCandidate(candidateId, {
      full_name: values.full_name.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      position: values.position.trim(),
      linkedin_url: values.linkedin_url.trim() || undefined,
      cv_url: values.cv_url.trim() || undefined,
      status: values.status,
      stage: values.stage,
      experience_years: Number(values.experience_years),
    });

    setCandidate(updated);
    setIsEditing(false);
    setSuccessMessage("Candidate profile updated successfully.");
  }

  return (
    <div className="min-h-screen bg-app-pattern">
      <main className="mx-auto w-full max-w-6xl space-y-5 px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">TrackFlow</p>
            <h1 className="mt-1 text-2xl font-semibold text-zinc-900">Candidate detail</h1>
          </div>
          <Link href="/" className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-semibold text-zinc-700">
            Back to list
          </Link>
        </div>

        {successMessage ? <StateMessage type="success" title={successMessage} /> : null}
        {error ? <StateMessage type="error" title="Request failed" description={error} /> : null}

        {!candidate ? (
          <StateMessage
            type="empty"
            title="Candidate not available"
            description="The requested candidate could not be loaded."
          />
        ) : (
          <>
            <section className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold text-zinc-900">{candidate.full_name}</h2>
                  <p className="text-sm text-zinc-600">{candidate.position}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge value={candidate.status} kind="status" />
                  <Badge value={candidate.stage} kind="stage" />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                <Field label="ID" value={candidate.id} />
                <Field label="Email" value={candidate.email} />
                <Field label="Phone" value={candidate.phone ?? ""} />
                <Field label="Position" value={candidate.position} />
                <Field label="LinkedIn" value={candidate.linkedin_url ?? ""} />
                <Field label="CV URL" value={candidate.cv_url ?? ""} />
                <Field label="Experience years" value={String(candidate.experience_years ?? "")} />
                <Field label="Applied at" value={formatDate(candidate.applied_at)} />
                <Field label="Updated at" value={formatDate(candidate.updated_at)} />
                <Field label="Notes count" value={String(candidate.notes_count)} />
                <Field label="Status" value={candidate.status} />
                <Field label="Stage" value={candidate.stage} />
              </div>
            </section>

            <section className="space-y-3 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
              <h2 className="text-lg font-semibold text-zinc-900">Quick status update</h2>
              <form onSubmit={handlePatch} className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <select
                  name="status"
                  defaultValue={candidate.status}
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900"
                >
                  {CANDIDATE_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status.replace(/_/g, " ")}
                    </option>
                  ))}
                </select>
                <select
                  name="stage"
                  defaultValue={candidate.stage}
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900"
                >
                  {CANDIDATE_STAGES.map((stage) => (
                    <option key={stage} value={stage}>
                      {stage.replace(/_/g, " ")}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  disabled={isPatching}
                  className="rounded-lg bg-zinc-900 px-3 py-2 text-sm font-semibold text-white hover:bg-zinc-700 disabled:opacity-60"
                >
                  {isPatching ? "Updating..." : "Update status + stage"}
                </button>
              </form>
            </section>

            <section className="space-y-3 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-zinc-900">Candidate profile editor</h2>
                <button
                  type="button"
                  onClick={() => setIsEditing((current) => !current)}
                  className="rounded-lg border border-zinc-300 px-3 py-2 text-sm font-semibold text-zinc-700"
                >
                  {isEditing ? "Close editor" : "Edit candidate"}
                </button>
              </div>

              {isEditing ? (
                <CandidateForm
                  initialCandidate={candidate}
                  submitLabel="Save candidate"
                  onSubmit={handleFullUpdate}
                  onCancel={() => setIsEditing(false)}
                />
              ) : null}
            </section>

            <NotesPanel candidateId={candidate.id} initialNotes={initialNotes} initialError={notesError} />
          </>
        )}
      </main>
    </div>
  );
}
