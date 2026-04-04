'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { MonthlyReport } from '@/components/Reports/MonthlyReport';
import { useReports } from '@/hooks/useReports';
import { MonthlyReport as MonthlyReportType } from '@/types';

export default function MonthlyReportPage() {
  const { getMonthlyReport, loading } = useReports();
  const [reports, setReports] = useState<MonthlyReportType[]>([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const handleLoadReports = async () => {
    const monthlyReports: MonthlyReportType[] = [];

    for (let month = 0; month < 12; month++) {
      const date = new Date(selectedYear, month, 1);
      const report = await getMonthlyReport(date);
      monthlyReports.push(report);
    }

    setReports(monthlyReports);
  };

  useEffect(() => {
    handleLoadReports();
  }, [selectedYear]);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Reporte Mensual</h1>
        <p className="text-gray-600">Resumen de ventas mensuales</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6 flex gap-4 items-center">
        <select
          value={selectedYear}
          onChange={e => setSelectedYear(parseInt(e.target.value))}
          className="border border-gray-300 rounded px-4 py-2"
        >
          {[2023, 2024, 2025, 2026].map(year => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        <Button variant="primary" onClick={handleLoadReports} loading={loading}>
          Cargar Reportes
        </Button>
      </div>

      <MonthlyReport reports={reports} isLoading={loading} />
    </div>
  );
}
