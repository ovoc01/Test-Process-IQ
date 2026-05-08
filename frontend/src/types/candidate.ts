export enum CandidateStatus {
  PENDING = 'pending',
  VALIDATED = 'validated',
  REJECTED = 'rejected',
}

export interface Candidate {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: CandidateStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CandidateResponse {
  candidates: Candidate[];
  totalPages: number;
  currentPage: number;
  total: number;
}
