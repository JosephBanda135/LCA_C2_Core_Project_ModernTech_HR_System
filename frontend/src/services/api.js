import axios from "axios";

// One axios instance, reused everywhere, so the base URL only lives in one place.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// This runs before every single request made with `api`.
// It automatically attaches the JWT token  as an
// Authorization header, so we never have to remember to do it manually
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
