import { PrismaClient, Role, OrderStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding KilimoLink database...');

  const admin = await prisma.user.upsert({
    where: { email: 'admin@kilimolink.demo' },
    update: {},
    create: {
      email: 'admin@kilimolink.demo',
      name: 'KilimoLink Admin',
      role: Role.ADMIN,
      phone: '+254700000000',
    },
  });
  console.log(`Admin user: ${admin.id}`);

  const farmer1 = await prisma.user.upsert({
    where: { email: 'farmer1@kilimolink.demo' },
    update: {},
    create: {
      email: 'farmer1@kilimolink.demo',
      name: 'Mama Mboga - Kibera',
      role: Role.FARMER,
      phone: '+254711111111',
    },
  });

  const farmer2 = await prisma.user.upsert({
    where: { email: 'farmer2@kilimolink.demo' },
    update: {},
    create: {
      email: 'farmer2@kilimolink.demo',
      name: 'Limuru Dairy Coop',
      role: Role.FARMER,
      phone: '+254722222222',
    },
  });

  const farmer3 = await prisma.user.upsert({
    where: { email: 'farmer3@kilimolink.demo' },
    update: {},
    create: {
      email: 'farmer3@kilimolink.demo',
      name: 'Kikuyu Poultry Hub',
      role: Role.FARMER,
      phone: '+254733333333',
    },
  });

  const buyer = await prisma.user.upsert({
    where: { email: 'buyer@kilimolink.demo' },
    update: {},
    create: {
      email: 'buyer@kilimolink.demo',
      name: 'Nairobi Consumer',
      role: Role.BUYER,
      phone: '+254744444444',
    },
  });
  console.log(`Created ${3} farmers, 1 buyer`);

  const products = [
    { title: 'Sukuma Wiki (Kale)', category: 'Vegetables', price: 50, quantity: 200, farmerId: farmer1.id, lat: -1.313, lng: 36.788, address: 'Kibera Urban Gardens' },
    { title: 'Fresh Milk (1L)', category: 'Dairy', price: 65, quantity: 100, farmerId: farmer2.id, lat: -1.102, lng: 36.643, address: 'Limuru Dairy Farm' },
    { title: 'Free-Range Eggs (tray)', category: 'Poultry', price: 420, quantity: 50, farmerId: farmer3.id, lat: -1.233, lng: 36.666, address: 'Kikuyu Poultry Hub' },
    { title: 'Organic Tomatoes (kg)', category: 'Vegetables', price: 120, quantity: 80, farmerId: farmer1.id, lat: -1.286, lng: 36.817, address: 'Nairobi City Farm' },
    { title: 'Maize Flour (2kg)', category: 'Grains', price: 180, quantity: 150, farmerId: farmer2.id, lat: -1.250, lng: 36.800, address: 'Westlands Millers' },
    { title: 'Avocados (each)', category: 'Fruits', price: 30, quantity: 300, farmerId: farmer1.id, lat: -1.310, lng: 36.790, address: 'Kibera Green Grocers' },
    { title: 'Mangoes (kg)', category: 'Fruits', price: 80, quantity: 120, farmerId: farmer3.id, lat: -1.270, lng: 36.810, address: 'Eastlands Market' },
  ];

  for (const p of products) {
    await prisma.product.create({
      data: {
        ...p,
        location: { lat: p.lat, lng: p.lng, address: p.address },
        imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
      },
    });
  }
  console.log(`Created ${products.length} products`);

  await prisma.impactMetric.create({
    data: { ordersCompleted: 42, co2SavedKg: 158.5, wasteDivertedKg: 89.2, greenSpaceM2: 1200 },
  });

  await prisma.resilienceLog.create({
    data: { type: 'REGULATORY', title: 'Nairobi Urban Farming Act', description: 'New policy supports rooftop gardens', impact: 'POSITIVE', status: 'MONITORED' },
  });

  await prisma.impactMetric.create({
    data: { date: new Date(Date.now() - 86400000), ordersCompleted: 38, co2SavedKg: 142.0, wasteDivertedKg: 76.5, greenSpaceM2: 1100 },
  });

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
