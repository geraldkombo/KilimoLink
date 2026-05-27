import { Injectable } from '@nestjs/common';

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
