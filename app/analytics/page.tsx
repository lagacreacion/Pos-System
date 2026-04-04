'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Analytics } from '@/components/Reports/Analytics';
import { useReports } from '@/hooks/useReports';
import { Analytics as AnalyticsType } from '@/types';

export default function AnalyticsPage() {
  const { getAnalytics, loading } = useReports();
  const [analytics, setAnalytics] = useState<AnalyticsType | null>(null);

  const handleLoadAnalytics = async () => {
    const data = await getAnalytics();
    setAnalytics(data);
  };

  useEffect(() => {
    handleLoadAnalytics();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analíticas</h1>
          <p className="text-gray-600">Estadísticas y análisis de tu negocio</p>
        </div>
        <Button variant="primary" onClick={handleLoadAnalytics} loading={loading}>
          Actualizar
        </Button>
      </div>

      <Analytics data={analytics} isLoading={loading} />
    </div>
  );
}
