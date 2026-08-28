import axios from "axios";

// One axios instance, reused everywhere, so the base URL only lives in one place.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// This runs before every single request made with `api`.
// It automatically attaches the JWT token as an
// Authorization header, so we never have to remember to do it manually
// in every component.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// This runs after every response comes back. If the token is expired or
// invalid , clear the stale session and send the user back to
// login instead of leaving them stuck looking at broken/empty pages, I was confused when it happened the first time.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const hadToken = localStorage.getItem("token");

    // Only treat this as "your session expired" if we actually had a
    // token to begin with
    // wrong email/password - that should show a normal error message,
    // not force a reload.
    if (
      hadToken &&
      (error.response?.status === 401 || error.response?.status === 403)
    ) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.reload();
    }
    return Promise.reject(error);
  },
);

export default api;
