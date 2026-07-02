import Link from "next/link";

import { Badge } from "@/components/Badge";
import type { Candidate } from "@/types/candidates";

interface CandidateTableProps {
  candidates: Candidate[];
}

export function CandidateTable({ candidates }: CandidateTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
      <div className="hidden md:block">
        <table className="min-w-full divide-y divide-zinc-200">
          <thead className="bg-zinc-100">
            <tr className="text-left text-xs font-semibold uppercase tracking-wide text-zinc-600">
              <th className="px-4 py-3">Candidate</th>
              <th className="px-4 py-3">Position</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Stage</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200">
            {candidates.map((candidate) => (
              <tr key={candidate.id} className="text-sm text-zinc-800">
                <td className="px-4 py-3">
                  <div className="font-semibold">{candidate.full_name}</div>
                  <div className="text-zinc-500">{candidate.email}</div>
                </td>
                <td className="px-4 py-3">{candidate.position}</td>
                <td className="px-4 py-3">
                  <Badge value={candidate.status} kind="status" />
                </td>
                <td className="px-4 py-3">
                  <Badge value={candidate.stage} kind="stage" />
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/candidates/${candidate.id}`}
                    className="inline-flex rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-100"
                  >
                    View details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 p-3 md:hidden">
        {candidates.map((candidate) => (
          <article key={candidate.id} className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
            <p className="font-semibold text-zinc-900">{candidate.full_name}</p>
            <p className="text-sm text-zinc-600">{candidate.email}</p>
            <p className="mt-2 text-sm text-zinc-700">{candidate.position}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <Badge value={candidate.status} kind="status" />
              <Badge value={candidate.stage} kind="stage" />
            </div>
            <Link
              href={`/candidates/${candidate.id}`}
              className="mt-3 inline-flex rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-semibold text-zinc-700"
            >
              View details
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}