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
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    <div className="space-y-3">
      {selectedCustomer ? (
        <div className="bg-blue-600 p-4 rounded-xl shadow-md flex justify-between items-center animate-in zoom-in-95 duration-200">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-white mr-3">
              👤
            </div>
            <div>
              <span className="block font-black text-white">{selectedCustomer.name}</span>
              <span className="block text-[10px] text-blue-100 uppercase font-black tracking-widest">Cliente Seleccionado</span>
            </div>
          </div>
          <button
            onClick={() => onSelect(null)}
            className="bg-white text-blue-600 px-3 py-1.5 rounded-lg text-xs font-black shadow-sm active:translate-y-0.5 transition-all"
          >
            CAMBIAR
          </button>
        </div>
      ) : (
        <div className="space-y-3 p-1">
          <Input
            placeholder="🔍 Buscar cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-gray-50 border-gray-100 h-10 text-sm"
            fullWidth
          />
          <div className="relative group">
            <select
              onChange={e => {
                const customer = customers.find(c => c.id === e.target.value);
                if (customer) onSelect(customer);
              }}
              className="w-full h-14 bg-white border-2 border-gray-100 rounded-xl px-4 appearance-none font-bold text-gray-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all shadow-sm"
              defaultValue=""
            >
              <option value="" disabled>👥 Seleccionar cliente...</option>
              {filteredCustomers.map(customer => (
                <option key={customer.id} value={customer.id}>
                  {customer.name} {customer.totalDebt > 0 ? `(Debe: $${customer.totalDebt})` : ''}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="w-full h-12 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center gap-2 text-gray-500 font-bold hover:bg-gray-100 hover:border-gray-300 transition-all active:scale-95"
          >
            <span className="text-xl">+</span>
            <span>Nuevo Cliente</span>
          </button>
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
