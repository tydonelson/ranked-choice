import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Poll } from '../types';
import './Vote.css';

interface VoteProps {
  pollId: string;
  onVoteSubmitted: () => void;
}

export function Vote({ pollId, onVoteSubmitted }: VoteProps) {
  const [poll, setPoll] = useState<Poll | null>(null);
  const [rankings, setRankings] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  useEffect(() => {
    loadPoll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pollId]);

  const loadPoll = async () => {
    setLoading(true);
    setError('');
    try {
      const pollData = await api.getPoll(pollId);
      setPoll(pollData);
      setRankings([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load poll');
    } finally {
      setLoading(false);
    }
  };

  const toggleCandidate = (candidate: string) => {
    if (rankings.includes(candidate)) {
      setRankings(rankings.filter(c => c !== candidate));
    } else {
      setRankings([...rankings, candidate]);
    }
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();

    if (draggedIndex === null || draggedIndex === index) {
      return;
    }

    const newRankings = [...rankings];
    const draggedItem = newRankings[draggedIndex];

    // Remove dragged item
    newRankings.splice(draggedIndex, 1);
    // Insert at new position
    newRankings.splice(index, 0, draggedItem);

    setRankings(newRankings);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rankings.length === 0) {
      setError('Please rank at least one candidate');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await api.submitVote(pollId, { rankings });
      onVoteSubmitted();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit vote');
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="vote-container"><p>Loading poll...</p></div>;
  }

  if (error && !poll) {
    return <div className="vote-container"><div className="error-message">{error}</div></div>;
  }

  if (!poll) {
    return <div className="vote-container"><p>Poll not found</p></div>;
  }

  const unrankedCandidates = poll.candidates.filter(c => !rankings.includes(c));

  return (
    <div className="vote-container">
      <h2>{poll.title}</h2>
      {poll.description && <p className="poll-description">{poll.description}</p>}

      <form onSubmit={handleSubmit}>
        <div className="instructions">
          <p>Click candidates to add them to your ranking. You can rank as many or as few as you like.</p>
          <p>Drag and drop to reorder your rankings.</p>
        </div>

        {rankings.length > 0 && (
          <div className="rankings-section">
            <h3>Your Rankings</h3>
            <div className="ranked-list">
              {rankings.map((candidate, index) => (
                <div
                  key={candidate}
                  className={`ranked-item ${draggedIndex === index ? 'dragging' : ''}`}
                  draggable={!submitting}
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                >
                  <span className="drag-handle">⋮⋮</span>
                  <span className="rank-number">{index + 1}</span>
                  <span className="candidate-name">{candidate}</span>
                  <button
                    type="button"
                    onClick={() => toggleCandidate(candidate)}
                    disabled={submitting}
                    className="remove-ranking-btn"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {unrankedCandidates.length > 0 && (
          <div className="candidates-section">
            <h3>Available Candidates</h3>
            <div className="candidate-list">
              {unrankedCandidates.map(candidate => (
                <button
                  key={candidate}
                  type="button"
                  onClick={() => toggleCandidate(candidate)}
                  className="candidate-btn"
                  disabled={submitting}
                >
                  {candidate}
                </button>
              ))}
            </div>
          </div>
        )}

        {error && <div className="error-message">{error}</div>}

        <button type="submit" className="submit-vote-btn" disabled={submitting || rankings.length === 0}>
          {submitting ? 'Submitting...' : 'Submit Vote'}
        </button>
      </form>
    </div>
  );
}
