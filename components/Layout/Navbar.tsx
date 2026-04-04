'use client';

import Link from 'next/link';

export const Navbar = () => {
  return (
    <nav className="bg-blue-600 text-white shadow-lg sticky top-0 z-40">
      <div className="px-4 sm:px-6">
        <div className="flex justify-between items-center h-14 sm:h-16">
          <Link href="/" className="text-xl sm:text-2xl font-black tracking-tight">
            💰 POS System
          </Link>
          <span className="text-[10px] sm:text-sm opacity-80 font-medium hidden sm:block">Sistema de Punto de Venta</span>
        </div>
      </div>
    </nav>
  );
};
