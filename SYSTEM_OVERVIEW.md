# 📊 Reporte del Sistema: Ventas e Inventario (POS)

Este documento proporciona una visión general organizada de todas las funcionalidades, arquitectura y componentes técnicos de la aplicación.

## 🌟 Resumen del Proyecto
La aplicación es un Sistema de Punto de Venta (POS) moderno, diseñado para gestionar ventas, inventarios, promociones, clientes y reportes financieros de manera eficiente. Recientemente ha sido actualizado a una **arquitectura multi-usuario**, permitiendo que múltiples negocios o usuarios utilicen el mismo sistema manteniendo sus datos aislados de forma segura.

---

## 🛠️ Stack Tecnológico
- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Lenguaje**: [TypeScript](https://www.typescriptlang.org/)
- **Base de Datos & Auth**: [Firebase](https://firebase.google.com/) (Firestore & Authentication)
- **Estilos**: [Tailwind CSS](https://tailwindcss.com/)
- **Iconografía**: [Lucide React](https://lucide.dev/)
- **Visualización de Datos**: [Recharts](https://recharts.org/)

---

## 📁 Estructura de Módulos

### 1. 🛒 Punto de Venta (POS)
El núcleo de la aplicación.
- **Ubicación**: `/app/sales` y `/services/salesService.ts`
- **Funciones**:
  - Selección rápida de productos y promociones.
  - Búsqueda en tiempo real.
  - Gestión de carrito de compras.
  - Múltiples métodos de pago (Efectivo, Transferencia, Crédito).
  - Integración con el sistema de cuentas por cobrar (Deudas).

### 2. 📦 Gestión de Inventario
Control total sobre los productos.
- **Ubicación**: `/app/inventory` y `/services/productService.ts`
- **Funciones**:
  - CRUD completo de productos (Crear, Leer, Actualizar, Borrar).
  - Control de stock dinámico.
  - Alertas visuales de inventario bajo.

### 3. 🏷️ Promociones y Combos
Flexibilidad en precios.
- **Ubicación**: `/app/promotions` y `/services/promotionService.ts`
- **Funciones**:
  - Creación de combos que agrupan múltiples productos.
  - Precios especiales para promociones.
  - Descuentos por volumen.

### 4. 👥 Gestión de Clientes
Base de datos de compradores.
- **Ubicación**: `/app/customers` y `/services/customerService.ts`
- **Funciones**:
  - Registro de datos personales y contacto.
  - Historial de transacciones vinculado.

### 5. 💸 Cuentas por Cobrar (Deudas)
Control de ventas a crédito.
- **Ubicación**: `/app/debts` y `/services/debtService.ts`
- **Funciones**:
  - Seguimiento automático de ventas marcadas como "Crédito".
  - Gestión de pagos parciales.
  - Alertas de deudas pendientes.

### 6. 📈 Reportes y Analíticas
Visibilidad financiera.
- **Ubicación**: `/app/daily-report`, `/app/monthly-report`, `/app/analytics`, y `/services/reportService.ts`
- **Funciones**:
  - **Reporte Diario**: Resumen detallado de ventas por fecha.
  - **Reporte Mensual**: Comparativa de ingresos y ventas por mes.
  - **Analíticas**: Gráficos interactivos de rendimiento, productos más vendidos y tendencias de ingresos.

---

## 🔒 Arquitectura y Seguridad

### Arquitectura Multi-Usuario
El sistema utiliza un enfoque de **colecciones planas** en Firestore:
- Cada documento (producto, venta, deuda, etc.) contiene un campo `userId`.
- Todas las consultas están estrictamente filtradas por el ID del usuario autenticado.
- Esto garantiza que ningún usuario pueda ver o modificar datos de otro.

### Sistema de Autenticación
- Integrado con **Firebase Auth**.
- Flujo de login persistente.
- Protección de rutas para asegurar que solo usuarios autenticados accedan a la gestión.

---

## 🚀 Guía de Configuración Rápida

### Variables de Entorno (`.env.local`)
Se requieren las siguientes claves de Firebase para el funcionamiento:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

### Comandos Útiles
- `npm install`: Instalar dependencias.
- `npm run dev`: Iniciar servidor de desarrollo.
- `npm run build`: Preparar para producción.

---
*Reporte generado automáticamente para documentar el estado actual de la aplicación.*
