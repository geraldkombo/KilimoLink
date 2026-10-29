-- KilimoLink D1 schema (SQLite port of prisma/schema.prisma)
-- Enums are TEXT + CHECK. Json columns are TEXT (JSON strings). Dates are ISO-8601 TEXT.

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'FARMER' CHECK (role IN ('FARMER','BUYER','ADMIN')),
  passwordHash TEXT,
  createdAt TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price REAL NOT NULL,
  quantity REAL NOT NULL,
  category TEXT NOT NULL,
  imageUrl TEXT,
  location TEXT,
  farmerId TEXT NOT NULL REFERENCES users(id),
  createdAt TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE INDEX IF NOT EXISTS idx_products_farmer ON products(farmerId);
CREATE INDEX IF NOT EXISTS idx_products_created ON products(createdAt);

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  buyerId TEXT NOT NULL REFERENCES users(id),
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING','CONFIRMED','DELIVERED','CANCELLED')),
  paymentMethod TEXT,
  paymentRef TEXT,
  totalAmount REAL NOT NULL,
  createdAt TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE INDEX IF NOT EXISTS idx_orders_buyer ON orders(buyerId);

CREATE TABLE IF NOT EXISTS orderItems (
  id TEXT PRIMARY KEY,
  orderId TEXT NOT NULL REFERENCES orders(id),
  productId TEXT NOT NULL REFERENCES products(id),
  quantity REAL NOT NULL,
  price REAL NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_items_order ON orderItems(orderId);

CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY,
  productId TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  buyerId TEXT NOT NULL REFERENCES users(id),
  rating INTEGER NOT NULL,
  comment TEXT,
  createdAt TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  UNIQUE (productId, buyerId)
);

CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  senderId TEXT NOT NULL REFERENCES users(id),
  receiverId TEXT NOT NULL REFERENCES users(id),
  orderId TEXT REFERENCES orders(id),
  text TEXT NOT NULL,
  readAt TEXT,
  createdAt TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE INDEX IF NOT EXISTS idx_messages_pair ON messages(senderId, receiverId);

CREATE TABLE IF NOT EXISTS resilienceLog (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  impact TEXT NOT NULL,
  status TEXT NOT NULL,
  createdAt TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

CREATE TABLE IF NOT EXISTS otpChallenges (
  id TEXT PRIMARY KEY,
  phone TEXT NOT NULL,
  codeHash TEXT NOT NULL,
  expiresAt TEXT NOT NULL,
  usedAt TEXT,
  createdAt TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE INDEX IF NOT EXISTS idx_otp_phone ON otpChallenges(phone, createdAt);

CREATE TABLE IF NOT EXISTS otpThrottle (
  phone TEXT PRIMARY KEY,
  failures INTEGER NOT NULL DEFAULT 0,
  lockedUntil TEXT
);
