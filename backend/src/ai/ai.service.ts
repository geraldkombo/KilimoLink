import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class AiService {
  private readonly categoryBaseline: Record<string, number> = {
    fruits: 120,
    vegetables: 90,
    grains: 80,
    cereals: 80,
    dairy: 180,
    poultry: 220,
    legumes: 100,
    spices: 250,
    seafood: 260,
    meat: 240,
    default: 120,
  };

  async suggestPrice(productName: string, category: string, recentPrices: number[]) {
    const categoryKey = category?.toLowerCase() || 'default';
    const baseline = this.categoryBaseline[categoryKey] ?? this.categoryBaseline.default;
    const averageRecent = recentPrices.length > 0
      ? recentPrices.reduce((sum, price) => sum + price, 0) / recentPrices.length
      : baseline;

    const adjusted = this.adjustForAttributes(productName, averageRecent);
    const recommended = Math.round(adjusted);
    const min = Math.round(Math.max(1, adjusted * 0.85));
    const max = Math.round(adjusted * 1.25);

    return {
      min,
      max,
      recommended,
    };
  }

  private readonly PRICE_TRUTH: Record<string, { reference: number; source: string; asOf: string; typicalMiddleman: number; note: string }> = {
    'sukuma-wiki-kale': { reference: 45, source: 'KNBS Food Price Bulletin', asOf: '2026-05', typicalMiddleman: 28, note: 'Middleman figure is a typical quoted rate; reference is the published government price.' },
    'tomatoes': { reference: 120, source: 'AFA Horticulture', asOf: '2026-05', typicalMiddleman: 80, note: 'Middleman figure is a typical quoted rate; reference is the published government price.' },
    'onions-red': { reference: 130, source: 'AFA Horticulture', asOf: '2026-05', typicalMiddleman: 85, note: 'Middleman figure is a typical quoted rate; reference is the published government price.' },
    'grade-a-milk-raw': { reference: 65, source: 'AFA Dairy Directorate', asOf: '2026-05', typicalMiddleman: 42, note: 'Middleman figure is a typical quoted rate; reference is the published government price.' },
    'spinach': { reference: 50, source: 'KNBS Food Price Bulletin', asOf: '2026-05', typicalMiddleman: 32, note: 'Middleman figure is a typical quoted rate; reference is the published government price.' },
    'maize-white': { reference: 185, source: 'KNBS / AFA', asOf: '2026-05', typicalMiddleman: 130, note: 'Middleman figure is a typical quoted rate; reference is the published government price.' },
    'cabbage': { reference: 80, source: 'KNBS Food Price Bulletin', asOf: '2026-05', typicalMiddleman: 55, note: 'Middleman figure is a typical quoted rate; reference is the published government price.' },
    'pure-honey': { reference: 850, source: 'AFA Honey Directorate', asOf: '2026-05', typicalMiddleman: 600, note: 'Middleman figure is a typical quoted rate; reference is the published government price.' },
    'irish-potatoes': { reference: 140, source: 'KNBS Food Price Bulletin', asOf: '2026-05', typicalMiddleman: 95, note: 'Middleman figure is a typical quoted rate; reference is the published government price.' },
    'bananas-sweet': { reference: 100, source: 'AFA Horticulture', asOf: '2026-05', typicalMiddleman: 65, note: 'Middleman figure is a typical quoted rate; reference is the published government price.' },
    'avocados': { reference: 80, source: 'AFA Horticulture', asOf: '2026-05', typicalMiddleman: 50, note: 'Middleman figure is a typical quoted rate; reference is the published government price.' },
  };

  getPriceTruth(slug: string) {
    const row = this.PRICE_TRUTH[slug];
    if (!row) return null;
    const gap = row.reference - row.typicalMiddleman;
    const lossPct = Math.round((gap / row.reference) * 100);
    return {
      slug,
      referencePrice: row.reference,
      middlemanPrice: row.typicalMiddleman,
      gapKes: gap,
      farmerLossPercent: lossPct,
      source: row.source,
      asOf: row.asOf,
      note: row.note,
    };
  }

  private adjustForAttributes(productName: string, basePrice: number) {
    const name = productName?.toLowerCase() || '';
    let multiplier = 1;

    if (name.includes('organic') || name.includes('premium') || name.includes('fresh')) {
      multiplier += 0.15;
    }
    if (name.includes('bulk') || name.includes('wholesale')) {
      multiplier -= 0.1;
    }
    if (name.includes('small') || name.includes('baby') || name.includes('micro')) {
      multiplier += 0.05;
    }

    return basePrice * multiplier;
  }
}
