'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/Button';

import { migrateExistingDataToUser } from '@/lib/migration-script';

export default function MigratePage() {
  const { user } = useAuth();
  const [status, setStatus] = useState<string>('Esperando...');
  const [loading, setLoading] = useState(false);

  const startMigration = async () => {
    if (!user) {
      setStatus('Error: Debes iniciar sesión para continuar.');
      return;
    }

    setLoading(true);
    setStatus('Iniciando migración segura...');

    try {
      await migrateExistingDataToUser(user.uid);
      setStatus('¡Migración Completada con Éxito! Ya puedes ver tu inventario.');
    } catch (error: any) {
      console.error(error);
      setStatus(`Error durante la migración: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
    } catch (error: any) {
      console.error(error);
      setStatus(`Error durante la migración: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-10 px-4 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Restauración de Datos</h1>
      <p className="text-gray-600 text-sm">
        Esta herramienta copiará los datos antiguos (públicos) al nuevo entorno SaaS de la cuenta actualmente conectada (<strong>{user?.email || 'No iniciaste sesión'}</strong>).
      </p>

      <div className="bg-blue-50 p-4 border border-blue-100 rounded-lg">
        <p className="font-mono text-xs text-blue-800 break-words">{status}</p>
      </div>

      <Button 
        onClick={startMigration} 
        disabled={loading || !user}
        variant="primary" 
        className="w-full h-12 text-lg font-bold"
      >
        {loading ? 'Copiando datos...' : 'Recuperar Mi Inventario Anterior'}
      </Button>
    </div>
  );
}
