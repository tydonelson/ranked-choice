import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import './CreatePoll.css';

export function CreatePoll() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [candidates, setCandidates] = useState<string[]>(['', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const addCandidate = () => {
    setCandidates([...candidates, '']);
  };

  const removeCandidate = (index: number) => {
    if (candidates.length > 2) {
      setCandidates(candidates.filter((_, i) => i !== index));
    }
  };

  const updateCandidate = (index: number, value: string) => {
    const updated = [...candidates];
    updated[index] = value;
    setCandidates(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!title.trim()) {
      setError('Please enter a poll title');
      return;
    }

    const validCandidates = candidates
      .map(c => c.trim())
      .filter(c => c.length > 0);

    if (validCandidates.length < 2) {
      setError('Please enter at least 2 candidates');
      return;
    }

    // Check for duplicate candidates
    const uniqueCandidates = new Set(validCandidates);
    if (uniqueCandidates.size !== validCandidates.length) {
      setError('Candidate names must be unique');
      return;
    }

    setLoading(true);

    try {
      const poll = await api.createPoll({
        title: title.trim(),
        description: description.trim(),
        candidates: validCandidates,
      });

      // Navigate to the poll page
      navigate(`/poll/${poll.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create poll');
      setLoading(false);
    }
  };

  return (
    <div className="create-poll-container">
      <h2>Create a New Poll</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Poll Title *</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Best Programming Language 2024"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description (optional)</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add more context about this poll..."
            rows={3}
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>Candidates * (minimum 2)</label>
          {candidates.map((candidate, index) => (
            <div key={index} className="candidate-input">
              <input
                type="text"
                value={candidate}
                onChange={(e) => updateCandidate(index, e.target.value)}
                placeholder={`Candidate ${index + 1}`}
                disabled={loading}
              />
              {candidates.length > 2 && (
                <button
                  type="button"
                  onClick={() => removeCandidate(index)}
                  className="remove-btn"
                  disabled={loading}
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addCandidate}
            className="add-candidate-btn"
            disabled={loading}
          >
            + Add Candidate
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Creating Poll...' : 'Create Poll'}
        </button>
      </form>
    </div>
  );
}
