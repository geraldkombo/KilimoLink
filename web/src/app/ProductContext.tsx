import React, { createContext, useContext, useState, useCallback } from 'react';
import { api } from '../services/api';

interface Product {
  id: string;
  title: string;
  price: number;
  quantity: number;
  category: string;
  imageUrl?: string;
  location?: any;
}

interface ProductContextType {
  products: Product[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  totalPages: number;
  fetchProducts: (coords?: { lat: number; lng: number }, pageNum?: number) => Promise<void>;
  searchProducts: (query: string) => Product[];
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const fetchProducts = useCallback(async (coords?: { lat: number; lng: number }, pageNum = 1) => {
    setLoading(true);
    setError(null);
    try {
      let url = `/products?page=${pageNum}&limit=50`;
      if (coords) url += `&lat=${coords.lat}&lng=${coords.lng}`;
      const res = await api.get(url);
      const data = res.data;
      if (Array.isArray(data)) {
        setProducts(data);
        setTotal(data.length);
        setPage(1);
        setTotalPages(1);
      } else {
        setProducts(data.products || []);
        setTotal(data.total || 0);
        setPage(data.page || 1);
        setTotalPages(data.totalPages || 0);
      }
    } catch (err) {
      console.error('Failed to fetch products', err);
      setError('Failed to load products. Please check your connection.');
    } finally {
      setLoading(false);
    }
  }, []);

  const searchProducts = useCallback((query: string) => {
    if (!query) return products;
    const lowerQuery = query.toLowerCase();
    return products.filter(
      (p) =>
        p.title.toLowerCase().includes(lowerQuery) ||
        p.category.toLowerCase().includes(lowerQuery)
    );
  }, [products]);

  return (
    <ProductContext.Provider value={{ products, loading, error, total, page, totalPages, fetchProducts, searchProducts }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) throw new Error('useProducts must be used within a ProductProvider');
  return context;
};
