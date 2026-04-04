'use client';

import { useState } from 'react';
import { Customer } from '@/types';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';

interface CustomerSelectorProps {
  customers: Customer[];
  onSelect: (customer: Customer | null) => void;
  onCreateNew: (name: string, phone?: string) => Promise<void>;
  selectedCustomer: Customer | null;
}

export const CustomerSelector = ({
  customers,
  onSelect,
  onCreateNew,
  selectedCustomer,
}: CustomerSelectorProps) => {
  const [showModal, setShowModal] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCustomerPhone, setNewCustomerPhone] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateCustomer = async () => {
    try {
      setIsCreating(true);
      await onCreateNew(newCustomerName, newCustomerPhone);
      setNewCustomerName('');
      setNewCustomerPhone('');
      setShowModal(false);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Cliente (Opcional)
      </label>

      {selectedCustomer && (
        <div className="bg-blue-50 p-3 rounded border border-blue-200 flex justify-between items-center">
          <span className="font-medium">{selectedCustomer.name}</span>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onSelect(null)}
          >
            Cambiar
          </Button>
        </div>
      )}

      {!selectedCustomer && (
        <div className="space-y-2">
          <select
            onChange={e => {
              const customer = customers.find(c => c.id === e.target.value);
              if (customer) onSelect(customer);
            }}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="">Seleccionar cliente...</option>
            {customers.map(customer => (
              <option key={customer.id} value={customer.id}>
                {customer.name} - Deuda: ${customer.totalDebt}
              </option>
            ))}
          </select>

          <Button
            variant="secondary"
            size="sm"
            fullWidth
            onClick={() => setShowModal(true)}
          >
            + Crear Cliente
          </Button>
        </div>
      )}

      <Modal
        isOpen={showModal}
        title="Crear Nuevo Cliente"
        onClose={() => setShowModal(false)}
        actions={
          <>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
            <Button
              variant="primary"
              loading={isCreating}
              onClick={handleCreateCustomer}
            >
              Crear
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <Input
            label="Nombre*"
            value={newCustomerName}
            onChange={e => setNewCustomerName(e.target.value)}
            placeholder="Ej: Juan Pérez"
            fullWidth
          />
          <Input
            label="Teléfono"
            value={newCustomerPhone}
            onChange={e => setNewCustomerPhone(e.target.value)}
            placeholder="Ej: 3001234567"
            fullWidth
          />
        </div>
      </Modal>
    </div>
  );
};
