'use client';

import { Product } from '@/types';
import { Alert } from '@/components/ui/Alert';

interface StockAlertProps {
  products: Product[];
}

export const StockAlert = ({ products }: StockAlertProps) => {
  const lowStockProducts = products.filter(p => p.stock < 5 && p.stock > 0);
  const outOfStockProducts = products.filter(p => p.stock === 0);

  if (lowStockProducts.length === 0 && outOfStockProducts.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      {lowStockProducts.length > 0 && (
        <Alert
          type="warning"
          message={`⚠️ ${lowStockProducts.length} producto(s) con bajo stock (< 5 unidades)`}
        />
      )}
      {outOfStockProducts.length > 0 && (
        <Alert
          type="error"
          message={`❌ ${outOfStockProducts.length} producto(s) sin stock`}
        />
      )}
    </div>
  );
};
