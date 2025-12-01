# Configuración de Variables de Entorno en Vercel

El deploy está fallando porque faltan las variables de entorno. Sigue estos pasos:

## 1. Obtener credenciales de Firebase Admin

1. Ve a [Firebase Console](https://console.firebase.google.com/project/vuelavuela-5af97/settings/serviceaccounts/adminsdk)
2. Click en **"Generate new private key"**
3. Se descargará un archivo JSON (ej: `vuelavuela-5af97-firebase-adminsdk-xxxxx.json`)
4. Abre el archivo JSON y copia:
   - `private_key` (incluye todo desde `-----BEGIN` hasta `-----END-----`)
   - `client_email`

## 2. Generar NEXTAUTH_SECRET

En tu terminal, ejecuta:
```bash
openssl rand -base64 32
```
Copia el resultado.

## 3. Configurar variables de entorno en Vercel

1. Ve a tu proyecto en [Vercel Dashboard](https://vercel.com/dashboard)
2. Click en **Settings** → **Environment Variables**
3. Agrega las siguientes variables (todas en el ambiente **Production**, **Preview** y **Development**):

### Variables requeridas:

```
GOOGLE_CLIENT_ID=tu_google_client_id
GOOGLE_CLIENT_SECRET=tu_google_client_secret
NEXTAUTH_URL=https://tu-proyecto.vercel.app
NEXTAUTH_SECRET=el_secret_generado_con_openssl
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyB-cVJ5S1XEpp4M9k0Txb73ap6vaAXLKxM
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=vuelavuela-5af97.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=vuelavuela-5af97
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=vuelavuela-5af97.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=49620968522
NEXT_PUBLIC_FIREBASE_APP_ID=1:49620968522:web:f8fe137a34ded39cf0b2b3
FIREBASE_PRIVATE_KEY=el_private_key_del_json_de_firebase
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@vuelavuela-5af97.iam.gserviceaccount.com
RESEND_API_KEY=tu_resend_api_key
AGENT_EMAIL=tu_email@ejemplo.com
```

### Notas importantes:

**FIREBASE_PRIVATE_KEY:**
- Copia el valor completo del `private_key` del JSON de Firebase
- Debe incluir `-----BEGIN PRIVATE KEY-----` y `-----END PRIVATE KEY-----`
- Los saltos de línea `\n` deben mantenerse literalmente
- Ejemplo: `-----BEGIN PRIVATE KEY-----\nMIIEvQIB...\n-----END PRIVATE KEY-----\n`

**NEXTAUTH_URL:**
- Primero usa `https://tu-proyecto.vercel.app` (reemplaza con tu URL real de Vercel)
- Actualízala después del primer deploy si cambia

**GOOGLE_CLIENT_ID y GOOGLE_CLIENT_SECRET:**
- Si aún no los tienes, ve a [Google Cloud Console](https://console.cloud.google.com/)
- APIs & Services → Credentials
- Crea OAuth 2.0 Client ID
- Authorized redirect URIs: `https://tu-proyecto.vercel.app/api/auth/callback/google`

**RESEND_API_KEY:**
- Si aún no lo tienes, ve a [Resend.com](https://resend.com/)
- Crea una cuenta y obtén tu API key

## 4. Redeploy

Después de configurar todas las variables:

1. Ve a **Deployments** en Vercel
2. Click en el último deployment
3. Click en **Redeploy**

O simplemente haz un nuevo commit:
```bash
git commit --allow-empty -m "Trigger redeploy with env vars"
git push origin main
```

## 5. Actualizar Google OAuth

Una vez desplegado exitosamente:

1. Copia tu URL de producción de Vercel
2. Ve a [Google Cloud Console](https://console.cloud.google.com/)
3. APIs & Services → Credentials
4. Edita tu OAuth 2.0 Client ID
5. Agrega a **Authorized JavaScript origins**: `https://tu-proyecto.vercel.app`
6. Agrega a **Authorized redirect URIs**: `https://tu-proyecto.vercel.app/api/auth/callback/google`

## Checklist

- [ ] Generar private key de Firebase
- [ ] Generar NEXTAUTH_SECRET
- [ ] Configurar todas las variables de entorno en Vercel
- [ ] Hacer redeploy
- [ ] Actualizar Google OAuth URLs
- [ ] Probar login en producción

## Solución de problemas

**Error: "Service account object must contain a string private_key property"**
- Verifica que `FIREBASE_PRIVATE_KEY` esté configurada
- Asegúrate de que incluya `-----BEGIN PRIVATE KEY-----` y `-----END PRIVATE KEY-----`
- Verifica que los `\n` estén presentes

**Error de autenticación de Google:**
- Verifica que las redirect URIs en Google Cloud Console coincidan exactamente
- Verifica que `NEXTAUTH_URL` sea correcto

**Emails no se envían:**
- Verifica que `RESEND_API_KEY` sea válido
- Verifica que `AGENT_EMAIL` esté configurado
