'use client';

import { useState } from 'react';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { PromotionList } from '@/components/Promotions/PromotionList';
import { PromotionForm } from '@/components/Promotions/PromotionForm';
import { usePromotions } from '@/hooks/usePromotions';
import { useProducts } from '@/hooks/useProducts';
import { useConfirm } from '@/components/ui/ConfirmDialog';

export default function PromotionsPage() {
  const { promotions, createPromotion, deletePromotion, loading, error } = usePromotions();
  const { products } = useProducts();
  const [showForm, setShowForm] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { confirm, ConfirmDialog } = useConfirm();

  const filteredPromotions = [...promotions]
    .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name));

  const handleCreatePromotion = async (formData: any) => {
    try {
      await createPromotion(formData);
      setAlert({ type: 'success', message: 'Promoción creada correctamente' });
      setShowForm(false);
      setTimeout(() => setAlert(null), 3000);
    } catch (err) {
      setAlert({ type: 'error', message: 'Error al crear promoción' });
    }
  };

  const handleDeletePromotion = async (id: string) => {
    const ok = await confirm({ title: 'Eliminar promoción', message: '¿Seguro que quieres eliminar esta promoción?', confirmLabel: 'Eliminar' });
    if (ok) {
      try {
        await deletePromotion(id);
        setAlert({ type: 'success', message: 'Promoción eliminada' });
        setTimeout(() => setAlert(null), 3000);
      } catch (err) {
        setAlert({ type: 'error', message: 'Error al eliminar promoción' });
      }
    }
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">Promociones</h1>
          <p className="text-gray-500 font-medium text-sm">Crea combos y promociones especiales</p>
        </div>
        <Button
          variant="primary"
          onClick={() => setShowForm(true)}
          className="w-full sm:w-auto shadow-xl shadow-blue-200 py-4 px-8 rounded-2xl font-black"
        >
          + Crear Promoción
        </Button>
      </div>

      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}
      {error && <Alert type="error" message={error} />}

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="text-lg sm:text-xl font-black text-gray-800">
            Combos <span className="text-blue-600 ml-1">({filteredPromotions.length})</span>
          </h2>
          {promotions.length > 0 && (
            <div className="w-full md:w-72">
              <Input
                placeholder="🔍 Buscar promoción..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                fullWidth
              />
            </div>
          )}
        </div>
        <div className="p-3 sm:p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-400 font-bold animate-pulse">Cargando promociones...</p>
            </div>
          ) : promotions.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🎯</div>
              <p className="text-gray-400 font-black text-xl">Sin promociones</p>
              <p className="text-gray-400 text-sm">Crea un combo para impulsar tus ventas</p>
            </div>
          ) : filteredPromotions.length === 0 ? (
            <div className="text-center py-16 text-slate-400 font-semibold">Sin resultados para “{searchTerm}”</div>
          ) : (
            <PromotionList
              promotions={filteredPromotions}
              onDelete={handleDeletePromotion}
              products={products}
            />
          )}
        </div>
      </div>

      <ConfirmDialog />

      <PromotionForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        products={products}
        onSubmit={handleCreatePromotion}
      />
    </div>
  );
}
