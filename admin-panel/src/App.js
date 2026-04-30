import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import IntentManager from './pages/IntentManager';
import IntentTester from './pages/IntentTester';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <div className="nav-brand">
            <h2>Chatbot Admin Panel</h2>
          </div>
          <ul className="nav-links">
            <li><Link to="/">Analytics</Link></li>
            <li><Link to="/intents">Intent Manager</Link></li>
            <li><Link to="/tester">Intent Tester</Link></li>
          </ul>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<AnalyticsDashboard />} />
            <Route path="/intents" element={<IntentManager />} />
            <Route path="/tester" element={<IntentTester />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;