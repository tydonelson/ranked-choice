import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Poll, PollResults } from '../types';
import './Results.css';

interface ResultsProps {
  pollId: string;
}

export function Results({ pollId }: ResultsProps) {
  const [poll, setPoll] = useState<Poll | null>(null);
  const [results, setResults] = useState<PollResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    loadResults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pollId]);

  const loadResults = async () => {
    setLoading(true);
    setError('');
    try {
      const [pollData, resultsData] = await Promise.all([
        api.getPoll(pollId),
        api.getResults(pollId)
      ]);
      setPoll(pollData);
      setResults(resultsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load results');
    } finally {
      setLoading(false);
    }
  };

  const copyPollLink = () => {
    const pollUrl = `${window.location.origin}/poll/${pollId}`;
    navigator.clipboard.writeText(pollUrl).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  if (loading) {
    return <div className="results-container"><p>Loading results...</p></div>;
  }

  if (error) {
    return (
      <div className="results-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  if (!poll || !results) {
    return <div className="results-container"><p>No results found</p></div>;
  }

  if (results.totalVotes === 0) {
    return (
      <div className="results-container">
        <h2>{poll.title}</h2>
        {poll.description && <p className="poll-description">{poll.description}</p>}
        <div className="no-votes">
          <p>No votes have been cast yet.</p>
          <p>Share this poll to start collecting votes!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="results-container">
      <h2>{poll.title}</h2>
      {poll.description && <p className="poll-description">{poll.description}</p>}

      <div className="share-section">
        <button onClick={copyPollLink} className="copy-link-btn">
          {copySuccess ? '✓ Link Copied!' : '📋 Copy Poll Link'}
        </button>
      </div>

      <div className="results-summary">
        <p><strong>Total Votes:</strong> {results.totalVotes}</p>
        {results.winner && (
          <div className="winner-announcement">
            <h3>Winner: {results.winner}</h3>
          </div>
        )}
      </div>

      <div className="rounds-section">
        <h3>Round-by-Round Results</h3>
        {results.rounds.map((round) => {
          const totalVotesInRound = Object.values(round.votes).reduce((sum, count) => sum + count, 0);
          const majority = Math.floor(totalVotesInRound / 2) + 1;

          return (
            <div key={round.roundNumber} className="round">
              <h4>Round {round.roundNumber}</h4>
              <div className="vote-bars">
                {Object.entries(round.votes)
                  .sort(([, a], [, b]) => b - a)
                  .map(([candidate, votes]) => {
                    const percentage = totalVotesInRound > 0
                      ? (votes / totalVotesInRound) * 100
                      : 0;
                    const hasMajority = votes >= majority;

                    return (
                      <div key={candidate} className="vote-bar-container">
                        <div className="candidate-info">
                          <span className="candidate-name">
                            {candidate}
                            {hasMajority && <span className="majority-badge">Majority</span>}
                          </span>
                          <span className="vote-count">
                            {votes} {votes === 1 ? 'vote' : 'votes'} ({percentage.toFixed(1)}%)
                          </span>
                        </div>
                        <div className="vote-bar-track">
                          <div
                            className={`vote-bar ${hasMajority ? 'has-majority' : ''}`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
              {round.eliminated && (
                <div className="eliminated-notice">
                  <strong>Eliminated:</strong> {round.eliminated}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="how-it-works">
        <h4>How Ranked Choice Voting Works</h4>
        <ol>
          <li>Count all first-choice votes</li>
          <li>If a candidate has more than 50% of votes, they win</li>
          <li>If not, eliminate the candidate with the fewest votes</li>
          <li>Redistribute those votes to voters' next choices</li>
          <li>Repeat until someone has a majority</li>
        </ol>
      </div>
    </div>
  );
}
