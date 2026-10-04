import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import React from 'react';

// Import all your completed pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import LogToday from './pages/LogToday';
import Suggestions from './pages/Suggestions';
import AppLayout from './components/AppLayout';

const PlaceholderPage = ({ eyebrow, title, description, icon, action, to }) => (
  <div className="placeholder-page">
    <div className="page-heading">
      <div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p className="heading-subtitle">{description}</p></div>
    </div>
    <section className="empty-state-panel">
      <span className="empty-state-icon" aria-hidden="true">{icon}</span>
      <h2>There’s more to come</h2>
      <p>Your activity will show up here once you start logging your daily habits.</p>
      <Link className="primary-action" to={to}>{action} <span>→</span></Link>
    </section>
  </div>
);

const History = () => <PlaceholderPage eyebrow="YOUR PROGRESS" title="History & trends" description="See how your everyday choices add up over time." icon="↗" action="Log your first day" to="/log" />;
const Achievements = () => <PlaceholderPage eyebrow="MILESTONES" title="Achievements" description="Celebrate the small wins that make lasting change." icon="◇" action="Start tracking" to="/log" />;
const Profile = () => <PlaceholderPage eyebrow="YOUR ACCOUNT" title="Profile & settings" description="Your EcoTrack demo profile and account preferences." icon="E" action="Back to overview" to="/" />;

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/log" element={<LogToday />} />
          <Route path="/suggestions" element={<Suggestions />} />
          <Route path="/history" element={<History />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;