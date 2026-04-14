import axios from "axios";

// Use environment variable or default to localhost:5001
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

export const predictData = async (data) => {
  return await axios.post(`${API_URL}/predict`, data);
};

export const getHistory = async () => {
  return await axios.get(`${API_URL}/history`);
};

export const getStats = async () => {
  return await axios.get(`${API_URL}/stats`);
};
