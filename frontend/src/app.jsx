import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import React, { useCallback, useEffect, useState } from 'react';
import { api } from './api';
import { auth, onAuthStateChanged, signOut } from './firebase';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import LogToday from './pages/LogToday';
import Suggestions from './pages/Suggestions';
import AppLayout from './components/AppLayout';

const getStoredUser = () => {
  try {
    const saved = localStorage.getItem('ecotrack-user');
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

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

const History = ({ user }) => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const userId = user?.uid || 'demo_user_123';

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.getHistory(userId, 365);
      setEntries((response.data || []).sort((a, b) => b.date.localeCompare(a.date)));
    } catch (err) {
      console.error('History fetch failed:', err);
      setError(err.response?.data?.error || 'Could not load history. Check that the EcoTrack backend is running.');
    } finally { setLoading(false); }
  }, [userId]);

  useEffect(() => { fetchHistory(); }, [fetchHistory]);

  const removeEntry = async (entry) => {
    if (!window.confirm(`Delete the log for ${entry.date}?`)) return;
    try {
      await api.deleteLog(userId, entry.date);
      setEntries((current) => current.filter((item) => item.date !== entry.date));
    } catch (err) {
      setError(err.response?.data?.error || 'Could not delete this log.');
    }
  };

  return (
    <div className="placeholder-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">YOUR PROGRESS</p>
          <h1>History & trends</h1>
          <p className="heading-subtitle">See how your everyday choices add up over time.</p>
        </div>
      </div>

      {error && <div role="alert" className="history-error">{error}<button onClick={fetchHistory}>Try again</button></div>}
      <section className="history-panel">
        {loading ? <p className="history-status">Loading your activity…</p> : entries.length === 0 ? (
          <>
            <span className="empty-state-icon" aria-hidden="true">↗</span>
            <h2>No entries yet</h2>
            <p>Your saved logs will show up here once you start tracking.</p>
            <Link className="primary-action" to="/log">Log your first day <span>→</span></Link>
          </>
        ) : (
          <div className="history-list">
            <h2>Your saved logs <span>{entries.length} {entries.length === 1 ? 'day' : 'days'}</span></h2>
            <div style={{ display: 'grid', gap: '12px', marginTop: '20px' }}>
              {entries.map((entry) => (
                <article key={`${entry.user_id}-${entry.date}`} className="history-entry">
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', marginBottom: '4px' }}>
                    <strong>{new Date(`${entry.date}T12:00:00`).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</strong>
                    <span>{Number(entry.total_emissions || 0).toFixed(2)} kg CO₂e</span>
                  </div>
                  <p style={{ margin: '0', color: '#4B5563' }}>
                    Travel: {entry.transport_mode} · {Number(entry.distance || 0)} km<br />
                    Food: {entry.diet_type} · Waste: {entry.food_waste ? 'Yes' : 'No'}<br />
                    Energy: {Number(entry.electricity_kwh || 0)} kWh · AC: {entry.ac ? 'Yes' : 'No'} · Heating: {entry.heating ? 'Yes' : 'No'}
                  </p>
                  <div className="history-actions"><Link className="history-edit" to={`/log?date=${encodeURIComponent(entry.date)}`}>Edit this day</Link><button className="history-delete" onClick={() => removeEntry(entry)}>Delete</button></div>
                </article>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

const Achievements = ({ user }) => {
  const [daysLogged, setDaysLogged] = useState(null);
  const [error, setError] = useState('');
  const userId = user?.uid || 'demo_user_123';
  useEffect(() => {
    api.getHistory(userId, 365).then(({ data }) => setDaysLogged(data.length)).catch(() => setError('Could not load your progress. Check that the backend is running.'));
  }, [userId]);
  const milestones = [
    { count: 1, title: 'First step', description: 'Log your first day of activities.', icon: '🌱' },
    { count: 7, title: 'A full week', description: 'Track seven different days.', icon: '🌿' },
    { count: 30, title: 'Habit builder', description: 'Track thirty different days.', icon: '🌳' },
  ];
  return <div className="placeholder-page"><div className="page-heading"><div><p className="eyebrow">MILESTONES</p><h1>Achievements</h1><p className="heading-subtitle">Celebrate the small wins that make lasting change.</p></div></div>
    {error && <div role="alert" className="history-error">{error}</div>}
    <section className="history-panel achievement-panel"><h2>{daysLogged === null ? 'Loading progress…' : `${daysLogged} ${daysLogged === 1 ? 'day' : 'days'} tracked`}</h2><p className="heading-subtitle">Each different date you log counts toward your milestones.</p>
      <div className="achievement-list">{milestones.map((milestone) => { const unlocked = (daysLogged || 0) >= milestone.count; return <article className={`achievement-card${unlocked ? ' unlocked' : ''}`} key={milestone.count}><span>{milestone.icon}</span><div><strong>{milestone.title}</strong><p>{milestone.description}</p></div><small>{unlocked ? 'Unlocked' : `${daysLogged === null ? '…' : Math.max(milestone.count - daysLogged, 0)} to go`}</small></article>; })}</div>
      <Link className="primary-action" to="/log">Log a day <span>→</span></Link>
    </section></div>;
};
const Profile = ({ user }) => (
  <div className="placeholder-page">
    <div className="page-heading">
      <div><p className="eyebrow">YOUR ACCOUNT</p><h1>Profile & settings</h1><p className="heading-subtitle">Your EcoTrack account and saved details.</p></div>
    </div>
    <section className="empty-state-panel">
      <span className="empty-state-icon" aria-hidden="true">E</span>
      <h2>{user?.displayName || 'Eco User'}</h2>
      <p>{user?.email || 'demo@ecotrack.app'}</p>
      <Link className="primary-action" to="/">Back to overview <span>→</span></Link>
    </section>
  </div>
);

const ProtectedRoute = ({ user, children }) => (user ? children : <Navigate to="/login" replace />);

function App() {
  const [user, setUser] = useState(() => getStoredUser());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!auth) {
      const persistedUser = getStoredUser();
      setUser(persistedUser || null);
      setReady(true);
      return undefined;
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const nextUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Eco User',
          demo: false,
        };
        localStorage.setItem('ecotrack-user', JSON.stringify(nextUser));
        setUser(nextUser);
      } else {
        const persistedUser = getStoredUser();
        setUser(persistedUser || null);
      }
      setReady(true);
    });

    return unsubscribe;
  }, []);

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
    }
    localStorage.removeItem('ecotrack-user');
    setUser(null);
  };

  if (!ready) {
    return <div style={{ display: 'grid', placeItems: 'center', minHeight: '100vh' }}>Loading EcoTrack…</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login onLogin={setUser} />} />
        <Route element={<AppLayout user={user} onLogout={handleLogout} />}>
          <Route path="/" element={<ProtectedRoute user={user}><Dashboard user={user} /></ProtectedRoute>} />
          <Route path="/log" element={<ProtectedRoute user={user}><LogToday user={user} /></ProtectedRoute>} />
          <Route path="/suggestions" element={<ProtectedRoute user={user}><Suggestions user={user} /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute user={user}><History user={user} /></ProtectedRoute>} />
          <Route path="/achievements" element={<ProtectedRoute user={user}><Achievements user={user} /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute user={user}><Profile user={user} /></ProtectedRoute>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
