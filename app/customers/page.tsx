'use client';

import { useState } from 'react';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
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
      setAlert({ type: 'success', message: 'Cliente creado correctamente' });
      setShowForm(false);
      setTimeout(() => setAlert(null), 3000);
    } catch (err) {
      setAlert({ type: 'error', message: 'Error al crear cliente' });
    }
  };

  const handleDeleteCustomer = async (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este cliente?')) {
      try {
        await deleteCustomer(id);
        setAlert({ type: 'success', message: 'Cliente eliminado' });
        setTimeout(() => setAlert(null), 3000);
      } catch (err) {
        setAlert({ type: 'error', message: 'Error al eliminar cliente' });
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Clientes</h1>
          <p className="text-gray-600">Gestiona tu base de clientes</p>
        </div>
        <Button variant="primary" onClick={() => setShowForm(true)}>
          + Agregar Cliente
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

      <Card title={`Clientes (${customers.length})`}>
        {loading ? (
          <div className="text-center py-8">Cargando clientes...</div>
        ) : customers.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No hay clientes</div>
        ) : (
          <CustomerList
            customers={customers}
            onDelete={handleDeleteCustomer}
          />
        )}
      </Card>

      <CustomerForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={handleCreateCustomer}
      />
    </div>
  );
}
