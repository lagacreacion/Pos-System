'use client';

import { useState, useMemo } from 'react';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ProductList } from '@/components/Inventory/ProductList';
import { ProductForm } from '@/components/Inventory/ProductForm';
import { StockAlert } from '@/components/Inventory/StockAlert';
import { useProducts } from '@/hooks/useProducts';
import { useConfirm } from '@/components/ui/ConfirmDialog';
import { Product } from '@/types';

export default function InventoryPage() {
  const { products, createProduct, updateProduct, deleteProduct, loading, error } = useProducts();
  const [showForm, setShowForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const { confirm, ConfirmDialog } = useConfirm();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'stock' | 'price'>('name');

  const sortedProducts = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return [...products]
      .filter(p => p.name.toLowerCase().includes(term))
      .sort((a, b) => {
        if (sortBy === 'stock') return a.stock - b.stock;
        if (sortBy === 'price') return b.price - a.price;
        return a.name.localeCompare(b.name);
      });
  }, [products, searchTerm, sortBy]);

  const handleAdjustStock = async (product: Product, delta: number) => {
    const next = product.stock + delta;
    if (next < 0) return;
    try {
      await updateProduct(product.id, { stock: next });
    } catch {
      setAlert({ type: 'error', message: 'Error al ajustar stock' });
    }
  };

  const handleCreateProduct = async (formData: any) => {
    try {
      if (selectedProduct) {
        await updateProduct(selectedProduct.id, formData);
        setAlert({ type: 'success', message: 'Producto actualizado correctamente' });
      } else {
        await createProduct(formData);
        setAlert({ type: 'success', message: 'Producto creado correctamente' });
      }
      setShowForm(false);
      setSelectedProduct(null);
      setTimeout(() => setAlert(null), 3000);
    } catch (err) {
      setAlert({ type: 'error', message: selectedProduct ? 'Error al actualizar' : 'Error al crear' });
    }
  };

  const handleDeleteProduct = async (id: string) => {
    const ok = await confirm({ title: 'Eliminar producto', message: '¿Seguro que quieres eliminar este producto? Esta acción no se puede deshacer.', confirmLabel: 'Eliminar' });
    if (ok) {
      try {
        await deleteProduct(id);
        setAlert({ type: 'success', message: 'Producto eliminado' });
        setTimeout(() => setAlert(null), 3000);
      } catch (err) {
        setAlert({ type: 'error', message: 'Error al eliminar producto' });
      }
    }
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setShowForm(true);
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Inventario</h1>
          <p className="text-gray-500 font-medium">Control total de tus existencias</p>
        </div>
        <Button 
          variant="primary" 
          onClick={() => {
            setSelectedProduct(null);
            setShowForm(true);
          }}
          className="w-full sm:w-auto shadow-xl shadow-blue-200 py-4 px-8 rounded-2xl font-black"
        >
          + Nuevo Producto
        </Button>
      </div>

      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
          className="animate-in slide-in-from-top-4 duration-300"
        />
      )}

      {error && <Alert type="error" message={error} />}

      <div className="grid grid-cols-1 gap-6">
        <StockAlert products={products} />
        
        <div className="bg-white rounded-3xl border-2 border-gray-50 shadow-sm overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-slate-100 bg-slate-50/50 space-y-3">
            <div className="flex justify-between items-center gap-3">
              <h2 className="text-lg sm:text-xl font-black text-gray-800">
                Productos <span className="text-blue-600 ml-1">({sortedProducts.length})</span>
              </h2>
              <div className="flex gap-1 bg-white rounded-xl p-1 border border-slate-100">
                {([['name','A-Z'],['stock','Stock'],['price','Precio']] as const).map(([key,label]) => (
                  <button
                    key={key}
                    onClick={() => setSortBy(key)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${sortBy===key ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            {products.length > 0 && (
              <Input
                placeholder="🔍 Buscar producto..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                fullWidth
              />
            )}
          </div>
          <div className="p-2 sm:p-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-400 font-bold animate-pulse">Sincronizando inventario...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">📦</div>
                <p className="text-gray-400 font-black text-xl">Tu inventario está vacío</p>
                <p className="text-gray-400">Agrega productos para comenzar a vender</p>
              </div>
            ) : (
              <ProductList
                products={sortedProducts}
                onDelete={handleDeleteProduct}
                onEdit={handleEdit}
                onAdjustStock={handleAdjustStock}
              />
            )}
          </div>
        </div>
      </div>

      <ConfirmDialog />

      <ProductForm
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setSelectedProduct(null);
        }}
        onSubmit={handleCreateProduct}
        initialData={selectedProduct}
      />
    </div>
  );
}
