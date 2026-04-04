# 🚀 GUÍA COMPLETA DE INSTALACIÓN Y CONFIGURACIÓN

## Paso 1: Preparar el Ambiente

### Requisitos
- Node.js 18 o superior instalado
- npm o yarn
- Cuenta en Google/Firebase (gratuita)

### Verificar Node.js
```bash
node --version
npm --version
```

## Paso 2: Instalar Dependencias

Abre la terminal en la carpeta `VENTAS Y INVENTARIO` y ejecuta:

```bash
npm install
```

Esto instalará todos los paquetes necesarios. Espera a que termine (puede tomar 2-3 minutos).

## Paso 3: Configurar Firebase

### 3.1 Crear proyecto en Firebase

1. Ve a [https://console.firebase.google.com](https://console.firebase.google.com)
2. Click en "Crear un proyecto"
3. Nombre: `POS System` (o el que prefieras)
4. Desactiva Google Analytics (opcional)
5. Crear proyecto

### 3.2 Crear aplicación web

1. En el proyecto, click en el ícono `</>` para crear una app web
2. Nombre de la app: `POS Web`
3. Registrar app
4. Copiar el código de configuración que aparece

Verás algo como:
```javascript
const firebaseConfig = {
  apiKey: "AIzaxxxxxxxxxxxx",
  authDomain: "pos-system-xxxxx.firebaseapp.com",
  projectId: "pos-system-xxxxx",
  storageBucket: "pos-system-xxxxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:xxxxxxxxxxxxxx"
};
```

### 3.3 Crear archivo .env.local

En la carpeta raíz (`VENTAS Y INVENTARIO/`), crea un archivo llamado `.env.local` con:

```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaxxxxxxxxxxxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=pos-system-xxxxx.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=pos-system-xxxxx
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=pos-system-xxxxx.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:xxxxxxxxxxxxxx
```

Reemplaza los valores con los de tu proyecto Firebase.

### 3.4 Activar Firestore

1. En Firebase Console, ve a "Firestore Database"
2. Click "Crear base de datos"
3. Modo: "Iniciar en modo de prueba"
4. Ubicación: Closest to you (ej: us-central1)
5. Crear

### 3.5 Crear colecciones en Firestore

Firebase crea las colecciones automáticamente cuando insertas datos, PERO puedes crearlas manualmente:

En Firestore Console:
1. Click "+ Crear colección"
2. Nombre: `products` → Crear
3. Click "+ Crear colección"
4. Nombre: `customers` → Crear
5. Repite para: `promotions`, `sales`, `debts`

(Saltable - se crearán automáticamente al usar la app)

## Paso 4: Ejecutar la Aplicación

```bash
npm run dev
```

Verás:
```
  ▲ Next.js 14.0.0
  - Local:        http://localhost:3000
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Paso 5: Primeras Acciones

### 5.1 Crear Productos

1. Ve a "Inventario" (menú izquierdo)
2. Click "+ Agregar Producto"
3. Ingresa:
   - Nombre: "Coca Cola"
   - Stock: 50
   - Precio: 5000
4. Click "Crear"

Repite para agregar más productos.

### 5.2 Crear Clientes (Opcional)

1. Ve a "Clientes"
2. Click "+ Agregar Cliente"
3. Ingresa nombre y teléfono
4. Click "Crear"

### 5.3 Crear Promociones (Opcional)

1. Ve a "Promociones"
2. Click "+ Crear Promoción"
3. Nombre: "Combo X2"
4. Selecciona 2 productos
5. Precio final: 9000
6. Click "Crear"

### 5.4 Realizar una Venta

1. Ve a "Venta Principal (POS)"
2. Selecciona productos del lado izquierdo
3. (Opcional) Selecciona un cliente
4. Elige método de pago:
   - **Efectivo**: Pago inmediato
   - **Transferencia**: Pago inmediato
   - **Crédito**: Requiere fecha límite
5. Click "Completar Venta"

### 5.5 Ver Reportes

- **Reporte Diario**: Selecciona fecha → Cargar Reporte
- **Reporte Mensual**: Elige año → Se cargan todos los meses
- **Analíticas**: Click "Actualizar" para ver estadísticas

## Paso 6: Desplegar en Vercel (Producción)

### 6.1 Preparar para Git

```bash
git init
git add .
git commit -m "Initial POS System commit"
```

### 6.2 Crear repositorio en GitHub

1. Ve a [https://github.com/new](https://github.com/new)
2. Nombre: `pos-system`
3. Crear repositorio

### 6.3 Subir código a GitHub

```bash
git remote add origin https://github.com/tu-usuario/pos-system.git
git branch -M main
git push -u origin main
```

### 6.4 Desplegar en Vercel

1. Ve a [https://vercel.com](https://vercel.com)
2. Click "Import Project"
3. Elige "From Git" → Conecta GitHub
4. Selecciona el repositorio `pos-system`
5. En "Environment Variables", agrega:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
6. Click "Deploy"

Tu app estará disponible en una URL como: `pos-system.vercel.app`

## Paso 7: Acceder desde iPhone

### Con Vercel (Recomendado)

1. Abre la URL de Vercel en Safari
2. Click compartir → "Agregar a pantalla de inicio"
3. ¡Hecho! Tendrás un ícono en tu pantalla

### Localmente (Sin conexión)

1. En la red local, accede: `http://IP-TU-COMPUTADORA:3000`
2. Abre en Safari → Compartir → "Agregar a pantalla de inicio"

## 🎓 Resumen de Módulos

| Módulo | Función |
|--------|---------|
| **Venta Principal** | Crear ventas rápido |
| **Inventario** | Gestionar stock |
| **Promociones** | Crear combos/descuentos |
| **Clientes** | Registro de clientes |
| **Por Cobrar** | Control de créditos |
| **Reporte Diario** | Resumen del día |
| **Reporte Mensual** | Análisis mensual |
| **Analíticas** | Estadísticas |

## ❓ Preguntas Frecuentes

**P: ¿Es necesario pagar por Firebase?**
R: No, el plan gratuito (Spark) es suficiente para comenzar. Se cobra solo si superas límites generosos.

**P: ¿Puedo usar esto en mi teléfono sin internet?**
R: La versión local requiere conexión a la computadora. Vercel funciona con internet.

**P: ¿Cómo cambio los colores?**
R: Edita `tailwind.config.js` y cambia los colores en la sección `theme.extend.colors`.

**P: ¿Los datos se pierden si apago la app?**
R: No, todo está guardado en Firebase. Volverá a cargar al abrir la app.

**P: ¿Puedo agregar más usuarios?**
R: Actualmente no hay login. Todos acceden con los mismos datos.

## 📞 Comandos Útiles

```bash
# Desarrollo
npm run dev

# Compilar para producción
npm run build

# Ejecutar versión compilada
npm start

# Linting (buscar errores)
npm run lint

# Limpiar caché de Node
rm -rf node_modules package-lock.json && npm install
```

## ✅ Checklist de Configuración

- [ ] Node.js 18+ instalado
- [ ] Proyecto Firebase creado
- [ ] Archivo .env.local configurado
- [ ] Firestore activado en Firebase
- [ ] npm install ejecutado
- [ ] npm run dev sin errores
- [ ] Puedo acceder a http://localhost:3000
- [ ] Puedo crear un producto
- [ ] Puedo realizar una venta
- [ ] Los datos se guardan en Firestore

¡Listo! Tu sistema POS está funcionando. 🎉

---

**Próximos pasos sugeridos:**
1. Agregar tus productos reales
2. Crear un cliente de prueba
3. Realizar una venta completa
4. Desplegar en Vercel para usarlo desde iPhone
