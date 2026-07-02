"use client";

import { useMemo, useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";

import { CandidateForm, type CandidateFormValues } from "@/components/CandidateForm";
import { CandidateTable } from "@/components/CandidateTable";
import { StateMessage } from "@/components/StateMessage";
import { createCandidate } from "@/services/candidates";
import {
  CANDIDATE_STAGES,
  CANDIDATE_STATUSES,
  type Candidate,
} from "@/types/candidates";

interface CandidatesPageClientProps {
  initialCandidates: Candidate[];
  initialTotal: number;
  initialSearch: string;
  initialStatus: string;
  initialStage: string;
  initialError: string | null;
}

export function CandidatesPageClient({
  initialCandidates,
  initialTotal,
  initialSearch,
  initialStatus,
  initialStage,
  initialError,
}: CandidatesPageClientProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [isPending, startTransition] = useTransition();
  const [searchInput, setSearchInput] = useState(initialSearch);
  const [selectedStatus, setSelectedStatus] = useState(initialStatus);
  const [selectedStage, setSelectedStage] = useState(initialStage);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [candidates, setCandidates] = useState(initialCandidates);
  const [total, setTotal] = useState(initialTotal);
  const [error, setError] = useState<string | null>(initialError);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const resultSummary = useMemo(() => {
    if (isPending) {
      return "Loading records...";
    }

    return `${total} candidate${total === 1 ? "" : "s"} found`;
  }, [isPending, total]);

  function pushQuery(nextSearch: string, nextStatus: string, nextStage: string) {
    const params = new URLSearchParams();
    if (nextSearch) {
      params.set("search", nextSearch);
    }
    if (nextStatus) {
      params.set("status", nextStatus);
    }
    if (nextStage) {
      params.set("stage", nextStage);
    }

    const query = params.toString();
    startTransition(() => {
      router.replace(query ? `${pathname}?${query}` : pathname);
    });
  }

  function handleSearchSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    pushQuery(searchInput.trim(), selectedStatus, selectedStage);
  }

  function handleStatusChange(value: string) {
    setSelectedStatus(value);
    pushQuery(searchInput.trim(), value, selectedStage);
  }

  function handleStageChange(value: string) {
    setSelectedStage(value);
    pushQuery(searchInput.trim(), selectedStatus, value);
  }

  async function handleCreateCandidate(values: CandidateFormValues) {
    setError(null);
    setSuccessMessage(null);

    const newCandidate = await createCandidate({
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

    setCandidates((current) => [newCandidate, ...current]);
    setTotal((current) => current + 1);
    setIsCreateOpen(false);
    setSuccessMessage("Candidate created successfully.");
  }

  return (
    <div className="min-h-screen bg-app-pattern">
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">TrackFlow</p>
          <h1 className="mt-2 text-2xl font-semibold text-zinc-900 sm:text-3xl">People and Talent Pipeline</h1>
          <p className="mt-2 text-sm text-zinc-600">Search, filter, and manage candidates across interview stages.</p>
        </header>

        <section className="mt-5 space-y-4 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-medium text-zinc-700">{resultSummary}</p>
            <button
              type="button"
              onClick={() => setIsCreateOpen((current) => !current)}
              className="rounded-lg bg-zinc-900 px-3 py-2 text-sm font-semibold text-white hover:bg-zinc-700"
            >
              {isCreateOpen ? "Close form" : "New candidate"}
            </button>
          </div>

          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 gap-3 md:grid-cols-4">
            <input
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search by name or email"
              className="md:col-span-2 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-500"
            />

            <select
              value={selectedStatus}
              onChange={(event) => handleStatusChange(event.target.value)}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900"
            >
              <option value="">All statuses</option>
              {CANDIDATE_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status.replace(/_/g, " ")}
                </option>
              ))}
            </select>

            <select
              value={selectedStage}
              onChange={(event) => handleStageChange(event.target.value)}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900"
            >
              <option value="">All stages</option>
              {CANDIDATE_STAGES.map((stage) => (
                <option key={stage} value={stage}>
                  {stage.replace(/_/g, " ")}
                </option>
              ))}
            </select>

            <button
              type="submit"
              className="md:col-span-4 rounded-lg border border-zinc-300 px-3 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-100"
            >
              Apply search
            </button>
          </form>

          {isCreateOpen ? (
            <CandidateForm submitLabel="Create candidate" onSubmit={handleCreateCandidate} onCancel={() => setIsCreateOpen(false)} />
          ) : null}

          {successMessage ? <StateMessage type="success" title={successMessage} /> : null}
          {error ? <StateMessage type="error" title="Unable to load candidate data" description={error} /> : null}
          {isPending ? <StateMessage type="loading" title="Loading candidates..." /> : null}

          {!isPending && !error && candidates.length === 0 ? (
            <StateMessage
              type="empty"
              title="No candidates found"
              description="Adjust filters or create a new candidate to start the pipeline."
            />
          ) : null}

          {!isPending && !error && candidates.length > 0 ? <CandidateTable candidates={candidates} /> : null}
        </section>
      </main>
    </div>
  );
}
