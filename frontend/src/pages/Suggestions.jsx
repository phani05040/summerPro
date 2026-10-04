import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

const Suggestions = () => {
  const navigate = useNavigate();
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch suggestions automatically when page loads
    const fetchSuggestions = async () => {
      try {
        // Simulating the payload you just logged
        const payload = { travel_emissions: 2.5, food_emissions: 5.6, energy_emissions: 1.2, total: 9.3 };
        const response = await api.generateSuggestions(payload);
        setSuggestions(response.data);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSuggestions();
  }, []);

  return (
    <div className="suggestions-page">
      <div className="page-heading">
        <div><p className="eyebrow">PERSONAL IDEAS</p><h1>Suggestions</h1><p className="heading-subtitle">Practical ways to make your everyday routine lighter.</p></div>
        <button className="back-link" onClick={() => navigate('/')}>← Overview</button>
      </div>
      <div className="suggestions-content">
        <div className="suggestions-intro">
          <div className="mt-3 inline-block bg-pink-50 text-pink-600 text-xs font-bold px-3 py-1 rounded-full border border-pink-100">
            ✨ AI-powered by Groq (LLaMA 3.3 70B)
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-500 font-medium animate-pulse">
            🤖 Analyzing your habits with AI...
          </div>
        ) : (
          <div className="space-y-4">
            {suggestions.map((sug, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-start">
                <div className="text-3xl mr-4 bg-gray-50 p-3 rounded-full">
                  {sug.category === 'travel' ? '🚗' : sug.category === 'food' ? '🥗' : '⚡'}
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">{sug.title}</h3>
                  <p className="text-gray-600 text-sm mt-1">{sug.description}</p>
                  <div className="mt-3 inline-block bg-green-50 text-green-700 text-xs font-bold px-3 py-1 rounded-md border border-green-100">
                    ✅ Could save {sug.estimated_co2_saving} today
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick Swaps Footer */}
        <div className="mt-12">
          <h4 className="font-bold text-gray-800 mb-4">Quick Green Swaps</h4>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-center">
              <div className="text-2xl mb-2">🚌</div>
              <div className="text-xs font-bold text-gray-700">Use public transport</div>
              <div className="text-xs text-green-600 font-medium mt-1">Save 2.4 kg</div>
            </div>
            <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-center">
              <div className="text-2xl mb-2">💡</div>
              <div className="text-xs font-bold text-gray-700">Eat plant-based</div>
              <div className="text-xs text-green-600 font-medium mt-1">Save 1.5 kg</div>
            </div>
            <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-center">
              <div className="text-2xl mb-2">🔌</div>
              <div className="text-xs font-bold text-gray-700">Unplug devices</div>
              <div className="text-xs text-green-600 font-medium mt-1">Save 0.3 kg</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Suggestions;