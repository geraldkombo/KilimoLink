import { setAuthToken } from './api';

export const adminTokenKey = 'kilimolink_admin_token';
export const userTokenKey = 'kilimolink_user_token';

export function loadToken(kind: 'admin' | 'user') {
  const key = kind === 'admin' ? adminTokenKey : userTokenKey;
  return localStorage.getItem(key);
}

export function saveToken(kind: 'admin' | 'user', token: string | null) {
  const key = kind === 'admin' ? adminTokenKey : userTokenKey;
  if (!token) localStorage.removeItem(key);
  else localStorage.setItem(key, token);
}

export function applyToken(kind: 'admin' | 'user') {
  setAuthToken(loadToken(kind));
}

