'use client';

import { Card } from '@/components/ui/Card';

export default function Home() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Bienvenido al Sistema POS
        </h1>
        <p className="text-gray-600">Gestiona tus ventas, inventario y clientes de forma eficiente</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card title="💳 Ventas">
          <p className="text-gray-600">Crea y gestiona tus ventas en tiempo real</p>
        </Card>

        <Card title="📦 Inventario">
          <p className="text-gray-600">Controla el stock de tus productos</p>
        </Card>

        <Card title="🎯 Promociones">
          <p className="text-gray-600">Crea combos y promociones especiales</p>
        </Card>

        <Card title="👥 Clientes">
          <p className="text-gray-600">Gestiona tu base de clientes</p>
        </Card>

        <Card title="💸 Por Cobrar">
          <p className="text-gray-600">Controla las deudas de tus clientes</p>
        </Card>

        <Card title="📊 Reporte Diario">
          <p className="text-gray-600">Resumen de ventas del día</p>
        </Card>

        <Card title="📈 Reporte Mensual">
          <p className="text-gray-600">Análisis de ventas mensuales</p>
        </Card>

        <Card title="📉 Analíticas">
          <p className="text-gray-600">Estadísticas de negocio</p>
        </Card>
      </div>

      <Card title="Instrucciones">
        <div className="space-y-2 text-sm text-gray-600">
          <p>1. Configura tus productos en la sección de Inventario</p>
          <p>2. Crea promociones para tus clientes en la sección de Promociones</p>
          <p>3. Registra tus clientes en la sección de Clientes</p>
          <p>4. Realiza ventas desde la sección de Venta Principal</p>
          <p>5. Consulta reportes y analíticas para monitorear tu negocio</p>
        </div>
      </Card>
    </div>
  );
}
