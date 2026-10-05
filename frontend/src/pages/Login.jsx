import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from '../firebase';

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [mode, setMode] = useState('signin');
  const [email, setEmail] = useState('demo@ecotrack.app');
  const [password, setPassword] = useState('demo123456');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDemoLogin = () => {
    const demoUser = {
      uid: 'demo_user_123',
      email: 'demo@ecotrack.app',
      displayName: 'Eco User',
      demo: true,
    };
    localStorage.setItem('ecotrack-user', JSON.stringify(demoUser));
    onLogin?.(demoUser);
    navigate('/');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Enter both email and password.');
      return;
    }

    try {
      setLoading(true);

      if (!auth) {
        const fallbackUser = {
          uid: `demo_${email.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || 'user'}`,
          email: email.trim(),
          displayName: email.split('@')[0] || 'Eco User',
          demo: true,
        };
        localStorage.setItem('ecotrack-user', JSON.stringify(fallbackUser));
        onLogin?.(fallbackUser);
        navigate('/');
        return;
      }

      const userCredential = mode === 'signin'
        ? await signInWithEmailAndPassword(auth, email.trim(), password)
        : await createUserWithEmailAndPassword(auth, email.trim(), password);

      const nextUser = {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: userCredential.user.displayName || email.split('@')[0] || 'Eco User',
        demo: false,
      };

      localStorage.setItem('ecotrack-user', JSON.stringify(nextUser));
      onLogin?.(nextUser);
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Unable to sign in right now.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-600 via-green-700 to-green-900 selection:bg-green-300">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md transform transition-all hover:scale-[1.01] duration-300">
        <div className="text-center mb-8">
          <div className="text-green-600 text-5xl mb-3 drop-shadow-md">🌿</div>
          <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">EcoTrack</h1>
          <p className="text-sm text-gray-500 mt-1 font-medium">Track your carbon footprint. Live greener.</p>
        </div>

        <div className="flex mb-6 bg-gray-100 rounded-xl p-1.5">
          <button
            type="button"
            onClick={() => setMode('signin')}
            className={`flex-1 text-sm font-bold py-2.5 rounded-lg transition-all ${mode === 'signin' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-500'}`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode('signup')}
            className={`flex-1 text-sm font-medium py-2.5 rounded-lg transition-all ${mode === 'signup' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-500'}`}
          >
            Create Account
          </button>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-blue-50/50 border border-blue-100 rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-blue-50/50 border border-blue-100 rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-700 text-white font-bold py-3.5 rounded-xl hover:bg-green-800 hover:shadow-lg active:scale-95 transition-all duration-200 disabled:opacity-60"
          >
            {loading ? 'Please wait...' : mode === 'signin' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="mt-8 flex items-center justify-between">
          <hr className="w-full border-gray-200" />
          <span className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">or</span>
          <hr className="w-full border-gray-200" />
        </div>

        <button
          type="button"
          className="w-full mt-8 bg-green-50 text-green-700 font-bold py-3.5 rounded-xl border border-green-200 hover:bg-green-100 hover:border-green-300 transition-all duration-200 flex items-center justify-center gap-2 group"
          onClick={handleDemoLogin}
        >
          <span className="group-hover:-translate-y-1 transition-transform">🚀</span> Try Demo Mode
        </button>
        <p className="text-xs text-center text-gray-400 mt-5 font-medium px-4">
          {auth ? 'Your sign-in uses Firebase; activity logs are saved by the EcoTrack backend.' : 'Cloud sign-in is not configured. You can use demo mode or a local profile.'}
        </p>
      </div>
    </div>
  );
};

export default Login;
