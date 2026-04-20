'use client';

import { useState, useEffect } from 'react';
import { Debt } from '@/types';
import { debtService } from '@/services/debtService';
import { useAuth } from './useAuth';

export const useDebts = () => {
  const [debts, setDebts] = useState<Debt[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDebts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await debtService.getAll();
      setDebts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar deudas');
    } finally {
      setLoading(false);
    }
  };

  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchDebts();
    }
  }, [user]);

  const createDebt = async (debt: Omit<Debt, 'id' | 'createdAt'>) => {
    try {
      setError(null);
      const id = await debtService.create(debt);
      const newDebt = { ...debt, id, createdAt: new Date() };
      setDebts([...debts, newDebt]);
      return id;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al crear deuda';
      setError(message);
      throw err;
    }
  };

  const markAsPaid = async (id: string) => {
    try {
      setError(null);
      await debtService.markAsPaid(id);
      setDebts(
        debts.map(d => (d.id === id ? { ...d, status: 'paid' } : d))
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al marcar como pagado';
      setError(message);
      throw err;
    }
  };

  const deleteDebt = async (id: string) => {
    try {
      setError(null);
      await debtService.delete(id);
      setDebts(debts.filter(d => d.id !== id));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al eliminar deuda';
      setError(message);
      throw err;
    }
  };

  return {
    debts,
    loading,
    error,
    fetchDebts,
    createDebt,
    markAsPaid,
    deleteDebt,
  };
};
