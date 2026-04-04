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
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-2">
        <button
          type="button"
          onClick={() => handleMethodChange('cash')}
          className={`flex items-center p-4 border-2 rounded-xl transition-all ${
            selectedMethod === 'cash'
              ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-600 ring-opacity-20'
              : 'border-gray-100 hover:border-gray-300 bg-white'
          }`}
        >
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl shrink-0 ${
            selectedMethod === 'cash' ? 'bg-blue-600' : 'bg-gray-100'
          }`}>
            💵
          </div>
          <div className="ml-4 text-left">
            <div className={`font-bold ${selectedMethod === 'cash' ? 'text-blue-900' : 'text-gray-700'}`}>Efectivo</div>
            <div className="text-xs text-gray-500 font-medium">Pago inmediato</div>
          </div>
          {selectedMethod === 'cash' && (
            <div className="ml-auto text-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </button>

        <button
          type="button"
          onClick={() => handleMethodChange('transfer')}
          className={`flex items-center p-4 border-2 rounded-xl transition-all ${
            selectedMethod === 'transfer'
              ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-600 ring-opacity-20'
              : 'border-gray-100 hover:border-gray-300 bg-white'
          }`}
        >
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl shrink-0 ${
            selectedMethod === 'transfer' ? 'bg-blue-600' : 'bg-gray-100'
          }`}>
            💳
          </div>
          <div className="ml-4 text-left">
            <div className={`font-bold ${selectedMethod === 'transfer' ? 'text-blue-900' : 'text-gray-700'}`}>Transferencia</div>
            <div className="text-xs text-gray-500 font-medium">Mercado Pago / Banco</div>
          </div>
          {selectedMethod === 'transfer' && (
            <div className="ml-auto text-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </button>

        <button
          type="button"
          onClick={() => handleMethodChange('credit')}
          className={`flex items-center p-4 border-2 rounded-xl transition-all ${
            selectedMethod === 'credit'
              ? 'border-orange-600 bg-orange-50 ring-2 ring-orange-600 ring-opacity-20'
              : 'border-gray-100 hover:border-gray-300 bg-white'
          }`}
        >
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl shrink-0 ${
            selectedMethod === 'credit' ? 'bg-orange-600 text-white' : 'bg-gray-100'
          }`}>
            📝
          </div>
          <div className="ml-4 text-left">
            <div className={`font-bold ${selectedMethod === 'credit' ? 'text-orange-900' : 'text-gray-700'}`}>Crédito (Fiado)</div>
            <div className="text-xs text-gray-500 font-medium">Pago a futuro</div>
          </div>
          {selectedMethod === 'credit' && (
            <div className="ml-auto text-orange-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </button>
      </div>

      {selectedMethod === 'credit' && (
        <div className="mt-4 p-4 bg-orange-50 rounded-xl border border-orange-100 animate-in fade-in slide-in-from-top-2">
          <Input
            label="¿Cuándo pagará el cliente?*"
            type="date"
            value={dueDate}
            onChange={e => handleDueDateChange(e.target.value)}
            fullWidth
            className="border-orange-200 focus:border-orange-500"
          />
        </div>
      )}
    </div>
  );
};
