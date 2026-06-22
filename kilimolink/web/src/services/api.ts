import axios from 'axios';

export const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

export const api = axios.create({
  baseURL: apiBaseUrl,
  timeout: 45000
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      error.userMessage = 'The KilimoLink Direct server is waking up. Please retry in a few seconds.';
    } else if (!error.response) {
      error.userMessage = 'Network connection unavailable. Check internet or use the backup demo.';
    } else if (error.response.status >= 500) {
      error.userMessage = 'The server is temporarily unavailable. Please retry or switch to the preloaded demo.';
    }
    return Promise.reject(error);
  }
);

export function setAuthToken(token: string | null) {
  if (token) {
    api.defaults.headers.common.authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.authorization;
  }
}
