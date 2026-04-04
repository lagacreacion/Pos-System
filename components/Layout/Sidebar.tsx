'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/sales', label: 'Venta Principal', icon: '💳' },
  { href: '/inventory', label: 'Inventario', icon: '📦' },
  { href: '/promotions', label: 'Promociones', icon: '🎯' },
  { href: '/customers', label: 'Clientes', icon: '👥' },
  { href: '/debts', label: 'Por Cobrar', icon: '💸' },
  { href: '/daily-report', label: 'Reporte Diario', icon: '📊' },
  { href: '/monthly-report', label: 'Reporte Mensual', icon: '📈' },
  { href: '/analytics', label: 'Analíticas', icon: '📉' },
];

export const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="bg-gray-900 text-white w-64 min-h-screen p-4">
      <div className="space-y-2">
        {navItems.map(item => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-4 py-3 rounded transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              <span className="mr-2">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </div>
    </aside>
  );
};
