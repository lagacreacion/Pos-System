'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';

interface PaymentMethodProps {
  onMethodSelect: (method: 'cash' | 'transfer' | 'credit', dueDate?: Date) => void;
}

export const PaymentMethod = ({ onMethodSelect }: PaymentMethodProps) => {
  const [selectedMethod, setSelectedMethod] = useState<'cash' | 'transfer' | 'credit' | null>(null);
  const [dueDate, setDueDate] = useState('');

  const handleMethodChange = (method: 'cash' | 'transfer' | 'credit') => {
    setSelectedMethod(method);
    if (method === 'credit' && dueDate) {
      onMethodSelect(method, new Date(dueDate));
    } else if (method !== 'credit') {
      onMethodSelect(method);
    }
  };

  const handleDueDateChange = (date: string) => {
    setDueDate(date);
    if (selectedMethod === 'credit') {
      onMethodSelect('credit', new Date(date));
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        Método de Pago
      </label>

      <div className="space-y-2">
        <label className="flex items-center p-3 border-2 border-gray-200 rounded cursor-pointer hover:bg-gray-50"
          style={{ borderColor: selectedMethod === 'cash' ? '#3b82f6' : undefined }}>
          <input
            type="radio"
            name="paymentMethod"
            value="cash"
            checked={selectedMethod === 'cash'}
            onChange={() => handleMethodChange('cash')}
            className="cursor-pointer"
          />
          <span className="ml-3 font-medium">💵 Efectivo</span>
        </label>

        <label className="flex items-center p-3 border-2 border-gray-200 rounded cursor-pointer hover:bg-gray-50"
          style={{ borderColor: selectedMethod === 'transfer' ? '#3b82f6' : undefined }}>
          <input
            type="radio"
            name="paymentMethod"
            value="transfer"
            checked={selectedMethod === 'transfer'}
            onChange={() => handleMethodChange('transfer')}
            className="cursor-pointer"
          />
          <span className="ml-3 font-medium">💳 Transferencia</span>
        </label>

        <label className="flex items-center p-3 border-2 border-gray-200 rounded cursor-pointer hover:bg-gray-50"
          style={{ borderColor: selectedMethod === 'credit' ? '#3b82f6' : undefined }}>
          <input
            type="radio"
            name="paymentMethod"
            value="credit"
            checked={selectedMethod === 'credit'}
            onChange={() => handleMethodChange('credit')}
            className="cursor-pointer"
          />
          <span className="ml-3 font-medium">📝 Crédito (Fiado)</span>
        </label>
      </div>

      {selectedMethod === 'credit' && (
        <Input
          label="Fecha límite de pago*"
          type="date"
          value={dueDate}
          onChange={e => handleDueDateChange(e.target.value)}
          fullWidth
        />
      )}
    </div>
  );
};
