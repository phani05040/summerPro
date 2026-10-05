import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../api';

const LogToday = ({ user }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const activeUserId = user?.uid || 'demo_user_123';

  const [formData, setFormData] = useState({
    user_id: activeUserId,
    date: searchParams.get('date') || new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10),
    transport_mode: 'Car Petrol',
    distance: 0,
    passengers: 1,
    diet_type: 'Omnivore',
    food_waste: false,
    electricity_kwh: 0,
    heating: false,
    ac: false
  });

  useEffect(() => {
    setFormData((current) => ({ ...current, user_id: activeUserId }));
  }, [activeUserId]);

  useEffect(() => {
    const date = searchParams.get('date');
    if (!date) return;
    let active = true;
    api.getHistory(activeUserId, 365).then(({ data }) => {
      const existing = data.find((entry) => entry.date === date);
      if (active && existing) setFormData((current) => ({ ...current, ...existing, user_id: activeUserId }));
    }).catch((error) => console.error('Could not load saved log:', error));
    return () => { active = false; };
  }, [activeUserId, searchParams]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const numericFields = ['distance', 'passengers', 'electricity_kwh'];

    setFormData((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : numericFields.includes(name) ? Number(value) : value
    }));
  };

  // Final submission to the Flask backend
  const handleSubmit = async () => {
    if (!formData.date) return;
    setLoading(true);
    try {
      const payload = {
        ...formData,
        user_id: activeUserId,
        distance: Number(formData.distance) || 0,
        passengers: Number(formData.passengers) || 1,
        electricity_kwh: Number(formData.electricity_kwh) || 0,
        food_waste: Boolean(formData.food_waste),
        heating: Boolean(formData.heating),
        ac: Boolean(formData.ac),
      };

      // 1. Calculate the footprint via Flask
      const calcResponse = await api.calculateFootprint(payload);
      const totalEmissions = calcResponse.data.total;

      // 2. Log the habit to Firebase (via Flask)
      await api.logHabit({ ...payload, total_emissions: totalEmissions, travel_emissions: calcResponse.data.travel_emissions, food_emissions: calcResponse.data.food_emissions, energy_emissions: calcResponse.data.energy_emissions });

      // 3. Move to Suggestions automatically
      navigate(`/suggestions?date=${encodeURIComponent(payload.date)}`);
    } catch (error) {
      console.error("Error logging habits:", error);
      alert(error.response?.data?.error || "Could not save your daily log. Check that the EcoTrack backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="log-page">
      <div className="page-heading log-heading">
        <div><p className="eyebrow">DAILY CHECK-IN</p><h1>Log today’s activity</h1><p className="heading-subtitle">A few details help us estimate your daily footprint.</p></div>
        <button className="back-link" onClick={() => navigate('/')}>← Overview</button>
      </div>
      <div className="log-content">
        <div className="log-date"><label htmlFor="log-date">Log date</label><input id="log-date" name="date" type="date" value={formData.date} onChange={handleChange} required /></div>

        {/* 3-Step Progress Tracker */}
        <div className="flex justify-center mb-8 space-x-4 text-sm font-medium">
          <div className={`px-4 py-2 rounded-full flex items-center ${step === 1 ? 'bg-green-700 text-white' : 'bg-white text-gray-400 border'}`}>
            🚗 Travel
          </div>
          <div className="text-gray-300 mt-2">—</div>
          <div className={`px-4 py-2 rounded-full flex items-center ${step === 2 ? 'bg-green-700 text-white' : 'bg-white text-gray-400 border'}`}>
            🍽️ Food
          </div>
          <div className="text-gray-300 mt-2">—</div>
          <div className={`px-4 py-2 rounded-full flex items-center ${step === 3 ? 'bg-green-700 text-white' : 'bg-white text-gray-400 border'}`}>
            ⚡ Energy
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          
          {/* STEP 1: TRAVEL */}
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-lg font-bold text-gray-800 flex items-center">🚗 Travel</h2>
              
              <div>
                <label htmlFor="transport_mode" className="block text-sm font-medium text-gray-700 mb-2">Mode of Transport</label>
                <select id="transport_mode" name="transport_mode" value={formData.transport_mode} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-green-500">
                  <option value="Car Petrol">🚗 Car (Petrol)</option>
                  <option value="Car Diesel">🚗 Car (Diesel)</option>
                  <option value="Car Electric">⚡ Car (Electric)</option>
                  <option value="Bus">🚌 Bus</option>
                  <option value="Train">🚆 Train</option>
                  <option value="Bicycle">🚲 Bicycle</option>
                  <option value="Walking">🚶 Walking</option>
                </select>
              </div>

              <div>
                <label htmlFor="distance" className="block text-sm font-medium text-gray-700 mb-2">Distance Traveled (km)</label>
                <input id="distance" type="number" name="distance" value={formData.distance} onChange={handleChange} min="0" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-green-500" />
              </div>

              <div>
                <label htmlFor="passengers" className="block text-sm font-medium text-gray-700 mb-2">Passengers</label>
                <input id="passengers" type="number" name="passengers" value={formData.passengers} onChange={handleChange} min="1" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-green-500" />
              </div>

              <div className="bg-green-50 text-green-700 p-4 rounded-lg text-sm font-medium">
                Estimated: ~{((formData.distance || 0) * 0.192).toFixed(2)} kg CO₂
              </div>

              <button onClick={() => setStep(2)} className="w-full bg-green-700 text-white font-bold py-3 rounded-xl hover:bg-green-800 transition shadow-sm mt-4">
                Next: Food →
              </button>
            </div>
          )}

          {/* STEP 2: FOOD */}
          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-lg font-bold text-gray-800 flex items-center">🍽️ Food</h2>
              
              <div>
                <label htmlFor="diet_type" className="block text-sm font-medium text-gray-700 mb-2">Diet Type Today</label>
                <select id="diet_type" name="diet_type" value={formData.diet_type} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-green-500">
                  <option value="Meat-heavy">🥩 Meat-heavy</option>
                  <option value="Omnivore">🍗 Omnivore</option>
                  <option value="Vegetarian">🥗 Vegetarian</option>
                  <option value="Vegan">🌱 Vegan</option>
                </select>
              </div>

              <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <input id="food_waste" type="checkbox" name="food_waste" checked={formData.food_waste} onChange={handleChange} className="w-5 h-5 text-green-600 rounded" />
                <label htmlFor="food_waste" className="text-sm font-medium text-gray-700">I wasted food today (+10% penalty)</label>
              </div>

              <div className="flex space-x-4 mt-6">
                <button onClick={() => setStep(1)} className="w-1/3 bg-gray-100 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-200 transition">
                  ← Back
                </button>
                <button onClick={() => setStep(3)} className="w-2/3 bg-green-700 text-white font-bold py-3 rounded-xl hover:bg-green-800 transition shadow-sm">
                  Next: Energy →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: ENERGY */}
          {step === 3 && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-lg font-bold text-gray-800 flex items-center">⚡ Energy</h2>
              
              <div>
                <label htmlFor="electricity_kwh" className="block text-sm font-medium text-gray-700 mb-2">Electricity Used (kWh)</label>
                <input id="electricity_kwh" type="number" name="electricity_kwh" value={formData.electricity_kwh} onChange={handleChange} min="0" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-green-500" />
              </div>

              <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <input id="heating" type="checkbox" name="heating" checked={formData.heating} onChange={handleChange} className="w-5 h-5 text-green-600 rounded" />
                <label htmlFor="heating" className="text-sm font-medium text-gray-700">Heated the home today</label>
              </div>

              <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <input id="ac" type="checkbox" name="ac" checked={formData.ac} onChange={handleChange} className="w-5 h-5 text-green-600 rounded" />
                <label htmlFor="ac" className="text-sm font-medium text-gray-700">Used Air Conditioning (AC)</label>
              </div>

              <div className="flex space-x-4 mt-6">
                <button onClick={() => setStep(2)} className="w-1/3 bg-gray-100 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-200 transition">
                  ← Back
                </button>
                <button onClick={handleSubmit} disabled={loading} className="w-2/3 bg-green-700 text-white font-bold py-3 rounded-xl hover:bg-green-800 transition shadow-sm disabled:opacity-50">
                  {loading ? 'Processing...' : 'Submit & Get AI Suggestions ✨'}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default LogToday;
