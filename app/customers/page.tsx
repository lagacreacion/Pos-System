'use client';

import { useState } from 'react';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { CustomerList } from '@/components/Customers/CustomerList';
import { CustomerForm } from '@/components/Customers/CustomerForm';
import { useCustomers } from '@/hooks/useCustomers';
import { Customer } from '@/types';

export default function CustomersPage() {
  const { customers, createCustomer, updateCustomer, deleteCustomer, loading, error } = useCustomers();
  const [showForm, setShowForm] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubmitCustomer = async (formData: any) => {
    try {
      if (selectedCustomer) {
        await updateCustomer(selectedCustomer.id, formData);
        setAlert({ type: 'success', message: 'Cliente actualizado correctamente' });
      } else {
        await createCustomer(formData);
        setAlert({ type: 'success', message: 'Cliente registrado con éxito' });
      }
      setShowForm(false);
      setSelectedCustomer(null);
      setTimeout(() => setAlert(null), 3000);
    } catch (err) {
      setAlert({ type: 'error', message: selectedCustomer ? 'Error al actualizar' : 'Error al crear cliente' });
    }
  };

  const handleDeleteCustomer = async (id: string) => {
    if (confirm('¿Eliminar este cliente permanentemente?')) {
      try {
        await deleteCustomer(id);
        setAlert({ type: 'success', message: 'Cliente eliminado' });
        setTimeout(() => setAlert(null), 3000);
      } catch (err) {
        setAlert({ type: 'error', message: 'Error al eliminar' });
      }
    }
  };

  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowForm(true);
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">Clientes</h1>
          <p className="text-gray-500 font-medium text-sm">Gestiona deudas y consumos</p>
        </div>
        <Button
          variant="primary"
          onClick={() => {
            setSelectedCustomer(null);
            setShowForm(true);
          }}
          className="w-full sm:w-auto shadow-xl shadow-blue-200 py-4 px-8 rounded-2xl font-black"
        >
          + Nuevo Cliente
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

      <div className="bg-white rounded-3xl border-2 border-gray-50 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
          <h2 className="text-lg sm:text-xl font-black text-gray-800">
            Directorio <span className="text-blue-600 ml-1">({customers.length})</span>
          </h2>
        </div>
        <div className="p-2 sm:p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-400 font-bold animate-pulse">Cargando clientes...</p>
            </div>
          ) : customers.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">👥</div>
              <p className="text-gray-400 font-black text-xl">Sin clientes</p>
              <p className="text-gray-400 text-sm">Registra un cliente para llevar el control</p>
            </div>
          ) : (
            <CustomerList
              customers={customers}
              onDelete={handleDeleteCustomer}
              onEdit={handleEdit}
            />
          )}
        </div>
      </div>

      <CustomerForm
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setSelectedCustomer(null);
        }}
        onSubmit={handleSubmitCustomer}
        initialData={selectedCustomer}
      />
    </div>
  );
}
