'use client';

import { useRef, useState } from 'react';
import { CartItem } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface CartProps {
  items: CartItem[];
  onRemove: (index: number) => void;
  onQuantityChange: (index: number, quantity: number) => void;
}

const haptic = (ms = 8) => {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) navigator.vibrate(ms);
};

/** Fila con deslizar-para-eliminar (touch) + boton eliminar visible. */
const CartRow = ({
  item,
  onRemove,
  onQuantityChange,
}: {
  item: CartItem;
  onRemove: () => void;
  onQuantityChange: (q: number) => void;
}) => {
  const [dragX, setDragX] = useState(0);
  const startX = useRef<number | null>(null);

  const onTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (startX.current === null) return;
    const dx = e.touches[0].clientX - startX.current;
    if (dx < 0) setDragX(Math.max(dx, -96));
  };
  const onTouchEnd = () => {
    if (dragX < -64) {
      haptic(12);
      onRemove();
    }
    setDragX(0);
    startX.current = null;
  };

  return (
    <div className="relative overflow-hidden rounded-2xl">
      {/* Fondo rojo revelado al deslizar */}
      <div className="absolute inset-0 bg-red-500 flex items-center justify-end pr-6">
        <span className="text-white font-bold text-sm">Eliminar</span>
      </div>

      <div
        className="relative bg-white p-3 border border-slate-100 flex items-center gap-3 rounded-2xl"
        style={{ transform: `translateX(${dragX}px)`, transition: startX.current === null ? 'transform .2s ease' : 'none' }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div className="flex-1 min-w-0">
          <p className="font-bold text-slate-800 leading-tight truncate">{item.name}</p>
          <p className="text-xs font-semibold text-slate-400 mt-0.5">{formatCurrency(item.price)} c/u</p>
        </div>

        {/* Stepper de cantidad */}
        <div className="flex items-center gap-1 bg-slate-100 rounded-full p-1 shrink-0">
          <button
            onClick={() => { haptic(); onQuantityChange(Math.max(1, item.quantity - 1)); }}
            className="w-9 h-9 flex items-center justify-center bg-white rounded-full shadow-sm active:scale-90 transition-transform text-lg font-black text-slate-600"
            aria-label="Disminuir"
          >
            &#8722;
          </button>
          <span className="w-8 text-center font-black text-slate-800 tabular-nums">{item.quantity}</span>
          <button
            onClick={() => { haptic(); onQuantityChange(item.quantity + 1); }}
            className="w-9 h-9 flex items-center justify-center bg-blue-600 text-white rounded-full shadow-sm active:scale-90 transition-transform text-lg font-black"
            aria-label="Aumentar"
          >
            +
          </button>
        </div>

        <div className="w-20 text-right shrink-0">
          <span className="text-sm font-black text-slate-900 tabular-nums">
            {formatCurrency(item.price * item.quantity)}
          </span>
        </div>

        {/* Eliminar directo (desktop / accesible) */}
        <button
          onClick={() => { haptic(12); onRemove(); }}
          className="w-8 h-8 shrink-0 flex items-center justify-center rounded-full text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors"
          aria-label="Quitar producto"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export const Cart = ({ items, onRemove, onQuantityChange }: CartProps) => {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-3xl mb-3">&#128722;</div>
        <p className="text-slate-400 font-semibold">Carrito vacio</p>
        <p className="text-slate-300 text-sm mt-1">Toca un producto para agregarlo</p>
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {items.map((item, index) => (
        <CartRow
          key={`${item.type}-${item.id}`}
          item={item}
          onRemove={() => onRemove(index)}
          onQuantityChange={(q) => onQuantityChange(index, q)}
        />
      ))}
      <p className="text-center text-[11px] text-slate-300 pt-1 lg:hidden">Desliza para eliminar</p>
    </div>
  );
};
