'use client';

import { DailyReport as DailyReportType } from '@/types';
import { Card } from '@/components/ui/Card';
import { formatCurrency, formatDate } from '@/lib/utils';

interface DailyReportProps {
  report: DailyReportType | null;
  isLoading: boolean;
}

export const DailyReport = ({ report, isLoading }: DailyReportProps) => {
  if (isLoading) {
    return <div className="text-center py-8">Cargando reporte...</div>;
  }

  if (!report) {
    return <div className="text-center py-8 text-gray-500">Selecciona una fecha</div>;
  }

  return (
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
          <div className="text-sm text-gray-500 mt-1">
            Efectivo + Transferencia
          </div>
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
  );
};
