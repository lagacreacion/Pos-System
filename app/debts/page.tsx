'use client';

import { useState } from 'react';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useDebts } from '@/hooks/useDebts';
import { useCustomers } from '@/hooks/useCustomers';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function DebtsPage() {
  const { debts, markAsPaid, deleteDebt, loading, error } = useDebts();
  const { customers } = useCustomers();
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleMarkAsPaid = async (id: string) => {
    try {
      await markAsPaid(id);
      setAlert({ type: 'success', message: 'Deuda marcada como pagada' });
      setTimeout(() => setAlert(null), 3000);
    } catch (err) {
      setAlert({ type: 'error', message: 'Error al actualizar deuda' });
    }
  };

  const handleDeleteDebt = async (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta deuda?')) {
      try {
        await deleteDebt(id);
        setAlert({ type: 'success', message: 'Deuda eliminada' });
        setTimeout(() => setAlert(null), 3000);
      } catch (err) {
        setAlert({ type: 'error', message: 'Error al eliminar deuda' });
      }
    }
  };

  const getCustomerName = (customerId: string) => {
    return customers.find(c => c.id === customerId)?.name || 'Cliente desconocido';
  };

  const pendingDebts = debts.filter(d => d.status === 'pending');
  const paidDebts = debts.filter(d => d.status === 'paid');
  const totalPending = pendingDebts.reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Por Cobrar (Fiados)</h1>
        <p className="text-gray-600">Gestiona las deudas de tus clientes</p>
      </div>

      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      {error && <Alert type="error" message={error} />}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <div className="text-center">
            <div className="text-4xl font-bold text-red-600 mb-2">
              {formatCurrency(totalPending)}
            </div>
            <div className="text-gray-600">Total Pendiente</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-4xl font-bold text-purple-600 mb-2">
              {pendingDebts.length}
            </div>
            <div className="text-gray-600">Deudas Pendientes</div>
          </div>
        </Card>
      </div>

      <Card title="Deudas Pendientes">
        {loading ? (
          <div className="text-center py-8">Cargando...</div>
        ) : pendingDebts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No hay deudas pendientes</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-semibold">Cliente</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">Monto</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">Fecha Límite</th>
                  <th className="px-4 py-2 text-center text-sm font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {pendingDebts.map(debt => (
                  <tr key={debt.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2 font-medium">
                      {getCustomerName(debt.customerId)}
                    </td>
                    <td className="px-4 py-2 font-semibold text-red-600">
                      {formatCurrency(debt.amount)}
                    </td>
                    <td className="px-4 py-2 text-sm">
                      {formatDate(debt.dueDate)}
                    </td>
                    <td className="px-4 py-2 text-center space-x-2">
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => handleMarkAsPaid(debt.id)}
                      >
                        Marcar Pagado
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteDebt(debt.id)}
                      >
                        Eliminar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {paidDebts.length > 0 && (
        <Card title={`Deudas Pagadas (${paidDebts.length})`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-semibold">Cliente</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">Monto</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">Fecha Límite</th>
                </tr>
              </thead>
              <tbody>
                {paidDebts.map(debt => (
                  <tr key={debt.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2 font-medium">
                      {getCustomerName(debt.customerId)}
                    </td>
                    <td className="px-4 py-2 text-green-600">
                      {formatCurrency(debt.amount)}
                    </td>
                    <td className="px-4 py-2 text-sm">
                      {formatDate(debt.dueDate)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
