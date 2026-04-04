'use client';

import { CartItem } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface CartProps {
  items: CartItem[];
  onRemove: (index: number) => void;
  onQuantityChange: (index: number, quantity: number) => void;
}

export const Cart = ({ items, onRemove, onQuantityChange }: CartProps) => {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Carrito vacío
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1 custom-scrollbar">
        {items.map((item, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-xl border border-gray-100 flex flex-col gap-3 shadow-sm"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <p className="font-bold text-gray-800 leading-tight">{item.name}</p>
                <p className="text-xs font-bold text-blue-600 mt-1 uppercase tracking-wider">
                  {formatCurrency(item.price)} unidad
                </p>
              </div>
              <button
                onClick={() => onRemove(index)}
                className="text-gray-300 hover:text-red-500 transition-colors p-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            <div className="flex justify-between items-center bg-gray-50 rounded-lg p-2">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onQuantityChange(index, Math.max(1, item.quantity - 1))}
                  className="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 rounded-md shadow-sm active:bg-gray-100 font-black text-gray-600"
                >
                  -
                </button>
                <span className="w-10 text-center font-bold text-gray-700">{item.quantity}</span>
                <button
                  onClick={() => onQuantityChange(index, item.quantity + 1)}
                  className="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 rounded-md shadow-sm active:bg-gray-100 font-black text-gray-600"
                >
                  +
                </button>
              </div>
              <div className="text-right">
                <span className="text-sm font-black text-gray-900">
                  {formatCurrency(item.price * item.quantity)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gray-900 text-white p-4 rounded-xl shadow-lg mt-4">
        <div className="flex justify-between items-center text-lg font-black uppercase tracking-tight">
          <span className="text-gray-400 text-sm">Subtotal:</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </div>
    </div>
  );
};
