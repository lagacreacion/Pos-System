'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';

interface PaymentMethodProps {
  onMethodSelect: (method: 'cash' | 'transfer' | 'credit', dueDate?: Date, initialPayment?: number) => void;
}

export const PaymentMethod = ({ onMethodSelect }: PaymentMethodProps) => {
  const [selectedMethod, setSelectedMethod] = useState<'cash' | 'transfer' | 'credit' | null>(null);
  const [dueDate, setDueDate] = useState('');
  const [initialPayment, setInitialPayment] = useState('');

  const handleMethodChange = (method: 'cash' | 'transfer' | 'credit') => {
    setSelectedMethod(method);
    const initialAmt = parseFloat(initialPayment) || 0;
    if (method === 'credit' && dueDate) {
      onMethodSelect(method, new Date(dueDate), initialAmt);
    } else if (method !== 'credit') {
      onMethodSelect(method);
    }
  };

  const handleDueDateChange = (date: string) => {
    setDueDate(date);
    const initialAmt = parseFloat(initialPayment) || 0;
    if (selectedMethod === 'credit') {
      onMethodSelect('credit', new Date(date), initialAmt);
    }
  };

  const handleInitialPaymentChange = (amount: string) => {
    setInitialPayment(amount);
    const initialAmt = parseFloat(amount) || 0;
    if (selectedMethod === 'credit' && dueDate) {
      onMethodSelect('credit', new Date(dueDate), initialAmt);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-2">
        {/* ... (buttons remain the same) ... */}
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
        </button>
      </div>

      {selectedMethod === 'credit' && (
        <div className="mt-4 p-4 bg-orange-50 rounded-2xl border-2 border-orange-100 space-y-4 animate-in fade-in slide-in-from-top-2">
          <Input
            label="¿Cuándo pagará el resto?*"
            type="date"
            value={dueDate}
            onChange={e => handleDueDateChange(e.target.value)}
            fullWidth
            className="bg-white border-2 border-orange-100 focus:border-orange-500 rounded-xl"
          />
          <Input
            label="Abono Inicial (Opcional)"
            type="number"
            placeholder="Ej: 15000"
            value={initialPayment}
            onChange={e => handleInitialPaymentChange(e.target.value)}
            fullWidth
            className="bg-white border-2 border-orange-100 focus:border-orange-500 rounded-xl"
          />
          {initialPayment && (
            <p className="text-[10px] text-orange-600 font-bold px-1">
              * Se registrará un pago inicial de {initialPayment}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
