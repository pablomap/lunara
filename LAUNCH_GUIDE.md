# 🚀 Lunara Launch Guide

Guía paso a paso para lanzar Lunara en producción.

## 🎯 Pre-requisitos

Asegúrate de tener:
- Node.js 18+ instalado
- Cuenta en [Supabase](https://supabase.com)
- Cuenta en [Anthropic Console](https://console.anthropic.com)
- Cuenta en [Vercel](https://vercel.com) (opcional pero recomendado para deploy)

---

## PASO 1: Configurar Supabase

### 1.1 Crear proyecto en Supabase

1. Ve a https://supabase.com
2. Haz clic en "New Project"
3. Selecciona una región cercana a tu público
4. Copia el nombre de tu proyecto

### 1.2 Ejecutar el esquema de base de datos

1. En Supabase Dashboard, ve a "SQL Editor"
2. Haz clic en "New Query"
3. Copia todo el contenido de `SETUP_DATABASE.sql` (en este proyecto)
4. Pégalo en el editor y ejecuta con Ctrl+Enter
5. Verifica que todas las tablas se crearon sin errores

### 1.3 Obtener credenciales

1. Ve a "Settings" → "API"
2. Copia `Project URL` → guárdalo
3. Copia `anon public` key → guárdalo
4. En "Settings" → "Auth", verifica que las siguientes opciones estén habilitadas:
   - Email (activado)
   - Confirm email (opcional pero recomendado)

---

## PASO 2: Obtener API key de Anthropic

1. Ve a https://console.anthropic.com/account/keys
2. Haz clic en "Create Key"
3. Dale un nombre descriptivo: "Lunara Production"
4. Copia la clave → guárdala segura

---

## PASO 3: Configurar variables de entorno locales

1. En la carpeta raíz del proyecto, copia `.env.local.example` a `.env.local`
2. Completa con tus credenciales:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=<tu_supabase_project_url>
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<tu_supabase_anon_key>
   ANTHROPIC_API_KEY=<tu_anthropic_api_key>
   ```
3. **IMPORTANTE:** Nunca commitees `.env.local` a git

---

## PASO 4: Probar localmente

```bash
# Navega a la carpeta del proyecto
cd lunara

# Instala dependencias (si no lo hiciste)
npm install

# Corre el servidor local
npm run dev
```

Abre http://localhost:3000 en tu navegador. Deberías ver la landing page de Lunara.

### Test básico:
1. Haz clic en "Acceso a beta"
2. Crea una cuenta (email de prueba)
3. Completa onboarding
4. Registra síntomas en /track
5. Habla con Lunara en /chat

---

## PASO 5: Deploy en Vercel

### 5.1 Preparar código

```bash
# Desde la carpeta lunara
git add .
git commit -m "Initial Lunara commit"
```

### 5.2 Deploy

**Opción A: Via Vercel CLI (recomendado)**

```bash
# Instala Vercel CLI si no lo tienes
npm i -g vercel

# Deploy
vercel
```

Sigue las instrucciones en la terminal.

**Opción B: Via GitHub (si usas GitHub)**

1. Sube tu código a GitHub
2. Ve a https://vercel.com/new
3. Conecta tu repositorio
4. Vercel detectará Next.js automáticamente
5. Haz clic en "Deploy"

### 5.3 Configurar variables de entorno en Vercel

Después de deployar:

1. Ve a tu proyecto en Vercel → "Settings" → "Environment Variables"
2. Añade las 3 variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `ANTHROPIC_API_KEY`
3. Redeploy: Settings → "Deployments" → "Redeploy"

---

## PASO 6: Conectar dominio personalizado (opcional)

1. En Vercel → "Settings" → "Domains"
2. Añade tu dominio
3. Sigue las instrucciones para configurar DNS
4. Verifica el dominio

**Sugerencias de dominios:**
- lunara.health
- lunara.care
- lunara-hormonal.com
- tucopilotohormonal.com

---

## PASO 7: Capturar Beta Users

### 7.1 Landing page optimizada

Tu landing page ya está lista para capturar emails. Para conectarla a una newsletter:

**Con Typeform:**
1. Crea un Typeform personalizado
2. En el botón "Acceso a beta", cambia el href a tu Typeform

**Con Mailchimp:**
```jsx
// En app/page.tsx handleSubmit:
// Cambia para hacer POST a tu endpoint de Mailchimp
```

### 7.2 Canales de promoción

```
📱 Social Media Strategy:
- Instagram: Contenido educativo sobre síntomas
- TikTok: Videos cortos sobre myths de menopausia
- LinkedIn: Posts sobre salud femenina

🎯 Messaging (ejemplo):
"Cansada de Googlear síntomas a las 3am? Lunara es tu copiloto hormonal.
Sin diagnósticos. Sin tecnicismos. Solo apoyo personalizado con IA."

📝 Post Ideas:
1. "Lo que nadie te dijo sobre la perimenopausia"
2. "Por qué tus cambios de ánimo no son 'locura'"
3. "Sofocos a los 35: esto es menopausia temprana"
4. "El sueño y tus hormonas: conexión que no sabías"
```

---

## PASO 8: Monitoreo y métricas

### Vercel Analytics
1. Settings → "Web Analytics"
2. Activa para ver traffic y performance

### Supabase Logs
1. Dashboard → "Logs"
2. Monitorea errores de auth y base de datos

### Métricas clave a trackear:
- Signups por día
- Engagement (% que completa onboarding)
- Chats iniciados
- Logs diarios registrados
- Retention (día 7, día 30)

---

## PASO 9: Seguridad y compliance

### Checklist:

- [ ] HTTPS habilitado (Vercel lo hace automáticamente)
- [ ] Variables de entorno no están en git
- [ ] RLS habilitado en Supabase (ya está en SQL)
- [ ] Disclaimers médicos visibles (landing + onboarding + chat)
- [ ] Política de privacidad (URGENTE - añade antes de launch)
- [ ] Términos de servicio (URGENTE - añade antes de launch)

### Disclaimer a añadir:

```
⚠️ LUNARA NO ES UN DIAGNÓSTICO MÉDICO

Lunara es una herramienta educativa de acompañamiento.
No reemplaza consulta con un profesional de la salud.
Siempre consulta a tu médico ante síntomas graves o inesperados.
```

---

## PASO 10: Siguientes pasos post-launch

### Semana 1:
- [ ] Recibir feedback de primeros usuarios
- [ ] Monitorear errores en Vercel
- [ ] Responder a emails

### Mes 1:
- [ ] Recopilar 20-50 usuarias en beta
- [ ] Hacer entrevistas con ellas
- [ ] Mejorar según feedback

### Mes 2-3:
- [ ] Añadir newsletter automático (semanal)
- [ ] Crear "tips" basados en patrones
- [ ] Expandir base de datos de síntomas
- [ ] Optimizar UX basada en data

---

## Troubleshooting

### Error: "No se puede conectar a Supabase"
```
→ Verifica NEXT_PUBLIC_SUPABASE_URL y ANON_KEY en .env.local
→ En Vercel, ve a Logs y busca los errores exactos
```

### Error: "API key de Anthropic inválida"
```
→ Verifica que ANTHROPIC_API_KEY esté en variable de entorno
→ En Vercel Dashboard, revisa que esté configurada
→ No incluyas espacios ni caracteres raros
```

### Chat no responde
```
→ Verifica que los últimos logs estén en la base de datos
→ En Supabase SQL, ejecuta:
   SELECT * FROM daily_logs ORDER BY created_at DESC LIMIT 5;
→ Revisa la consola de Vercel (Functions logs)
```

### Auth no funciona
```
→ En Supabase, ve a "Auth" → "Providers" y verifica Email está activo
→ Revisa que NEXT_PUBLIC_SUPABASE_URL termine sin /
```

---

## Comandos útiles

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Deploy a Vercel
vercel

# Ver logs en Vercel
vercel logs <url-de-tu-app>
```

---

## Recursos

- [Docs Supabase](https://supabase.com/docs)
- [Docs Anthropic Claude](https://docs.anthropic.com)
- [Next.js Docs](https://nextjs.org/docs)
- [Vercel Docs](https://vercel.com/docs)

---

## Próximas características

Una vez valides con usuarios:

- [ ] Reportes semanales por email
- [ ] Gráficas de patrones (energía, mood, síntomas en tiempo)
- [ ] Integración con calendarios (Google Calendar, Apple)
- [ ] Recomendaciones de hábitos personalizadas
- [ ] Comunidad privada (forum o Discord)
- [ ] Versión premium con "coach" humano

---

**¿Preguntas?** Consulta el código o revisa los comentarios en cada archivo.

¡A que funcione bien! 🚀
