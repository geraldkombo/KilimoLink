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
  fetchProducts: (coords?: { lat: number; lng: number }) => Promise<void>;
  searchProducts: (query: string) => Product[];
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async (coords?: { lat: number; lng: number }) => {
    setLoading(true);
    setError(null);
    try {
      const url = coords ? `/products?lat=${coords.lat}&lng=${coords.lng}` : '/products';
      const res = await api.get(url);
      setProducts(res.data);
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
    <ProductContext.Provider value={{ products, loading, error, fetchProducts, searchProducts }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) throw new Error('useProducts must be used within a ProductProvider');
  return context;
};
