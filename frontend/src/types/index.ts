export interface Poll {
  id: string;
  title: string;
  description: string;
  candidates: string[];
  createdAt: string;
  expiresAt?: string;
}

export interface Vote {
  id: string;
  pollId: string;
  rankings: string[];
  votedAt: string;
}

export interface Round {
  roundNumber: number;
  votes: Record<string, number>;
  eliminated?: string;
}

export interface PollResults {
  pollId: string;
  totalVotes: number;
  rounds: Round[];
  winner?: string;
}

export interface CreatePollRequest {
  title: string;
  description: string;
  candidates: string[];
}

export interface CreateVoteRequest {
  rankings: string[];
}
