'use client';

import { useState } from 'react';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { PromotionList } from '@/components/Promotions/PromotionList';
import { PromotionForm } from '@/components/Promotions/PromotionForm';
import { usePromotions } from '@/hooks/usePromotions';
import { useProducts } from '@/hooks/useProducts';

export default function PromotionsPage() {
  const { promotions, createPromotion, deletePromotion, loading, error } = usePromotions();
  const { products } = useProducts();
  const [showForm, setShowForm] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

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
    if (confirm('¿Estás seguro de que quieres eliminar esta promoción?')) {
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
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Promociones</h1>
          <p className="text-gray-600">Crea combos y promociones especiales</p>
        </div>
        <Button variant="primary" onClick={() => setShowForm(true)}>
          + Crear Promoción
        </Button>
      </div>

      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      {error && <Alert type="error" message={error} />}

      <Card title={`Promociones (${promotions.length})`}>
        {loading ? (
          <div className="text-center py-8">Cargando promociones...</div>
        ) : promotions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No hay promociones</div>
        ) : (
          <PromotionList
            promotions={promotions}
            onDelete={handleDeletePromotion}
          />
        )}
      </Card>

      <PromotionForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        products={products}
        onSubmit={handleCreatePromotion}
      />
    </div>
  );
}
