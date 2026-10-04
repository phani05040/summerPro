import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React from 'react';

// Import all your completed pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import LogToday from './pages/LogToday';
import Suggestions from './pages/Suggestions';

// Placeholders for the final three pages
const History = () => <div>History & Trends Charts Page</div>;
const Achievements = () => <div>Badges Page</div>;
const Profile = () => <div>Settings Page</div>;

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-green-50 text-gray-900">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/log" element={<LogToday />} />
          <Route path="/suggestions" element={<Suggestions />} />
          <Route path="/history" element={<History />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;