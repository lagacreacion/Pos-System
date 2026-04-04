'use client';

import { Customer } from '@/types';
import { Button } from '@/components/ui/Button';
import { formatCurrency, formatDate } from '@/lib/utils';

interface CustomerListProps {
  customers: Customer[];
  onDelete: (id: string) => Promise<void>;
  onViewDetails?: (customer: Customer) => void;
}

export const CustomerList = ({ customers, onDelete, onViewDetails }: CustomerListProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-semibold">Nombre</th>
            <th className="px-4 py-2 text-left text-sm font-semibold">Teléfono</th>
            <th className="px-4 py-2 text-left text-sm font-semibold">Deuda Total</th>
            <th className="px-4 py-2 text-center text-sm font-semibold">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {customers.map(customer => (
            <tr key={customer.id} className="border-t hover:bg-gray-50">
              <td className="px-4 py-2 font-medium">{customer.name}</td>
              <td className="px-4 py-2">{customer.phone || '-'}</td>
              <td className="px-4 py-2">
                <span
                  className={`font-semibold ${
                    customer.totalDebt > 0 ? 'text-red-600' : 'text-green-600'
                  }`}
                >
                  {formatCurrency(customer.totalDebt)}
                </span>
              </td>
              <td className="px-4 py-2 text-center space-x-2">
                {onViewDetails && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onViewDetails(customer)}
                  >
                    Ver Detalles
                  </Button>
                )}
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => onDelete(customer.id)}
                >
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
