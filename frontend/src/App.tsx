import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import { CreatePoll } from './components/CreatePoll';
import { PollPage } from './components/PollPage';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <header className="App-header">
          <h1>
            <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
              Ranked Choice Voting
            </Link>
          </h1>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<CreatePoll />} />
            <Route path="/poll/:pollId" element={<PollPage />} />
            <Route path="/poll/:pollId/results" element={<PollPage showResults={true} />} />
          </Routes>
        </main>

        <footer>
          <p>Built with React + TypeScript and Go on AWS</p>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
