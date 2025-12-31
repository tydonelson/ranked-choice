import { Poll, PollResults, CreatePollRequest, CreateVoteRequest } from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || 'Request failed');
  }
  return response.json();
}

export const api = {
  createPoll: async (data: CreatePollRequest): Promise<Poll> => {
    const response = await fetch(`${API_URL}/polls`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<Poll>(response);
  },

  getPoll: async (pollId: string): Promise<Poll> => {
    const response = await fetch(`${API_URL}/polls/${pollId}`);
    return handleResponse<Poll>(response);
  },

  submitVote: async (pollId: string, data: CreateVoteRequest): Promise<void> => {
    const response = await fetch(`${API_URL}/polls/${pollId}/vote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<void>(response);
  },

  getResults: async (pollId: string): Promise<PollResults> => {
    const response = await fetch(`${API_URL}/polls/${pollId}/results`);
    return handleResponse<PollResults>(response);
  },
};
