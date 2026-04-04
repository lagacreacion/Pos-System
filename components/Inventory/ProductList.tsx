'use client';

import { Product } from '@/types';
import { Button } from '@/components/ui/Button';
import { formatCurrency, formatDate } from '@/lib/utils';

interface ProductListProps {
  products: Product[];
  onDelete: (id: string) => Promise<void>;
  onEdit?: (product: Product) => void;
}

export const ProductList = ({ products, onDelete, onEdit }: ProductListProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-semibold">Nombre</th>
            <th className="px-4 py-2 text-left text-sm font-semibold">Stock</th>
            <th className="px-4 py-2 text-left text-sm font-semibold">Precio</th>
            <th className="px-4 py-2 text-left text-sm font-semibold">Costo</th>
            <th className="px-4 py-2 text-left text-sm font-semibold">Creado</th>
            <th className="px-4 py-2 text-center text-sm font-semibold">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id} className="border-t hover:bg-gray-50">
              <td className="px-4 py-2">{product.name}</td>
              <td className="px-4 py-2">
                <span
                  className={`px-2 py-1 rounded text-sm font-medium ${
                    product.stock < 5
                      ? 'bg-red-100 text-red-800'
                      : 'bg-green-100 text-green-800'
                  }`}
                >
                  {product.stock}
                </span>
              </td>
              <td className="px-4 py-2">{formatCurrency(product.price)}</td>
              <td className="px-4 py-2">
                {product.cost ? formatCurrency(product.cost) : '-'}
              </td>
              <td className="px-4 py-2 text-sm text-gray-600">
                {formatDate(product.createdAt)}
              </td>
              <td className="px-4 py-2 text-center space-x-2">
                {onEdit && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onEdit(product)}
                  >
                    Editar
                  </Button>
                )}
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => onDelete(product.id)}
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
