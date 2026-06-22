import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { api } from '../services/api';

interface Product {
  id: string;
  title: string;
  price: number;
  quantity: number;
  category: string;
  imageUrl?: string;
  farmer?: { name: string; email?: string };
  location?: { address: string; lat: number; lng: number };
}

interface ProductFilters {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
}

interface ProductContextType {
  products: Product[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  totalPages: number;
  filters: ProductFilters;
  setFilters: (f: ProductFilters) => void;
  fetchProducts: (coords?: { lat: number; lng: number }, pageNum?: number) => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState<ProductFilters>({});
  const filtersRef = useRef(filters);
  useEffect(() => { filtersRef.current = filters; }, [filters]);

  const fetchProducts = useCallback(async (coords?: { lat: number; lng: number }, pageNum = 1) => {
    setLoading(true);
    setError(null);
    try {
      const f = filtersRef.current;
      let url = `/products?page=${pageNum}&limit=50`;
      if (coords) url += `&lat=${coords.lat}&lng=${coords.lng}`;
      if (f.search) url += `&search=${encodeURIComponent(f.search)}`;
      if (f.category) url += `&category=${encodeURIComponent(f.category)}`;
      if (f.minPrice !== undefined) url += `&minPrice=${f.minPrice}`;
      if (f.maxPrice !== undefined) url += `&maxPrice=${f.maxPrice}`;
      if (f.sort) url += `&sort=${f.sort}`;
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
    } catch (err: any) {
      console.error('Failed to fetch products', err);
      setError(err.userMessage || 'Failed to load products. Please check your connection.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  return (
    <ProductContext.Provider value={{ products, loading, error, total, page, totalPages, filters, setFilters, fetchProducts }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) throw new Error('useProducts must be used within a ProductProvider');
  return context;
};
