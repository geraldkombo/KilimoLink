import { describe, it, expect } from 'vitest';

describe('API Service', () => {
  it('has correct base URL from environment', () => {
    const { apiBaseUrl } = require('../services/api');
    expect(apiBaseUrl).toBeDefined();
    expect(apiBaseUrl).toContain('kilimolink.onrender.com');
  });

  it('sets auth token on requests', () => {
    const { setAuthToken } = require('../services/api');
    expect(() => setAuthToken('test-token')).not.toThrow();
  });

  it('clears auth token', () => {
    const { setAuthToken } = require('../services/api');
    expect(() => setAuthToken(null)).not.toThrow();
  });
});
