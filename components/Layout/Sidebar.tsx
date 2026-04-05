'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const primaryNav = [
  { href: '/sales', label: 'Vender', icon: '💳' },
  { href: '/inventory', label: 'Stock', icon: '📦' },
  { href: '/promotions', label: 'Promos', icon: '🎯' },
];

const secondaryNav = [
  { href: '/customers', label: 'Clientes', icon: '👥' },
  { href: '/debts', label: 'Por Cobrar', icon: '💸' },
  { href: '/daily-report', label: 'Reporte Diario', icon: '📊' },
  { href: '/monthly-report', label: 'Reporte Mensual', icon: '📈' },
  { href: '/analytics', label: 'Analíticas', icon: '📉' },
];
export const Sidebar = () => {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Close drawer on route change
  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [drawerOpen]);

  const isSecondaryActive = secondaryNav.some(item => pathname.startsWith(item.href));

  return (
    <>
      {/* ==================== DESKTOP SIDEBAR ==================== */}
      <aside className="hidden lg:block bg-gradient-to-b from-slate-900 to-slate-950 text-white w-64 min-h-screen p-5 shadow-2xl">
        <div className="space-y-1.5 sticky top-20">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-3 px-4">Principal</p>
          {primaryNav.map(item => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-4 py-3.5 rounded-2xl transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <span className="text-xl mr-3">{item.icon}</span>
                <span className="font-semibold text-sm">{item.label}</span>
              </Link>
            );
          })}

          <div className="pt-4 pb-2">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-3 px-4">Gestión</p>
          </div>
          {secondaryNav.map(item => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-4 py-3.5 rounded-2xl transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <span className="text-xl mr-3">{item.icon}</span>
                <span className="font-semibold text-sm">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </aside>

      {/* ==================== MOBILE BOTTOM NAVIGATION ==================== */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-slate-200/80 px-2 flex justify-around items-stretch z-50 shadow-[0_-8px_30px_rgba(0,0,0,0.08)]"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 8px)' }}
      >
        {primaryNav.map(item => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-2 px-1 min-w-[72px] min-h-[60px] relative transition-all duration-200 active:scale-95 ${
                isActive ? 'text-blue-600' : 'text-slate-400'
              }`}
            >
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" />
              )}
              <span className="text-2xl mb-0.5">{item.icon}</span>
              <span className={`text-[10px] font-bold uppercase tracking-wider ${isActive ? 'text-blue-600' : 'text-slate-400'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}

        {/* "Más" button */}
        <button
          onClick={() => setDrawerOpen(true)}
          className={`flex flex-col items-center justify-center py-2 px-1 min-w-[72px] min-h-[60px] relative transition-all duration-200 active:scale-95 ${
            isSecondaryActive ? 'text-blue-600' : 'text-slate-400'
          }`}
        >
          {isSecondaryActive && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" />
          )}
          <span className="text-2xl mb-0.5">☰</span>
          <span className={`text-[10px] font-bold uppercase tracking-wider ${isSecondaryActive ? 'text-blue-600' : 'text-slate-400'}`}>
            Más
          </span>
        </button>
      </div>

      {/* ==================== MOBILE DRAWER (slide from bottom) ==================== */}
      {/* Backdrop */}
      <div
        className={`lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-[200] transition-opacity duration-300 ${
          drawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setDrawerOpen(false)}
      />

      {/* Drawer Panel */}
      <div
        className={`lg:hidden fixed bottom-0 left-0 right-0 z-[201] transition-transform duration-300 ease-out ${
          drawerOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="bg-white rounded-t-3xl shadow-2xl overflow-hidden"
          style={{ paddingBottom: 'env(safe-area-inset-bottom, 16px)' }}
        >
          {/* Handle bar */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 bg-slate-300 rounded-full" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-3">
            <h3 className="text-lg font-black text-slate-900">Más opciones</h3>
            <button
              onClick={() => setDrawerOpen(false)}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 transition-colors active:scale-95"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>

          {/* Nav items */}
          <div className="px-4 pb-4 space-y-1">
            {secondaryNav.map(item => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setDrawerOpen(false)}
                  className={`flex items-center px-5 py-4 rounded-2xl transition-all duration-200 active:scale-[0.98] min-h-[56px] ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
                      : 'text-slate-700 hover:bg-slate-50 active:bg-slate-100'
                  }`}
                >
                  <span className="text-2xl mr-4">{item.icon}</span>
                  <span className="font-semibold text-base">{item.label}</span>
                  {isActive && (
                    <div className="ml-auto w-2 h-2 bg-white rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};
