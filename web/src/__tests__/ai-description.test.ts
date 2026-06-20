import { describe, it, expect } from 'vitest';

describe('AI description fallback', () => {
  // Tests the pure function that would back up the AI call
  const fallbackDescriptions: Record<string, string> = {
    'Sukuma Wiki (Kale)': 'Fresh farm Sukuma Wiki, picked today, grown near Nairobi.',
    'Tomatoes': 'Ripe local tomatoes from a Nairobi-area farmer.',
  };

  function describeProduct(category: string) {
    return fallbackDescriptions[category] ?? `Fresh ${category} from a local Nairobi farmer.`;
  }

  const categories = ['Sukuma Wiki (Kale)', 'Tomatoes', 'Unknown Crop'];

  it('returns a non-empty string per category', () => {
    categories.forEach((c) => {
      const out = describeProduct(c);
      expect(typeof out).toBe('string');
      expect(out.length).toBeGreaterThan(0);
    });
  });

  it('returns a fallback for unknown categories', () => {
    const out = describeProduct('Mangoes');
    expect(out).toContain('Mangoes');
  });
});
