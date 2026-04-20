'use client';

import { useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function DebugPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const testFetch = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, 'products'));
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setData(docs);
    } catch (e) {
      console.error(e);
      alert('Error (probablemente reglas de seguridad): ' + (e as Error).message);
    }
    setLoading(false);
  };

  return (
    <div className="p-8">
      <button onClick={testFetch} className="bg-blue-500 text-white p-2">
        Leer Firebase (Productos)
      </button>
      <pre className="mt-4 text-xs bg-gray-100 p-4">
        {loading ? 'Cargando...' : JSON.stringify(data.slice(0, 5), null, 2)}
      </pre>
    </div>
  );
}
