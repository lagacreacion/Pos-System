'use client';

import { useState, useEffect } from 'react';
import { Customer } from '@/types';
import { customerService } from '@/services/customerService';

export const useCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await customerService.getAll();
      setCustomers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar clientes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const createCustomer = async (customer: Omit<Customer, 'id' | 'createdAt' | 'totalDebt' | 'totalSpent'>) => {
    try {
      setError(null);
      const id = await customerService.create(customer);
      const newCustomer = { ...customer, id, totalDebt: 0, totalSpent: 0, createdAt: new Date() };
      setCustomers([...customers, newCustomer]);
      return id;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al crear cliente';
      setError(message);
      throw err;
    }
  };

  const updateCustomer = async (id: string, updates: Partial<Customer>) => {
    try {
      setError(null);
      await customerService.update(id, updates);
      setCustomers(
        customers.map(c => (c.id === id ? { ...c, ...updates } : c))
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al actualizar cliente';
      setError(message);
      throw err;
    }
  };

  const deleteCustomer = async (id: string) => {
    try {
      setError(null);
      await customerService.delete(id);
      setCustomers(customers.filter(c => c.id !== id));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al eliminar cliente';
      setError(message);
      throw err;
    }
  };

  return {
    customers,
    loading,
    error,
    fetchCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer,
  };
};
