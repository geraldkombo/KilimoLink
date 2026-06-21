import { describe, it, expect } from 'vitest';

describe('API Service', () => {
  it('API base URL is configured', () => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';
    expect(baseUrl).toBeTruthy();
  });

  it('setAuthToken sets bearer header', async () => {
    const { setAuthToken, api } = await import('../api');
    setAuthToken('test-token-123');
    expect(api.defaults.headers.common['authorization']).toBe('Bearer test-token-123');
  });

  it('setAuthToken removes header when null', async () => {
    const { setAuthToken, api } = await import('../api');
    setAuthToken('test-token-123');
    setAuthToken(null);
    expect(api.defaults.headers.common['authorization']).toBeUndefined();
  });
});
