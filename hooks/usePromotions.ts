'use client';

import { useState, useEffect } from 'react';
import { Promotion } from '@/types';
import { promotionService } from '@/services/promotionService';
import { useAuth } from './useAuth';

export const usePromotions = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPromotions = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await promotionService.getAll();
      setPromotions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar promociones');
    } finally {
      setLoading(false);
    }
  };

  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchPromotions();
    }
  }, [user]);

  const createPromotion = async (promotion: Omit<Promotion, 'id' | 'createdAt'>) => {
    try {
      setError(null);
      const id = await promotionService.create(promotion);
      const newPromotion = { ...promotion, id, createdAt: new Date() };
      setPromotions([...promotions, newPromotion]);
      return id;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al crear promoción';
      setError(message);
      throw err;
    }
  };

  const updatePromotion = async (id: string, updates: Partial<Promotion>) => {
    try {
      setError(null);
      await promotionService.update(id, updates);
      setPromotions(
        promotions.map(p => (p.id === id ? { ...p, ...updates } : p))
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al actualizar promoción';
      setError(message);
      throw err;
    }
  };

  const deletePromotion = async (id: string) => {
    try {
      setError(null);
      await promotionService.delete(id);
      setPromotions(promotions.filter(p => p.id !== id));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al eliminar promoción';
      setError(message);
      throw err;
    }
  };

  return {
    promotions,
    loading,
    error,
    fetchPromotions,
    createPromotion,
    updatePromotion,
    deletePromotion,
  };
};
