'use client';

import { useState } from 'react';
import { Product } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { validators } from '@/lib/validators';

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (product: Omit<Product, 'id' | 'createdAt'>) => Promise<void>;
}

export const ProductForm = ({ isOpen, onClose, onSubmit }: ProductFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    stock: 0,
    price: 0,
    cost: 0,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!validators.productName(formData.name)) {
      newErrors.name = 'Nombre requerido';
    }
    if (!validators.stock(formData.stock)) {
      newErrors.stock = 'Stock inválido';
    }
    if (!validators.price(formData.price)) {
      newErrors.price = 'Precio inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setIsLoading(true);
      await onSubmit({
        name: formData.name,
        stock: formData.stock,
        price: formData.price,
        cost: formData.cost || undefined,
      });

      setFormData({ name: '', stock: 0, price: 0, cost: 0 });
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      title="Crear Producto"
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
      <div className="space-y-3">
        <Input
          label="Nombre*"
          value={formData.name}
          onChange={e => handleChange('name', e.target.value)}
          error={errors.name}
          placeholder="Ej: Bebida Energética"
          fullWidth
        />
        <Input
          label="Stock*"
          type="number"
          value={formData.stock}
          onChange={e => handleChange('stock', parseInt(e.target.value) || 0)}
          error={errors.stock}
          fullWidth
        />
        <Input
          label="Precio Unitario*"
          type="number"
          value={formData.price}
          onChange={e => handleChange('price', parseFloat(e.target.value) || 0)}
          error={errors.price}
          placeholder="0.00"
          step="0.01"
          fullWidth
        />
        <Input
          label="Costo (opcional)"
          type="number"
          value={formData.cost}
          onChange={e => handleChange('cost', parseFloat(e.target.value) || 0)}
          placeholder="0.00"
          step="0.01"
          fullWidth
        />
      </div>
    </Modal>
  );
};
