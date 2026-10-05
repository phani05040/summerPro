import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

const Dashboard = ({ user }) => {
  const navigate = useNavigate();
  const userId = user?.uid || 'demo_user_123';
  const [todayEntry, setTodayEntry] = useState(null);
  const [weekDates, setWeekDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const todayKey = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  useEffect(() => {
    let active = true;
    api.getHistory(userId, 365).then(({ data }) => {
      if (!active) return;
      setTodayEntry(data.find((entry) => entry.date === todayKey) || null);
      const start = new Date();
      start.setDate(start.getDate() - 6);
      const dates = Array.from({ length: 7 }, (_, i) => { const d = new Date(start); d.setDate(start.getDate() + i); return d.toLocaleDateString('en-CA'); });
      setWeekDates(dates.map((date) => data.some((entry) => entry.date === date)));
    }).catch((error) => console.error('Dashboard activity fetch failed:', error)).finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [userId, todayKey]);
  const total = Number(todayEntry?.total_emissions || 0);
  const categories = [
    ['Travel', Number(todayEntry?.travel_emissions || 0), 'travel-bar', 'travel-icon', '↗'],
    ['Food', Number(todayEntry?.food_emissions || 0), 'food-bar', 'food-icon', '◒'],
    ['Home energy', Number(todayEntry?.energy_emissions || 0), 'energy-bar', 'energy-icon', 'ϟ'],
  ];
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  });

  return (
    <div className="dashboard-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">OVERVIEW</p>
          <h1>Hello, {user?.displayName || 'Eco User'}</h1>
          <p className="heading-subtitle">A little progress goes a long way. Here’s your impact today.</p>
        </div>
        <div className="date-stamp"><span className="date-dot" />{today}</div>
      </div>

      <section className="dashboard-grid" aria-label="Today's carbon footprint">
        <div className="footprint-panel">
          <div className="panel-heading">
            <div><span className="panel-kicker">YOUR DAILY IMPACT</span><h2>Carbon footprint</h2></div>
            <span className="period-tag">Today</span>
          </div>
          <div className="footprint-content">
            <div className="footprint-number">{loading ? '…' : total.toFixed(2)} <span>kg CO₂e</span></div>
            <p className="footprint-note">{todayEntry ? 'Your saved footprint for today.' : 'You haven’t logged any activity today yet.'}</p>
            <div className="budget-track"><span style={{ width: `${Math.min(total / 8 * 100, 100)}%` }} /></div>
            <div className="budget-labels"><span>{total.toFixed(2)} kg used</span><span>8 kg daily budget</span></div>
            <button className="primary-action" onClick={() => navigate(`/log${todayEntry ? `?date=${todayKey}` : ''}`)}><span>+</span> {todayEntry ? 'Update today’s activity' : 'Log today’s activity'}</button>
          </div>
          <div className="panel-orbit orbit-one" /><div className="panel-orbit orbit-two" />
        </div>

        <div className="breakdown-panel">
          <div className="panel-heading">
            <div><span className="panel-kicker">WHERE IT COMES FROM</span><h2>Daily breakdown</h2></div>
            <span className="breakdown-total">{total.toFixed(2)} <small>kg</small></span>
          </div>
          <div className="category-list">
            {categories.map(([label, amount, bar, iconClass, icon]) => <div className="category-row" key={label}><span className={`category-icon ${iconClass}`}>{icon}</span><div className="category-info"><div><strong>{label}</strong><span>{amount.toFixed(2)} kg</span></div><div className="category-track"><i className={bar} style={{ width: `${total ? Math.min(amount / total * 100, 100) : 0}%` }} /></div></div></div>)}
          </div>
          <button className="text-action" onClick={() => navigate('/history')}>View your history <span>→</span></button>
        </div>
      </section>

      <section className="next-step-panel">
        <div className="next-step-copy"><span className="next-step-mark">✳</span><div><span className="panel-kicker">YOUR NEXT STEP</span><h2>Start with one small thing</h2><p>Log your travel, meals, and home energy to see your personal footprint.</p></div></div>
        <button className="secondary-action" onClick={() => navigate('/log')}>Start logging <span>→</span></button>
      </section>

      <section className="bottom-grid">
        <div className="small-panel"><div className="small-panel-title"><span>✦</span><h2>A greener idea</h2></div><p>Try swapping one short car trip for a walk, bike ride, or public transit journey.</p><button onClick={() => navigate('/suggestions')}>Explore suggestions <span>→</span></button></div>
        <div className="small-panel streak-panel"><div className="small-panel-title"><span>◷</span><h2>Your tracking rhythm</h2></div><p>Build a clearer picture of your impact by logging a little each day.</p><div className="week-dots" aria-label="Tracking activity over the last seven days">{weekDates.map((logged, index) => <span key={index} className={logged ? 'logged' : ''} />)}</div><div className="week-labels"><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span></div></div>
      </section>
    </div>
  );
};

export default Dashboard;
