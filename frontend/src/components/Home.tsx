import React from 'react';
import { useNavigate } from 'react-router-dom';

export function Home() {
  const navigate = useNavigate();

  return (
    <div className="home">
      <h2>Welcome to Ranked Choice Voting</h2>
      <p>Create polls and let people vote using ranked choice voting.</p>
      <div className="features">
        <div className="feature">
          <h3>Create Polls</h3>
          <p>Set up polls with multiple candidates</p>
        </div>
        <div className="feature">
          <h3>Ranked Voting</h3>
          <p>Voters rank candidates in order of preference</p>
        </div>
        <div className="feature">
          <h3>Fair Results</h3>
          <p>Results calculated using instant-runoff voting</p>
        </div>
        <div className="feature">
          <h3>Share Links</h3>
          <p>Easily share poll links with voters</p>
        </div>
      </div>
      <button
        className="cta-button"
        onClick={() => navigate('/create')}
      >
        Create Your First Poll
      </button>
    </div>
  );
}
