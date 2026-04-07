'use client';

import { DailyReport as DailyReportType, Customer, Sale } from '@/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatCurrency, formatDate } from '@/lib/utils';

interface DailyReportProps {
  report: DailyReportType | null;
  isLoading: boolean;
  customers?: Customer[];
  onDeleteSale?: (sale: Sale) => void;
}

const paymentLabel = (m: string) =>
  m === 'cash' ? 'Efectivo' : m === 'transfer' ? 'Transferencia' : 'Crédito';

export const DailyReport = ({ report, isLoading, customers = [], onDeleteSale }: DailyReportProps) => {
  if (isLoading) {
    return <div className="text-center py-8">Cargando reporte...</div>;
  }

  if (!report) {
    return <div className="text-center py-8 text-gray-500">Selecciona una fecha</div>;
  }

  const customerName = (id?: string) =>
    id ? customers.find(c => c.id === id)?.name || 'Cliente' : 'Sin cliente';

  const handleDelete = (sale: Sale) => {
    if (!onDeleteSale) return;
    if (confirm('¿Eliminar esta venta? Se restablecerá el stock y la deuda si existe.')) {
      onDeleteSale(sale);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">
              {formatCurrency(report.totalSold)}
            </div>
            <div className="text-gray-600">Total Vendido</div>
            <div className="text-sm text-gray-500 mt-2">{formatDate(report.date)}</div>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">
              {formatCurrency(report.totalCollected)}
            </div>
            <div className="text-gray-600">Total Cobrado</div>
            <div className="text-sm text-gray-500 mt-1">Efectivo + Transferencia</div>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="text-4xl font-bold text-red-600 mb-2">
              {formatCurrency(report.totalPending)}
            </div>
            <div className="text-gray-600">Por Cobrar</div>
            <div className="text-sm text-gray-500 mt-1">Créditos pendientes</div>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="text-4xl font-bold text-purple-600 mb-2">
              {report.customersServed}
            </div>
            <div className="text-gray-600">Clientes Atendidos</div>
          </div>
        </Card>
      </div>

      <Card>
        <h3 className="text-lg font-bold text-gray-900 mb-3">Detalle de Ventas</h3>
        {report.sales.length === 0 ? (
          <p className="text-gray-500 text-sm">Sin ventas en esta fecha</p>
        ) : (
          <div className="space-y-3">
            {report.sales.map(sale => (
              <div key={sale.id} className="border rounded-lg p-3 bg-gray-50">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-gray-900">{customerName(sale.customerId)}</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                        {paymentLabel(sale.paymentMethod)}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(sale.date).toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <ul className="mt-2 text-sm text-gray-700 space-y-0.5">
                      {sale.items.map((it, i) => (
                        <li key={i} className="flex justify-between">
                          <span>{it.quantity} × {it.name}</span>
                          <span className="text-gray-600">{formatCurrency(it.price * it.quantity)}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-2 text-right font-bold text-gray-900">
                      Total: {formatCurrency(sale.totalAmount)}
                    </div>
                  </div>
                  {onDeleteSale && (
                    <Button variant="danger" onClick={() => handleDelete(sale)}>
                      Eliminar
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};
