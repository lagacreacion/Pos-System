'use client';

import { useState } from 'react';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ProductList } from '@/components/Inventory/ProductList';
import { ProductForm } from '@/components/Inventory/ProductForm';
import { StockAlert } from '@/components/Inventory/StockAlert';
import { useProducts } from '@/hooks/useProducts';

export default function InventoryPage() {
  const { products, createProduct, deleteProduct, loading, error } = useProducts();
  const [showForm, setShowForm] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleCreateProduct = async (formData: any) => {
    try {
      await createProduct(formData);
      setAlert({ type: 'success', message: 'Producto creado correctamente' });
      setShowForm(false);
      setTimeout(() => setAlert(null), 3000);
    } catch (err) {
      setAlert({ type: 'error', message: 'Error al crear producto' });
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      try {
        await deleteProduct(id);
        setAlert({ type: 'success', message: 'Producto eliminado' });
        setTimeout(() => setAlert(null), 3000);
      } catch (err) {
        setAlert({ type: 'error', message: 'Error al eliminar producto' });
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inventario</h1>
          <p className="text-gray-600">Gestiona tus productos</p>
        </div>
        <Button variant="primary" onClick={() => setShowForm(true)}>
          + Agregar Producto
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

      <StockAlert products={products} />

      <Card title={`Productos (${products.length})`}>
        {loading ? (
          <div className="text-center py-8">Cargando productos...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No hay productos</div>
        ) : (
          <ProductList
            products={products}
            onDelete={handleDeleteProduct}
          />
        )}
      </Card>

      <ProductForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={handleCreateProduct}
      />
    </div>
  );
}
