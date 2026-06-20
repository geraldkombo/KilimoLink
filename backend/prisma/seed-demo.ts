const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding KilimoLink marketplace...');

  // Create or find demo farmer
  const farmer = await prisma.user.upsert({
    where: { email: 'demo@kilimolink.com' },
    update: {},
    create: {
      email: 'demo@kilimolink.com',
      name: 'Mama Njeri',
      phone: '0712345678',
      role: 'FARMER',
    },
  });
  console.log(`Farmer: ${farmer.name} (${farmer.id})`);

  const products = [
    {
      title: 'Sukuma Wiki (Kale)',
      description: 'Freshly harvested sukuma wiki from our farm in Kiambu. Picked this morning, no chemicals, delivered straight to your neighborhood.',
      price: 45,
      quantity: 200,
      category: 'Vegetables',
      imageUrl: 'https://images.unsplash.com/photo-1524179091875-bf99a9a6af97?auto=format&fit=crop&w=800&q=80',
      location: { lat: -1.171, lng: 36.835, address: 'Kiambu Road' },
    },
    {
      title: 'Tomatoes',
      description: 'Ripe, juicy tomatoes grown in Kangemi. Perfect for your Sunday stew. We grow them with care so you get the best flavor.',
      price: 120,
      quantity: 80,
      category: 'Vegetables',
      imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80',
      location: { lat: -1.275, lng: 36.745, address: 'Kangemi' },
    },
    {
      title: 'Maize (White)',
      description: 'High-quality white maize from our recent harvest. Cleaned, dried, and ready for your kitchen. Great for ugali and githeri.',
      price: 185,
      quantity: 500,
      category: 'Grains',
      imageUrl: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=80',
      location: { lat: -1.149, lng: 36.959, address: 'Ruiru' },
    },
    {
      title: 'Spinach',
      description: 'Fresh green spinach from our garden. We don\'t use harsh chemicals and we deliver fast to keep it crisp and nutritious.',
      price: 50,
      quantity: 100,
      category: 'Vegetables',
      imageUrl: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=800&q=80',
      location: { lat: -1.302, lng: 36.731, address: 'Dagoretti' },
    },
    {
      title: 'Cabbage',
      description: 'Large, fresh cabbages from our farm. Grown using traditional methods for that authentic taste. Perfect for salads and stews.',
      price: 80,
      quantity: 60,
      category: 'Vegetables',
      imageUrl: 'https://images.unsplash.com/photo-1551884170-09fb70a3a2ed?auto=format&fit=crop&w=800&q=80',
      location: { lat: -1.293, lng: 36.730, address: 'Kawangware' },
    },
    {
      title: 'Grade A Milk (Raw)',
      description: 'Pure, fresh milk from healthy local cows. Clean, safe, and delivered cold to your neighborhood. Tested and quality assured.',
      price: 65,
      quantity: 100,
      category: 'Dairy',
      imageUrl: 'https://images.unsplash.com/photo-1550583724-1255818c0533?auto=format&fit=crop&w=800&q=80',
      location: { lat: -1.233, lng: 36.910, address: 'Githurai' },
    },
    {
      title: 'Avocados',
      description: 'Large, creamy avocados from our family farm. Ripe and ready to eat. Perfect for your morning toast or evening salad.',
      price: 150,
      quantity: 40,
      category: 'Fruits',
      imageUrl: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=800&q=80',
      location: { lat: -1.171, lng: 36.835, address: 'Kiambu' },
    },
    {
      title: 'Bananas (Sweet)',
      description: 'Sweet, ripe bananas straight from the farm. Naturally grown, no chemicals. Great for snacking or your morning porridge.',
      price: 100,
      quantity: 200,
      category: 'Fruits',
      imageUrl: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=800&q=80',
      location: { lat: -1.315, lng: 36.785, address: 'Kibera' },
    },
    {
      title: 'Onions (Red)',
      description: 'Red onions fresh from our farm. Strong flavor, long shelf life. A staple for every Kenyan kitchen.',
      price: 130,
      quantity: 150,
      category: 'Vegetables',
      imageUrl: 'https://images.unsplash.com/photo-1508747703722-5c8e6c2b4c19?auto=format&fit=crop&w=800&q=80',
      location: { lat: -1.258, lng: 36.858, address: 'Mathare' },
    },
    {
      title: 'Irish Potatoes',
      description: 'Quality Irish potatoes from the slopes of Kiambu. Perfect for chips, stew, or mashed. Clean and graded.',
      price: 140,
      quantity: 300,
      category: 'Tubers',
      imageUrl: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80',
      location: { lat: -1.149, lng: 36.959, address: 'Ruiru' },
    },
    {
      title: 'Mangoes',
      description: 'Sun-ripened mangoes at their peak. Sweet, juicy, and full of flavor. Picked at the right time from our orchard.',
      price: 200,
      quantity: 50,
      category: 'Fruits',
      imageUrl: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=800&q=80',
      location: { lat: -1.302, lng: 36.731, address: 'Dagoretti' },
    },
    {
      title: 'Pure Honey',
      description: 'Pure, raw honey from our local hives. Natural, unprocessed, and full of health benefits. Perfect for tea or as a spread.',
      price: 850,
      quantity: 10,
      category: 'Honey',
      imageUrl: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80',
      location: { lat: -1.275, lng: 36.745, address: 'Kangemi' },
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: {
        id: product.title.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      },
      create: {
        id: product.title.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        ...product,
        farmerId: farmer.id,
      },
      update: {
        ...product,
        farmerId: farmer.id,
      },
    });
    console.log(`  ✓ ${product.title} — KES ${product.price}`);
  }

  // Also create a demo buyer user so login works smoothly
  await prisma.user.upsert({
    where: { email: 'buyer@kilimolink.com' },
    update: {},
    create: {
      email: 'buyer@kilimolink.com',
      name: 'Wanjiku',
      phone: '0712345679',
      role: 'BUYER',
    },
  });
  console.log('Buyer: Wanjiku (buyer@kilimolink.com)');

  console.log('\n✅ Seeding complete!');
  console.log(`   ${products.length} products created`);
  console.log('   Demo login: demo@kilimolink.com (OTP)');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
