import { apiRequest } from "@/services/api-client";
import type {
  Candidate,
  CandidateCreatePayload,
  CandidateListParams,
  CandidateListResponse,
  CandidateNote,
  CandidateNoteCreatePayload,
  CandidateNotesResponse,
  CandidatePatchPayload,
  CandidateUpdatePayload,
} from "@/types/candidates";

export async function getCandidates(params: CandidateListParams = {}): Promise<CandidateListResponse> {
  return apiRequest<CandidateListResponse>("/records", undefined, {
    search: params.search,
    status: params.status,
    stage: params.stage,
    page: params.page,
    limit: params.limit,
  });
}

export async function getCandidateById(id: string): Promise<Candidate> {
  return apiRequest<Candidate>(`/records/${id}`);
}

export async function createCandidate(payload: CandidateCreatePayload): Promise<Candidate> {
  return apiRequest<Candidate>("/records", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateCandidate(id: string, payload: CandidateUpdatePayload): Promise<Candidate> {
  return apiRequest<Candidate>(`/records/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function patchCandidateStatusAndStage(
  id: string,
  payload: CandidatePatchPayload,
): Promise<Candidate> {
  return apiRequest<Candidate>(`/records/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function getCandidateNotes(id: string): Promise<CandidateNote[]> {
  const response = await apiRequest<CandidateNotesResponse>(`/records/${id}/notes`);
  return response.data;
}

export async function addCandidateNote(
  id: string,
  payload: CandidateNoteCreatePayload,
): Promise<CandidateNote> {
  return apiRequest<CandidateNote>(`/records/${id}/notes`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function deleteCandidateNote(id: string, noteId: string): Promise<void> {
  await apiRequest<void>(`/records/${id}/notes/${noteId}`, {
    method: "DELETE",
  });
}