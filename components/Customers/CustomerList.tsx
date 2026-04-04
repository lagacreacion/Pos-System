'use client';

import { Customer } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface CustomerListProps {
  customers: Customer[];
  onDelete: (id: string) => Promise<void>;
  onEdit: (customer: Customer) => void;
}

export const CustomerList = ({ customers, onDelete, onEdit }: CustomerListProps) => {
  return (
    <div>
      {/* Desktop View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Nombre</th>
              <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Teléfono</th>
              <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Deuda</th>
              <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Total Gastado</th>
              <th className="px-6 py-4 text-center text-xs font-black text-gray-400 uppercase tracking-widest">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {customers.map(customer => (
              <tr key={customer.id} className="hover:bg-blue-50 transition-colors group">
                <td className="px-6 py-4 font-bold text-gray-900">{customer.name}</td>
                <td className="px-6 py-4 text-gray-600">{customer.phone || '-'}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-black ${
                    customer.totalDebt > 0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {formatCurrency(customer.totalDebt)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="font-black text-blue-600">
                    {formatCurrency(customer.totalSpent || 0)}
                  </span>
                </td>
                <td className="px-6 py-4 text-center space-x-2">
                  <button
                    onClick={() => onEdit(customer)}
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                    title="Editar"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => onDelete(customer.id)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                    title="Eliminar"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
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
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-black text-gray-900 truncate">{customer.name}</h3>
                <p className="text-gray-500 font-medium text-sm">{customer.phone || 'Sin teléfono'}</p>
              </div>
              <div className="flex gap-1 shrink-0 ml-2">
                <button
                  onClick={() => onEdit(customer)}
                  className="bg-blue-50 text-blue-600 p-2.5 rounded-xl active:bg-blue-100 transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </button>
                <button
                  onClick={() => onDelete(customer.id)}
                  className="bg-red-50 text-red-500 p-2.5 rounded-xl active:bg-red-100 transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
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
