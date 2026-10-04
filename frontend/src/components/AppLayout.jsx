import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const navigation = [
  { to: '/', label: 'Overview', icon: '◫', end: true },
  { to: '/log', label: 'Log today', icon: '+' },
  { to: '/history', label: 'History', icon: '↗' },
  { to: '/suggestions', label: 'Suggestions', icon: '✳' },
  { to: '/achievements', label: 'Achievements', icon: '◇' },
];

function AppLayout() {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <NavLink className="brand" to="/" aria-label="EcoTrack home">
          <span className="brand-mark">e</span>
          <span>ecotrack</span>
        </NavLink>
        <div className="sidebar-label">WORKSPACE</div>
        <nav className="side-nav" aria-label="Main navigation">
          {navigation.map(({ to, label, icon, end }) => (
            <NavLink key={to} to={to} end={end} className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              <span className="nav-icon" aria-hidden="true">{icon}</span>
              <span>{label}</span>
              {label === 'Log today' && <span className="nav-add">+</span>}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-tip">
            <span className="tip-icon">✦</span>
            <p>Small choices add up.</p>
            <span>Every day is a fresh start.</span>
          </div>
          <NavLink className="account-link" to="/profile">
            <span className="avatar">E</span>
            <span className="account-copy"><strong>Eco User</strong><small>Personal account</small></span>
            <span className="account-more">···</span>
          </NavLink>
        </div>
      </aside>
      <div className="main-column">
        <header className="topbar">
          <span className="topbar-context">Your sustainability, in focus</span>
          <div className="topbar-actions">
            <span className="demo-indicator"><span /> Demo mode</span>
            <NavLink className="topbar-profile" to="/profile" aria-label="Open profile">E</NavLink>
          </div>
        </header>
        <main className="page-content"><Outlet /></main>
      </div>
    </div>
  );
}

export default AppLayout;