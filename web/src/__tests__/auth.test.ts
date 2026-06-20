import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('Auth Service', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('saves and loads a token', () => {
    const { saveToken, applyToken } = require('../services/auth');
    saveToken('test-jwt-token');
    const result = applyToken('token');
    expect(result).toBe('test-jwt-token');
  });

  it('returns null when no token exists', () => {
    const { applyToken } = require('../services/auth');
    const result = applyToken('token');
    expect(result).toBeNull();
  });

  it('saves and loads a role', () => {
    const { saveRole, loadRole } = require('../services/auth');
    saveRole('FARMER');
    expect(loadRole()).toBe('FARMER');
  });

  it('clears all auth data', () => {
    const { saveToken, saveRole, clearAllAuth, applyToken, loadRole } = require('../services/auth');
    saveToken('token123');
    saveRole('BUYER');
    clearAllAuth();
    expect(applyToken('token')).toBeNull();
    expect(loadRole()).toBeNull();
  });

  it('tracks onboarding state', () => {
    const { isOnboardingDone, setOnboardingDone } = require('../services/auth');
    expect(isOnboardingDone()).toBe(false);
    setOnboardingDone();
    expect(isOnboardingDone()).toBe(true);
  });
});
