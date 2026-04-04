'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export const Navbar = () => {
  const { user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg sticky top-0 z-40">
      <div className="px-4 sm:px-6">
        <div className="flex justify-between items-center h-14 sm:h-16">
          <Link href="/" className="text-xl sm:text-2xl font-black tracking-tight">
            💰 POS System
          </Link>
          <div className="flex gap-4 items-center">
            {user ? (
              <>
                <span className="text-[10px] sm:text-sm opacity-80 font-medium hidden sm:block">{user.email}</span>
                <button 
                  onClick={handleLogout}
                  className="bg-blue-700 hover:bg-blue-800 text-white px-3 py-1 rounded text-sm transition-colors"
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <span className="text-[10px] sm:text-sm opacity-80 font-medium hidden sm:block">Sistema de Punto de Venta</span>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
