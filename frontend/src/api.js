import axios from 'axios';

// Connect to the backend URL defined in .env, defaulting to localhost:5000
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const api = {
  // Calculates footprint breakdown
  calculateFootprint: (data) => apiClient.post('/api/calculate/footprint', data),
  
  // Saves daily logs
  logHabit: (data) => apiClient.post('/api/habits/log', data),
  
  // Retrieves 30-day history
  getHistory: (userId, limit = 30) => apiClient.get('/api/habits/history', { params: { user_id: userId, limit } }),
  deleteLog: (userId, date) => apiClient.delete(`/api/habits/log/${date}`, { params: { user_id: userId } }),
  
  // Sends data to Groq AI for suggestions
  generateSuggestions: (data) => apiClient.post('/api/suggestions/generate', data),
  
  // Gets or updates settings
  getSettings: (userId) => apiClient.get(`/api/habits/settings?user_id=${userId}`),
  updateSettings: (data) => apiClient.patch('/api/habits/settings', data),
  
  // Gets or updates badges
  getBadges: (userId) => apiClient.get(`/api/habits/badges?user_id=${userId}`),
  updateBadges: (data) => apiClient.post('/api/habits/badges', data),
};
