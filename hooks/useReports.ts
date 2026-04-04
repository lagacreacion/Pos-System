'use client';

import { useState } from 'react';
import { DailyReport, MonthlyReport, Analytics } from '@/types';
import { reportService } from '@/services/reportService';

export const useReports = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getDailyReport = async (date: Date) => {
    try {
      setError(null);
      setLoading(true);
      const report = await reportService.getDailyReport(date);
      return report;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cargar reporte diario';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getMonthlyReport = async (date: Date) => {
    try {
      setError(null);
      setLoading(true);
      const report = await reportService.getMonthlyReport(date);
      return report;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cargar reporte mensual';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getAnalytics = async () => {
    try {
      setError(null);
      setLoading(true);
      const analytics = await reportService.getAnalytics();
      return analytics;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cargar analíticas';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    getDailyReport,
    getMonthlyReport,
    getAnalytics,
  };
};
