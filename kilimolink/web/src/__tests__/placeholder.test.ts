import { describe, it, expect } from 'vitest';

describe('KilimoLink Web', () => {
  it('sanity check - test framework works', () => {
    expect(true).toBe(true);
  });

  it('math works', () => {
    expect(1 + 1).toBe(2);
  });

  it('environment is configured', () => {
    expect(import.meta.env).toBeDefined();
  });
});
