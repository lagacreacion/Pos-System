'use client';

import { useState, useEffect } from 'react';
import { Debt, Payment } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useDebts } from '@/hooks/useDebts';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  debt: Debt;
}

export const PaymentModal = ({ isOpen, onClose, debt }: PaymentModalProps) => {
  const { addPayment, getPayments, loading } = useDebts();
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [payments, setPayments] = useState<Payment[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    if (isOpen && debt.id) {
      loadHistory();
    }
  }, [isOpen, debt.id]);

  const loadHistory = async () => {
    if (!debt.id) return;
    setHistoryLoading(true);
    try {
      const data = await getPayments(debt.id);
      setPayments(data);
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) return;

    try {
      await addPayment(debt.id, amt, note);
      setAmount('');
      setNote('');
      // Delay history load slightly to allow Firebase to propagate changes if needed
      setTimeout(loadHistory, 500);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Error al registrar abono');
    }
  };

  if (!isOpen) return null;

  const remaining = debt.amount - (debt.paidAmount || 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black text-gray-800 tracking-tight">Registrar Abono</h2>
            <p className="text-gray-500 font-medium text-sm">Gestiona el pago de esta deuda</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          {/* Summary */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-2xl border-2 border-blue-100">
              <div className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">Total Deuda</div>
              <div className="text-xl font-black text-blue-700">{formatCurrency(debt.amount)}</div>
            </div>
            <div className="bg-orange-50 p-4 rounded-2xl border-2 border-orange-100">
              <div className="text-xs font-bold text-orange-400 uppercase tracking-wider mb-1">Saldo Restante</div>
              <div className="text-xl font-black text-orange-700">{formatCurrency(remaining)}</div>
            </div>
          </div>

          {/* Form */}
          {remaining > 0 ? (
            <form onSubmit={handleSubmit} className="space-y-4 bg-gray-50/50 p-6 rounded-3xl border-2 border-dashed border-gray-200">
              <div className="space-y-4">
                <Input
                  label="Monto a Abonar"
                  type="number"
                  placeholder="Ej: 5000"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  fullWidth
                  required
                  className="bg-white border-2 border-gray-100 rounded-2xl text-lg font-bold"
                />
                <Input
                  label="Nota (Opcional)"
                  placeholder="Ej: Pago en efectivo"
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  fullWidth
                  className="bg-white border-2 border-gray-100 rounded-2xl"
                />
                <Button 
                  type="submit" 
                  variant="primary" 
                  fullWidth 
                  loading={loading}
                  className="py-4 rounded-2xl font-black shadow-lg shadow-blue-100"
                >
                  💰 Confirmar Abono
                </Button>
              </div>
            </form>
          ) : (
            <div className="bg-green-50 p-6 rounded-3xl border-2 border-green-100 text-center">
              <div className="text-3xl mb-2">✅</div>
              <p className="text-green-700 font-black">Esta deuda está totalmente pagada</p>
            </div>
          )}

          {/* History */}
          <div className="space-y-3">
            <h3 className="font-black text-gray-800 text-lg flex items-center">
              <span className="mr-2">📜</span> Historial de Pagos
            </h3>
            {historyLoading ? (
              <div className="text-center py-4 text-gray-400 animate-pulse font-bold">Cargando historial...</div>
            ) : payments.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-2xl text-gray-400 text-sm font-medium">
                No se han registrado pagos aún
              </div>
            ) : (
              <div className="space-y-2">
                {payments.map(payment => (
                  <div key={payment.id} className="flex items-center justify-between p-4 bg-white border-2 border-gray-100 rounded-2xl shadow-sm">
                    <div className="min-w-0">
                      <div className="font-bold text-gray-800">{formatCurrency(payment.amount)}</div>
                      <div className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                        {formatDate(payment.date)}
                      </div>
                      {payment.note && <div className="text-xs text-gray-500 mt-1 italic truncate">{payment.note}</div>}
                    </div>
                    <div className="bg-green-100 text-green-700 p-2 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="p-6 bg-gray-50 border-t border-gray-100">
          <Button variant="secondary" fullWidth onClick={onClose} className="rounded-2xl font-bold py-3">
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  );
};
