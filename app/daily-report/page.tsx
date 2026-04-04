'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { DailyReport } from '@/components/Reports/DailyReport';
import { useReports } from '@/hooks/useReports';
import { DailyReport as DailyReportType } from '@/types';
import { formatDate } from '@/lib/utils';

export default function DailyReportPage() {
  const { getDailyReport, loading } = useReports();
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()).split('/').reverse().join('-'));
  const [report, setReport] = useState<DailyReportType | null>(null);

  const handleLoadReport = async () => {
    const date = new Date(selectedDate);
    const dailyReport = await getDailyReport(date);
    setReport(dailyReport);
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Reporte Diario</h1>
        <p className="text-gray-600">Resumen de ventas del día</p>
      </div>

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

      <DailyReport report={report} isLoading={loading} />
    </div>
  );
}
