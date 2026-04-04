'use client';

import { Analytics as AnalyticsType } from '@/types';
import { Card } from '@/components/ui/Card';
import { formatCurrency } from '@/lib/utils';

interface AnalyticsProps {
  data: AnalyticsType | null;
  isLoading: boolean;
}

export const Analytics = ({ data, isLoading }: AnalyticsProps) => {
  if (isLoading) {
    return <div className="text-center py-8">Cargando analíticas...</div>;
  }

  if (!data) {
    return <div className="text-center py-8 text-gray-500">No hay datos disponibles</div>;
  }

  return (
    <div className="space-y-4">
      <Card title="Ingresos Totales">
        <div className="text-4xl font-bold text-blue-600">
          {formatCurrency(data.totalRevenue)}
        </div>
      </Card>

      <Card title="Top 5 Productos Más Vendidos">
        {data.topProducts.length === 0 ? (
          <div className="text-gray-500">Sin datos</div>
        ) : (
          <div className="space-y-2">
            {data.topProducts.map((product, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="font-medium">{product.name}</span>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded">
                  {product.quantity} unidades
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card title="Top 5 Productos Menos Vendidos">
        {data.bottomProducts.length === 0 ? (
          <div className="text-gray-500">Sin datos</div>
        ) : (
          <div className="space-y-2">
            {data.bottomProducts.map((product, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="font-medium">{product.name}</span>
                <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded">
                  {product.quantity} unidades
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card title="Top 5 Clientes">
        {data.topCustomers.length === 0 ? (
          <div className="text-gray-500">Sin datos</div>
        ) : (
          <div className="space-y-2">
            {data.topCustomers.map((customer, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="font-medium">{customer.name}</span>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded">
                  {formatCurrency(customer.totalSpent)}
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};
