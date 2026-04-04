'use client';

import { MonthlyReport as MonthlyReportType } from '@/types';
import { Card } from '@/components/ui/Card';
import { formatCurrency } from '@/lib/utils';

interface MonthlyReportProps {
  reports: MonthlyReportType[];
  isLoading: boolean;
}

export const MonthlyReport = ({ reports, isLoading }: MonthlyReportProps) => {
  if (isLoading) {
    return <div className="text-center py-8">Cargando reportes...</div>;
  }

  return (
    <div className="space-y-4">
      {reports.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No hay datos disponibles</div>
      ) : (
        reports.map((report, index) => (
          <Card key={index} title={report.month}>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {formatCurrency(report.totalSold)}
                </div>
                <div className="text-sm text-gray-600">Total Vendido</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(report.totalCollected)}
                </div>
                <div className="text-sm text-gray-600">Total Cobrado</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {formatCurrency(report.totalPending)}
                </div>
                <div className="text-sm text-gray-600">Por Cobrar</div>
              </div>
            </div>
          </Card>
        ))
      )}
    </div>
  );
};
