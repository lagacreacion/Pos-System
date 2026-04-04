'use client';

import Link from 'next/link';

export const Navbar = () => {
  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-bold">
            POS System
          </Link>
          <div className="flex gap-4">
            <span className="text-sm opacity-80">Sistema de Punto de Venta</span>
          </div>
        </div>
      </div>
    </nav>
  );
};
