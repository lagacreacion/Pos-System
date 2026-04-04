'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/types';
import { productService } from '@/services/productService';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await productService.getAll();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar productos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const createProduct = async (product: Omit<Product, 'id' | 'createdAt'>) => {
    try {
      setError(null);
      const id = await productService.create(product);
      const newProduct = { ...product, id, createdAt: new Date() };
      setProducts([...products, newProduct]);
      return id;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al crear producto';
      setError(message);
      throw err;
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      setError(null);
      await productService.update(id, updates);
      setProducts(
        products.map(p => (p.id === id ? { ...p, ...updates } : p))
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al actualizar producto';
      setError(message);
      throw err;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      setError(null);
      await productService.delete(id);
      setProducts(products.filter(p => p.id !== id));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al eliminar producto';
      setError(message);
      throw err;
    }
  };

  const decrementStock = async (id: string, quantity: number) => {
    try {
      setError(null);
      const product = products.find(p => p.id === id);
      if (product && product.stock >= quantity) {
        await productService.decrementStock(id, quantity);
        setProducts(
          products.map(p =>
            p.id === id ? { ...p, stock: p.stock - quantity } : p
          )
        );
      } else {
        throw new Error('Stock insuficiente');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al actualizar stock';
      setError(message);
      throw err;
    }
  };

  return {
    products,
    loading,
    error,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    decrementStock,
  };
};
