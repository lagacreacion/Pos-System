'use client';

import { useState } from 'react';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { CustomerList } from '@/components/Customers/CustomerList';
import { CustomerForm } from '@/components/Customers/CustomerForm';
import { useCustomers } from '@/hooks/useCustomers';

export default function CustomersPage() {
  const { customers, createCustomer, deleteCustomer, loading, error } = useCustomers();
  const [showForm, setShowForm] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleCreateCustomer = async (formData: any) => {
    try {
      await createCustomer(formData);
      setAlert({ type: 'success', message: 'Cliente registrado con éxito' });
      setShowForm(false);
      setTimeout(() => setAlert(null), 3000);
    } catch (err) {
      setAlert({ type: 'error', message: 'No se pudo crear el cliente' });
    }
  };

  const handleDeleteCustomer = async (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este cliente? Se borrarán sus datos permanentemente.')) {
      try {
        await deleteCustomer(id);
        setAlert({ type: 'success', message: 'Cliente eliminado del sistema' });
        setTimeout(() => setAlert(null), 3000);
      } catch (err) {
        setAlert({ type: 'error', message: 'Error al intentar eliminar' });
      }
    }
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-2 sm:px-0">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Directorio de Clientes</h1>
          <p className="text-gray-500 font-medium">Gestiona deudas y consumos de tus clientes</p>
        </div>
        <Button 
          variant="primary" 
          onClick={() => setShowForm(true)}
          className="w-full sm:w-auto shadow-xl shadow-blue-200 py-4 px-8 rounded-2xl font-black"
        >
          + Agregar Cliente
        </Button>
      </div>

      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
          className="mx-2 sm:mx-0 animate-in slide-in-from-top-4"
        />
      )}

      {error && <Alert type="error" message={error} className="mx-2 sm:mx-0" />}

      <div className="bg-white rounded-3xl border-2 border-gray-50 shadow-sm overflow-hidden mx-2 sm:mx-0">
        <div className="p-6 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
          <h2 className="text-xl font-black text-gray-800">
            Lista de Clientes <span className="text-blue-600 ml-1">({customers.length})</span>
          </h2>
        </div>
        <div className="p-3 sm:p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-400 font-bold animate-pulse">Obteniendo datos de clientes...</p>
            </div>
          ) : customers.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">👥</div>
              <p className="text-gray-400 font-black text-xl">Sin clientes registrados</p>
              <p className="text-gray-400">Registra un cliente para llevar el control de sus compras</p>
            </div>
          ) : (
            <CustomerList
              customers={customers}
              onDelete={handleDeleteCustomer}
            />
          )}
        </div>
      </div>

      <CustomerForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={handleCreateCustomer}
      />
    </div>
  );
}
