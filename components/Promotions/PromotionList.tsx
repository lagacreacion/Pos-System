'use client';

import { Promotion } from '@/types';
import { Button } from '@/components/ui/Button';
import { formatCurrency, formatDate } from '@/lib/utils';

interface PromotionListProps {
  promotions: Promotion[];
  onDelete: (id: string) => Promise<void>;
}

export const PromotionList = ({ promotions, onDelete }: PromotionListProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-semibold">Nombre</th>
            <th className="px-4 py-2 text-left text-sm font-semibold">Productos</th>
            <th className="px-4 py-2 text-left text-sm font-semibold">Precio Final</th>
            <th className="px-4 py-2 text-left text-sm font-semibold">Creado</th>
            <th className="px-4 py-2 text-center text-sm font-semibold">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {promotions.map(promotion => (
            <tr key={promotion.id} className="border-t hover:bg-gray-50">
              <td className="px-4 py-2 font-medium">{promotion.name}</td>
              <td className="px-4 py-2 text-sm">
                {promotion.products.map(p => p.productId).join(', ')}
              </td>
              <td className="px-4 py-2 font-semibold text-green-600">
                {formatCurrency(promotion.finalPrice)}
              </td>
              <td className="px-4 py-2 text-sm text-gray-600">
                {formatDate(promotion.createdAt)}
              </td>
              <td className="px-4 py-2 text-center">
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => onDelete(promotion.id)}
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
