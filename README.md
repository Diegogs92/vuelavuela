# Vuela Vuela - Agencia de Viajes Personalizada

Web app para gestionar solicitudes de viajes personalizados, donde los clientes pueden especificar sus preferencias y recibir ofertas del agente.

## Características

- Autenticación con Google (NextAuth.js)
- Formulario paso a paso para preferencias de viaje
- Panel de administración para el agente
- Sistema de ofertas y aceptación/rechazo
- Notificaciones por email (Resend)
- Base de datos en tiempo real (Firebase Firestore)

## Stack Tecnológico

- **Frontend**: Next.js 15 (App Router) con TypeScript
- **Autenticación**: NextAuth.js con Google Provider
- **Base de datos**: Firebase Firestore
- **Emails**: Resend
- **Estilos**: Tailwind CSS
- **Hosting**: Vercel (recomendado)

## Configuración Inicial

### 1. Clonar el repositorio

```bash
git clone <tu-repositorio>
cd vuelavuela
npm install
```

### 2. Configurar Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto
3. Habilita Firestore Database
4. Ve a Project Settings > General y copia la configuración web
5. Ve a Project Settings > Service Accounts y genera una nueva clave privada (descarga el JSON)

### 3. Configurar Google OAuth

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Ve a APIs & Services > Credentials
4. Crea credenciales OAuth 2.0 Client ID
5. Agrega los URIs autorizados:
   - http://localhost:3000 (desarrollo)
   - https://tu-dominio.vercel.app (producción)
6. Agrega los URIs de redireccionamiento:
   - http://localhost:3000/api/auth/callback/google
   - https://tu-dominio.vercel.app/api/auth/callback/google

### 4. Configurar Resend

1. Ve a [Resend](https://resend.com/)
2. Crea una cuenta y obtén tu API key
3. Verifica tu dominio (opcional, para emails en producción)

### 5. Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
# Google OAuth
GOOGLE_CLIENT_ID=tu_google_client_id
GOOGLE_CLIENT_SECRET=tu_google_client_secret

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=genera_un_secret_aleatorio

# Firebase (Client-side)
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id

# Firebase Admin (Server-side)
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\ntu_private_key\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@tu-project.iam.gserviceaccount.com

# Resend
RESEND_API_KEY=tu_resend_api_key
AGENT_EMAIL=tu_email@ejemplo.com
```

**Importante**: Para generar `NEXTAUTH_SECRET`, ejecuta:
```bash
openssl rand -base64 32
```

## Ejecutar en Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Estructura del Proyecto

```
vuelavuela/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/    # NextAuth configuration
│   │   │   ├── travel-requests/       # API para solicitudes de viaje
│   │   │   ├── quotes/                # API para ofertas
│   │   │   └── admin/                 # API para panel de admin
│   │   ├── dashboard/                 # Dashboard del cliente
│   │   │   ├── nueva-solicitud/       # Formulario de nueva solicitud
│   │   │   └── ofertas/[id]/          # Ver oferta específica
│   │   ├── admin/                     # Panel de administración
│   │   │   └── crear-oferta/[id]/     # Crear oferta para solicitud
│   │   ├── auth/
│   │   │   └── signin/                # Página de login
│   │   ├── layout.tsx                 # Layout principal
│   │   ├── page.tsx                   # Página de inicio
│   │   └── globals.css                # Estilos globales
│   ├── components/
│   │   └── Providers.tsx              # Session provider
│   ├── lib/
│   │   ├── firebase.ts                # Firebase client config
│   │   ├── firebase-admin.ts          # Firebase admin config
│   │   └── auth.ts                    # Auth helpers
│   └── types/
│       └── index.ts                   # TypeScript types
├── .env.example                       # Template de variables de entorno
├── .gitignore
├── next.config.ts
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

## Flujo de la Aplicación

### Para Clientes:

1. **Login con Google** → Página de inicio
2. **Crear solicitud** → Formulario de 4 pasos:
   - Fechas de viaje
   - Cantidad de pasajeros
   - Destinos deseados
   - Preferencias de alojamiento y actividades
3. **Envío de solicitud** → Email automático al agente
4. **Recibir oferta** → Email con link a la oferta
5. **Aceptar/Rechazar** → Notificación al agente por email

### Para Agente:

1. **Login con Google** → Panel de administración
2. **Ver solicitudes** → Lista de todas las solicitudes
3. **Crear oferta** → Formulario con:
   - Título de la oferta
   - Descripción
   - Itinerario detallado
   - Precio y moneda
   - Fecha de validez
4. **Envío de oferta** → Email automático al cliente
5. **Recibir respuesta** → Email cuando el cliente acepta/rechaza

## Modelos de Datos

### TravelRequest
```typescript
{
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  preferences: {
    travelPeriod: {
      startDate: string;
      endDate: string;
      flexible: boolean;
    };
    daysAvailable: number;
    passengers: {
      adults: number;
      children: number;
      babies: number;
    };
    destinations: string[];
    accommodationType: string[];
    activities: string[];
    otherPreferences: string;
  };
  status: 'pending' | 'quoted' | 'accepted' | 'rejected';
  createdAt: string;
  updatedAt: string;
}
```

### Quote
```typescript
{
  id: string;
  requestId: string;
  userId: string;
  title: string;
  description: string;
  itinerary: string;
  price: number;
  currency: string;
  validUntil: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  updatedAt: string;
}
```

## Despliegue en Vercel

1. Crea una cuenta en [Vercel](https://vercel.com)
2. Conecta tu repositorio de GitHub
3. Configura las variables de entorno en Vercel (igual que `.env.local`)
4. Despliega

**Importante**: Actualiza `NEXTAUTH_URL` con tu URL de producción.

## Mejoras Futuras

- [ ] Sistema de pagos (Stripe/MercadoPago)
- [ ] Chat en tiempo real entre cliente y agente
- [ ] Historial de viajes realizados
- [ ] Compartir ofertas por WhatsApp
- [ ] Galería de fotos de destinos
- [ ] Sistema de reseñas
- [ ] Multi-idioma
- [ ] Modo oscuro persistente
- [ ] Notificaciones push
- [ ] Export de ofertas a PDF

## Solución de Problemas

### Error de autenticación
- Verifica que las URLs de redirección en Google Cloud Console coincidan exactamente
- Asegúrate de que `NEXTAUTH_SECRET` esté configurado
- Revisa que `NEXTAUTH_URL` sea correcto

### Error de Firebase
- Verifica que las credenciales de Firebase sean correctas
- Asegúrate de que Firestore esté habilitado
- Revisa los permisos de las reglas de Firestore

### Emails no se envían
- Verifica que `RESEND_API_KEY` sea válido
- Revisa que `AGENT_EMAIL` esté configurado
- En desarrollo, Resend envía a `onboarding@resend.dev`

## Soporte

Para problemas o preguntas, contacta a: tu_email@ejemplo.com

## Licencia

MIT
