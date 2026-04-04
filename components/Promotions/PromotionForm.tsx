'use client';

import { useState } from 'react';
import { Product, Promotion } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { validators } from '@/lib/validators';

interface PromotionFormProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSubmit: (promotion: Omit<Promotion, 'id' | 'createdAt'>) => Promise<void>;
}

export const PromotionForm = ({
  isOpen,
  onClose,
  products,
  onSubmit,
}: PromotionFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    finalPrice: 0,
    productIds: [] as string[],
  });
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleProductToggle = (productId: string) => {
    setFormData(prev => ({
      ...prev,
      productIds: prev.productIds.includes(productId)
        ? prev.productIds.filter(id => id !== productId)
        : [...prev.productIds, productId],
    }));
  };

  const handleQuantityChange = (productId: string, quantity: number) => {
    setQuantities(prev => ({ ...prev, [productId]: quantity }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!validators.promotionName(formData.name)) {
      newErrors.name = 'Nombre requerido';
    }
    if (!validators.price(formData.finalPrice)) {
      newErrors.finalPrice = 'Precio final inválido';
    }
    if (formData.productIds.length === 0) {
      newErrors.products = 'Selecciona al menos un producto';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setIsLoading(true);
      const promotionProducts = formData.productIds.map(productId => ({
        productId,
        quantity: quantities[productId] || 1,
      }));

      await onSubmit({
        name: formData.name,
        finalPrice: formData.finalPrice,
        products: promotionProducts,
      });

      setFormData({ name: '', finalPrice: 0, productIds: [] });
      setQuantities({});
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      title="Crear Promoción"
      onClose={onClose}
      actions={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" loading={isLoading} onClick={handleSubmit}>
            Crear
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Input
          label="Nombre de Promoción*"
          value={formData.name}
          onChange={e => handleChange('name', e.target.value)}
          error={errors.name}
          placeholder="Ej: Combo X2"
          fullWidth
        />

        <Input
          label="Precio Final*"
          type="number"
          value={formData.finalPrice}
          onChange={e => handleChange('finalPrice', parseFloat(e.target.value) || 0)}
          error={errors.finalPrice}
          placeholder="0.00"
          step="0.01"
          fullWidth
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Productos* {errors.products && <span className="text-red-500">{errors.products}</span>}
          </label>
          <div className="max-h-40 overflow-y-auto space-y-2">
            {products.map(product => (
              <div key={product.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.productIds.includes(product.id)}
                  onChange={() => handleProductToggle(product.id)}
                  className="cursor-pointer"
                />
                <span className="flex-1">{product.name}</span>
                {formData.productIds.includes(product.id) && (
                  <input
                    type="number"
                    min="1"
                    value={quantities[product.id] || 1}
                    onChange={e =>
                      handleQuantityChange(product.id, parseInt(e.target.value) || 1)
                    }
                    className="w-16 border border-gray-300 rounded px-2 py-1 text-center"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};
