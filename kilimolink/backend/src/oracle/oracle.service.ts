import { Injectable } from '@nestjs/common';

@Injectable()
export class OracleService {
  private readonly categoryAverages: Record<string, number> = {
    grains: 190,
    vegetables: 72,
    dairy: 42,
    fruits: 95,
    meat: 640,
    honey: 850,
    tubers: 115,
    other: 150,
  };

  getPriceSnapshot(product?: string) {
    const key = (product || 'other').toLowerCase();
    const average = this.categoryAverages[key] ?? this.categoryAverages.other;

    return {
      product: product || 'other',
      average,
      currency: 'KES',
      effectiveMonth: '2026-05',
      source: 'KilimoLink simulated oracle',
      updatedAt: new Date().toISOString(),
    };
  }
}
