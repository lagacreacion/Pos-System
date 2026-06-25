'use client';

import { Promotion, Product } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface PromotionListProps {
  promotions: Promotion[];
  onDelete: (id: string) => Promise<void>;
  products?: Product[];
}

export const PromotionList = ({ promotions, onDelete, products = [] }: PromotionListProps) => {
  const nameOf = (id: string) => products.find(p => p.id === id)?.name ?? 'Producto';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {promotions.map(promotion => (
        <div
          key={promotion.id}
          className="relative flex flex-col p-5 rounded-3xl bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-100 shadow-sm"
        >
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-9 h-9 shrink-0 rounded-2xl bg-white/70 flex items-center justify-center text-lg">✨</span>
              <h3 className="font-black text-purple-900 leading-tight truncate">{promotion.name}</h3>
            </div>
            <button
              onClick={() => onDelete(promotion.id)}
              className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full text-purple-300 hover:text-red-500 hover:bg-white/60 transition-colors"
              aria-label="Eliminar promoción"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5 mb-4">
            {promotion.products.map((p, i) => (
              <span key={i} className="text-[11px] font-bold bg-white/70 text-purple-700 px-2 py-1 rounded-full">
                {p.quantity}× {nameOf(p.productId)}
              </span>
            ))}
          </div>

          <div className="mt-auto pt-3 border-t border-purple-100">
            <span className="block text-[10px] font-black text-purple-400 uppercase tracking-widest">Precio combo</span>
            <span className="text-2xl font-black text-purple-700">{formatCurrency(promotion.finalPrice)}</span>
          </div>
        </div>
      ))}
    </div>
  );
};
