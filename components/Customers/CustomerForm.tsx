'use client';

import { useState } from 'react';
import { Customer } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { validators } from '@/lib/validators';

interface CustomerFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (customer: Omit<Customer, 'id' | 'createdAt' | 'totalDebt'>) => Promise<void>;
}

export const CustomerForm = ({ isOpen, onClose, onSubmit }: CustomerFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!validators.customerName(formData.name)) {
      newErrors.name = 'Nombre requerido';
    }
    if (formData.phone && !validators.phone(formData.phone)) {
      newErrors.phone = 'Teléfono inválido';
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
        phone: formData.phone || undefined,
      });

      setFormData({ name: '', phone: '' });
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      title="Crear Cliente"
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
          placeholder="Ej: Juan Pérez"
          fullWidth
        />
        <Input
          label="Teléfono"
          value={formData.phone}
          onChange={e => handleChange('phone', e.target.value)}
          error={errors.phone}
          placeholder="Ej: 3001234567"
          fullWidth
        />
      </div>
    </Modal>
  );
};
