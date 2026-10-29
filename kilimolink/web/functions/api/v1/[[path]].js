// KilimoLink API — Cloudflare Pages Functions port of the NestJS backend.
// Contract-compatible with backend/src (see docs/EDGE_API.md for intentional deviations).
import { json, err, withCors, uuid, nowIso, parseLocation, stripUser } from '../../_lib/util.js';
import { hashSecret, verifySecret } from '../../_lib/crypto.js';
import { signToken, authenticate } from '../../_lib/jwt.js';
import {
  PRICE_TRUTH, PRICE_TRUTH_DEFAULT_NOTE, ORACLE_AVERAGES, AI_BASELINES,
  DEMO_PRODUCTS, DEMO_FARMER, DEMO_BUYER, slugify,
  SEED_PRODUCTS, SEED_BUSINESSES, SEED_LOCATIONS, SEED_IMAGE, RESILIENCE_SEED,
} from '../../_lib/data.js';

export async function onRequest(context) {
  try {
    const res = await route(context);
    return withCors(res);
  } catch (e) {
    if (e && e.status) return withCors(err(e.status, e.message));
    console.error('api error', e);
    return withCors(err(500, 'Internal server error'));
  }
}

async function route({ request, env }) {
  if (request.method === 'OPTIONS') return new Response(null, { status: 204 });

  const url = new URL(request.url);
  const seg = url.pathname.replace(/^\/api\/v1\/?/, '').split('/').filter(Boolean).map(decodeURIComponent);
  const m = request.method;
  const db = env.DB;
  const body = (m === 'POST' || m === 'PATCH' || m === 'PUT') ? await request.json().catch(() => ({})) : {};

  const requireAuth = async () => {
    const user = await authenticate(request, env);
    if (!user) throw httpError(401, 'Unauthorized');
    return user;
  };
  const requireAdmin = async () => {
    const user = await requireAuth();
    if (user.role !== 'ADMIN') throw httpError(403, 'Forbidden');
    return user;
  };

  // ---------- health ----------
  if (m === 'GET' && seg[0] === 'health' && seg.length === 1) {
    try {
      await db.prepare('SELECT 1').first();
      return json({ status: 'ok', info: { database: { status: 'up' } }, error: {}, details: { database: { status: 'up' } } });
    } catch {
      return json({ status: 'error', info: {}, error: { database: { status: 'down' } }, details: { database: { status: 'down' } } }, 503);
    }
  }

  // ---------- auth ----------
  if (seg[0] === 'auth') {
    if (m === 'POST' && seg[1] === 'register') {
      const { email, password, name, role } = body;
      if (!email || !password) return err(400, 'email and password are required');
      const existing = await db.prepare('SELECT id FROM users WHERE email = ?1').bind(email).first();
      if (existing) return err(409, 'User already exists');
      const user = await createUser(db, {
        id: uuid(), email, name: name ?? email,
        role: ['FARMER', 'BUYER', 'ADMIN'].includes(role) ? role : 'FARMER',
        passwordHash: await hashSecret(password), phone: null,
      });
      return json({ token: await signToken({ sub: user.id, role: user.role }, env), user: stripUser(user) });
    }

    if (m === 'POST' && seg[1] === 'login') {
      const { email, password } = body;
      const user = await db.prepare('SELECT * FROM users WHERE email = ?1').bind(email || '').first();
      if (!user) return err(404, 'User not found');
      if (!user.passwordHash) return err(401, 'Password login not available for this account');
      if (!(await verifySecret(password || '', user.passwordHash))) return err(401, 'Wrong password');
      return json({ token: await signToken({ sub: user.id, role: user.role }, env), user: stripUser(user) });
    }

    if (m === 'POST' && seg[1] === 'login-email') {
      const { email, name, role } = body;
      if (!email || !name) return err(400, 'email and name are required');
      const adminEmails = (env.ADMIN_EMAILS || '').split(',').map((e) => e.trim().toLowerCase()).filter(Boolean);
      const isAdmin = adminEmails.includes(String(email).toLowerCase());
      const existing = await db.prepare('SELECT * FROM users WHERE email = ?1').bind(email).first();
      let user;
      if (existing) {
        const newRole = isAdmin ? 'ADMIN' : (role ?? existing.role);
        await db.prepare('UPDATE users SET name = ?1, role = ?2 WHERE id = ?3').bind(name, newRole, existing.id).run();
        user = { ...existing, name, role: newRole };
      } else {
        user = await createUser(db, { id: uuid(), email, name, role: isAdmin ? 'ADMIN' : (role || 'FARMER'), phone: null, passwordHash: null });
      }
      return json({ token: await signToken({ sub: user.id, role: user.role }, env), user: stripUser(user) });
    }

    if (m === 'POST' && (seg[1] === 'send-otp' || seg[1] === 'otp')) {
      const phone = String(body.phone || '');
      if (!phone) return err(400, 'phone is required');
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const codeHash = await hashSecret(code);
      const now = nowIso();
      await db.prepare('UPDATE otpChallenges SET usedAt = ?1 WHERE phone = ?2 AND usedAt IS NULL AND expiresAt > ?1').bind(now, phone).run();
      await db.prepare('INSERT INTO otpChallenges (id, phone, codeHash, expiresAt, createdAt) VALUES (?1,?2,?3,?4,?5)')
        .bind(uuid(), phone, codeHash, new Date(Date.now() + 10 * 60 * 1000).toISOString(), now).run();
      // No SMS provider is wired on the edge yet; DEV_OTP=true returns the code
      // so the phone flow stays usable (mirrors NODE_ENV=dev devCode in the Node backend).
      return json(env.DEV_OTP === 'true' ? { ok: true, devCode: code } : { ok: true });
    }

    if (m === 'POST' && (seg[1] === 'verify-otp' || seg[1] === 'verify')) {
      const phone = String(body.phone || '');
      const code = String(body.code || '');
      const now = new Date();
      const throttle = await db.prepare('SELECT * FROM otpThrottle WHERE phone = ?1').bind(phone).first();
      if (throttle?.lockedUntil && new Date(throttle.lockedUntil) > now) return err(429, 'Too many attempts');

      const challenge = await db.prepare('SELECT * FROM otpChallenges WHERE phone = ?1 AND usedAt IS NULL AND expiresAt > ?2 ORDER BY createdAt DESC LIMIT 1')
        .bind(phone, now.toISOString()).first();

      const fail = async (status, message) => {
        const failures = (throttle?.failures ?? 0) + 1;
        const lockedUntil = failures >= 3 ? new Date(Date.now() + 10 * 60 * 1000).toISOString() : null;
        await db.prepare('INSERT INTO otpThrottle (phone, failures, lockedUntil) VALUES (?1,?2,?3) ON CONFLICT(phone) DO UPDATE SET failures = ?2, lockedUntil = ?3')
          .bind(phone, failures, lockedUntil).run();
        if (failures >= 3) return err(429, 'Too many attempts');
        return err(status, message);
      };

      if (!challenge) return fail(401, 'Code expired');
      if (!(await verifySecret(code, challenge.codeHash))) return fail(401, 'Invalid code');

      await db.prepare('UPDATE otpChallenges SET usedAt = ?1 WHERE id = ?2').bind(now.toISOString(), challenge.id).run();
      await db.prepare('DELETE FROM otpThrottle WHERE phone = ?1').bind(phone).run();

      const email = `${phone}@sms.kilimolink`;
      let user = await db.prepare('SELECT * FROM users WHERE email = ?1').bind(email).first();
      if (!user) {
        user = await createUser(db, { id: uuid(), email, name: phone, role: 'FARMER', phone, passwordHash: null });
      }
      return json({ token: await signToken({ sub: user.id, role: user.role }, env), user: stripUser(user) });
    }

    if (m === 'GET' && seg[1] === 'me') {
      const { userId, role } = await requireAuth();
      return json({ userId, role });
    }
  }

  // ---------- users ----------
  if (seg[0] === 'users' && seg[1] === 'me') {
    const { userId } = await requireAuth();
    const user = await db.prepare('SELECT * FROM users WHERE id = ?1').bind(userId).first();
    if (!user) return err(404, 'User not found');
    if (m === 'GET') return json(stripUser(user));
    if (m === 'DELETE') {
      try {
        await db.prepare('DELETE FROM messages WHERE senderId = ?1 OR receiverId = ?1').bind(userId).run();
        await db.prepare('DELETE FROM users WHERE id = ?1').bind(userId).run();
      } catch {
        return err(400, 'Account has linked orders or products and cannot be deleted');
      }
      return json({ ok: true });
    }
  }

  // ---------- products ----------
  if (seg[0] === 'products') {
    if (m === 'GET' && seg.length === 1) return listProducts(db, url);

    if (m === 'GET' && seg[1] === 'my') {
      const { userId } = await requireAuth();
      const rows = await db.prepare('SELECT * FROM products WHERE farmerId = ?1 ORDER BY createdAt DESC').bind(userId).all();
      return json(rows.results.map(parseLocation));
    }

    if (m === 'POST' && seg.length === 1) {
      const { userId } = await requireAuth();
      const user = await db.prepare('SELECT * FROM users WHERE id = ?1').bind(userId).first();
      if (!user) return err(401, 'Unauthorized');
      if (user.role !== 'FARMER') return err(400, 'Only farmers can create products');
      const { title, description, price, quantity, category, imageUrl, location, phone } = body;
      if (!title || typeof price !== 'number' || typeof quantity !== 'number' || !category || typeof location !== 'object' || location === null) {
        return err(400, 'title, price, quantity, category and location are required');
      }
      if (phone) await db.prepare('UPDATE users SET phone = ?1 WHERE id = ?2').bind(String(phone), userId).run();
      const id = uuid();
      const createdAt = nowIso();
      await db.prepare('INSERT INTO products (id,title,description,price,quantity,category,imageUrl,location,farmerId,createdAt) VALUES (?1,?2,?3,?4,?5,?6,?7,?8,?9,?10)')
        .bind(id, String(title), description != null ? String(description) : null, price, quantity, String(category), imageUrl != null ? String(imageUrl) : null, JSON.stringify(location), userId, createdAt).run();
      return json({ id, title, description: description ?? null, price, quantity, category, imageUrl: imageUrl ?? null, location, farmerId: userId, createdAt });
    }

    if (seg[1] === 'my') return err(404, 'Not found');

    const id = seg[1];

    if (m === 'GET' && seg[2] === 'reviews') {
      const agg = await db.prepare('SELECT COALESCE(AVG(rating),0) as avgRating, COUNT(*) as reviewCount FROM reviews WHERE productId = ?1').bind(id).first();
      const rows = await db.prepare('SELECT r.id, r.productId, r.buyerId, r.rating, r.comment, r.createdAt, u.id as b_id, u.name as b_name FROM reviews r LEFT JOIN users u ON u.id = r.buyerId WHERE r.productId = ?1 ORDER BY r.createdAt DESC').bind(id).all();
      return json({
        avgRating: agg.avgRating,
        reviewCount: agg.reviewCount,
        reviews: rows.results.map((r) => ({ id: r.id, productId: r.productId, buyerId: r.buyerId, rating: r.rating, comment: r.comment, createdAt: r.createdAt, buyer: { id: r.b_id, name: r.b_name } })),
      });
    }

    if (m === 'GET' && seg.length === 2) {
      const row = await db.prepare(productSelectSql('p', 'WHERE p.id = ?1')).bind(id).first();
      if (!row) return err(404, 'Product not found');
      return json(shapeProduct(row));
    }

    if (m === 'PATCH' && seg.length === 2) {
      const { userId } = await requireAuth();
      const existing = await db.prepare('SELECT * FROM products WHERE id = ?1').bind(id).first();
      if (!existing) return err(404, 'Product not found');
      if (existing.farmerId !== userId) return err(400, 'You can only edit your own products');
      const fields = ['title', 'description', 'price', 'quantity', 'category', 'imageUrl'];
      const sets = [];
      const vals = [];
      for (const f of fields) {
        if (body[f] !== undefined) { sets.push(`${f} = ?${vals.length + 1}`); vals.push(body[f]); }
      }
      if (body.location !== undefined) { sets.push(`location = ?${vals.length + 1}`); vals.push(JSON.stringify(body.location)); }
      if (sets.length) {
        vals.push(id);
        await db.prepare(`UPDATE products SET ${sets.join(', ')} WHERE id = ?${vals.length}`).bind(...vals).run();
      }
      const updated = await db.prepare('SELECT * FROM products WHERE id = ?1').bind(id).first();
      return json(parseLocation(updated));
    }

    if (m === 'DELETE' && seg.length === 2) {
      const { userId } = await requireAuth();
      const existing = await db.prepare('SELECT * FROM products WHERE id = ?1').bind(id).first();
      if (!existing) return err(404, 'Product not found');
      if (existing.farmerId !== userId) return err(400, 'You can only delete your own products');
      await db.prepare('DELETE FROM reviews WHERE productId = ?1').bind(id).run();
      try {
        await db.prepare('DELETE FROM products WHERE id = ?1').bind(id).run();
      } catch {
        return err(400, 'Product has existing orders and cannot be deleted');
      }
      return json({ success: true });
    }
  }

  // ---------- reviews ----------
  if (m === 'POST' && seg[0] === 'reviews' && seg.length === 1) {
    const { userId } = await requireAuth();
    const { productId, rating, comment } = body;
    if (!productId || !Number.isInteger(rating) || rating < 1 || rating > 5) {
      return err(400, 'productId and rating (integer 1-5) are required');
    }
    const delivered = await db.prepare("SELECT COUNT(*) c FROM orders o JOIN orderItems oi ON oi.orderId = o.id WHERE o.buyerId = ?1 AND o.status = 'DELIVERED' AND oi.productId = ?2")
      .bind(userId, productId).first();
    if (!delivered.c) return err(403, 'You must have a delivered order for this product to review it');
    const dup = await db.prepare('SELECT id FROM reviews WHERE productId = ?1 AND buyerId = ?2').bind(productId, userId).first();
    if (dup) return err(403, 'You have already reviewed this product');
    const review = { id: uuid(), productId, buyerId: userId, rating, comment: comment != null ? String(comment) : null, createdAt: nowIso() };
    await db.prepare('INSERT INTO reviews (id,productId,buyerId,rating,comment,createdAt) VALUES (?1,?2,?3,?4,?5,?6)')
      .bind(review.id, review.productId, review.buyerId, review.rating, review.comment, review.createdAt).run();
    const buyer = await db.prepare('SELECT id, name FROM users WHERE id = ?1').bind(userId).first();
    return json({ ...review, buyer });
  }

  // ---------- orders ----------
  if (seg[0] === 'orders') {
    const { userId } = await requireAuth();

    if (m === 'POST' && seg.length === 1) {
      const { productId, quantity, paymentMethod } = body;
      if (!productId || typeof quantity !== 'number' || quantity <= 0) return err(400, 'productId and quantity are required');
      const product = await db.prepare('SELECT * FROM products WHERE id = ?1').bind(productId).first();
      if (!product) return err(400, 'Product not found');
      if (product.quantity < quantity) return err(400, 'Not enough quantity available');
      const totalAmount = product.price * quantity;
      const mock = (env.MOCK_PAYMENTS ?? 'true') === 'true';
      const order = {
        id: uuid(), buyerId: userId,
        status: mock ? 'CONFIRMED' : 'PENDING',
        paymentMethod: mock ? 'MOCK' : (paymentMethod || 'CASH'),
        paymentRef: null, totalAmount, createdAt: nowIso(),
      };
      const batch = db.batch([
        db.prepare('INSERT INTO orders (id,buyerId,status,paymentMethod,paymentRef,totalAmount,createdAt) VALUES (?1,?2,?3,?4,?5,?6,?7)')
          .bind(order.id, order.buyerId, order.status, order.paymentMethod, order.paymentRef, order.totalAmount, order.createdAt),
        db.prepare('INSERT INTO orderItems (id,orderId,productId,quantity,price) VALUES (?1,?2,?3,?4,?5)')
          .bind(uuid(), order.id, productId, quantity, product.price),
        db.prepare('UPDATE products SET quantity = quantity - ?1 WHERE id = ?2').bind(quantity, productId),
      ]);
      await batch;
      return json({ success: true, orderId: order.id });
    }

    if (m === 'GET' && seg.length === 1) {
      const page = Math.max(1, Number(url.searchParams.get('page') || 1));
      const limit = Math.min(100, Math.max(1, Number(url.searchParams.get('limit') || 20)));
      const offset = (page - 1) * limit;
      const totalRow = await db.prepare('SELECT COUNT(DISTINCT o.id) t FROM orders o LEFT JOIN orderItems oi ON oi.orderId = o.id LEFT JOIN products p ON p.id = oi.productId WHERE o.buyerId = ?1 OR p.farmerId = ?1').bind(userId).first();
      const total = totalRow.t;
      const orders = (await db.prepare('SELECT DISTINCT o.* FROM orders o LEFT JOIN orderItems oi ON oi.orderId = o.id LEFT JOIN products p ON p.id = oi.productId WHERE o.buyerId = ?1 OR p.farmerId = ?1 ORDER BY o.createdAt DESC LIMIT ?2 OFFSET ?3').bind(userId, limit, offset).all()).results;

      const ids = orders.map((o) => o.id);
      let itemsByOrder = {};
      let buyers = {};
      if (ids.length) {
        const ph = ids.map(() => '?').join(',');
        const itemRows = (await db.prepare(`SELECT oi.*, p.title p_title, p.description p_description, p.price p_price, p.quantity p_quantity, p.category p_category, p.imageUrl p_imageUrl, p.location p_location, p.farmerId p_farmerId, p.createdAt p_createdAt, u.id f_id, u.email f_email, u.phone f_phone, u.name f_name, u.role f_role, u.createdAt f_createdAt FROM orderItems oi JOIN products p ON p.id = oi.productId LEFT JOIN users u ON u.id = p.farmerId WHERE oi.orderId IN (${ph})`).bind(...ids).all()).results;
        for (const it of itemRows) {
          (itemsByOrder[it.orderId] ||= []).push({
            id: it.id, orderId: it.orderId, productId: it.productId, quantity: it.quantity, price: it.price,
            product: parseLocation({ id: it.productId, title: it.p_title, description: it.p_description, price: it.p_price, quantity: it.p_quantity, category: it.p_category, imageUrl: it.p_imageUrl, location: it.p_location, farmerId: it.p_farmerId, createdAt: it.p_createdAt, farmer: { id: it.f_id, email: it.f_email, phone: it.f_phone, name: it.f_name, role: it.f_role, createdAt: it.f_createdAt } }),
          });
        }
        const buyerIds = [...new Set(orders.map((o) => o.buyerId))];
        if (buyerIds.length) {
          const bph = buyerIds.map(() => '?').join(',');
          const brows = (await db.prepare(`SELECT * FROM users WHERE id IN (${bph})`).bind(...buyerIds).all()).results;
          for (const b of brows) buyers[b.id] = stripUser(b);
        }
      }
      return json({
        orders: orders.map((o) => ({ ...o, items: itemsByOrder[o.id] || [], buyer: buyers[o.buyerId] || null })),
        total, page, limit, totalPages: Math.ceil(total / limit),
      });
    }

    if (m === 'PATCH' && seg[2] === 'complete') {
      const order = await db.prepare('SELECT * FROM orders WHERE id = ?1').bind(seg[1]).first();
      if (!order) return err(404, 'Order not found');
      if (order.buyerId !== userId) return err(403, 'You can only complete your own orders');
      await db.prepare("UPDATE orders SET status = 'DELIVERED' WHERE id = ?1").bind(order.id).run();
      return json({ success: true, orderId: order.id, status: 'DELIVERED' });
    }
  }

  // ---------- chat ----------
  if (seg[0] === 'chat') {
    const { userId } = await requireAuth();

    if (m === 'GET' && seg[1] === 'conversations') {
      const rows = (await db.prepare('SELECT m.*, s.name senderName, r.name receiverName FROM messages m JOIN users s ON s.id = m.senderId JOIN users r ON r.id = m.receiverId WHERE m.senderId = ?1 OR m.receiverId = ?1 ORDER BY m.createdAt DESC').bind(userId).all()).results;
      const byPartner = new Map();
      for (const msg of rows) {
        const partnerId = msg.senderId === userId ? msg.receiverId : msg.senderId;
        const partnerName = msg.senderId === userId ? msg.receiverName : msg.senderName;
        const entry = byPartner.get(partnerId) || { partner: { id: partnerId, name: partnerName }, lastMessage: { text: msg.text, createdAt: msg.createdAt }, unreadCount: 0 };
        if (msg.receiverId === userId && msg.readAt === null) entry.unreadCount++;
        byPartner.set(partnerId, entry);
      }
      return json([...byPartner.values()]);
    }

    if (seg[1] === 'messages') {
      if (m === 'POST') {
        const { receiverId, text, orderId } = body;
        if (!receiverId || !text || !String(text).length) return err(400, 'receiverId and text are required');
        const msg = { id: uuid(), senderId: userId, receiverId, orderId: orderId || null, text: String(text), readAt: null, createdAt: nowIso() };
        await db.prepare('INSERT INTO messages (id,senderId,receiverId,orderId,text,readAt,createdAt) VALUES (?1,?2,?3,?4,?5,?6,?7)')
          .bind(msg.id, msg.senderId, msg.receiverId, msg.orderId, msg.text, msg.readAt, msg.createdAt).run();
        const sender = await db.prepare('SELECT id, name FROM users WHERE id = ?1').bind(userId).first();
        const receiver = await db.prepare('SELECT id, name FROM users WHERE id = ?1').bind(receiverId).first();
        return json({ ...msg, sender, receiver });
      }

      if (m === 'GET' && seg[2]) {
        const otherId = seg[2];
        const now = nowIso();
        await db.prepare('UPDATE messages SET readAt = ?1 WHERE senderId = ?2 AND receiverId = ?3 AND readAt IS NULL').bind(now, otherId, userId).run();
        const rows = (await db.prepare('SELECT m.*, s.name senderName, r.name receiverName FROM messages m JOIN users s ON s.id = m.senderId JOIN users r ON r.id = m.receiverId WHERE (m.senderId = ?1 AND m.receiverId = ?2) OR (m.senderId = ?2 AND m.receiverId = ?1) ORDER BY m.createdAt ASC').bind(userId, otherId).all()).results;
        return json(rows.map((msg) => ({
          id: msg.id, senderId: msg.senderId, receiverId: msg.receiverId, orderId: msg.orderId,
          text: msg.text, readAt: msg.readAt, createdAt: msg.createdAt,
          sender: { id: msg.senderId, name: msg.senderName }, receiver: { id: msg.receiverId, name: msg.receiverName },
        })));
      }

      if (m === 'PATCH' && seg[2] && seg[3] === 'read') {
        const msg = await db.prepare('SELECT * FROM messages WHERE id = ?1').bind(seg[2]).first();
        if (!msg) return err(404, 'Message not found');
        if (msg.receiverId !== userId) return err(403, 'Forbidden');
        await db.prepare('UPDATE messages SET readAt = ?1 WHERE id = ?2').bind(nowIso(), msg.id).run();
        return json({ ...msg, readAt: nowIso() });
      }
    }
  }

  // ---------- ai ----------
  if (seg[0] === 'ai') {
    if (m === 'POST' && seg[1] === 'suggest-price') {
      await requireAuth();
      const productName = String(body.productName || '').toLowerCase();
      const baseline = AI_BASELINES[String(body.category || '').toLowerCase()] ?? AI_BASELINES.default;
      const recent = Array.isArray(body.recentPrices) ? body.recentPrices.filter((n) => typeof n === 'number') : [];
      const averageRecent = recent.length ? recent.reduce((a, b) => a + b, 0) / recent.length : baseline;
      let multiplier = 1;
      if (/organic|premium|fresh/.test(productName)) multiplier += 0.15;
      if (/bulk|wholesale/.test(productName)) multiplier -= 0.1;
      if (/small|baby|micro/.test(productName)) multiplier += 0.05;
      const adjusted = averageRecent * multiplier;
      return json({
        min: Math.round(Math.max(1, adjusted * 0.85)),
        max: Math.round(adjusted * 1.25),
        recommended: Math.round(adjusted),
      });
    }

    if (m === 'GET' && seg[1] === 'price-truth' && seg[2]) {
      const row = PRICE_TRUTH[seg[2]];
      if (!row) return err(404, 'No reference price for this product');
      const gap = row.reference - row.typicalMiddleman;
      return json({
        slug: seg[2],
        referencePrice: row.reference,
        middlemanPrice: row.typicalMiddleman,
        gapKes: gap,
        farmerLossPercent: Math.round((gap / row.reference) * 100),
        source: row.source,
        asOf: row.asOf,
        note: row.note || PRICE_TRUTH_DEFAULT_NOTE,
      });
    }
  }

  // ---------- oracle / market ----------
  if (m === 'GET' && seg[0] === 'oracle' && seg[1] === 'prices') {
    const product = url.searchParams.get('product') || undefined;
    const key = (product || 'other').toLowerCase();
    return json({
      product: product || 'other',
      average: ORACLE_AVERAGES[key] ?? ORACLE_AVERAGES.other,
      currency: 'KES',
      effectiveMonth: '2026-10',
      source: 'KilimoLink simulated oracle (calibrated to KNBS 2026 Economic Survey + AFA bulletins)',
      updatedAt: nowIso(),
    });
  }

  if (m === 'GET' && seg[0] === 'market' && seg[1] === 'disruption-alerts') {
    return json({ active: false, status: 'stable', message: 'No active supply-chain disruption alerts.', updatedAt: nowIso() });
  }

  // ---------- impact ----------
  if (m === 'GET' && seg[0] === 'impact' && seg.length === 1) {
    const data = await computeImpact(db);
    return json({ ...data, activeFarmers: data.activeFarmers, co2SavedKg: round2(data.co2SavedKg), wasteDivertedKg: round2(data.wasteDivertedKg) });
  }

  // ---------- admin ----------
  if (seg[0] === 'admin') {
    await requireAdmin();

    if (m === 'GET' && seg[1] === 'impact') {
      const data = await computeImpact(db);
      return json({ completedOrders: data.completedOrders, co2SavedKg: data.co2SavedKg, wasteDivertedKg: data.wasteDivertedKg, greenSpaceM2: data.greenSpaceM2 });
    }

    if (m === 'GET' && seg[1] === 'users') {
      const rows = (await db.prepare('SELECT * FROM users ORDER BY createdAt DESC').all()).results;
      return json(rows.map(stripUser));
    }

    if (m === 'GET' && seg[1] === 'products') {
      const rows = (await db.prepare(productSelectSql('p', null, null, 'p.createdAt DESC')).all()).results;
      return json(rows.map(shapeProduct));
    }

    if (m === 'DELETE' && seg[1] === 'products' && seg[2]) {
      const existing = await db.prepare('SELECT * FROM products WHERE id = ?1').bind(seg[2]).first();
      if (!existing) return err(404, 'Product not found');
      await db.prepare('DELETE FROM reviews WHERE productId = ?1').bind(seg[2]).run();
      await db.prepare('DELETE FROM products WHERE id = ?1').bind(seg[2]).run();
      return json(parseLocation(existing));
    }

    if (m === 'GET' && seg[1] === 'resilience') {
      const rows = (await db.prepare('SELECT * FROM resilienceLog ORDER BY createdAt DESC').all()).results;
      return json(rows);
    }

    if (m === 'POST' && seg[1] === 'resilience') {
      const row = { id: uuid(), createdAt: nowIso(), ...body };
      await db.prepare('INSERT INTO resilienceLog (id,type,title,description,impact,status,createdAt) VALUES (?1,?2,?3,?4,?5,?6,?7)')
        .bind(row.id, row.type, row.title, row.description, row.impact, row.status, row.createdAt).run();
      return json(row);
    }

    if (m === 'POST' && seg[1] === 'seed') {
      const phoneToUser = {};
      for (const biz of SEED_BUSINESSES) {
        const email = biz.phone.replace('+', '') + '@kilimolink.demo';
        let u = await db.prepare('SELECT * FROM users WHERE email = ?1').bind(email).first();
        if (!u) {
          u = await createUser(db, { id: uuid(), email, name: `${biz.sector} Provider (${biz.county})`, role: 'FARMER', phone: biz.phone, passwordHash: null });
        }
        phoneToUser[biz.phone] = u.id;
      }
      let admin = await db.prepare('SELECT * FROM users WHERE email = ?1').bind('admin@kilimolink.demo').first();
      if (!admin) {
        admin = await createUser(db, { id: uuid(), email: 'admin@kilimolink.demo', name: 'KilimoLink Admin', role: 'ADMIN', phone: '+254000000000', passwordHash: null });
      }
      for (const p of SEED_PRODUCTS) {
        const cat = p.category.charAt(0).toUpperCase() + p.category.slice(1);
        const loc = SEED_LOCATIONS[p.category] || SEED_LOCATIONS.fallback;
        await db.prepare('INSERT INTO products (id,title,description,price,quantity,category,imageUrl,location,farmerId,createdAt) VALUES (?1,?2,?3,?4,?5,?6,?7,?8,?9,?10)')
          .bind(uuid(), p.name, p.description, p.priceKes, p.quantity, cat, SEED_IMAGE, JSON.stringify(loc), phoneToUser[p.sellerPhone] ?? admin.id, nowIso()).run();
      }
      return json({ success: true, message: `Successfully seeded ${SEED_PRODUCTS.length} products from official datasets.` });
    }
  }

  // ---------- public demo seed (parity with Node backend) ----------
  if (m === 'GET' && seg[0] === 'seed') {
    if (url.searchParams.get('key') !== 'seedme-2024') return json({ error: 'invalid key' });
    await seedDemoData(db);
    return json({ ok: true, products: DEMO_PRODUCTS.length });
  }

  return err(404, `Cannot ${m} /api/v1/${seg.join('/')}`);
}

// ================= helpers =================

function httpError(status, message) {
  const e = new Error(message);
  e.status = status;
  return e;
}

function round2(x) {
  return Math.round(x * 100) / 100;
}

function productSelectSql(alias, whereSql, params, orderBy) {
  return `SELECT ${alias}.*, u.id f_id, u.email f_email, u.phone f_phone, u.name f_name, u.role f_role, u.createdAt f_createdAt,
    (SELECT AVG(rating) FROM reviews r WHERE r.productId = ${alias}.id) avgRating,
    (SELECT COUNT(*) FROM reviews r WHERE r.productId = ${alias}.id) reviewCount
    FROM products ${alias} LEFT JOIN users u ON u.id = ${alias}.farmerId
    ${whereSql || ''} ${orderBy ? 'ORDER BY ' + orderBy : ''}`;
}

function shapeProduct(row) {
  const { f_id, f_email, f_phone, f_name, f_role, f_createdAt, avgRating, reviewCount, ...p } = row;
  return {
    ...parseLocation(p),
    farmer: f_id ? { id: f_id, email: f_email, phone: f_phone, name: f_name, role: f_role, createdAt: f_createdAt } : null,
    avgRating: avgRating ?? null,
    reviewCount: reviewCount ?? 0,
  };
}

async function listProducts(db, url) {
  const sp = url.searchParams;
  const lat = sp.has('lat') ? Number(sp.get('lat')) : undefined;
  const lng = sp.has('lng') ? Number(sp.get('lng')) : undefined;
  const page = sp.has('page') ? Math.max(1, Number(sp.get('page'))) : 1;
  const limit = sp.has('limit') ? Math.min(100, Math.max(1, Number(sp.get('limit')))) : 50;
  const search = sp.get('search') || undefined;
  const category = sp.get('category') || undefined;
  const minPrice = sp.has('minPrice') ? Number(sp.get('minPrice')) : undefined;
  const maxPrice = sp.has('maxPrice') ? Number(sp.get('maxPrice')) : undefined;
  const sort = sp.get('sort') || undefined;

  const where = [];
  const params = [];
  if (search) {
    params.push(`%${search.toLowerCase()}%`, `%${search.toLowerCase()}%`);
    where.push(`(LOWER(p.title) LIKE ?${params.length - 1} OR LOWER(COALESCE(p.description,'')) LIKE ?${params.length})`);
  }
  if (category) { params.push(category); where.push(`p.category = ?${params.length}`); }
  if (minPrice !== undefined && !Number.isNaN(minPrice)) { params.push(minPrice); where.push(`p.price >= ?${params.length}`); }
  if (maxPrice !== undefined && !Number.isNaN(maxPrice)) { params.push(maxPrice); where.push(`p.price <= ?${params.length}`); }
  const whereSql = where.length ? 'WHERE ' + where.join(' AND ') : '';

  let orderBy = 'p.createdAt DESC';
  if (sort === 'price_asc') orderBy = 'p.price ASC';
  else if (sort === 'price_desc') orderBy = 'p.price DESC';

  const total = (await db.prepare(`SELECT COUNT(*) t FROM products p ${whereSql}`).bind(...params).first()).t;
  const offset = (page - 1) * limit;
  const rows = (await db.prepare(`${productSelectSql('p', whereSql, params, orderBy)} LIMIT ?${params.length + 1} OFFSET ?${params.length + 2}`)
    .bind(...params, limit, offset).all()).results;

  let products = rows.map(shapeProduct);
  if (lat !== undefined && lng !== undefined && !Number.isNaN(lat) && !Number.isNaN(lng)) {
    products = products
      .map((p) => ({ ...p, distance: haversine(lat, lng, p.location?.lat, p.location?.lng) }))
      .sort((a, b) => (a.distance || 0) - (b.distance || 0));
  }
  return json({ products, total, page, limit, totalPages: Math.ceil(total / limit) });
}

function haversine(lat1, lon1, lat2, lon2) {
  if (lat2 === undefined || lon2 === undefined || lat1 === undefined || lon1 === undefined) return null;
  const R = 6371;
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

function deg2rad(d) {
  return d * (Math.PI / 180);
}

async function computeImpact(db) {
  const completedOrders = (await db.prepare("SELECT COUNT(*) c FROM orders WHERE status = 'DELIVERED'").first()).c;
  const rows = (await db.prepare("SELECT p.quantity, COALESCE((SELECT SUM(oi.quantity) FROM orderItems oi JOIN orders o ON o.id = oi.orderId WHERE oi.productId = p.id AND o.status = 'DELIVERED'), 0) sold FROM products p").all()).results;
  let totalSold = 0;
  let totalInitial = 0;
  for (const r of rows) {
    totalSold += r.sold;
    totalInitial += r.quantity + r.sold;
  }
  const wasteDivertedKg = (totalInitial - totalSold) * 0.5;
  const co2SavedKg = completedOrders * 5 * 0.2 + wasteDivertedKg * 2.5;
  const activeFarmers = (await db.prepare("SELECT COUNT(*) c FROM users WHERE role = 'FARMER'").first()).c;
  return { completedOrders, co2SavedKg, wasteDivertedKg, greenSpaceM2: activeFarmers * 100, activeFarmers };
}

async function createUser(db, { id, email, name, role, phone, passwordHash }) {
  const createdAt = nowIso();
  await db.prepare('INSERT INTO users (id,email,phone,name,role,passwordHash,createdAt) VALUES (?1,?2,?3,?4,?5,?6,?7)')
    .bind(id, email, phone ?? null, name, role, passwordHash ?? null, createdAt).run();
  return { id, email, phone: phone ?? null, name, role, createdAt };
}

export async function seedDemoData(db) {
  let farmer = await db.prepare('SELECT * FROM users WHERE email = ?1').bind(DEMO_FARMER.email).first();
  if (!farmer) farmer = await createUser(db, DEMO_FARMER);
  let buyer = await db.prepare('SELECT * FROM users WHERE email = ?1').bind(DEMO_BUYER.email).first();
  if (!buyer) buyer = await createUser(db, DEMO_BUYER);
  for (const p of DEMO_PRODUCTS) {
    const id = slugify(p.title);
    const exists = await db.prepare('SELECT id FROM products WHERE id = ?1').bind(id).first();
    const loc = JSON.stringify(p.location);
    if (exists) {
      await db.prepare('UPDATE products SET title=?1, description=?2, price=?3, quantity=?4, category=?5, imageUrl=?6, location=?7, farmerId=?8 WHERE id=?9')
        .bind(p.title, p.description, p.price, p.quantity, p.category, p.imageUrl, loc, farmer.id, id).run();
    } else {
      await db.prepare('INSERT INTO products (id,title,description,price,quantity,category,imageUrl,location,farmerId,createdAt) VALUES (?1,?2,?3,?4,?5,?6,?7,?8,?9,?10)')
        .bind(id, p.title, p.description, p.price, p.quantity, p.category, p.imageUrl, loc, farmer.id, nowIso()).run();
    }
  }
  const rl = await db.prepare('SELECT COUNT(*) c FROM resilienceLog').first();
  if (!rl.c) {
    await db.prepare('INSERT INTO resilienceLog (id,type,title,description,impact,status,createdAt) VALUES (?1,?2,?3,?4,?5,?6,?7)')
      .bind(uuid(), RESILIENCE_SEED.type, RESILIENCE_SEED.title, RESILIENCE_SEED.description, RESILIENCE_SEED.impact, RESILIENCE_SEED.status, nowIso()).run();
  }
}
