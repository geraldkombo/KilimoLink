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

  /**
   * Two price points per crop: a published government reference and a typical
   * field/buyer quote. The spread between them is a market fact to display —
   * it is NOT an accusation that any particular buyer is defrauding the farmer.
   * Each row states its provenance; the tool's job is to make the spread
   * visible, not to deliver a moral verdict.
   */
  private readonly PRICE_TRUTH: Record<string, { reference: number; source: string; asOf: string; typicalFieldQuote: number; note: string }> = {
    'sukuma-wiki-kale': { reference: 45, source: 'KNBS Food Price Bulletin', asOf: '2026-05', typicalFieldQuote: 28, note: 'Government reference vs. a typical field quote. A single representative rate cannot capture what every buyer actually pays.' },
    'tomatoes': { reference: 120, source: 'AFA Horticulture', asOf: '2026-05', typicalFieldQuote: 80, note: 'Government reference vs. a typical field quote. A single representative rate cannot capture what every buyer actually pays.' },
    'onions-red': { reference: 130, source: 'AFA Horticulture', asOf: '2026-05', typicalFieldQuote: 85, note: 'Government reference vs. a typical field quote. A single representative rate cannot capture what every buyer actually pays.' },
    'grade-a-milk-raw': { reference: 65, source: 'AFA Dairy Directorate', asOf: '2026-05', typicalFieldQuote: 42, note: 'Government reference vs. a typical field quote. A single representative rate cannot capture what every buyer actually pays.' },
    'spinach': { reference: 50, source: 'KNBS Food Price Bulletin', asOf: '2026-05', typicalFieldQuote: 32, note: 'Government reference vs. a typical field quote. A single representative rate cannot capture what every buyer actually pays.' },
    'maize-white': { reference: 185, source: 'KNBS / AFA', asOf: '2026-05', typicalFieldQuote: 130, note: 'Government reference vs. a typical field quote. A single representative rate cannot capture what every buyer actually pays.' },
    'cabbage': { reference: 80, source: 'KNBS Food Price Bulletin', asOf: '2026-05', typicalFieldQuote: 55, note: 'Government reference vs. a typical field quote. A single representative rate cannot capture what every buyer actually pays.' },
    'pure-honey': { reference: 850, source: 'AFA Honey Directorate', asOf: '2026-05', typicalFieldQuote: 600, note: 'Government reference vs. a typical field quote. A single representative rate cannot capture what every buyer actually pays.' },
    'irish-potatoes': { reference: 140, source: 'KNBS Food Price Bulletin', asOf: '2026-05', typicalFieldQuote: 95, note: 'Government reference vs. a typical field quote. A single representative rate cannot capture what every buyer actually pays.' },
    'bananas-sweet': { reference: 100, source: 'AFA Horticulture', asOf: '2026-05', typicalFieldQuote: 65, note: 'Government reference vs. a typical field quote. A single representative rate cannot capture what every buyer actually pays.' },
    'avocados': { reference: 80, source: 'AFA Horticulture', asOf: '2026-05', typicalFieldQuote: 50, note: 'Government reference vs. a typical field quote. A single representative rate cannot capture what every buyer actually pays.' },
    'macadamia-nuts-in-shell': { reference: 100, source: 'Ministry of Agriculture farmgate minimum (Apr 2026)', asOf: '2026-10', typicalFieldQuote: 30, note: 'Government minimum price announced Apr 2026; MACNUT warns brokers pay as low as KSh 30/kg. Retail kernel ~KSh 1,456/kg. Farmgate, wholesale and retail are different markets — compare like with like.' },
    'goat-meat-mbuzi': { reference: 940, source: 'Verified Nairobi retail benchmark (KMP, Oct 2026)', asOf: '2026-10', typicalFieldQuote: 600, note: 'Retail benchmark for all cuts. Farmgate sellers should compare against the farmgate market, not a retail figure — the two are not the same market.' },
    'beef-with-bones': { reference: 690, source: 'KNBS 2026 Economic Survey (Sh689.62/kg avg retail)', asOf: '2026-10', typicalFieldQuote: 450, note: 'Official national average retail price, up 8.6% from Sh635.08/kg in 2024. Retail average, not a farmgate quote.' },
  };

  getPriceTruth(slug: string) {
    const row = this.PRICE_TRUTH[slug];
    if (!row) return null;
    const spread = row.reference - row.typicalFieldQuote;
    const spreadPct = Math.round((spread / row.reference) * 100);
    return {
      slug,
      referencePrice: row.reference,
      middlemanPrice: row.typicalFieldQuote,
      spreadKes: spread,
      spreadPercent: spreadPct,
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
