export const CANDIDATE_STATUSES = ["received", "in_progress", "discarded"] as const;

export const CANDIDATE_STAGES = [
  "pending",
  "review",
  "personal_interview",
  "technical_interview",
] as const;

export type CandidateStatus = (typeof CANDIDATE_STATUSES)[number] | string;
export type CandidateStage = (typeof CANDIDATE_STAGES)[number] | string;

export interface Candidate {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  position: string;
  linkedin_url: string | null;
  cv_url: string | null;
  status: CandidateStatus;
  stage: CandidateStage;
  experience_years: number | null;
  notes_count: number;
  applied_at: string;
  updated_at: string;
}

export interface CandidateListResponse {
  total: number;
  page: number;
  limit: number;
  data: Candidate[];
}

export interface CandidateNote {
  id: string;
  record_id: string;
  content: string;
  created_at: string;
}

export interface CandidateNotesResponse {
  data: CandidateNote[];
  meta: {
    total: number;
  };
}

export interface CandidateListParams {
  search?: string;
  status?: CandidateStatus | "";
  stage?: CandidateStage | "";
  page?: number;
  limit?: number;
}

export interface CandidateCreatePayload {
  full_name: string;
  email: string;
  phone: string;
  position: string;
  linkedin_url?: string;
  cv_url?: string;
  status: CandidateStatus;
  stage: CandidateStage;
  experience_years: number;
}

export interface CandidateUpdatePayload {
  full_name: string;
  email: string;
  phone: string;
  position: string;
  linkedin_url?: string;
  cv_url?: string;
  status: CandidateStatus;
  stage: CandidateStage;
  experience_years: number;
}

export interface CandidatePatchPayload {
  status: CandidateStatus;
  stage: CandidateStage;
}

export interface CandidateNoteCreatePayload {
  content: string;
}