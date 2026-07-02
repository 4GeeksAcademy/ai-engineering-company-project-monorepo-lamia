import { CandidateDetailClient } from "@/components/CandidateDetailClient";
import { getCandidateById, getCandidateNotes } from "@/services/candidates";
import type { Candidate, CandidateNote } from "@/types/candidates";

interface CandidateDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function CandidateDetailPage({ params }: CandidateDetailPageProps) {
  const { id } = await params;

  let initialCandidate: Candidate | null = null;
  let initialNotes: CandidateNote[] = [];
  let initialError: string | null = null;
  let notesError: string | null = null;

  try {
    initialCandidate = await getCandidateById(id);
  } catch (err) {
    initialError = err instanceof Error ? err.message : "Failed to load candidate details.";
  }

  if (initialCandidate) {
    try {
      initialNotes = await getCandidateNotes(id);
    } catch (err) {
      notesError = err instanceof Error ? err.message : "Failed to load notes.";
    }
  }

  return (
    <CandidateDetailClient
      candidateId={id}
      initialCandidate={initialCandidate}
      initialNotes={initialNotes}
      initialError={initialError}
      notesError={notesError}
    />
  );
}
