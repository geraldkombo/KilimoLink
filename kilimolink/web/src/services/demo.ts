export const DEMO_TOKEN = 'demo-token-123';
export const DEMO_EMAIL = 'demo@farmers.co.ke';
export const DEMO_USER_ID = 'demo-user-123';
export const DEMO_USER_NAME = 'Demo Farmer';
export const DEMO_ROLE = 'FARMER';

const DEMO_SESSION_KEY = 'kilimolink_demo_session';
const DEMO_ORDERS_KEY = 'kilimolink_demo_orders';
const DEMO_MESSAGES_KEY = 'kilimolink_demo_messages';

export type DemoRole = 'FARMER' | 'BUYER';

export type DemoProfile = {
  id: string;
  email: string;
  name: string;
  role: DemoRole;
};

export type DemoProduct = {
  id: string;
  title: string;
  price: number;
  quantity: number;
  category: string;
  description: string;
  farmer: { id: string; name: string; phone: string };
  location: { address: string; lat: number; lng: number };
  imageUrl?: string;
};

type DemoOrder = {
  id: string;
  status: 'PENDING' | 'DELIVERED';
  totalAmount: number;
  createdAt: string;
  items: Array<{
    productId: string;
    product: {
      id: string;
      title: string;
      farmer: { id: string; name: string; phone: string };
    };
  }>;
};

export type DemoMessage = {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  createdAt: string;
  readAt?: string;
};

export const DEMO_PRODUCTS: DemoProduct[] = [
  {
    id: 'demo-1',
    title: 'Sukuma Wiki (Kale)',
    price: 45,
    quantity: 100,
    category: 'Vegetables',
    description: 'Freshly harvested sukuma wiki from the Kiambu corridor, packed for same-day Nairobi delivery.',
    farmer: { id: 'demo-farmer-1', name: 'Jane Wanjiku', phone: '0712345678' },
    location: { address: 'Kiambu corridor', lat: -1.1714, lng: 36.8356 },
  },
  {
    id: 'demo-2',
    title: 'Fresh Tomatoes',
    price: 120,
    quantity: 50,
    category: 'Vegetables',
    description: 'Quality tomatoes from Machakos farms, sorted for urban retail and household supply.',
    farmer: { id: 'demo-farmer-2', name: 'Peter Kamau', phone: '0723456789' },
    location: { address: 'Machakos corridor', lat: -1.5177, lng: 37.2634 },
  },
  {
    id: 'demo-3',
    title: 'Free-Range Eggs',
    price: 60,
    quantity: 200,
    category: 'Dairy',
    description: 'Farm-fresh eggs from a trusted peri-urban producer with steady weekly supply.',
    farmer: { id: 'demo-farmer-3', name: 'Grace Akinyi', phone: '0734567890' },
    location: { address: 'Kajiado corridor', lat: -1.8521, lng: 36.7768 },
  },
  {
    id: 'demo-4',
    title: 'Sweet Potatoes',
    price: 80,
    quantity: 75,
    category: 'Grains',
    description: 'Reliable bulk sweet potatoes for schools, kiosks, and neighborhood retailers.',
    farmer: { id: 'demo-farmer-4', name: 'David Mwangi', phone: '0745678901' },
    location: { address: 'Murang\'a', lat: -0.7213, lng: 37.1526 },
  },
  {
    id: 'demo-5',
    title: 'Fresh Mangoes',
    price: 150,
    quantity: 30,
    category: 'Fruits',
    description: 'Ripe Makueni mangoes with strong buyer demand and clean transport handling.',
    farmer: { id: 'demo-farmer-5', name: 'Susan Wanjiku', phone: '0756789012' },
    location: { address: 'Makueni', lat: -2.2827, lng: 37.8239 },
  },
  {
    id: 'demo-6',
    title: 'Dairy Milk (1L)',
    price: 70,
    quantity: 40,
    category: 'Dairy',
    description: 'Fresh pasteurized milk for Nairobi households, shops, and food service buyers.',
    farmer: { id: 'demo-farmer-6', name: 'Joseph Njoroge', phone: '0767890123' },
    location: { address: 'Nakuru', lat: -0.3031, lng: 36.08 },
  },
];

const DEFAULT_DEMO_ORDERS: DemoOrder[] = [
  {
    id: 'demo-001',
    status: 'DELIVERED',
    totalAmount: 450,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    items: [
      {
        productId: 'demo-1',
        product: {
          id: 'demo-1',
          title: 'Sukuma Wiki (Kale)',
          farmer: { id: 'demo-farmer-1', name: 'Jane Wanjiku', phone: '0712345678' },
        },
      },
    ],
  },
  {
    id: 'demo-002',
    status: 'PENDING',
    totalAmount: 960,
    createdAt: new Date().toISOString(),
    items: [
      {
        productId: 'demo-2',
        product: {
          id: 'demo-2',
          title: 'Fresh Tomatoes',
          farmer: { id: 'demo-farmer-2', name: 'Peter Kamau', phone: '0723456789' },
        },
      },
    ],
  },
];

const DEFAULT_DEMO_MESSAGES: DemoMessage[] = [
  {
    id: 'demo-msg-1',
    senderId: 'demo-farmer-1',
    receiverId: DEMO_USER_ID,
    text: 'Morning. I can send the sukuma batch to Mathare by 9am.',
    createdAt: new Date(Date.now() - 90 * 60000).toISOString(),
  },
  {
    id: 'demo-msg-2',
    senderId: DEMO_USER_ID,
    receiverId: 'demo-farmer-1',
    text: 'Perfect. Please keep two bundles aside for the demo order.',
    createdAt: new Date(Date.now() - 70 * 60000).toISOString(),
  },
  {
    id: 'demo-msg-3',
    senderId: 'demo-farmer-2',
    receiverId: DEMO_USER_ID,
    text: 'Tomatoes are ready. Rain is slowing the Kiambu route so I suggest early pickup.',
    createdAt: new Date(Date.now() - 30 * 60000).toISOString(),
  },
];

const safeStorage = () => {
  try {
    // prefer browser `window.localStorage` when available
    // fall back to globalThis.localStorage for Node/test environments
    // eslint-disable-next-line no-undef
    if (typeof window !== 'undefined' && window?.localStorage) return window.localStorage;
  } catch (e) {
    // ignore
  }
  // @ts-ignore
  if (typeof globalThis !== 'undefined' && globalThis.localStorage) return globalThis.localStorage;
  return null;
};

export function isDemoSession(): boolean {
  const storage = safeStorage();
  if (!storage) return false;
  return (
    storage.getItem(DEMO_SESSION_KEY) === 'true' ||
    (storage.getItem('kilimolink_user_token') === DEMO_TOKEN &&
      storage.getItem('email') === DEMO_EMAIL)
  );
}

export function getDemoProfile(role: DemoRole = DEMO_ROLE): DemoProfile {
  return { id: DEMO_USER_ID, email: DEMO_EMAIL, name: DEMO_USER_NAME, role };
}

export function startDemoSession(role: DemoRole = DEMO_ROLE) {
  const storage = safeStorage();
  if (!storage) return getDemoProfile(role);
  const profile = getDemoProfile(role);
  storage.setItem(DEMO_SESSION_KEY, 'true');
  storage.setItem('kilomolink_user_token', DEMO_TOKEN);
  storage.setItem('kilomolink_user_role', role);
  storage.setItem('email', profile.email);
  storage.setItem('kilomolink_user_id', profile.id);
  storage.setItem('kilomolink_user_name', profile.name);
  ensureDemoOrders();
  ensureDemoMessages();
  return profile;
}

export function clearDemoSession() {
  const storage = safeStorage();
  if (!storage) return;
  storage.removeItem(DEMO_SESSION_KEY);
}

export function filterDemoProducts(opts: { search?: string; category?: string; sort?: string }) {
  let list = [...DEMO_PRODUCTS];
  if (opts.search) {
    const q = opts.search.toLowerCase();
    list = list.filter(p => [p.title, p.description, p.location.address, p.farmer.name].join(' ').toLowerCase().includes(q));
  }
  if (opts.category) list = list.filter(p => p.category === opts.category);
  if (opts.sort === 'price_asc') list.sort((a, b) => a.price - b.price);
  if (opts.sort === 'price_desc') list.sort((a, b) => b.price - a.price);
  return list;
}

function ensureDemoOrders() {
  const s = safeStorage();
  if (s && !s.getItem(DEMO_ORDERS_KEY)) s.setItem(DEMO_ORDERS_KEY, JSON.stringify(DEFAULT_DEMO_ORDERS));
}

function ensureDemoMessages() {
  const s = safeStorage();
  if (s && !s.getItem(DEMO_MESSAGES_KEY)) s.setItem(DEMO_MESSAGES_KEY, JSON.stringify(DEFAULT_DEMO_MESSAGES));
}

export function getDemoOrders() {
  const s = safeStorage();
  if (!s) return DEFAULT_DEMO_ORDERS;
  ensureDemoOrders();
  return JSON.parse(s.getItem(DEMO_ORDERS_KEY) || '[]') as DemoOrder[];
}

export function addDemoOrder(product: { id: string; title: string; price: number; farmer?: { id?: string; name?: string; phone?: string } }) {
  const s = safeStorage();
  const orders = getDemoOrders();
  const next: DemoOrder = {
    id: `demo-${Date.now()}`,
    status: 'PENDING',
    totalAmount: product.price,
    createdAt: new Date().toISOString(),
    items: [{
      productId: product.id,
      product: {
        id: product.id,
        title: product.title,
        farmer: { id: product.farmer?.id || 'demo-farmer-1', name: product.farmer?.name || 'Demo Farmer Partner', phone: product.farmer?.phone || '0712345678' },
      },
    }],
  };
  const updated = [next, ...orders];
  if (s) s.setItem(DEMO_ORDERS_KEY, JSON.stringify(updated));
  return next;
}

export function getDemoConversations(currentUserId: string) {
  const messages = getDemoMessages();
  const partnerLookup = new Map(DEMO_PRODUCTS.map(p => [p.farmer.id, { id: p.farmer.id, name: p.farmer.name }]));
  const grouped = new Map<string, DemoMessage[]>();
  messages.forEach(m => {
    const pid = m.senderId === currentUserId ? m.receiverId : m.senderId;
    const g = grouped.get(pid) || [];
    g.push(m);
    grouped.set(pid, g);
  });
  return [...grouped.entries()].map(([pid, thread]) => {
    const latest = [...thread].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
    return { partner: partnerLookup.get(pid) || { id: pid, name: 'Supply Partner' }, lastMessage: { text: latest.text, createdAt: latest.createdAt }, unreadCount: latest.senderId === currentUserId ? 0 : 1 };
  }).sort((a, b) => new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime());
}

export function getDemoMessages() {
  const s = safeStorage();
  if (!s) return DEFAULT_DEMO_MESSAGES;
  ensureDemoMessages();
  return JSON.parse(s.getItem(DEMO_MESSAGES_KEY) || '[]') as DemoMessage[];
}

export function getDemoMessagesForPartner(partnerId: string, currentUserId: string) {
  return getDemoMessages().filter(m => (m.senderId === currentUserId && m.receiverId === partnerId) || (m.senderId === partnerId && m.receiverId === currentUserId))
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
}

export function sendDemoMessage(receiverId: string, text: string, currentUserId: string) {
  const s = safeStorage();
  const messages = getDemoMessages();
  const next: DemoMessage = { id: `demo-msg-${Date.now()}`, senderId: currentUserId, receiverId, text, createdAt: new Date().toISOString(), readAt: new Date().toISOString() };
  const updated = [...messages, next];
  if (s) s.setItem(DEMO_MESSAGES_KEY, JSON.stringify(updated));
  return next;
}
