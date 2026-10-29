// Static reference data ported from the NestJS backend (ai.service.ts, oracle.service.ts,
// seed.service.ts, prisma/seed_data/*.json).

export const PRICE_TRUTH = {
  'sukuma-wiki-kale': { reference: 45, source: 'KNBS Food Price Bulletin', asOf: '2026-05', typicalMiddleman: 28 },
  'tomatoes': { reference: 120, source: 'AFA Horticulture', asOf: '2026-05', typicalMiddleman: 80 },
  'onions-red': { reference: 130, source: 'AFA Horticulture', asOf: '2026-05', typicalMiddleman: 85 },
  'grade-a-milk-raw': { reference: 65, source: 'AFA Dairy Directorate', asOf: '2026-05', typicalMiddleman: 42 },
  'spinach': { reference: 50, source: 'KNBS Food Price Bulletin', asOf: '2026-05', typicalMiddleman: 32 },
  'maize-white': { reference: 185, source: 'KNBS / AFA', asOf: '2026-05', typicalMiddleman: 130 },
  'cabbage': { reference: 80, source: 'KNBS Food Price Bulletin', asOf: '2026-05', typicalMiddleman: 55 },
  'pure-honey': { reference: 850, source: 'AFA Honey Directorate', asOf: '2026-05', typicalMiddleman: 600 },
  'irish-potatoes': { reference: 140, source: 'KNBS Food Price Bulletin', asOf: '2026-05', typicalMiddleman: 95 },
  'bananas-sweet': { reference: 100, source: 'AFA Horticulture', asOf: '2026-05', typicalMiddleman: 65 },
  'avocados': { reference: 80, source: 'AFA Horticulture', asOf: '2026-05', typicalMiddleman: 50 },
  'macadamia-nuts-in-shell': { reference: 100, source: 'Ministry of Agriculture farmgate minimum (Apr 2026)', asOf: '2026-10', typicalMiddleman: 30, note: 'Government minimum price announced Apr 2026; MACNUT warns brokers pay as low as KSh 30/kg. Retail kernel ~KSh 1,456/kg.' },
  'goat-meat-mbuzi': { reference: 940, source: 'Verified Nairobi retail benchmark (KMP, Oct 2026)', asOf: '2026-10', typicalMiddleman: 600, note: 'Retail benchmark for all cuts; farmgate sellers should price against this, not broker offers.' },
  'beef-with-bones': { reference: 690, source: 'KNBS 2026 Economic Survey (Sh689.62/kg avg retail)', asOf: '2026-10', typicalMiddleman: 450, note: 'Official national average retail price, up 8.6% from Sh635.08/kg in 2024.' },
};
export const PRICE_TRUTH_DEFAULT_NOTE = 'Middleman figure is a typical quoted rate; reference is the published government price.';

export const ORACLE_AVERAGES = {
  grains: 190,
  vegetables: 72,
  dairy: 42,
  fruits: 95,
  meat: 690,
  honey: 1500,
  tubers: 115,
  other: 150,
};

export const AI_BASELINES = {
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

// Public demo seed (GET /seed?key=seedme-2024 in the Node backend; run automatically at
// D1 seed time here). Deterministic slug ids match PRICE_TRUTH slugs.
export const DEMO_FARMER = { id: 'demo-farmer', email: 'demo@kilimolink.com', name: 'Mama Njeri', phone: '0712345678', role: 'FARMER' };
export const DEMO_BUYER = { id: 'demo-buyer', email: 'buyer@kilimolink.com', name: 'Wanjiku', phone: '0712345679', role: 'BUYER' };

export const DEMO_PRODUCTS = [
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

export function slugify(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// Admin seed datasets (prisma/seed_data/*.json in the Node backend).
export const SEED_PRODUCTS = [
  { sellerPhone: '+254700000001', name: 'Sukuma Wiki (Nairobi Urban)', category: 'vegetables', priceKes: 30, quantity: 1000, description: 'Grown in Nairobi urban cooperatives using hydroponics. Low food miles.' },
  { sellerPhone: '+254700000001', name: 'Urban Spinach', category: 'vegetables', priceKes: 35, quantity: 800, description: 'Freshly harvested from Eastlands vertical farms.' },
  { sellerPhone: '+254700000002', name: 'Fresh Milk (Limuru Dairy)', category: 'dairy', priceKes: 65, quantity: 500, description: 'Sourced from the Nairobi peri-urban milk shed in Limuru.' },
  { sellerPhone: '+254700000003', name: 'Ground Maize Flour (2kg)', category: 'staples', priceKes: 210, quantity: 300, description: "Stone-ground maize from Nairobi's local millers." },
  { sellerPhone: '+254700000004', name: 'Grade 1 Eggs (Tray)', category: 'poultry', priceKes: 480, quantity: 200, description: 'Farm-fresh eggs from Kikuyu peri-urban poultry farms.' },
  { sellerPhone: '+254700000005', name: 'Managu (African Nightshade)', category: 'traditional', priceKes: 50, quantity: 600, description: 'Nutrient-rich traditional greens from urban gardens.' },
  { sellerPhone: '+254700000006', name: 'Nairobi Red Onions (Sack)', category: 'vegetables', priceKes: 3500, quantity: 50, description: "Cured onions sourced from Nairobi's local food hubs." },
];

export const SEED_BUSINESSES = [
  { phone: '+254700000001', sector: 'Horticulture', county: 'Nakuru' },
  { phone: '+254700000002', sector: 'Dairy', county: 'Kiambu' },
  { phone: '+254700000003', sector: 'Value Addition', county: 'Machakos' },
  { phone: '+254700000004', sector: 'Cereals', county: 'Uasin Gishu' },
  { phone: '+254700000005', sector: 'Poultry', county: 'Kisumu' },
  { phone: '+254700000006', sector: 'Legumes', county: 'Meru' },
  { phone: '+254700000007', sector: 'Processing', county: 'Nyeri' },
  { phone: '+254700000008', sector: 'Vegetables', county: 'Kakamega' },
  { phone: '+254700000009', sector: 'Goat Rearing', county: 'Kitui' },
  { phone: '+254700000010', sector: 'Fruits', county: 'Mombasa' },
];

export const SEED_LOCATIONS = {
  vegetables: { lat: -1.313, lng: 36.788, address: 'Kibera Urban Gardens' },
  dairy: { lat: -1.102, lng: 36.643, address: 'Limuru Peri-Urban' },
  staples: { lat: -1.286, lng: 36.817, address: 'Nairobi Central Millers' },
  poultry: { lat: -1.233, lng: 36.666, address: 'Kikuyu Poultry Hub' },
  traditional: { lat: -1.25, lng: 36.8, address: 'Westlands Community Garden' },
  fallback: { lat: -1.286389, lng: 36.817223, address: 'Nairobi Hub' },
};

export const SEED_IMAGE = 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80';

export const RESILIENCE_SEED = {
  type: 'REGULATORY',
  title: 'Nairobi Urban Farming Act',
  description: 'New policy supports rooftop gardens',
  impact: 'POSITIVE',
  status: 'MONITORED',
};
