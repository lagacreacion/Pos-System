'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

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
    <nav className="bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-lg sticky top-0 z-40">
      <div className="px-4 sm:px-6">
        <div className="flex justify-between items-center h-14 sm:h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
              <span className="text-white text-xs font-black">POS</span>
            </div>
            <span className="text-lg sm:text-xl font-black tracking-tight bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              Mi Negocio
            </span>
          </Link>
          <div className="flex gap-3 items-center">
            {user ? (
              <>
                <span className="text-[10px] sm:text-xs text-blue-200/60 font-medium hidden sm:block max-w-[180px] truncate">
                  {user.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 active:scale-95 min-h-[44px]"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Salir</span>
                </button>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </nav>
  );
};
