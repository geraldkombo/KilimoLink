export function createMockPrismaService() {
  const stores: Record<string, Map<string, any>> = {};
  const getStore = (name: string) => {
    if (!stores[name]) stores[name] = new Map();
    return stores[name];
  };

  const isMatch = (item: any, key: string, val: any): boolean => {
    if (val === null) return (item as any)[key] == null;
    const itemVal = (item as any)[key];
    if (typeof val === 'object' && val !== null) {
      if (key === 'OR') return true;
      for (const [op, opVal] of Object.entries(val)) {
        if (op === 'contains' && typeof itemVal === 'string') {
          if (!itemVal.includes(String(opVal as string))) return false;
        } else if (op === 'gt') {
          if (!(itemVal > (opVal as any))) return false;
        } else if (op === 'lt') {
          if (!(itemVal < (opVal as any))) return false;
        } else if (itemVal !== opVal) return false;
      }
      return true;
    }
    return itemVal === val;
  };

  const findInStore = (store: Map<string, any>, where: any) => {
    if (!where) return null;
    for (const [, item] of store) {
      let match = true;
      for (const [key, val] of Object.entries(where)) {
        if (key === 'OR') continue;
        if (!isMatch(item, key, val)) { match = false; break; }
      }
      if (match) return item;
    }
    return null;
  };

  const applyInclude = (item: any, include: any, model: string) => {
    if (!include || !item) return item;
    const result = { ...item };
    for (const [relName, relConfig] of Object.entries(include)) {
      if (relConfig === true) {
        if (relName === 'farmer') {
          const farmer = stores['user']?.get((item as any).farmerId);
          result[relName] = farmer || null;
        } else if (relName === 'buyer') {
          const buyer = stores['user']?.get((item as any).buyerId);
          result[relName] = buyer || null;
        } else if (relName === 'product') {
          const product = stores['product']?.get((item as any).productId);
          result[relName] = product || null;
        } else if (relName === 'admin') {
          const admin = stores['adminUser']?.get((item as any).adminId);
          result[relName] = admin || null;
        }
      } else if (typeof relConfig === 'object' && relConfig !== null) {
        if (relName === 'orderItems' || relName === 'items') {
          const results: any[] = [];
          const relWhere = (relConfig as any).where || {};
          const orderStatusWhere = relWhere?.order?.status;
          for (const [, oi] of stores['orderItem'] || new Map()) {
            const oiItem = oi as any;
            if (relName === 'items' || oiItem.orderId === item.id) {
              if (orderStatusWhere) {
                const orderItem = stores['order']?.get(oiItem.orderId);
                if (orderItem && (orderItem as any).status !== orderStatusWhere) continue;
              }
              const oiCopy = applyInclude(oi, (relConfig as any).include, model);
              results.push(oiCopy);
            }
          }
          result[relName] = results;
        }
      }
    }
    return result;
  };

  const mockQuery = (model: string) => ({
    findMany: async (args?: any) => {
      const store = getStore(model);
      let results = Array.from(store.values());

      if (args?.where) {
        if (args.where.OR) {
          const orResults = new Set<any>();
          for (const condition of args.where.OR) {
            for (const [, item] of store) {
              let match = true;
              for (const [key, val] of Object.entries(condition)) {
                if (typeof val === 'object' && val !== null) {
                  for (const [op, opVal] of Object.entries(val)) {
                    if (op === 'contains') {
                      if (op === 'contains' && typeof (item as any)[key] === 'string') {
                        if (!(item as any)[key].includes(String(opVal))) match = false;
                      }
                    } else if ((item as any)[key] !== opVal) { match = false; }
                  }
                } else if ((item as any)[key] !== val) { match = false; }
              }
              if (match) orResults.add(item);
            }
          }
          results = Array.from(orResults);
        } else {
          const where = { ...args.where };
          // Handle some/some nested conditions
          const someConditions: any = {};
          for (const [key, val] of Object.entries(where)) {
            if (typeof val === 'object' && val !== null && 'some' in val) {
              someConditions[key] = val;
              delete where[key];
            }
          }

          results = results.filter((item: any) => {
            for (const [key, val] of Object.entries(where)) {
              if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
                for (const [op, opVal] of Object.entries(val)) {
                  if (op === 'contains' && typeof (item as any)[key] === 'string') {
                    if (!(item as any)[key].includes(String(opVal))) return false;
                  } else if ((item as any)[key] !== opVal) return false;
                }
              } else if ((item as any)[key] !== val) return false;
            }
            return true;
          });
        }
      }

      if (args?.orderBy?.createdAt === 'desc') {
        results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }

      if (args?.include) {
        results = results.map((item: any) => applyInclude(item, args.include, model));
      }

      return results;
    },
    findUnique: async (args: any) => {
      const store = getStore(model);
      if (args.where.id) return store.get(args.where.id) || null;
      if (args.where.email) return findInStore(store, { email: args.where.email });
      // Handle compound unique keys like productId_buyerId
      for (const [key, val] of Object.entries(args.where)) {
        if (key !== 'id' && key !== 'email' && typeof val === 'object' && val !== null) {
          return findInStore(store, val as any);
        }
      }
      return null;
    },
    findFirst: async (args?: any) => {
      const store = getStore(model);
      let results = Array.from(store.values());
      if (args?.where) {
        results = results.filter((item: any) => {
          for (const [key, val] of Object.entries(args.where)) {
            if (key === 'OR') continue;
            if (typeof val === 'object' && val !== null && 'some' in val) {
              const someVal = (val as any).some;
              // Resolve related items from the relation store
              const relNames: Record<string, string> = { items: 'orderItem', orderItems: 'orderItem' };
              const relStoreName = relNames[key] || key;
              const relStore = getStore(relStoreName);
              // Check FK: rel store should have a field matching this model's id
              const match = Array.from(relStore.values()).some((relItem: any) => {
                if ((relItem as any).orderId === item.id || (relItem as any).productId === item.id || (relItem as any).buyerId === item.id) {
                  for (const [sk, sv] of Object.entries(someVal)) {
                    if ((relItem as any)[sk] !== sv) return false;
                  }
                  return true;
                }
                return false;
              });
              if (!match) return false;
            } else if (!isMatch(item, key, val)) {
              return false;
            }
          }
          return true;
        });
      }
      if (args?.orderBy) {
        const [sortKey, sortDir] = Object.entries(args.orderBy)[0];
        results.sort((a, b) => {
          if (sortDir === 'desc') return new Date(b[sortKey]).getTime() - new Date(a[sortKey]).getTime();
          return new Date(a[sortKey]).getTime() - new Date(b[sortKey]).getTime();
        });
      }
      return results[0] || null;
    },
    findUniqueOrThrow: async (args: any) => {
      const item = args.where.id ? getStore(model).get(args.where.id) : null;
      if (!item) throw Object.assign(new Error('Not found'), { code: 'P2025' });
      return item;
    },
    create: async (args: any) => {
      const store = getStore(model);
      const id = args.data.id || `mock-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const now = new Date();
      const item: any = {};
      for (const [k, v] of Object.entries(args.data)) {
        if (k !== 'items' && k !== 'orderItems') {
          item[k] = v;
        }
      }
      item.id = id;
      item.createdAt = now;
      item.updatedAt = now;
      store.set(id, item);

      const itemsData = (args.data as any).items;
      if (itemsData) {
        const createItems = itemsData.create || itemsData;
        for (const itemData of createItems as any[]) {
          const oiStore = getStore('orderItem');
          const oiId = `mock-oi-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
          const oiItem = { ...itemData, id: oiId, orderId: id, createdAt: now };
          oiStore.set(oiId, oiItem);
        }
      }

      return item;
    },
    upsert: async (args: any) => {
      const store = getStore(model);
      const whereKey = Object.keys(args.where)[0];
      const whereVal = (args.where as any)[whereKey];
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
    updateMany: async (args: any) => {
      const store = getStore(model);
      if (args?.where) {
        for (const [, item] of store) {
          let match = true;
          for (const [key, val] of Object.entries(args.where)) {
            if (key === 'OR') continue;
            if (!isMatch(item, key, val)) { match = false; break; }
          }
          if (match && args.data) {
            for (const [dk, dv] of Object.entries(args.data)) {
              (item as any)[dk] = dv;
            }
          }
        }
      }
      return { count: 0 };
    },
    deleteMany: async (args: any) => {
      const store = getStore(model);
      if (args?.where) {
        for (const [key, val] of Object.entries(args.where)) {
          for (const [id, item] of store) {
            if ((item as any)[key] === val) store.delete(id);
          }
        }
      }
      return { count: 0 };
    },
    delete: async (args: any) => {
      const store = getStore(model);
      const item = store.get(args.where.id);
      store.delete(args.where.id);
      return item;
    },
    update: async (args: any) => {
      const store = getStore(model);
      const whereKey = Object.keys(args.where)[0];
      const whereVal = (args.where as any)[whereKey];
      let item: any;
      if (whereKey === 'id') {
        item = store.get(whereVal);
      } else {
        item = findInStore(store, { [whereKey]: whereVal });
      }
      if (item) {
        for (const [key, val] of Object.entries(args.data)) {
          if (typeof val === 'object' && val !== null && 'decrement' in val) {
            item[key] = (item[key] || 0) - (val as any).decrement;
          } else if (typeof val === 'object' && val !== null && 'increment' in val) {
            item[key] = (item[key] || 0) + (val as any).increment;
          } else {
            item[key] = val;
          }
        }
        item.updatedAt = new Date();
      }
      return item;
    },
    count: async (args?: any) => {
      const store = getStore(model);
      if (args?.where) {
        let count = 0;
        for (const [, item] of store) {
          if (findInStore(store, args.where)) count++;
        }
        return count;
      }
      return store.size;
    },
    aggregate: async (args?: any) => {
      const store = getStore(model);
      let items = Array.from(store.values());
      if (args?.where) {
        items = items.filter((item: any) => {
          for (const [key, val] of Object.entries(args.where)) {
            if (!isMatch(item, key, val)) return false;
          }
          return true;
        });
      }
      const result: any = { _avg: {}, _count: items.length };
      if (args?._avg) {
        for (const field of Object.keys(args._avg)) {
          const vals = items.map((i: any) => Number(i[field])).filter((v: any) => !isNaN(v));
          result._avg[field] = vals.length > 0 ? vals.reduce((a: number, b: number) => a + b, 0) / vals.length : null;
        }
      }
      return result;
    },
    groupBy: async (args?: any) => {
      const store = getStore(model);
      let items = Array.from(store.values());
      const byField = args?.by?.[0];
      if (!byField) return [];
      const groups = new Map<any, any[]>();
      for (const item of items) {
        const key = (item as any)[byField];
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key)!.push(item);
      }
      const result: any[] = [];
      for (const [key, groupItems] of groups) {
        const entry: any = { [byField]: key, _avg: {}, _count: groupItems.length };
        if (args?._avg) {
          for (const field of Object.keys(args._avg)) {
            const vals = groupItems.map((i: any) => Number(i[field])).filter((v: any) => !isNaN(v));
            entry._avg[field] = vals.length > 0 ? vals.reduce((a: number, b: number) => a + b, 0) / vals.length : null;
          }
        }
        result.push(entry);
      }
      return result;
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
    review: mockQuery('review'),
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
