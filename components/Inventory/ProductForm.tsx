import { useState, useEffect } from 'react';
import { Product } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { validators } from '@/lib/validators';

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (product: Omit<Product, 'id' | 'createdAt'>) => Promise<void>;
  initialData?: Product | null;
}

export const ProductForm = ({ isOpen, onClose, onSubmit, initialData }: ProductFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    stock: 0,
    price: 0,
    cost: 0,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        stock: initialData.stock,
        price: initialData.price,
        cost: initialData.cost || 0,
      });
    } else {
      setFormData({ name: '', stock: 0, price: 0, cost: 0 });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!validators.productName(formData.name)) {
      newErrors.name = 'Nombre requerido';
    }
    if (formData.stock < 0) {
      newErrors.stock = 'Stock no puede ser negativo';
    }
    if (formData.price <= 0) {
      newErrors.price = 'Precio debe ser mayor a 0';
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
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      title={initialData ? 'Gestionar Producto' : 'Nuevo Producto'}
      onClose={onClose}
      actions={
        <>
          <Button variant="secondary" onClick={onClose} className="rounded-xl">
            Cancelar
          </Button>
          <Button variant="primary" loading={isLoading} onClick={handleSubmit} className="rounded-xl px-8 font-black">
            {initialData ? 'Actualizar' : 'Crear Producto'}
          </Button>
        </>
      }
    >
      <div className="space-y-6 py-2">
        <Input
          label="Nombre del Producto*"
          value={formData.name}
          onChange={e => handleChange('name', e.target.value)}
          error={errors.name}
          placeholder="Ej: Alfajor de Chocolate"
          fullWidth
          className="h-14 rounded-2xl border-2 border-gray-100 font-bold"
        />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Input
              label="Stock Actual*"
              type="number"
              value={formData.stock}
              onChange={e => handleChange('stock', parseInt(e.target.value) || 0)}
              error={errors.stock}
              fullWidth
              className="h-14 rounded-2xl border-2 border-gray-100 font-bold"
            />
            {initialData && (
              <p className="text-[10px] text-blue-600 font-black uppercase tracking-wider ml-1">
                Puedes sumar o restar directamente aquí
              </p>
            )}
          </div>
          
          <Input
            label="Precio de Venta*"
            type="number"
            value={formData.price}
            onChange={e => handleChange('price', parseFloat(e.target.value) || 0)}
            error={errors.price}
            placeholder="0.00"
            step="0.01"
            fullWidth
            className="h-14 rounded-2xl border-2 border-gray-100 font-bold"
          />
        </div>

        <Input
          label="Costo de Compra (Opcional)"
          type="number"
          value={formData.cost}
          onChange={e => handleChange('cost', parseFloat(e.target.value) || 0)}
          placeholder="0.00"
          step="0.01"
          fullWidth
          className="h-14 rounded-2xl border-2 border-gray-100 font-bold"
        />
      </div>
    </Modal>
  );
};
