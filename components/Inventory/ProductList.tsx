'use client';

import { Product } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';

interface ProductListProps {
  products: Product[];
  onDelete: (id: string) => Promise<void>;
  onEdit?: (product: Product) => void;
}

export const ProductList = ({ products, onDelete, onEdit }: ProductListProps) => {
  return (
    <div>
      {/* Desktop View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Producto</th>
              <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Stock</th>
              <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Precio Venta</th>
              <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Costo</th>
              <th className="px-6 py-4 text-center text-xs font-black text-gray-400 uppercase tracking-widest">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map(product => (
              <tr key={product.id} className="hover:bg-blue-50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="font-bold text-gray-900">{product.name}</div>
                  <div className="text-[10px] text-gray-400">{formatDate(product.createdAt)}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-black ${
                    product.stock < 5 ? 'bg-red-100 text-red-700 animate-pulse' : 'bg-green-100 text-green-700'
                  }`}>
                    {product.stock} u.
                  </span>
                </td>
                <td className="px-6 py-4 font-black text-blue-600">{formatCurrency(product.price)}</td>
                <td className="px-6 py-4 text-gray-500 font-medium">{product.cost ? formatCurrency(product.cost) : '-'}</td>
                <td className="px-6 py-4 text-center space-x-2">
                  <button
                    onClick={() => onEdit?.(product)}
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                    title="Editar"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => onDelete(product.id)}
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
      <div className="lg:hidden space-y-4">
        {products.map(product => (
          <div key={product.id} className="bg-white p-5 rounded-2xl border-2 border-gray-50 shadow-sm transition-all active:scale-[0.98]">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-black text-gray-900 leading-tight">{product.name}</h3>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Creado el {formatDate(product.createdAt)}
                </span>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-black ${
                product.stock < 5 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
              }`}>
                {product.stock} en stock
              </span>
            </div>

            <div className="flex justify-between items-end pt-4 border-t border-gray-50">
              <div>
                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Precio Venta</div>
                <div className="text-xl font-black text-blue-600">{formatCurrency(product.price)}</div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onEdit?.(product)}
                  className="bg-blue-50 text-blue-600 p-3 rounded-xl font-black flex items-center gap-2 active:bg-blue-100 transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  <span className="text-sm">Gestionar</span>
                </button>
                <button
                  onClick={() => onDelete(product.id)}
                  className="bg-red-50 text-red-600 p-3 rounded-xl active:bg-red-100 transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
