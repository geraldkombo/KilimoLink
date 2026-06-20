const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding KilimoLink marketplace...');

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
  console.log('Farmer: ' + farmer.name + ' (' + farmer.id + ')');

  const products = [
    {
      title: 'Sukuma Wiki (Kale)',
      description: 'Freshly harvested sukuma wiki. Picked this morning, no chemicals.',
      price: 45,
      quantity: 200,
      category: 'Vegetables',
      imageUrl: 'https://images.unsplash.com/photo-1524179091875-bf99a9a6af97?auto=format&fit=crop&w=800&q=80',
      location: { lat: -1.171, lng: 36.835, address: 'Kiambu Road' },
    },
    {
      title: 'Tomatoes',
      description: 'Ripe, juicy tomatoes grown in Kangemi. Perfect for your Sunday stew.',
      price: 120,
      quantity: 80,
      category: 'Vegetables',
      imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80',
      location: { lat: -1.275, lng: 36.745, address: 'Kangemi' },
    },
    {
      title: 'Maize (White)',
      description: 'High-quality white maize. Cleaned, dried, ready for ugali and githeri.',
      price: 185,
      quantity: 500,
      category: 'Grains',
      imageUrl: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=80',
      location: { lat: -1.149, lng: 36.959, address: 'Ruiru' },
    },
    {
      title: 'Spinach',
      description: 'Fresh green spinach from our garden. No chemicals, delivered fast.',
      price: 50,
      quantity: 100,
      category: 'Vegetables',
      imageUrl: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=800&q=80',
      location: { lat: -1.302, lng: 36.731, address: 'Dagoretti' },
    },
    {
      title: 'Cabbage',
      description: 'Large fresh cabbages. Grown using traditional methods.',
      price: 80,
      quantity: 60,
      category: 'Vegetables',
      imageUrl: 'https://images.unsplash.com/photo-1551884170-09fb70a3a2ed?auto=format&fit=crop&w=800&q=80',
      location: { lat: -1.293, lng: 36.730, address: 'Kawangware' },
    },
    {
      title: 'Grade A Milk (Raw)',
      description: 'Pure fresh milk from healthy local cows. Clean and quality assured.',
      price: 65,
      quantity: 100,
      category: 'Dairy',
      imageUrl: 'https://images.unsplash.com/photo-1550583724-1255818c0533?auto=format&fit=crop&w=800&q=80',
      location: { lat: -1.233, lng: 36.910, address: 'Githurai' },
    },
    {
      title: 'Avocados',
      description: 'Large creamy avocados from our family farm. Ripe and ready.',
      price: 150,
      quantity: 40,
      category: 'Fruits',
      imageUrl: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=800&q=80',
      location: { lat: -1.171, lng: 36.835, address: 'Kiambu' },
    },
    {
      title: 'Bananas (Sweet)',
      description: 'Sweet ripe bananas. Naturally grown, no chemicals.',
      price: 100,
      quantity: 200,
      category: 'Fruits',
      imageUrl: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=800&q=80',
      location: { lat: -1.315, lng: 36.785, address: 'Kibera' },
    },
    {
      title: 'Onions (Red)',
      description: 'Red onions fresh from our farm. Strong flavor, long shelf life.',
      price: 130,
      quantity: 150,
      category: 'Vegetables',
      imageUrl: 'https://images.unsplash.com/photo-1508747703722-5c8e6c2b4c19?auto=format&fit=crop&w=800&q=80',
      location: { lat: -1.258, lng: 36.858, address: 'Mathare' },
    },
    {
      title: 'Irish Potatoes',
      description: 'Quality Irish potatoes from Kiambu. Perfect for chips or stew.',
      price: 140,
      quantity: 300,
      category: 'Tubers',
      imageUrl: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80',
      location: { lat: -1.149, lng: 36.959, address: 'Ruiru' },
    },
    {
      title: 'Mangoes',
      description: 'Sun-ripened mangoes at their peak. Sweet, juicy, full of flavor.',
      price: 200,
      quantity: 50,
      category: 'Fruits',
      imageUrl: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=800&q=80',
      location: { lat: -1.302, lng: 36.731, address: 'Dagoretti' },
    },
    {
      title: 'Pure Honey',
      description: 'Pure raw honey from local hives. Natural, unprocessed.',
      price: 850,
      quantity: 10,
      category: 'Honey',
      imageUrl: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80',
      location: { lat: -1.275, lng: 36.745, address: 'Kangemi' },
    },
  ];

  for (const product of products) {
    const slug = product.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    await prisma.product.upsert({
      where: { id: slug },
      create: { id: slug, ...product, farmerId: farmer.id },
      update: { ...product, farmerId: farmer.id },
    });
    console.log('  OK ' + product.title + ' - KES ' + product.price);
  }

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
  console.log('Buyer: buyer@kilimolink.com');

  console.log('\nDone. ' + products.length + ' products seeded.');
}

main()
  .catch(function(e) { console.error('FAILED:', e); process.exit(1); })
  .finally(function() { return prisma.$disconnect(); });
