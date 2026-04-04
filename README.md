# POS System - Sistema de Punto de Venta

Aplicación web completa para gestionar ventas, inventario, clientes y deudas (fiados). Construida con Next.js 14, React 18, TypeScript y Firebase Firestore.

## 🚀 Características

### Módulos Principales

1. **Venta Principal (POS)**
   - Crear ventas en tiempo real
   - Selector de productos y promociones
   - Carrito de compras dinámico
   - Métodos de pago: Efectivo, Transferencia, Crédito (Fiado)
   - Crear clientes sobre la marcha

2. **Inventario**
   - CRUD completo de productos
   - Alertas de stock bajo (< 5 unidades)
   - Gestión de precios y costos
   - Control de stock en tiempo real

3. **Promociones**
   - Crear combos con múltiples productos
   - Descuentos automáticos
   - Impacto real en el inventario

4. **Clientes**
   - Crear y gestionar clientes
   - Historial de compras
   - Control de deudas totales

5. **Por Cobrar (Fiados)**
   - Gestión de créditos pendientes
   - Fecha límite de pago
   - Marcar como pagado
   - Seguimiento por cliente

6. **Reportes**
   - Reporte Diario: Vendido, Cobrado, Por Cobrar, Clientes
   - Reporte Mensual: Análisis por mes
   - Analíticas: Productos top, Clientes frecuentes, Ingresos totales

## 🛠️ Stack Tecnológico

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Base de Datos**: Firebase Firestore
- **Estado**: Hooks de React
- **Despliegue**: Vercel
- **PWA**: Instalable en iPhone y Android

## 📋 Instalación

### Requisitos Previos
- Node.js 18+
- npm o yarn
- Cuenta Firebase

### Pasos

1. **Clonar o crear el proyecto**
```bash
cd "VENTAS Y INVENTARIO"
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar Firebase**
   - Crear proyecto en [Firebase Console](https://console.firebase.google.com)
   - Copiar configuración
   - Crear archivo `.env.local`:

```
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id
```

4. **Crear colecciones en Firestore**
   - `products`
   - `customers`
   - `promotions`
   - `sales`
   - `debts`

5. **Ejecutar en desarrollo**
```bash
npm run dev
```
Acceder a `http://localhost:3000`

## 📁 Estructura del Proyecto

```
VENTAS Y INVENTARIO/
├── app/
│   ├── layout.tsx          # Layout principal
│   ├── page.tsx            # Página inicio
│   ├── sales/              # Módulo de ventas
│   ├── inventory/          # Módulo de inventario
│   ├── promotions/         # Módulo de promociones
│   ├── customers/          # Módulo de clientes
│   ├── debts/              # Módulo de por cobrar
│   ├── daily-report/       # Reporte diario
│   ├── monthly-report/     # Reporte mensual
│   └── analytics/          # Analíticas
├── components/
│   ├── ui/                 # Componentes UI base
│   ├── Layout/             # Layout components
│   ├── Sales/              # Componentes de ventas
│   ├── Inventory/          # Componentes de inventario
│   ├── Promotions/         # Componentes de promociones
│   ├── Customers/          # Componentes de clientes
│   └── Reports/            # Componentes de reportes
├── hooks/                  # Custom hooks
├── services/               # Servicios Firebase
├── lib/                    # Utilidades
├── types/                  # Tipos TypeScript
├── public/                 # Archivos públicos
├── package.json
└── tsconfig.json
```

## 🚀 Despliegue en Vercel

1. **Crear repositorio en GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/tu-usuario/repo.git
git branch -M main
git push -u origin main
```

2. **Desplegar en Vercel**
   - Ir a [Vercel](https://vercel.com)
   - Conectar repositorio GitHub
   - Agregar variables de entorno (Firebase)
   - Deploy automático

## 📱 PWA - Instalable

La aplicación es una PWA (Progressive Web App) y puede instalarse en:

- **iPhone**: Abre en Safari → Compartir → "Agregar a pantalla de inicio"
- **Android**: Abre en Chrome → Menú → "Instalar app"
- **Escritorio**: Botón de instalación en Chrome/Edge

## 📊 Base de Datos - Firestore

### Colecciones

**products**
```
- id: string
- name: string
- stock: number
- price: number
- cost?: number
- createdAt: timestamp
```

**customers**
```
- id: string
- name: string
- phone?: string
- totalDebt: number
- createdAt: timestamp
```

**promotions**
```
- id: string
- name: string
- products: [{productId, quantity}]
- finalPrice: number
- createdAt: timestamp
```

**sales**
```
- id: string
- customerId?: string
- items: [{id, name, price, quantity, type}]
- totalAmount: number
- paymentMethod: 'cash' | 'transfer' | 'credit'
- date: timestamp
- debtId?: string
```

**debts**
```
- id: string
- customerId: string
- saleId: string
- amount: number
- dueDate: date
- status: 'pending' | 'paid'
- createdAt: timestamp
```

## 🎯 Flujo de Uso

1. **Configurar Inventario**: Agregar productos con stock y precios
2. **Crear Promociones**: Combos con descuentos
3. **Registrar Clientes**: Base de clientes para ventas a crédito
4. **Realizar Ventas**: POS rápido y eficiente
5. **Seguimiento**: Reportes y analíticas del negocio
6. **Control de Deudas**: Gestión de créditos pendientes

## ⚙️ Configuración Adicional

### Firestore Security Rules (Producción)

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Environment Variables

- Todas las variables de Firebase deben empezar con `NEXT_PUBLIC_` para ser accesibles en el cliente

## 🐛 Solución de Problemas

**Error: "Missing API Key"**
- Verificar que `.env.local` existe con las variables correctas
- Reiniciar servidor de desarrollo

**Error: "No collection found"**
- Crear manualmente las colecciones en Firestore Console
- Las colecciones se crean automáticamente al insertar el primer documento

**Error: "Stock insuficiente"**
- Asegurar que el producto tiene stock disponible
- Verificar que no está siendo vendido desde otra venta simultáneamente

## 📝 Licencia

Este proyecto es de uso libre para propósitos de negocio.

## 👨‍💻 Desarrollo

```bash
# Desarrollo
npm run dev

# Build
npm run build

# Ejecutar build
npm start

# Linting
npm run lint
```

## 📞 Soporte

Para problemas o sugerencias, contactar al equipo de desarrollo.

---

**Versión**: 1.0.0  
**Última actualización**: Abril 2026
