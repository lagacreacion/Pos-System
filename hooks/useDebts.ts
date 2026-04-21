'use client';

import { useState, useEffect } from 'react';
import { Debt } from '@/types';
import { debtService } from '@/services/debtService';
import { useAuth } from './useAuth';

export const useDebts = () => {
  const [debts, setDebts] = useState<Debt[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDebts = async (silent = false) => {
    if (!silent) setLoading(true);
    setError(null);
    try {
      const data = await debtService.getAll();
      setDebts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar deudas');
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchDebts();
    }
  }, [user]);

  const createDebt = async (debt: Omit<Debt, 'id' | 'createdAt' | 'paidAmount' | 'status'>, initialPayment: number = 0) => {
    try {
      setError(null);
      const id = await debtService.create(debt, initialPayment);
      await fetchDebts(true);
      return id;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al crear deuda';
      setError(message);
      throw err;
    }
  };

  const addPayment = async (debtId: string, amount: number, note?: string) => {
    try {
      setError(null);
      await debtService.addPayment(debtId, amount, note);
      await fetchDebts(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al registrar abono';
      setError(message);
      throw err;
    }
  };

  const getPayments = async (debtId: string) => {
    try {
      setError(null);
      return await debtService.getPayments(debtId);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cargar abonos';
      setError(message);
      throw err;
    }
  };

  const markAsPaid = async (id: string) => {
    try {
      setError(null);
      await debtService.markAsPaid(id);
      await fetchDebts(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al liquidar deuda';
      setError(message);
      throw err;
    }
  };

  const deleteDebt = async (id: string) => {
    try {
      setError(null);
      await debtService.delete(id);
      await fetchDebts(true);
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
    addPayment,
    getPayments,
    markAsPaid,
    deleteDebt,
  };
};
