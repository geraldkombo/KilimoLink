import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class AiService {
  private client: OpenAI | null = null;

  constructor() {
    if (process.env.DEEPSEEK_API_KEY) {
      this.client = new OpenAI({
        apiKey: process.env.DEEPSEEK_API_KEY,
        baseURL: 'https://api.deepseek.com/v1',
      });
    }
  }

  async suggestPrice(productName: string, category: string, recentPrices: number[]) {
    const avg = recentPrices.length > 0 ? recentPrices.reduce((a, b) => a + b, 0) / recentPrices.length : 100;

    if (!this.client) {
      return {
        min: Math.round(avg * 0.8),
        max: Math.round(avg * 1.2),
        recommended: Math.round(avg),
      };
    }

    try {
      const response = await this.client.chat.completions.create({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'user',
            content: `Suggest a fair price range (min, max, recommended) for ${productName} in the ${category} category. Recent market prices: ${recentPrices.join(', ')}. Return only JSON.`,
          },
        ],
        response_format: { type: 'json_object' },
      });

      const content = response.choices[0].message.content;
      return content ? JSON.parse(content) : { min: avg * 0.8, max: avg * 1.2, recommended: avg };
    } catch (e) {
      console.error('DeepSeek AI failed:', e);
      return {
        min: Math.round(avg * 0.8),
        max: Math.round(avg * 1.2),
        recommended: Math.round(avg),
      };
    }
  }
}
