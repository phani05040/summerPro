import React from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-600 via-green-700 to-green-900 selection:bg-green-300">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md transform transition-all hover:scale-[1.01] duration-300">
        <div className="text-center mb-8">
          <div className="text-green-600 text-5xl mb-3 drop-shadow-md">🌿</div>
          <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">EcoTrack</h1>
          <p className="text-sm text-gray-500 mt-1 font-medium">Track your carbon footprint. Live greener.</p>
        </div>
        
        <div className="flex mb-6 bg-gray-100 rounded-xl p-1.5">
          <button className="flex-1 bg-white shadow-sm text-sm font-bold text-gray-800 py-2.5 rounded-lg transition-all">Sign In</button>
          <button className="flex-1 text-sm font-medium py-2.5 text-gray-500 hover:text-gray-700 transition-colors">Create Account</button>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Email</label>
            <input 
              type="email" 
              defaultValue="demo@ecotrack.app" 
              className="w-full bg-blue-50/50 border border-blue-100 rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all" 
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Password</label>
            <input 
              type="password" 
              defaultValue="........" 
              className="w-full bg-blue-50/50 border border-blue-100 rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all" 
            />
          </div>
          <button 
            className="w-full bg-green-700 text-white font-bold py-3.5 rounded-xl hover:bg-green-800 hover:shadow-lg active:scale-95 transition-all duration-200" 
            onClick={() => navigate('/')}
          >
            Sign In
          </button>
        </div>

        <div className="mt-8 flex items-center justify-between">
          <hr className="w-full border-gray-200" />
          <span className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">or</span>
          <hr className="w-full border-gray-200" />
        </div>

        <button 
          className="w-full mt-8 bg-green-50 text-green-700 font-bold py-3.5 rounded-xl border border-green-200 hover:bg-green-100 hover:border-green-300 transition-all duration-200 flex items-center justify-center gap-2 group" 
          onClick={() => navigate('/')}
        >
          <span className="group-hover:-translate-y-1 transition-transform">🚀</span> Try Demo Mode (no account needed)
        </button>
        <p className="text-xs text-center text-gray-400 mt-5 font-medium px-4">
          Demo mode works without Firebase. Your data is stored in memory for the session.
        </p>
      </div>
    </div>
  );
};

export default Login;