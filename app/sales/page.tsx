'use client';

import { useState } from 'react';
import { Alert } from '@/components/ui/Alert';
import { SalesForm } from '@/components/Sales/SalesForm';
import { useProducts } from '@/hooks/useProducts';
import { usePromotions } from '@/hooks/usePromotions';
import { useCustomers } from '@/hooks/useCustomers';
import { useSales } from '@/hooks/useSales';
import { useDebts } from '@/hooks/useDebts';
import { CartItem } from '@/types';

export default function SalesPage() {
  const { products, loading: loadingProducts } = useProducts();
  const { promotions } = usePromotions();
  const { customers, createCustomer } = useCustomers();
  const { createSale } = useSales();
  const { createDebt } = useDebts();
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleCreateCustomer = async (name: string, phone?: string) => {
    try {
      await createCustomer({ name, phone });
    } catch (error) {
      setAlert({
        type: 'error',
        message: error instanceof Error ? error.message : 'Error al crear cliente',
      });
    }
  };

  const handleCreateSale = async (
    items: CartItem[],
    paymentMethod: 'cash' | 'transfer' | 'credit',
    customerId?: string,
    dueDate?: Date
  ) => {
    try {
      const saleId = await createSale({
        customerId,
        items,
        totalAmount: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
        paymentMethod,
        date: new Date(),
      });

      // If credit, create debt
      if (paymentMethod === 'credit' && customerId && dueDate) {
        await createDebt({
          customerId,
          saleId,
          amount: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
          dueDate,
          status: 'pending',
        });
      }

      setAlert({ type: 'success', message: 'Venta registrada correctamente' });
      setTimeout(() => setAlert(null), 3000);
    } catch (error) {
      setAlert({
        type: 'error',
        message: error instanceof Error ? error.message : 'Error al crear venta',
      });
    }
  };

  if (loadingProducts) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-400 font-bold animate-pulse">Cargando productos...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-20 lg:pb-0">
      <div>
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">Venta Principal</h1>
        <p className="text-gray-500 font-medium text-sm">Realiza ventas rápidas y eficientes</p>
      </div>

      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      <SalesForm
        products={products}
        promotions={promotions}
        customers={customers}
        onCreateSale={handleCreateSale}
        onCreateCustomer={handleCreateCustomer}
      />
    </div>
  );
}
