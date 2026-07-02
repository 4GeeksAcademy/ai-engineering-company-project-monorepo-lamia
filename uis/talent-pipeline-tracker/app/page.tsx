import { CandidatesPageClient } from "@/components/CandidatesPageClient";
import { getCandidates } from "@/services/candidates";
import type { Candidate } from "@/types/candidates";

type RawSearchParams = Record<string, string | string[] | undefined>;

function pickFirst(value: string | string[] | undefined): string {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
}

interface HomePageProps {
  searchParams: Promise<RawSearchParams>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const resolvedSearchParams = await searchParams;
  const search = pickFirst(resolvedSearchParams.search);
  const status = pickFirst(resolvedSearchParams.status);
  const stage = pickFirst(resolvedSearchParams.stage);

  let initialCandidates: Candidate[] = [];
  let initialTotal = 0;
  let initialError: string | null = null;

  try {
    const response = await getCandidates({ search, status, stage });
    initialCandidates = response.data;
    initialTotal = response.total;
  } catch (err) {
    initialError = err instanceof Error ? err.message : "Failed to load candidates.";
  }

  const key = `${search}-${status}-${stage}`;

  return (
    <CandidatesPageClient
      key={key}
      initialCandidates={initialCandidates}
      initialTotal={initialTotal}
      initialSearch={search}
      initialStatus={status}
      initialStage={stage}
      initialError={initialError}
    />
  );
}
