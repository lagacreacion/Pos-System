'use client';

import { CartItem } from '@/types';
import { Button } from '@/components/ui/Button';
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
    <div className="space-y-4">
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {items.map((item, index) => (
          <div
            key={index}
            className="bg-gray-50 p-3 rounded border border-gray-200 flex justify-between items-center"
          >
            <div className="flex-1">
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-gray-600">
                {formatCurrency(item.price)} x {item.quantity} = {' '}
                {formatCurrency(item.price * item.quantity)}
              </p>
            </div>
            <div className="flex gap-2">
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={e =>
                  onQuantityChange(index, parseInt(e.target.value) || 1)
                }
                className="w-12 border border-gray-300 rounded px-2 py-1 text-center"
              />
              <Button
                variant="danger"
                size="sm"
                onClick={() => onRemove(index)}
              >
                ✕
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t-2 pt-4">
        <div className="flex justify-between items-center text-lg font-bold">
          <span>Total:</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </div>
    </div>
  );
};
