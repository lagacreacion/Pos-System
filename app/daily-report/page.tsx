'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { DailyReport } from '@/components/Reports/DailyReport';
import { useReports } from '@/hooks/useReports';
import { useSales } from '@/hooks/useSales';
import { useCustomers } from '@/hooks/useCustomers';
import { DailyReport as DailyReportType, Sale } from '@/types';
import { formatDate } from '@/lib/utils';

export default function DailyReportPage() {
  const { getDailyReport, loading } = useReports();
  const { deleteSale } = useSales();
  const { customers } = useCustomers();
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()).split('/').reverse().join('-'));
  const [report, setReport] = useState<DailyReportType | null>(null);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleLoadReport = async () => {
    const date = new Date(selectedDate);
    const dailyReport = await getDailyReport(date);
    setReport(dailyReport);
  };

  const handleDeleteSale = async (sale: Sale) => {
    try {
      await deleteSale(sale);
      setAlert({ type: 'success', message: 'Venta eliminada y stock restablecido' });
      const date = new Date(selectedDate);
      const refreshed = await getDailyReport(date);
      setReport(refreshed);
      setTimeout(() => setAlert(null), 3000);
    } catch (error) {
      setAlert({
        type: 'error',
        message: error instanceof Error ? error.message : 'Error al eliminar venta',
      });
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Reporte Diario</h1>
        <p className="text-gray-600">Resumen de ventas del día</p>
      </div>

      {alert && (
        <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />
      )}

      <div className="bg-white rounded-lg shadow p-6 flex gap-4 items-end">
        <Input
          label="Selecciona una fecha"
          type="date"
          value={selectedDate}
          onChange={e => setSelectedDate(e.target.value)}
        />
        <Button variant="primary" onClick={handleLoadReport} loading={loading}>
          Cargar Reporte
        </Button>
      </div>

      <DailyReport
        report={report}
        isLoading={loading}
        customers={customers}
        onDeleteSale={handleDeleteSale}
      />
    </div>
  );
}
