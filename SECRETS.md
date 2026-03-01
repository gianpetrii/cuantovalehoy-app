# Configuración de Secrets

## Variables de Entorno Necesarias

### 🔴 **OBLIGATORIAS** (para que la app funcione):

#### Supabase (Base de datos)
```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_aqui
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key_aqui
```

**Dónde obtenerlas:**
1. Ve a tu proyecto en [Supabase Dashboard](https://supabase.com/dashboard)
2. Settings → API
3. Copia:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role secret** → `SUPABASE_SERVICE_ROLE_KEY`

**Uso:**
- Almacenamiento de datos de inflación históricos
- Tipos de cambio
- Consultas en tiempo real

---

### 🟡 **OPCIONALES** (features adicionales):

#### Web3Forms (Formulario de contacto)
```env
NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY=tu_access_key
```

**Dónde obtenerla:**
1. Ve a [Web3Forms](https://web3forms.com/)
2. Crea una cuenta gratuita
3. Copia tu Access Key

**Uso:**
- Solo para la página `/contact`
- Si no está configurada, el formulario no funcionará

---

## Configuración en GitHub Actions

Para que la automatización diaria funcione, necesitás agregar estos secrets en GitHub:

1. Ve a tu repositorio en GitHub
2. Settings → Secrets and variables → Actions
3. Click en "New repository secret"
4. Agregá estos 3 secrets:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Tu URL de Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Tu anon key de Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Tu service role key de Supabase |

---

## Configuración Local

1. Copiá `.env.local.example` a `.env.local`
2. Completá las variables obligatorias
3. Las opcionales podés dejarlas vacías si no las necesitás

```bash
cp .env.local.example .env.local
# Editá .env.local con tus valores
```

---

## ⚠️ Seguridad

- **NUNCA** commitees `.env.local` al repositorio
- El archivo `.env.local` está en `.gitignore`
- `SUPABASE_SERVICE_ROLE_KEY` tiene permisos administrativos - mantenela segura
- Solo usá `SUPABASE_SERVICE_ROLE_KEY` en scripts del servidor, nunca en el cliente
