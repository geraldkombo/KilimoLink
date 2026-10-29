import { Injectable } from '@nestjs/common';

@Injectable()
export class OracleService {
  // Category averages in KES/kg, calibrated Oct 2026 against:
  // - KNBS 2026 Economic Survey (beef with bones retail Sh689.62/kg)
  // - Verified Nanyuki/Nairobi supplier price lists (goat KSh 940/kg,
  //   matumbo KSh 360-400/kg, raw honey retail KSh 1,500/kg)
  private readonly categoryAverages: Record<string, number> = {
    grains: 190,
    vegetables: 72,
    dairy: 42,
    fruits: 95,
    meat: 690,
    honey: 1500,
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
      effectiveMonth: '2026-10',
      source: 'KilimoLink simulated oracle (calibrated to KNBS 2026 Economic Survey + AFA bulletins)',
      updatedAt: new Date().toISOString(),
    };
  }
}
