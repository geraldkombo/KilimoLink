import axios from 'axios';

export const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

export const api = axios.create({
  baseURL: apiBaseUrl,
  timeout: 30000
});

export function setAuthToken(token: string | null) {
  if (token) {
    api.defaults.headers.common.authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.authorization;
  }
}

