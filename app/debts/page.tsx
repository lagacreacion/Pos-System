'use client';

import { useState, useMemo } from 'react';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useDebts } from '@/hooks/useDebts';
import { useCustomers } from '@/hooks/useCustomers';
import { formatCurrency, formatDate } from '@/lib/utils';
import { PaymentModal } from '@/components/Debts/PaymentModal';
import { Debt } from '@/types';
import { useConfirm } from '@/components/ui/ConfirmDialog';

export default function DebtsPage() {
  const { debts, markAsPaid, deleteDebt, loading, error } = useDebts();
  const { customers } = useCustomers();
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [selectedDebt, setSelectedDebt] = useState<Debt | null>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'overdue' | 'current'>('all');
  const { confirm, ConfirmDialog } = useConfirm();

  const handleMarkAsPaid = async (id: string) => {
    const ok = await confirm({ title: 'Liquidar deuda', message: '¿Deseas liquidar el saldo restante de esta deuda?', confirmLabel: 'Liquidar', variant: 'primary' });
    if (ok) {
      setIsActionLoading(true);
      try {
        await markAsPaid(id);
        setAlert({ type: 'success', message: 'Deuda liquidada correctamente' });
        setTimeout(() => setAlert(null), 5000);
      } catch (err) {
        setAlert({ type: 'error', message: 'Error al actualizar deuda' });
      } finally {
        setIsActionLoading(false);
      }
    }
  };

  const handleDeleteDebt = async (id: string) => {
    const ok = await confirm({ title: 'Eliminar deuda', message: 'Se eliminará la deuda y el saldo del cliente se ajustará automáticamente.', confirmLabel: 'Eliminar' });
    if (ok) {
      setIsActionLoading(true);
      try {
        await deleteDebt(id);
        setAlert({ type: 'success', message: 'Deuda eliminada' });
        setTimeout(() => setAlert(null), 5000);
      } catch (err) {
        setAlert({ type: 'error', message: 'Error al eliminar deuda' });
      } finally {
        setIsActionLoading(false);
      }
    }
  };

  const getCustomerName = (customerId: string) => {
    return customers.find(c => c.id === customerId)?.name || 'Cliente desconocido';
  };

  const allPending = debts.filter(d => d.status !== 'paid');
  const paidDebts = debts.filter(d => d.status === 'paid');

  const totalPending = allPending.reduce((sum, d) => {
    const remaining = d.amount - (d.paidAmount || 0);
    return sum + remaining;
  }, 0);

  const now = new Date();
  const overdueCount = allPending.filter(d => new Date(d.dueDate) < now).length;

  const pendingDebts = useMemo(() => {
    const term = search.trim().toLowerCase();
    return allPending.filter(d => {
      const isOverdue = new Date(d.dueDate) < now;
      if (filter === 'overdue' && !isOverdue) return false;
      if (filter === 'current' && isOverdue) return false;
      if (term && !getCustomerName(d.customerId).toLowerCase().includes(term)) return false;
      return true;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allPending, search, filter, customers]);

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Cuentas por Cobrar</h1>
          <p className="text-gray-500 font-medium text-sm">Gestiona créditos y abonos de clientes</p>
        </div>
      </div>

      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
          className="animate-in slide-in-from-top-4 duration-300"
        />
      )}

      {error && <Alert type="error" message={error} />}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-3xl border-2 border-red-50 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zM12 2a10 10 0 100 20 10 10 0 000-20z" />
            </svg>
          </div>
          <div className="text-4xl font-black text-red-600 mb-2 tracking-tighter">
            {formatCurrency(totalPending)}
          </div>
          <div className="text-gray-400 font-bold uppercase text-xs tracking-widest">Saldo Total Pendiente</div>
        </div>

        <div className="bg-white p-8 rounded-3xl border-2 border-purple-50 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div className="text-4xl font-black text-purple-600 mb-2 tracking-tighter">
            {pendingDebts.length}
          </div>
          <div className="text-gray-400 font-bold uppercase text-xs tracking-widest">Cuentas con Saldo</div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border-2 border-gray-50 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-50 bg-gray-50/50 space-y-3">
          <div className="flex justify-between items-center gap-3">
            <h2 className="text-lg sm:text-xl font-black text-gray-800">
              Cuentas Pendientes <span className="text-red-600 ml-1">({pendingDebts.length})</span>
            </h2>
            <div className="flex gap-1 bg-white rounded-xl p-1 border border-slate-100">
              {([['all','Todas'],['overdue',`Vencidas${overdueCount ? ` ${overdueCount}` : ''}`],['current','Al día']] as const).map(([key,label]) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${filter===key ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          {allPending.length > 0 && (
            <Input
              placeholder="🔍 Buscar por cliente..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              fullWidth
            />
          )}
        </div>
        <div className="p-2 sm:p-6">
          {loading ? (
            <div className="text-center py-20">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-400 font-bold">Cargando cuentas...</p>
            </div>
          ) : pendingDebts.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">{allPending.length === 0 ? '✨' : '🔍'}</div>
              <p className="text-gray-400 font-black text-xl">
                {allPending.length === 0 ? '¡Todo al día!' : 'Sin resultados'}
              </p>
              <p className="text-gray-400">
                {allPending.length === 0 ? 'No hay deudas pendientes actualmente' : 'Ajusta la búsqueda o el filtro'}
              </p>
            </div>
          ) : (
            <>
            {/* Tarjetas móvil */}
            <div className="lg:hidden space-y-3">
              {pendingDebts.map(debt => {
                const remaining = debt.amount - (debt.paidAmount || 0);
                const isOverdue = new Date(debt.dueDate) < new Date();
                return (
                  <div key={debt.id} className="bg-white p-4 rounded-2xl border-2 border-slate-100 shadow-sm">
                    <div className="flex justify-between items-start gap-3">
                      <div className="min-w-0">
                        <div className="font-black text-gray-800 truncate">{getCustomerName(debt.customerId)}</div>
                        <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${isOverdue ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>
                          Vence {formatDate(debt.dueDate)}
                        </span>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Restante</div>
                        <div className="text-xl font-black text-red-600">{formatCurrency(remaining)}</div>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3 pt-3 border-t border-slate-50">
                      <Button variant="primary" size="sm" disabled={isActionLoading} onClick={() => setSelectedDebt(debt)} className="flex-1 rounded-xl font-black">💰 Abonar</Button>
                      <Button variant="success" size="sm" loading={isActionLoading} disabled={isActionLoading} onClick={() => handleMarkAsPaid(debt.id)} className="flex-1 rounded-xl font-black">Liquidar</Button>
                      <Button variant="danger" size="sm" disabled={isActionLoading} onClick={() => handleDeleteDebt(debt.id)} className="rounded-xl font-black p-2.5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
            {/* Tabla escritorio */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-gray-400 text-[10px] font-black uppercase tracking-widest border-b-2 border-gray-50">
                    <th className="px-4 py-4 text-left">Cliente</th>
                    <th className="px-4 py-4 text-right">Total</th>
                    <th className="px-4 py-4 text-right">Abonado</th>
                    <th className="px-4 py-4 text-right">Restante</th>
                    <th className="px-4 py-4 text-left">Vencimiento</th>
                    <th className="px-4 py-4 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {pendingDebts.map(debt => {
                    const remaining = debt.amount - (debt.paidAmount || 0);
                    return (
                      <tr key={debt.id} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="px-4 py-5">
                          <div className="font-black text-gray-800">{getCustomerName(debt.customerId)}</div>
                          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                            Registrada el {formatDate(debt.createdAt)}
                          </div>
                        </td>
                        <td className="px-4 py-5 text-right font-bold text-gray-600">
                          {formatCurrency(debt.amount)}
                        </td>
                        <td className="px-4 py-5 text-right font-bold text-blue-600">
                          {formatCurrency(debt.paidAmount || 0)}
                        </td>
                        <td className="px-4 py-5 text-right font-black text-red-600 text-lg">
                          {formatCurrency(remaining)}
                        </td>
                        <td className="px-4 py-5">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                            new Date(debt.dueDate) < new Date() ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {formatDate(debt.dueDate)}
                          </span>
                        </td>
                        <td className="px-4 py-5 text-center">
                          <div className="flex justify-center gap-2">
                            <Button
                              variant="primary"
                              size="sm"
                              disabled={isActionLoading}
                              onClick={() => setSelectedDebt(debt)}
                              className="rounded-xl font-black px-4 shadow-md shadow-blue-100"
                            >
                              💰 Abonar
                            </Button>
                            <Button
                              variant="success"
                              size="sm"
                              loading={isActionLoading}
                              disabled={isActionLoading}
                              onClick={() => handleMarkAsPaid(debt.id)}
                              className="rounded-xl font-black px-4 shadow-md shadow-green-100"
                            >
                              Liquidar
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              disabled={isActionLoading}
                              onClick={() => handleDeleteDebt(debt.id)}
                              className="rounded-xl font-black p-2 opacity-30 hover:opacity-100 transition-opacity"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            </>
          )}
        </div>
      </div>

      {paidDebts.length > 0 && (
        <div className="bg-white rounded-3xl border-2 border-gray-50 shadow-sm overflow-hidden opacity-80">
          <div className="p-6 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
            <h2 className="text-lg font-black text-gray-500 uppercase tracking-widest">Historial Pagadas</h2>
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-black">{paidDebts.length}</span>
          </div>
          <div className="p-2 sm:p-6 overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-gray-400 text-[10px] font-black uppercase tracking-widest border-b border-gray-50">
                  <th className="px-4 py-4 text-left">Cliente</th>
                  <th className="px-4 py-4 text-right">Monto</th>
                  <th className="px-4 py-4 text-left">Liquidada el</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paidDebts.map(debt => (
                  <tr key={debt.id} className="group">
                    <td className="px-4 py-4 font-bold text-gray-600">
                      {getCustomerName(debt.customerId)}
                    </td>
                    <td className="px-4 py-4 text-right text-green-600 font-bold">
                      {formatCurrency(debt.amount)}
                    </td>
                    <td className="px-4 py-4 text-xs font-medium text-gray-400 italic">
                      {formatDate(debt.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ConfirmDialog />

      {selectedDebt && (
        <PaymentModal
          isOpen={!!selectedDebt}
          onClose={() => {
            setSelectedDebt(null);
            // useDebts handles the re-fetching, but we can ensure it here
          }}
          debt={selectedDebt}
        />
      )}
    </div>
  );
}
