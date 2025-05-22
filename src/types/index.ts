
export type ElectionType = 'general' | 'department' | 'custom';

export interface Election {
  id: string;
  name: string;
  description?: string;
  type: ElectionType;
  status: 'draft' | 'upcoming' | 'active' | 'ended' | 'published';
  startDate?: Date;
  endDate?: Date;
  positions: Position[];
  departments?: string[];
  customVotersList?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Position {
  id: string;
  title: string;
  description?: string;
  candidates: Candidate[];
  electionId: string;
}

export interface Candidate {
  id: string;
  name: string;
  slogan?: string;
  imageUrl?: string;
  bio?: string;
  positionId: string;
  votes?: number;
}

export interface Vote {
  id: string;
  electionId: string;
  positionId: string;
  candidateId: string;
  voterId: string;
  timestamp: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  department?: string;
  hasVoted?: Record<string, boolean>; // electionId -> boolean
}
