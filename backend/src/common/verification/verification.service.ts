import { Injectable, OnModuleInit } from '@nestjs/common';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

interface KnbsData {
  county: string;
  crop: string;
  avgPriceKes: number;
  yieldPerAcre: number | null;
  year: number;
}

@Injectable()
export class VerificationService implements OnModuleInit {
  private knbsData: KnbsData[] = [];

  async onModuleInit() {
    try {
      const path = join(process.cwd(), 'prisma', 'seed_data', 'knbs_agri.sample.json');
      const raw = await readFile(path, 'utf-8');
      this.knbsData = JSON.parse(raw);
    } catch (e) {
      console.error('Failed to load KNBS data', e);
    }
  }

  validatePrice(county: string, category: string, price: number) {
    const baseline = this.knbsData.find(
      (d) => d.county.toLowerCase() === county.toLowerCase() && d.crop.toLowerCase() === category.toLowerCase()
    );

    if (!baseline) return { verified: false, reason: 'No baseline data for this region/category' };

    const deviation = Math.abs(price - baseline.avgPriceKes) / baseline.avgPriceKes;
    const isFair = deviation <= 0.25; // Within 25% of KNBS average

    return {
      verified: isFair,
      baselinePrice: baseline.avgPriceKes,
      deviation: Math.round(deviation * 100),
      reason: isFair ? 'Price aligns with KNBS regional averages' : 'Price deviates significantly from regional averages'
    };
  }
}
