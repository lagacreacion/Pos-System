'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { MonthlyReport } from '@/components/Reports/MonthlyReport';
import { useReports } from '@/hooks/useReports';
import { MonthlyReport as MonthlyReportType } from '@/types';

const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export default function MonthlyReportPage() {
  const { getMonthlyReport, loading } = useReports();
  const [reports, setReports] = useState<MonthlyReportType[]>([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

  const handleLoadReports = async () => {
    const reportDate = new Date(selectedYear, selectedMonth, 1);
    const monthlyReport = await getMonthlyReport(reportDate);
    setReports([monthlyReport]);
  };

  useEffect(() => {
    handleLoadReports();
  }, [selectedYear, selectedMonth]);

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Reporte Mensual</h1>
          <p className="text-gray-500 font-medium">Resumen detallado por periodo</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border-2 border-gray-50 shadow-sm p-6 flex flex-col sm:flex-row gap-4 items-end">
        <div className="flex-1 space-y-2">
          <label className="text-sm font-bold text-gray-400 ml-1">Año</label>
          <select
            value={selectedYear}
            onChange={e => setSelectedYear(parseInt(e.target.value))}
            className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-4 py-3 font-bold text-gray-700 focus:border-blue-500 transition-colors appearance-none"
          >
            {[2023, 2024, 2025, 2026].map(year => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex-1 space-y-2">
          <label className="text-sm font-bold text-gray-400 ml-1">Mes</label>
          <select
            value={selectedMonth}
            onChange={e => setSelectedMonth(parseInt(e.target.value))}
            className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-4 py-3 font-bold text-gray-700 focus:border-blue-500 transition-colors appearance-none"
          >
            {MONTHS.map((month, index) => (
              <option key={index} value={index}>
                {month}
              </option>
            ))}
          </select>
        </div>

        <Button 
          variant="primary" 
          onClick={handleLoadReports} 
          loading={loading}
          className="w-full sm:w-auto shadow-xl shadow-blue-200 py-4 px-8 rounded-2xl font-black"
        >
          🔄 Actualizar
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <MonthlyReport reports={reports} isLoading={loading} />
      </div>
    </div>
  );
}
