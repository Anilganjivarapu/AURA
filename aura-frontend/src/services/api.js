import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("aura_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem("aura_token");
      window.dispatchEvent(new Event("aura:session-expired"));
    }

    return Promise.reject(error);
  }
);

export const extractError = (error) => {
  const message = error?.response?.data?.message || error?.message || "Something went wrong";

  if (["Invalid or expired token", "Authorization token missing", "User not found"].includes(message)) {
    return "Your session expired. Please sign in again.";
  }

  return message;
};

export default api;
