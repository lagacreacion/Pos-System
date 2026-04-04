'use client';

import { Customer } from '@/types';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';

interface CustomerListProps {
  customers: Customer[];
  onDelete: (id: string) => Promise<void>;
}

export const CustomerList = ({ customers, onDelete }: CustomerListProps) => {
  return (
    <div>
      {/* Desktop View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold">Nombre</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Teléfono</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Deuda Total</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Total Gastado</th>
              <th className="px-4 py-2 text-center text-sm font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {customers.map(customer => (
              <tr key={customer.id} className="border-t hover:bg-gray-50 transition-colors">
                <td className="px-4 py-4 font-bold text-gray-900">{customer.name}</td>
                <td className="px-4 py-4 text-gray-600">{customer.phone || '-'}</td>
                <td className="px-4 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-black ${
                    customer.totalDebt > 0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {formatCurrency(customer.totalDebt)}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className="font-black text-blue-600">
                    {formatCurrency(customer.totalSpent || 0)}
                  </span>
                </td>
                <td className="px-4 py-4 text-center space-x-2">
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

      {/* Mobile View */}
      <div className="md:hidden space-y-4">
        {customers.map(customer => (
          <div key={customer.id} className="bg-white p-5 rounded-2xl border-2 border-gray-50 shadow-sm space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-black text-gray-900">{customer.name}</h3>
                <p className="text-gray-500 font-medium">{customer.phone || 'Sin teléfono'}</p>
              </div>
              <button
                onClick={() => onDelete(customer.id)}
                className="text-gray-300 hover:text-red-500 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-50">
              <div>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Deuda</span>
                <span className={`text-sm font-black ${customer.totalDebt > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {formatCurrency(customer.totalDebt)}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Total Gastado</span>
                <span className="text-sm font-black text-blue-600">
                  {formatCurrency(customer.totalSpent || 0)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
