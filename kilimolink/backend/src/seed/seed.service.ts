import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class SeedService {
  constructor(private readonly prisma: PrismaService) {}

  async run(): Promise<number> {
    const farmer = await this.prisma.user.upsert({
      where: { email: 'demo@kilimolink.com' },
      update: {},
      create: {
        email: 'demo@kilimolink.com',
        name: 'Mama Njeri',
        phone: '0712345678',
        role: 'FARMER',
      },
    });

    await this.prisma.user.upsert({
      where: { email: 'buyer@kilimolink.com' },
      update: {},
      create: {
        email: 'buyer@kilimolink.com',
        name: 'Wanjiku',
        phone: '0712345679',
        role: 'BUYER',
      },
    });

    const products = [
      { title: 'Sukuma Wiki (Kale)', price: 45, quantity: 200, category: 'Vegetables', description: 'Freshly harvested sukuma wiki. Picked this morning, no chemicals.', imageUrl: 'https://images.unsplash.com/photo-1777353245982-c34b21fc5175?auto=format&fit=crop&w=800&q=80', location: { lat: -1.171, lng: 36.835, address: 'Kiambu Road' } },
      { title: 'Tomatoes', price: 120, quantity: 80, category: 'Vegetables', description: 'Ripe, juicy tomatoes grown in Kangemi. Perfect for your Sunday stew.', imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80', location: { lat: -1.275, lng: 36.745, address: 'Kangemi' } },
      { title: 'Maize (White)', price: 185, quantity: 500, category: 'Grains', description: 'High-quality white maize. Cleaned, dried, ready for ugali and githeri.', imageUrl: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=80', location: { lat: -1.149, lng: 36.959, address: 'Ruiru' } },
      { title: 'Spinach', price: 50, quantity: 100, category: 'Vegetables', description: 'Fresh green spinach from our garden. No chemicals, delivered fast.', imageUrl: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=800&q=80', location: { lat: -1.302, lng: 36.731, address: 'Dagoretti' } },
      { title: 'Cabbage', price: 80, quantity: 60, category: 'Vegetables', description: 'Large fresh cabbages. Grown using traditional methods.', imageUrl: 'https://images.unsplash.com/photo-1551884170-09fb70a3a2ed?auto=format&fit=crop&w=800&q=80', location: { lat: -1.293, lng: 36.730, address: 'Kawangware' } },
      { title: 'Grade A Milk (Raw)', price: 65, quantity: 100, category: 'Dairy', description: 'Pure fresh milk from healthy local cows. Clean and quality assured.', imageUrl: 'https://images.unsplash.com/photo-1601436423474-51738541c1b1?auto=format&fit=crop&w=800&q=80', location: { lat: -1.233, lng: 36.910, address: 'Githurai' } },
      { title: 'Avocados', price: 150, quantity: 40, category: 'Fruits', description: 'Large creamy avocados from our family farm. Ripe and ready.', imageUrl: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=800&q=80', location: { lat: -1.171, lng: 36.835, address: 'Kiambu' } },
      { title: 'Bananas (Sweet)', price: 100, quantity: 200, category: 'Fruits', description: 'Sweet ripe bananas. Naturally grown, no chemicals.', imageUrl: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=800&q=80', location: { lat: -1.315, lng: 36.785, address: 'Kibera' } },
      { title: 'Onions (Red)', price: 130, quantity: 150, category: 'Vegetables', description: 'Red onions fresh from our farm. Strong flavor, long shelf life.', imageUrl: 'https://images.unsplash.com/photo-1605197378298-02bf0af1c896?auto=format&fit=crop&w=800&q=80', location: { lat: -1.258, lng: 36.858, address: 'Mathare' } },
      { title: 'Irish Potatoes', price: 140, quantity: 300, category: 'Tubers', description: 'Quality Irish potatoes from Kiambu. Perfect for chips or stew.', imageUrl: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80', location: { lat: -1.149, lng: 36.959, address: 'Ruiru' } },
      { title: 'Mangoes', price: 200, quantity: 50, category: 'Fruits', description: 'Sun-ripened mangoes at their peak. Sweet, juicy, full of flavor.', imageUrl: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=800&q=80', location: { lat: -1.302, lng: 36.731, address: 'Dagoretti' } },
      { title: 'Pure Honey', price: 850, quantity: 10, category: 'Honey', description: 'Pure raw honey from local hives. Natural, unprocessed.', imageUrl: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80', location: { lat: -1.275, lng: 36.745, address: 'Kangemi' } },
    ];

    let count = 0;
    for (const p of products) {
      const slug = p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      await this.prisma.product.upsert({
        where: { id: slug },
        create: { id: slug, ...p, farmerId: farmer.id },
        update: { ...p, farmerId: farmer.id },
      });
      count++;
    }

    return count;
  }
}
