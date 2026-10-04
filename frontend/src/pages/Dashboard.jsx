import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-10">
      {/* Navigation Bar */}
      <nav className="bg-white border-b px-6 py-3 flex items-center justify-between text-sm shadow-sm">
        <div className="flex items-center font-bold text-green-700 text-lg">
          🌿 EcoTrack <span className="ml-2 text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">Demo</span>
        </div>
        <div className="flex space-x-6 text-gray-600 font-medium">
          <button className="text-green-700 bg-green-50 px-3 py-1 rounded-md flex items-center">🏠 Dashboard</button>
          <button onClick={() => navigate('/log')} className="hover:text-green-600 flex items-center">✏️ Log Today</button>
          <button onClick={() => navigate('/history')} className="hover:text-green-600 flex items-center">📈 History</button>
          <button onClick={() => navigate('/suggestions')} className="hover:text-green-600 flex items-center">💡 Suggestions</button>
          <button onClick={() => navigate('/achievements')} className="hover:text-green-600 flex items-center">🏅 Achievements</button>
          <button onClick={() => navigate('/profile')} className="hover:text-green-600 flex items-center">⚙️ Profile</button>
        </div>
        <div className="flex items-center space-x-4 text-gray-500">
          <span>demo@ecotrack.app</span>
          <button className="text-red-500 hover:text-red-600 font-medium" onClick={() => navigate('/login')}>Sign out</button>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="max-w-5xl mx-auto p-6 mt-4">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-800">Welcome back, Eco User 👋</h1>
          <p className="text-gray-500 text-sm mt-1">Monday, 25 May 2026</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Carbon Gauge Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col items-center justify-center">
            <h2 className="text-gray-700 font-medium mb-6">Today's Footprint</h2>
            <div className="relative w-48 h-48 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="#f3f4f6" strokeWidth="8" fill="none" />
                <circle cx="50" cy="50" r="40" stroke="#22c55e" strokeWidth="8" fill="none" strokeDasharray="250" strokeDashoffset="250" className="transition-all duration-1000" />
              </svg>
              <div className="absolute text-center">
                <div className="text-4xl font-bold text-green-500">0.0</div>
                <div className="text-xs text-gray-400 mt-1">kg CO₂</div>
                <div className="text-xs text-gray-400">of 8.0 target</div>
              </div>
            </div>
            <div className="text-green-500 font-medium text-sm mt-6">8.0 kg remaining</div>
            <div className="w-full flex justify-between text-xs text-gray-400 mt-4 px-4">
              <span>0 kg</span>
              <span>8 kg budget</span>
            </div>
          </div>

          {/* Habit Mini Cards */}
          <div className="flex flex-col gap-4 justify-center">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center justify-between">
              <div className="flex items-center"><span className="text-2xl mr-4">🚗</span><span className="font-medium text-gray-700">Travel</span></div>
              <span className="font-bold text-gray-800 text-lg">0.00 kg</span>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center justify-between">
              <div className="flex items-center"><span className="text-2xl mr-4">🍽️</span><span className="font-medium text-gray-700">Food</span></div>
              <span className="font-bold text-gray-800 text-lg">0.00 kg</span>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center justify-between">
              <div className="flex items-center"><span className="text-2xl mr-4">⚡</span><span className="font-medium text-gray-700">Energy</span></div>
              <span className="font-bold text-gray-800 text-lg">0.00 kg</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white text-center py-4 rounded-xl shadow-sm border border-gray-100 mb-6 font-medium text-gray-700 text-sm">
          No log yet today. Start tracking your habits! 🏋️
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          <button onClick={() => navigate('/log')} className="bg-green-700 text-white rounded-xl p-4 font-medium hover:bg-green-800 transition shadow-sm">
            ✏️ Log Today
          </button>
          <button onClick={() => navigate('/suggestions')} className="bg-green-50 text-green-800 rounded-xl p-4 font-medium border border-green-100 hover:bg-green-100 transition shadow-sm">
            💡 Suggestions
          </button>
          <button onClick={() => navigate('/history')} className="bg-green-50 text-green-800 rounded-xl p-4 font-medium border border-green-100 hover:bg-green-100 transition shadow-sm">
            📈 History
          </button>
          <button onClick={() => navigate('/achievements')} className="bg-green-50 text-green-800 rounded-xl p-4 font-medium border border-green-100 hover:bg-green-100 transition shadow-sm">
            🏅 Achievements
          </button>
        </div>

        {/* Start Logging Prompt */}
        <div className="bg-green-50 rounded-2xl p-10 text-center border border-green-100 border-dashed">
          <div className="text-4xl mb-3">📝</div>
          <h3 className="font-bold text-gray-800 text-lg mb-1">No habits logged today</h3>
          <p className="text-sm text-gray-500 mb-6">Track your travel, food, and energy to see your carbon footprint.</p>
          <button onClick={() => navigate('/log')} className="bg-green-700 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-800 transition shadow-sm">
            Start Logging →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;