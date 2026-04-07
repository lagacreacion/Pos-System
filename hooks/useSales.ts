'use client';

import { useState } from 'react';
import { Sale } from '@/types';
import { salesService } from '@/services/salesService';

export const useSales = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createSale = async (sale: Omit<Sale, 'id'>) => {
    try {
      setError(null);
      setLoading(true);
      const id = await salesService.create(sale);
      return id;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al crear venta';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getSalesByCustomer = async (customerId: string) => {
    try {
      setError(null);
      setLoading(true);
      const sales = await salesService.getByCustomer(customerId);
      return sales;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cargar ventas';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteSale = async (sale: Sale) => {
    try {
      setError(null);
      setLoading(true);
      await salesService.delete(sale);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al eliminar venta';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    createSale,
    getSalesByCustomer,
    deleteSale,
  };
};
