import axios from "axios";

const defaultHost = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:8000`;
export const API_BASE_URL = defaultHost;

const api = axios.create({
  baseURL: `${API_BASE_URL}/api/`,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
