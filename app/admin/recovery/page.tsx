'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, updateDoc, doc, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Alert } from '@/components/ui/Alert';

const COLLECTIONS = ['products', 'sales', 'customers', 'debts', 'promotions'];

export default function AdminRecoveryPage() {
  const [sourceId, setSourceId] = useState('');
  const [targetId, setTargetId] = useState('');
  const [stats, setStats] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error' | 'warning', message: string } | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    const currStats: Record<string, number> = {};
    try {
      for (const col of COLLECTIONS) {
        const snap = await getDocs(collection(db, col));
        const orphans = snap.docs.filter(d => {
          const data = d.data();
          if (sourceId.trim()) {
            return data.userId === sourceId.trim();
          }
          return !data.userId;
        }).length;
        currStats[col] = orphans;
      }
      setStats(currStats);
      setAlert({ type: 'success', message: 'Estadísticas de huérfanos cargadas correctamente.' });
      setTimeout(() => setAlert(null), 3000);
    } catch (err: any) {
      setAlert({ type: 'error', message: 'Error cargando datos: ' + err.message });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStats();
  }, [sourceId]);

  const totalOrphans = Object.values(stats).reduce((a, b) => a + b, 0);

  const handleMigrate = async (mode: 'move' | 'clone') => {
    if (!targetId.trim()) {
      setAlert({ type: 'error', message: 'Debes ingresar un ID de usuario destino.' });
      return;
    }
    
    if (totalOrphans === 0) {
      setAlert({ type: 'warning', message: 'No hay datos para procesar con el origen seleccionado.' });
      return;
    }

    if (!confirm(`¿Estás seguro de querer ${mode === 'move' ? 'MOVER' : 'CLONAR'} ${totalOrphans} registros al ID: ${targetId}?`)) {
      return;
    }

    setLoading(true);
    let processedCount = 0;

    try {
      for (const colName of COLLECTIONS) {
        const colRef = collection(db, colName);
        const snapshot = await getDocs(colRef);
        
        for (const d of snapshot.docs) {
          const data = d.data();
          const matchCondition = sourceId.trim() ? data.userId === sourceId.trim() : !data.userId;
          if (matchCondition) {
            if (mode === 'move') {
              // Move: Update the document with the new userId
              const docRef = doc(db, colName, d.id);
              await updateDoc(docRef, { userId: targetId });
            } else {
              // Clone: Create a new document with the new userId, keep the orphan
              await addDoc(collection(db, colName), {
                ...data,
                userId: targetId
              });
            }
            processedCount++;
          }
        }
      }
      setAlert({ type: 'success', message: `¡Se han ${mode === 'move' ? 'movido' : 'clonado'} ${processedCount} registros exitosamente!` });
      if (mode === 'move') {
        fetchStats(); // Update stats if we moved them (orphans gone)
      }
    } catch (err: any) {
      setAlert({ type: 'error', message: 'Error durante la operación: ' + err.message });
    }
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8 fade-in">
      <div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Panel de Recuperación / Traspaso</h1>
        <p className="text-gray-500 font-medium">Transfiere datos de un ID antiguo a un ID nuevo, o asigna datos huérfanos a usuarios específicos.</p>
      </div>

      {alert && (
        <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />
      )}

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-4">Estado de Datos Huérfanos</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {COLLECTIONS.map(col => (
              <div key={col} className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col items-center justify-center">
                <span className="text-sm font-bold text-gray-400 capitalize">{col}</span>
                <span className="text-3xl font-black text-indigo-600">
                  {stats[col] !== undefined ? stats[col] : '-'}
                </span>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-4 text-center border-t border-gray-50 pt-4">
            Total general: <strong className="text-gray-900">{totalOrphans} registros encontrados</strong>
          </p>
        </div>

        <div className="bg-yellow-50 border border-yellow-100 p-6 rounded-xl space-y-4">
          <h3 className="font-bold text-yellow-900">1. Buscar Datos de Origen</h3>
          <p className="text-sm text-yellow-800">
            ¿De quién provienen los datos? Si dejas esto en blanco, el sistema buscará datos &quot;huérfanos&quot;. Si tus clientes perdieron sus datos porque su ID cambió, pega aquí el <strong>ID ANTIGUO</strong>.
          </p>
          <Input 
            label="Source User ID (Origen, opcional)"
            placeholder="Dejar en blanco para buscar huérfanos, o pegar ID viejo..."
            value={sourceId}
            onChange={(e) => setSourceId(e.target.value)}
            fullWidth
          />
        </div>

        <div className="bg-blue-50 border border-blue-100 p-6 rounded-xl space-y-4">
          <h3 className="font-bold text-blue-900">2. Asignar al Nuevo Cliente</h3>
          <p className="text-sm text-blue-800">
            Ingresa el <strong>ID NUEVO / ACTUAL</strong> del usuario de Firebase al que deseas entregarle estos datos.
          </p>
          
          <Input 
            label="Target User ID"
            placeholder="Pegar ID aquí..."
            value={targetId}
            onChange={(e) => setTargetId(e.target.value)}
            fullWidth
          />

          <div className="flex gap-3 pt-2">
            <Button 
              variant="primary" 
              onClick={() => handleMigrate('move')}
              loading={loading}
              className="flex-1"
            >
              Mover Todos los Datos (Recomendado)
            </Button>
            <Button 
              variant="secondary" 
              onClick={() => handleMigrate('clone')}
              loading={loading}
              className="flex-1"
            >
              Clonar Datos (Duplicar)
            </Button>
          </div>
          <p className="text-xs text-blue-600 mt-2">
            * <strong>Mover:</strong> Asigna los datos y dejan de ser huérfanos.<br/>
            * <strong>Clonar:</strong> Duplica los datos para este usuario. Si necesitas darle los mismos datos a los 3 clientes, clónalos a los dos primeros y muévelos al último.
          </p>
        </div>

        <div className="flex justify-center pt-2">
          <Button variant="secondary" onClick={fetchStats} loading={loading}>
            Actualizar Contadores
          </Button>
        </div>
      </div>
    </div>
  );
}
