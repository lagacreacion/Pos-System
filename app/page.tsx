'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

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

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="space-y-6 fade-in">
      {/* Welcome Header */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <h1 className="text-2xl sm:text-3xl font-black text-white mb-2">
          ¡Hola! 👋
        </h1>
        <p className="text-blue-200/60 text-sm sm:text-base">
          Gestiona tu negocio desde cualquier lugar
        </p>
        {user?.email && (
          <div className="mt-3 inline-flex items-center px-3 py-1.5 bg-white/10 rounded-full">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
            <span className="text-xs text-blue-200/80 font-medium">{user.email}</span>
          </div>
        )}
      </div>

      {/* Quick Actions Grid */}
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

      {/* Quick Tips */}
      <div className="bg-blue-50 rounded-2xl p-5 sm:p-6 border border-blue-100">
        <h3 className="font-bold text-blue-900 mb-3 text-sm sm:text-base">💡 Tips rápidos</h3>
        <div className="space-y-2 text-xs sm:text-sm text-blue-700">
          <p>1. Configura tus productos en <strong>Inventario</strong></p>
          <p>2. Crea combos en <strong>Promociones</strong></p>
          <p>3. Registra clientes en <strong>Clientes</strong></p>
          <p>4. Realiza ventas desde <strong>Nueva Venta</strong></p>
          <p>5. Revisa tus <strong>Reportes</strong> para monitorear tu negocio</p>
        </div>
      </div>
    </div>
  );
}
