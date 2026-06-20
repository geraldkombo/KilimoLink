"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMockPrismaService = createMockPrismaService;
function createMockPrismaService() {
    const stores = {};
    const getStore = (name) => {
        if (!stores[name])
            stores[name] = new Map();
        return stores[name];
    };
    const findInStore = (store, where) => {
        if (!where)
            return null;
        for (const [, item] of store) {
            let match = true;
            for (const [key, val] of Object.entries(where)) {
                if (key === 'OR')
                    continue;
                if (typeof val === 'object' && val !== null) {
                    for (const [op, opVal] of Object.entries(val)) {
                        if (op === 'contains' && typeof item[key] === 'string') {
                            if (!item[key].includes(String(opVal))) {
                                match = false;
                            }
                        }
                        else if (op === 'startsWith' && typeof item[key] === 'string') {
                            if (!item[key].startsWith(String(opVal))) {
                                match = false;
                            }
                        }
                        else if (item[key] !== opVal) {
                            match = false;
                        }
                    }
                }
                else if (item[key] !== val) {
                    match = false;
                }
            }
            if (match)
                return item;
        }
        return null;
    };
    const applyInclude = (item, include, model) => {
        if (!include || !item)
            return item;
        const result = { ...item };
        for (const [relName, relConfig] of Object.entries(include)) {
            if (relConfig === true) {
                if (relName === 'farmer') {
                    const farmer = stores['user']?.get(item.farmerId);
                    result[relName] = farmer || null;
                }
                else if (relName === 'buyer') {
                    const buyer = stores['user']?.get(item.buyerId);
                    result[relName] = buyer || null;
                }
                else if (relName === 'product') {
                    const product = stores['product']?.get(item.productId);
                    result[relName] = product || null;
                }
                else if (relName === 'admin') {
                    const admin = stores['adminUser']?.get(item.adminId);
                    result[relName] = admin || null;
                }
            }
            else if (typeof relConfig === 'object' && relConfig !== null) {
                if (relName === 'orderItems' || relName === 'items') {
                    const results = [];
                    const relWhere = relConfig.where || {};
                    const orderStatusWhere = relWhere?.order?.status;
                    for (const [, oi] of stores['orderItem'] || new Map()) {
                        const oiItem = oi;
                        if (relName === 'items' || oiItem.orderId === item.id) {
                            if (orderStatusWhere) {
                                const orderItem = stores['order']?.get(oiItem.orderId);
                                if (orderItem && orderItem.status !== orderStatusWhere)
                                    continue;
                            }
                            const oiCopy = applyInclude(oi, relConfig.include, model);
                            results.push(oiCopy);
                        }
                    }
                    result[relName] = results;
                }
            }
        }
        return result;
    };
    const mockQuery = (model) => ({
        findMany: async (args) => {
            const store = getStore(model);
            let results = Array.from(store.values());
            if (args?.where) {
                if (args.where.OR) {
                    const orResults = new Set();
                    for (const condition of args.where.OR) {
                        for (const [, item] of store) {
                            let match = true;
                            for (const [key, val] of Object.entries(condition)) {
                                if (typeof val === 'object' && val !== null) {
                                    for (const [op, opVal] of Object.entries(val)) {
                                        if (op === 'contains') {
                                            if (op === 'contains' && typeof item[key] === 'string') {
                                                if (!item[key].includes(String(opVal)))
                                                    match = false;
                                            }
                                        }
                                        else if (item[key] !== opVal) {
                                            match = false;
                                        }
                                    }
                                }
                                else if (item[key] !== val) {
                                    match = false;
                                }
                            }
                            if (match)
                                orResults.add(item);
                        }
                    }
                    results = Array.from(orResults);
                }
                else {
                    const where = { ...args.where };
                    const someConditions = {};
                    for (const [key, val] of Object.entries(where)) {
                        if (typeof val === 'object' && val !== null && 'some' in val) {
                            someConditions[key] = val;
                            delete where[key];
                        }
                    }
                    results = results.filter((item) => {
                        for (const [key, val] of Object.entries(where)) {
                            if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
                                for (const [op, opVal] of Object.entries(val)) {
                                    if (op === 'contains' && typeof item[key] === 'string') {
                                        if (!item[key].includes(String(opVal)))
                                            return false;
                                    }
                                    else if (item[key] !== opVal)
                                        return false;
                                }
                            }
                            else if (item[key] !== val)
                                return false;
                        }
                        return true;
                    });
                }
            }
            if (args?.orderBy?.createdAt === 'desc') {
                results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            }
            if (args?.include) {
                results = results.map((item) => applyInclude(item, args.include, model));
            }
            return results;
        },
        findUnique: async (args) => {
            if (args.where.id)
                return getStore(model).get(args.where.id) || null;
            if (args.where.email)
                return findInStore(getStore(model), { email: args.where.email });
            return null;
        },
        findFirst: async (args) => {
            const store = getStore(model);
            if (args?.where)
                return findInStore(store, args.where);
            return store.values().next().value || null;
        },
        findUniqueOrThrow: async (args) => {
            const item = args.where.id ? getStore(model).get(args.where.id) : null;
            if (!item)
                throw Object.assign(new Error('Not found'), { code: 'P2025' });
            return item;
        },
        create: async (args) => {
            const store = getStore(model);
            const id = args.data.id || `mock-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
            const now = new Date();
            const item = {};
            for (const [k, v] of Object.entries(args.data)) {
                if (k !== 'items' && k !== 'orderItems') {
                    item[k] = v;
                }
            }
            item.id = id;
            item.createdAt = now;
            item.updatedAt = now;
            store.set(id, item);
            const itemsData = args.data.items;
            if (itemsData) {
                const createItems = itemsData.create || itemsData;
                for (const itemData of createItems) {
                    const oiStore = getStore('orderItem');
                    const oiId = `mock-oi-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
                    const oiItem = { ...itemData, id: oiId, orderId: id, createdAt: now };
                    oiStore.set(oiId, oiItem);
                }
            }
            return item;
        },
        upsert: async (args) => {
            const store = getStore(model);
            const whereKey = Object.keys(args.where)[0];
            const whereVal = args.where[whereKey];
            const existing = findInStore(store, { [whereKey]: whereVal });
            if (existing) {
                Object.assign(existing, args.update);
                return existing;
            }
            const id = `mock-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
            const now = new Date();
            const item = { ...args.create, id, createdAt: now, updatedAt: now };
            store.set(id, item);
            return item;
        },
        deleteMany: async (args) => {
            const store = getStore(model);
            if (args?.where) {
                for (const [key, val] of Object.entries(args.where)) {
                    for (const [id, item] of store) {
                        if (item[key] === val)
                            store.delete(id);
                    }
                }
            }
            return { count: 0 };
        },
        delete: async (args) => {
            const store = getStore(model);
            const item = store.get(args.where.id);
            store.delete(args.where.id);
            return item;
        },
        update: async (args) => {
            const store = getStore(model);
            const whereKey = Object.keys(args.where)[0];
            const whereVal = args.where[whereKey];
            let item;
            if (whereKey === 'id') {
                item = store.get(whereVal);
            }
            else {
                item = findInStore(store, { [whereKey]: whereVal });
            }
            if (item) {
                for (const [key, val] of Object.entries(args.data)) {
                    if (typeof val === 'object' && val !== null && 'decrement' in val) {
                        item[key] = (item[key] || 0) - val.decrement;
                    }
                    else if (typeof val === 'object' && val !== null && 'increment' in val) {
                        item[key] = (item[key] || 0) + val.increment;
                    }
                    else {
                        item[key] = val;
                    }
                }
                item.updatedAt = new Date();
            }
            return item;
        },
        count: async (args) => {
            const store = getStore(model);
            if (args?.where) {
                let count = 0;
                for (const [, item] of store) {
                    if (findInStore(store, args.where))
                        count++;
                }
                return count;
            }
            return store.size;
        },
    });
    return {
        user: mockQuery('user'),
        product: mockQuery('product'),
        order: mockQuery('order'),
        orderItem: mockQuery('orderItem'),
        impactMetric: mockQuery('impactMetric'),
        resilienceLog: mockQuery('resilienceLog'),
        adminUser: mockQuery('adminUser'),
        adminLoginThrottle: mockQuery('adminLoginThrottle'),
        auditLog: mockQuery('auditLog'),
        otpChallenge: mockQuery('otpChallenge'),
        otpVerifyThrottle: mockQuery('otpVerifyThrottle'),
        notificationLog: mockQuery('notificationLog'),
        $connect: async () => undefined,
        $disconnect: async () => undefined,
        $queryRaw: async () => [{ 1: 1 }],
        onModuleInit: async () => undefined,
        onModuleDestroy: async () => undefined,
    };
}
//# sourceMappingURL=prisma-mock.js.map