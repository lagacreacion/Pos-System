'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { useAuth } from '@/hooks/useAuth';
import { migrateExistingDataToUser } from '@/lib/migration-script';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const isLoginPage = pathname === '/login';

  useEffect(() => {
    const handleAutomaticMigration = async () => {
      if (!user || isLoginPage) return;

      const migrationKey = `migration_done_${user.uid}`;
      const alreadyDone = localStorage.getItem(migrationKey);

      if (!alreadyDone) {
        try {
          const updatedCount = await migrateExistingDataToUser(user.uid);
          localStorage.setItem(migrationKey, 'true');
          
          // If we actually merged data, we must do a full reload to ensure all hooks refetch
          if (updatedCount > 0) {
            window.location.reload();
          }
        } catch (error) {
          console.error("Error en migración automática:", error);
        }
      }
    };

    handleAutomaticMigration();
  }, [user, isLoginPage, router]);

  if (isLoginPage) {
    return <main className="min-h-screen">{children}</main>;
  }

  return (
    <>
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-3 sm:p-6 max-w-7xl mx-auto w-full min-h-screen pb-24 lg:pb-6">
          {children}
        </main>
      </div>
    </>
  );
}
