# 🌙 Lunara — Tu Copiloto Hormonal

MVP de aplicación web para acompañamiento personalizado en menopausia, perimenopausia y cambios hormonales. Usa IA para ofrecer educación, seguimiento y apoyo emocional.

## 🎯 Propuesta de valor

**Problema:** Mujeres en transición hormonal (35-65 años) tienen síntomas desestabilizadores (sofocos, insomnio, cambios de ánimo, fatiga) y reciben poca información de calidad. Google te da resultados confusos y los doctores dedican 10 minutos.

**Solución:** Un "copiloto hormonal" con IA que:
- Registra síntomas diarios
- Aprende patrones de 30+ días de datos
- Conversa con contexto y empatía
- Educa sin diagnosticar
- Acompaña sin reemplazar al médico

**Modelo:** Freemium inicialmente (captura), luego:
- Tier 1: $9/mes (seguimiento + chat)
- Tier 2: $49/mes (+ coach nutricional)
- B2B: Vender a clínicas de ginecología

---

## 📁 Estructura del proyecto

```
lunara/
├── app/
│   ├── page.tsx                    # Landing page (hero + features)
│   ├── auth/page.tsx               # Login / Signup
│   ├── onboarding/page.tsx         # Cuestionario inicial (edad, síntomas, etapa)
│   ├── dashboard/page.tsx          # Hub principal (stats, card de tracking)
│   ├── track/page.tsx              # Registro diario (sliders, síntomas, notas)
│   ├── chat/page.tsx               # Chat con Lunara
│   ├── api/
│   │   └── chat/route.ts           # API endpoint para chat con Claude
│   ├── layout.tsx                  # Root layout (fuentes, metadata)
│   └── globals.css                 # Tailwind + design system Lunara
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts               # Cliente Supabase (browser)
│   │   └── server.ts               # Cliente Supabase (server)
│   └── claude.ts                   # Cliente Anthropic + system prompt
│
├── SETUP_DATABASE.sql              # Esquema SQL para Supabase
├── LAUNCH_GUIDE.md                 # Guía paso a paso para lanzar
├── .env.local.example              # Template de variables de entorno
└── package.json
```

---

## 🔑 Features implementadas

### ✅ Landing page
- Hero section con propuesta clara
- 3 features visuales (Seguimiento, Chat IA, Patrones)
- Email capture para beta
- Disclaimers médicos

### ✅ Autenticación
- Signup / Login con email (Supabase Auth)
- Manejo de errores
- Redirección según estado

### ✅ Onboarding
- Paso 1: Edad y etapa (perimenopause/menopause/postmenopause)
- Paso 2: Síntomas actuales (12 síntomas comunes)
- Paso 3: Notas libres
- Validación y progreso visual

### ✅ Dashboard
- Saludo personalizado
- Card de "¿Cómo estás hoy?" → Link a tracking
- Card de "Habla con Lunara" → Link a chat
- Stats del día actual (si existe registro)
- Consejo del día

### ✅ Tracking diario
- Sliders para energía, sueño, ánimo (1-5)
- Selector visual de síntomas (chips)
- Textarea para notas libres
- Guardado de logs (inserta o actualiza)

### ✅ Chat con IA
- Interfaz conversacional limpia
- Historial de mensajes
- Streaming de respuestas
- Sistema prompt que incluye:
  - Rol: copiloto empático
  - NO diagnostica, SÍ educa
  - Contexto: últimos 30 días de logs del usuario
- Mensajes persistidos en BD

### ✅ API /chat
- Carga contexto de últimos 30 logs
- Construye system prompt dinámico
- Llama a Claude Haiku (rápido, económico)
- Retorna respuesta

### ✅ Diseño
- Colores Lunara (lavanda, crema, rosa suave, verde salvia)
- Tipografía elegante (Playfair Display para headings, Inter para body)
- Móvil-first, responsive
- Transiciones suaves
- Bordes redondeados, sombras suaves

### ✅ Seguridad
- RLS en Supabase (cada usuario solo ve sus datos)
- Env vars para credenciales
- Autenticación de usuario en API routes

---

## 🚀 Stack técnico

| Componente | Tecnología |
|-----------|-----------|
| Frontend | Next.js 14 (App Router) |
| Styling | Tailwind CSS v4 + shadcn |
| Base de datos | Supabase (PostgreSQL) |
| Auth | Supabase Auth (email + password) |
| IA | Anthropic Claude API |
| Icons | Lucide React |
| Deploy | Vercel |
| Charts | Recharts (preparado, no implementado aún) |

---

## 📊 Base de datos

### Tablas creadas (en SETUP_DATABASE.sql):

- **profiles** → Datos de usuario (edad, etapa, síntomas iniciales)
- **daily_logs** → Registros diarios (energía, sueño, ánimo, síntomas, notas)
- **conversations** → Sesiones de chat
- **messages** → Mensajes del chat (usuario + asistente)

Todas con:
- Row Level Security (RLS) habilitado
- Índices para performance
- Foreign keys con ON DELETE CASCADE

---

## 🎨 Paleta de colores

```css
--background: #FDFAF6     /* Crema cálido */
--foreground: #2D2228     /* Marrón oscuro */
--primary: #9B6B9E        /* Lavanda oscuro */
--secondary: #E8C4D0      /* Rosa suave */
--accent: #7DAB8B         /* Verde salvia */
--destructive: #E74C3C    /* Rojo suave */
```

---

## 🏃 Iniciar en local

```bash
# 1. Navega a la carpeta
cd lunara

# 2. Instala dependencias (si no lo hiciste)
npm install

# 3. Configura .env.local con credenciales Supabase y Anthropic
cp .env.local.example .env.local
# Edita .env.local y añade tus credenciales

# 4. Corre el servidor
npm run dev

# Abre http://localhost:3000
```

---

## 🚀 Cómo lanzar

**Lee [LAUNCH_GUIDE.md](LAUNCH_GUIDE.md) para pasos detallados**

Resumen rápido:
1. Crear proyecto Supabase
2. Ejecutar SETUP_DATABASE.sql
3. Obtener API key de Anthropic
4. Configurar .env.local
5. Deploy en Vercel
6. Capturar beta users

---

## 📝 Próximas features

MVP está completo pero hay espacio para:

- [ ] Dashboard con gráficas (últimos 7/30 días)
- [ ] Reportes semanales por email
- [ ] Integración de calendarios
- [ ] Recomendaciones personalizadas de hábitos
- [ ] Comunidad (forum privado)
- [ ] Tiers de pago (Stripe)
- [ ] App móvil nativa
- [ ] Dark mode
- [ ] Idiomas (English, Portuguese)

---

## ⚠️ Disclaimers importantes

**LUNARA NO ES UN DIAGNÓSTICO MÉDICO**

- Herramienta educativa de acompañamiento
- No reemplaza consulta médica
- Siempre consultar a profesional ante síntomas graves
- No prescribe tratamientos

Está integrado en todas las páginas.

---

## 🔐 Seguridad

- Credenciales en .env.local (NUNCA en git)
- RLS en Supabase
- Validación de entrada en frontend
- API routes protegidas

---

## 📞 Soporte

Para problemas:
1. Revisa [LAUNCH_GUIDE.md](LAUNCH_GUIDE.md) sección "Troubleshooting"
2. Verifica logs en Vercel → Functions
3. Verifica BD en Supabase → Logs

---

**¡Bienvenida a Lunara! 🌙**

Hiciste algo muy especial aquí. Ahora a validarlo con usuarias reales.

---

*Proyecto creado con Claude Code + Anthropic SDK*
