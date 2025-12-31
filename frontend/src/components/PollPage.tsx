import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Vote } from './Vote';
import { Results } from './Results';
import './PollPage.css';

interface PollPageProps {
  showResults?: boolean;
}

export function PollPage({ showResults = false }: PollPageProps) {
  const { pollId } = useParams<{ pollId: string }>();
  const navigate = useNavigate();
  const [hasVoted, setHasVoted] = useState(showResults);

  if (!pollId) {
    return <div className="poll-page"><p>Invalid poll ID</p></div>;
  }

  const handleVoteSubmitted = () => {
    setHasVoted(true);
    navigate(`/poll/${pollId}/results`);
  };

  return (
    <div className="poll-page">
      <div className="poll-tabs">
        <Link
          to={`/poll/${pollId}`}
          className={!hasVoted ? 'tab active' : 'tab'}
          onClick={() => setHasVoted(false)}
        >
          Vote
        </Link>
        <Link
          to={`/poll/${pollId}/results`}
          className={hasVoted ? 'tab active' : 'tab'}
          onClick={() => setHasVoted(true)}
        >
          Results
        </Link>
      </div>

      {hasVoted ? (
        <Results pollId={pollId} />
      ) : (
        <Vote pollId={pollId} onVoteSubmitted={handleVoteSubmitted} />
      )}
    </div>
  );
}
