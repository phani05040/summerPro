import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  });

  return (
    <div className="dashboard-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">OVERVIEW</p>
          <h1>Good morning, Eco User</h1>
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
            <div className="footprint-number">0.0 <span>kg CO₂e</span></div>
            <p className="footprint-note">You haven’t logged any activity yet.</p>
            <div className="budget-track"><span /></div>
            <div className="budget-labels"><span>0 kg used</span><span>8 kg daily budget</span></div>
            <button className="primary-action" onClick={() => navigate('/log')}><span>+</span> Log today’s activity</button>
          </div>
          <div className="panel-orbit orbit-one" /><div className="panel-orbit orbit-two" />
        </div>

        <div className="breakdown-panel">
          <div className="panel-heading">
            <div><span className="panel-kicker">WHERE IT COMES FROM</span><h2>Daily breakdown</h2></div>
            <span className="breakdown-total">0.00 <small>kg</small></span>
          </div>
          <div className="category-list">
            <div className="category-row"><span className="category-icon travel-icon">↗</span><div className="category-info"><div><strong>Travel</strong><span>0.00 kg</span></div><div className="category-track"><i className="travel-bar" /></div></div></div>
            <div className="category-row"><span className="category-icon food-icon">◒</span><div className="category-info"><div><strong>Food</strong><span>0.00 kg</span></div><div className="category-track"><i className="food-bar" /></div></div></div>
            <div className="category-row"><span className="category-icon energy-icon">ϟ</span><div className="category-info"><div><strong>Home energy</strong><span>0.00 kg</span></div><div className="category-track"><i className="energy-bar" /></div></div></div>
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
        <div className="small-panel streak-panel"><div className="small-panel-title"><span>◷</span><h2>Your tracking rhythm</h2></div><p>Build a clearer picture of your impact by logging a little each day.</p><div className="week-dots" aria-label="No days logged this week"><span /><span /><span /><span /><span /><span /><span /></div><div className="week-labels"><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span></div></div>
      </section>
    </div>
  );
};

export default Dashboard;