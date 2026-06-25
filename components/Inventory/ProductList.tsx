'use client';

import { Product } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface ProductListProps {
  products: Product[];
  onDelete: (id: string) => Promise<void>;
  onEdit?: (product: Product) => void;
  onAdjustStock?: (product: Product, delta: number) => void;
}

const haptic = (ms = 8) => {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) navigator.vibrate(ms);
};

const stockBadge = (stock: number) =>
  stock === 0
    ? 'bg-red-100 text-red-700'
    : stock < 5
    ? 'bg-amber-100 text-amber-700'
    : 'bg-emerald-100 text-emerald-700';

const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
  </svg>
);
const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
  </svg>
);

const StockStepper = ({ product, onAdjustStock }: { product: Product; onAdjustStock?: (p: Product, d: number) => void }) => {
  if (!onAdjustStock) {
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-black ${stockBadge(product.stock)}`}>{product.stock} u.</span>
    );
  }
  return (
    <div className="flex items-center gap-1 bg-slate-100 rounded-full p-1">
      <button
        onClick={() => { haptic(); onAdjustStock(product, -1); }}
        disabled={product.stock <= 0}
        className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm active:scale-90 transition-transform text-lg font-black text-slate-600 disabled:opacity-40"
        aria-label="Restar stock"
      >
        &#8722;
      </button>
      <span className={`min-w-[44px] text-center text-xs font-black px-2 py-1 rounded-full ${stockBadge(product.stock)}`}>
        {product.stock}
      </span>
      <button
        onClick={() => { haptic(); onAdjustStock(product, 1); }}
        className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded-full shadow-sm active:scale-90 transition-transform text-lg font-black"
        aria-label="Sumar stock"
      >
        +
      </button>
    </div>
  );
};

export const ProductList = ({ products, onDelete, onEdit, onAdjustStock }: ProductListProps) => {
  return (
    <div>
      {/* Desktop */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Producto</th>
              <th className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Stock</th>
              <th className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Precio Venta</th>
              <th className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Costo</th>
              <th className="px-6 py-4 text-center text-xs font-black text-slate-400 uppercase tracking-widest">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.map(product => (
              <tr key={product.id} className="hover:bg-blue-50/50 transition-colors">
                <td className="px-6 py-4 font-bold text-slate-900">{product.name}</td>
                <td className="px-6 py-4"><StockStepper product={product} onAdjustStock={onAdjustStock} /></td>
                <td className="px-6 py-4 font-black text-blue-600">{formatCurrency(product.price)}</td>
                <td className="px-6 py-4 text-slate-500 font-medium">{product.cost ? formatCurrency(product.cost) : '-'}</td>
                <td className="px-6 py-4 text-center space-x-2">
                  <button onClick={() => onEdit?.(product)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors" title="Editar"><EditIcon /></button>
                  <button onClick={() => onDelete(product.id)} className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors" title="Eliminar"><TrashIcon /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile */}
      <div className="lg:hidden space-y-3">
        {products.map(product => (
          <div key={product.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex justify-between items-start gap-3 mb-3">
              <h3 className="text-base font-black text-slate-900 leading-tight min-w-0">{product.name}</h3>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => onEdit?.(product)} className="bg-blue-50 text-blue-600 p-2.5 rounded-xl active:bg-blue-100 transition-colors"><EditIcon /></button>
                <button onClick={() => onDelete(product.id)} className="bg-red-50 text-red-500 p-2.5 rounded-xl active:bg-red-100 transition-colors"><TrashIcon /></button>
              </div>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-slate-50">
              <div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Precio</div>
                <div className="text-lg font-black text-blue-600">{formatCurrency(product.price)}</div>
              </div>
              <StockStepper product={product} onAdjustStock={onAdjustStock} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
