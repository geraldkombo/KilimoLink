import { describe, it, expect, beforeEach } from 'vitest';
import { applyToken, loadRole, saveToken, saveRole, clearAllAuth, isOnboardingDone, setOnboardingDone } from '../services/auth';

describe('auth service', () => {
  beforeEach(() => localStorage.clear());

  it('applyToken stores the JWT', () => {
    saveToken('user', 'test.jwt.token');
    const result = applyToken('user');
    expect(result).toBe('test.jwt.token');
  });

  it('returns null when no token exists', () => {
    const result = applyToken('user');
    expect(result).toBeNull();
  });

  it('saves and loads a role', () => {
    saveRole('FARMER');
    expect(loadRole()).toBe('FARMER');
  });

  it('clears all auth data', () => {
    saveToken('user', 'token123');
    saveRole('BUYER');
    clearAllAuth();
    expect(applyToken('user')).toBeNull();
    expect(loadRole()).toBeNull();
  });

  it('tracks onboarding state', () => {
    expect(isOnboardingDone()).toBe(false);
    setOnboardingDone(true);
    expect(isOnboardingDone()).toBe(true);
  });
});
