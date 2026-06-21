import { setAuthToken } from './api';

export const adminTokenKey = 'kilimolink_admin_token';
export const userTokenKey = 'kilimolink_user_token';
export const userRoleKey = 'kilimolink_user_role';
export const onboardingDoneKey = 'kilimolink_onboarding_done';

export function loadToken(kind: 'admin' | 'user') {
  const key = kind === 'admin' ? adminTokenKey : userTokenKey;
  return localStorage.getItem(key);
}

export function saveToken(kind: 'admin' | 'user', token: string | null) {
  const key = kind === 'admin' ? adminTokenKey : userTokenKey;
  if (!token) localStorage.removeItem(key);
  else localStorage.setItem(key, token);
}

export function loadRole(): string | null {
  return localStorage.getItem(userRoleKey);
}

export function saveRole(role: string | null) {
  if (!role) localStorage.removeItem(userRoleKey);
  else localStorage.setItem(userRoleKey, role);
}

export function isOnboardingDone(): boolean {
  return localStorage.getItem(onboardingDoneKey) === 'true';
}

export function setOnboardingDone(done: boolean) {
  if (!done) localStorage.removeItem(onboardingDoneKey);
  else localStorage.setItem(onboardingDoneKey, 'true');
}

export function applyToken(kind: 'admin' | 'user'): string | null {
  const token = loadToken(kind);
  setAuthToken(token);
  return token;
}

export function clearAllAuth() {
  localStorage.removeItem(userTokenKey);
  localStorage.removeItem(userRoleKey);
  setAuthToken(null);
}

