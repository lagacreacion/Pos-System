'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useReports } from '@/hooks/useReports';
import { useDebts } from '@/hooks/useDebts';
import { useProducts } from '@/hooks/useProducts';
import { formatCurrency } from '@/lib/utils';

const quickActions = [
  { href: '/sales', label: 'Nueva Venta', icon: '💳', description: 'Registrar venta', gradient: 'from-blue-500 to-indigo-600' },
  { href: '/inventory', label: 'Inventario', icon: '📦', description: 'Gestionar stock', gradient: 'from-emerald-500 to-teal-600' },
  { href: '/promotions', label: 'Promociones', icon: '🎯', description: 'Crear combos', gradient: 'from-amber-500 to-orange-600' },
  { href: '/customers', label: 'Clientes', icon: '👥', description: 'Base de datos', gradient: 'from-violet-500 to-purple-600' },
  { href: '/debts', label: 'Por Cobrar', icon: '💸', description: 'Deudas pendientes', gradient: 'from-rose-500 to-pink-600' },
  { href: '/daily-report', label: 'Reporte del Día', icon: '📊', description: 'Ventas de hoy', gradient: 'from-cyan-500 to-blue-600' },
  { href: '/monthly-report', label: 'Reporte Mensual', icon: '📈', description: 'Análisis mensual', gradient: 'from-sky-500 to-blue-600' },
  { href: '/analytics', label: 'Analíticas', icon: '📉', description: 'Estadísticas', gradient: 'from-fuchsia-500 to-purple-600' },
];

const LOW_STOCK_THRESHOLD = 5;

export default function Home() {
  const { user } = useAuth();
  const { getDailyReport } = useReports();
  const { debts } = useDebts();
  const { products } = useProducts();

  const [soldToday, setSoldToday] = useState<number | null>(null);
  const [collectedToday, setCollectedToday] = useState<number | null>(null);

  useEffect(() => {
    if (!user) return;
    let active = true;
    getDailyReport(new Date())
      .then(r => {
        if (!active) return;
        setSoldToday(r.totalSold);
        setCollectedToday(r.totalCollected);
      })
      .catch(() => { if (active) { setSoldToday(0); setCollectedToday(0); } });
    return () => { active = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const totalPending = useMemo(
    () => debts.filter(d => d.status !== 'paid').reduce((s, d) => s + (d.amount - (d.paidAmount || 0)), 0),
    [debts]
  );
  const lowStockCount = useMemo(
    () => products.filter(p => p.stock <= LOW_STOCK_THRESHOLD).length,
    [products]
  );

  const kpis = [
    { label: 'Vendido hoy', value: soldToday === null ? null : formatCurrency(soldToday), href: '/daily-report', accent: 'text-emerald-600', ring: 'border-emerald-100', icon: '📊' },
    { label: 'Cobrado hoy', value: collectedToday === null ? null : formatCurrency(collectedToday), href: '/daily-report', accent: 'text-blue-600', ring: 'border-blue-100', icon: '💵' },
    { label: 'Por cobrar', value: formatCurrency(totalPending), href: '/debts', accent: 'text-rose-600', ring: 'border-rose-100', icon: '💸' },
    { label: 'Stock bajo', value: `${lowStockCount}`, href: '/inventory', accent: lowStockCount > 0 ? 'text-amber-600' : 'text-slate-500', ring: 'border-amber-100', icon: '⚠️' },
  ];

  return (
    <div className="space-y-6 fade-in">
      {/* Welcome Header */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <h1 className="text-2xl sm:text-3xl font-black text-white mb-2">¡Hola! 👋</h1>
        <p className="text-blue-200/60 text-sm sm:text-base">Gestiona tu negocio desde cualquier lugar</p>
        {user?.email && (
          <div className="mt-3 inline-flex items-center px-3 py-1.5 bg-white/10 rounded-full">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
            <span className="text-xs text-blue-200/80 font-medium">{user.email}</span>
          </div>
        )}
      </div>

      {/* KPIs reales */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {kpis.map(kpi => (
          <Link
            key={kpi.label}
            href={kpi.href}
            className={`bg-white rounded-2xl p-4 sm:p-5 shadow-sm border-2 ${kpi.ring} hover:shadow-lg transition-all duration-200 active:scale-[0.97]`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-widest">{kpi.label}</span>
              <span className="text-lg">{kpi.icon}</span>
            </div>
            {kpi.value === null ? (
              <div className="h-7 w-20 bg-slate-100 rounded-lg animate-pulse" />
            ) : (
              <div className={`text-xl sm:text-2xl font-black tabular-nums ${kpi.accent}`}>{kpi.value}</div>
            )}
          </Link>
        ))}
      </div>

      {/* Quick Actions Grid */}
      <div>
        <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-3 px-1">Accesos rápidos</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {quickActions.map(action => (
            <Link
              key={action.href}
              href={action.href}
              className="group bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-100 hover:shadow-lg hover:border-slate-200 transition-all duration-200 active:scale-[0.97] min-h-[120px] flex flex-col justify-between"
            >
              <div className={`w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br ${action.gradient} rounded-2xl flex items-center justify-center shadow-lg mb-3 group-hover:scale-110 transition-transform duration-200`}>
                <span className="text-2xl">{action.icon}</span>
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base text-slate-900">{action.label}</h3>
                <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">{action.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
