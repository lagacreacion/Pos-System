'use client';

import { useState } from 'react';
import { Alert } from '@/components/ui/Alert';
import { SalesForm } from '@/components/Sales/SalesForm';
import { Card } from '@/components/ui/Card';
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
    return <div className="text-center py-12">Cargando...</div>;
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Venta Principal (POS)</h1>
        <p className="text-gray-600">Realiza ventas rápidas y eficientes</p>
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
        onCreateCustomer={createCustomer}
      />
    </div>
  );
}
