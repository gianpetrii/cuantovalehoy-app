# Cuánto Vale Hoy App

## Descripción del proyecto

Sitio y herramientas para **consultar cotizaciones y datos de mercado** (activos, dólar y series relacionadas) con Next.js en el front y **Supabase** como backend y jobs de actualización.

## Problema que resuelve

Hace legible y actualizable en un solo lugar la información que suele estar repartida en portales financieros, APIs o tablas crudas, para quien necesita números confiables sin armar su propio pipeline de datos.

## Stack

- Next.js, TypeScript, React  
- Supabase (`@supabase/supabase-js`), TanStack Query  

## Requisitos

- Node.js LTS  
- Proyecto Supabase  

## Instalación

```bash
npm install
npm run dev
```

Scripts: `build`, `start`, `lint`, `format`.

## Variables de entorno

En `.env.local` (y para scripts en `scripts/`) suelen usarse al menos:

- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`  
- `SUPABASE_SERVICE_ROLE_KEY` (solo servidor / scripts, no exponer al cliente)  
- `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` en el formulario de contacto, si aplica  

Revisá `lib/supabase/` y los archivos en `scripts/` para la lista exacta.
