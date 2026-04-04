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
  onSubmit: (customer: Omit<Customer, 'id' | 'createdAt' | 'totalDebt' | 'totalSpent'>) => Promise<void>;
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
      title="Nuevo Cliente"
      onClose={onClose}
      actions={
        <>
          <Button variant="secondary" onClick={onClose} className="rounded-xl">
            Cancelar
          </Button>
          <Button variant="primary" loading={isLoading} onClick={handleSubmit} className="rounded-xl px-10 font-black">
            REGISTRAR
          </Button>
        </>
      }
    >
      <div className="space-y-6 py-2">
        <div className="bg-blue-50 p-4 rounded-2xl flex items-center gap-3 border border-blue-100">
          <span className="text-2xl">👤</span>
          <div>
            <p className="text-sm font-black text-blue-900 uppercase tracking-tight">Registro de Cliente</p>
            <p className="text-xs text-blue-600 font-medium">Lleva el control de sus pagos y consumos</p>
          </div>
        </div>

        <Input
          label="Nombre Completo*"
          value={formData.name}
          onChange={e => handleChange('name', e.target.value)}
          error={errors.name}
          placeholder="Ej: Juan Pérez"
          fullWidth
          className="h-14 rounded-2xl border-2 border-gray-100 font-bold"
        />
        <Input
          label="Teléfono / WhatsApp"
          value={formData.phone}
          onChange={e => handleChange('phone', e.target.value)}
          error={errors.phone}
          placeholder="Ej: 3001234567"
          fullWidth
          className="h-14 rounded-2xl border-2 border-gray-100 font-bold"
        />
      </div>
    </Modal>
  );
};
