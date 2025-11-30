# ¿Cuánto Vale Hoy? - Calculadora de Inflación y Valor del Dinero

Una aplicación web moderna para calcular el impacto de la inflación en pesos argentinos y dólares estadounidenses. Permite ajustar valores históricos por inflación, realizar conversiones entre monedas, calcular el valor de inmuebles por metro cuadrado, y proyectar inversiones con interés compuesto.

## 🚀 Características

- ✅ **Cálculo de Inflación ARS**: Datos del INDEC desde 2020
- ✅ **Cálculo de Inflación USD**: Datos del CPI de Estados Unidos
- ✅ **Conversión de Monedas**: Tipo de cambio oficial y blue
- ✅ **Conversión con Inflación**: Convierte y ajusta por inflación en el tiempo
- ✅ **Interfaz Moderna**: Diseño responsive con Tailwind CSS
- ✅ **Modo Oscuro/Claro**: Tema adaptable con next-themes
- ✅ **TypeScript**: Código tipado y seguro
- ✅ **Next.js 14**: Framework moderno con App Router

## 📊 Funcionalidades

### Calculadora de Inflación Simple
Calcula cómo la inflación afecta un monto entre dos fechas:
- Selecciona la moneda (ARS o USD)
- Ingresa el monto original
- Selecciona la fecha de origen y destino
- Obtén el valor ajustado por inflación

### Conversión con Ajuste de Inflación
Realiza conversiones complejas considerando inflación:
1. Convierte de ARS a USD (o viceversa) en una fecha pasada
2. Ajusta el resultado por la inflación de la moneda destino
3. Compara con la conversión directa en la fecha futura
4. Elige entre tipo de cambio oficial o blue

## 🛠️ Instalación

1. **Clona o copia este proyecto**

```bash
cd cuantovalehoy-app
```

2. **Instala las dependencias**

```bash
npm install
# o
yarn install
# o
pnpm install
```

3. **Inicia el servidor de desarrollo**

```bash
npm run dev
# o
yarn dev
# o
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📁 Estructura del Proyecto

```
cuantovalehoy-app/
├── app/                                    # App Router de Next.js
│   ├── page.tsx                           # Página principal con calculadoras
│   ├── about/                             # Información del proyecto
│   ├── contact/                           # Contacto
│   ├── layout.tsx                         # Layout principal
│   └── globals.css                        # Estilos globales
├── components/                            # Componentes reutilizables
│   ├── inflation/                         # Componentes de inflación
│   │   ├── inflation-calculator.tsx      # Calculadora simple
│   │   └── currency-converter.tsx        # Conversión con inflación
│   ├── ui/                               # Componentes UI base
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   └── ...
│   └── layout/                           # Componentes de layout
│       ├── header.tsx                    # Header con navegación
│       └── footer.tsx                    # Footer
├── lib/                                  # Utilidades y servicios
│   ├── services/                         # Servicios de negocio
│   │   └── inflation-service.ts         # Lógica de inflación
│   └── utils.ts                         # Funciones utilitarias
├── types/                                # Tipos de TypeScript
│   └── inflation.ts                      # Tipos de inflación
└── package.json                          # Dependencias del proyecto
```

## 📈 Fuentes de Datos

### Inflación Argentina (ARS)
- **Fuente**: INDEC (Instituto Nacional de Estadística y Censos)
- **Indicador**: Índice de Precios al Consumidor (IPC)
- **Período**: Enero 2020 - Noviembre 2024
- **Frecuencia**: Mensual

### Inflación Estados Unidos (USD)
- **Fuente**: US Bureau of Labor Statistics
- **Indicador**: Consumer Price Index (CPI)
- **Período**: Enero 2020 - Noviembre 2024
- **Frecuencia**: Mensual

### Tipos de Cambio
- **Oficial**: Banco Central de la República Argentina (BCRA)
- **Blue/Paralelo**: Fuentes de mercado
- **Período**: Enero 2020 - Noviembre 2024
- **Frecuencia**: Mensual (promedio del mes)

## 🎯 Casos de Uso

### Ejemplo 1: Ajuste por Inflación ARS
**Pregunta**: ¿Cuánto valdría hoy $10,000 de enero 2020?

1. Selecciona moneda: ARS
2. Monto: 10,000
3. Fecha origen: Enero 2020
4. Fecha destino: Noviembre 2024
5. **Resultado**: ~$262,390 (inflación acumulada: 2,523.9%)

### Ejemplo 2: Conversión con Inflación
**Pregunta**: Tenía $100,000 ARS en enero 2020. ¿Cuántos dólares serían hoy considerando inflación?

1. Monto: 100,000 ARS
2. Fecha origen: Enero 2020
3. Fecha destino: Noviembre 2024
4. Tipo de cambio: Blue
5. **Resultado**:
   - Conversión inicial (ene 2020): US$ 1,250 (a $80 blue)
   - Ajustado por inflación USD: US$ 1,499
   - Conversión directa (nov 2024): US$ 87 (a $1,150 blue)

## 🎨 Personalización

### Actualizar Datos de Inflación

Los datos están en `lib/services/inflation-service.ts`. Para actualizarlos:

```typescript
const ARS_INFLATION_DATA: InflationData[] = [
  { date: "2024-12", rate: 2.5, accumulated: 2586.4 },
  // Agregar nuevos meses aquí
];
```

### Agregar Nuevas Monedas

1. Actualiza el tipo `Currency` en `types/inflation.ts`
2. Agrega datos de inflación en `inflation-service.ts`
3. Actualiza los componentes para incluir la nueva moneda

## 🚀 Despliegue en Vercel

1. **Sube tu código a GitHub**

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/tu-usuario/calculadora-inflacion.git
git push -u origin main
```

2. **Importa en Vercel**
   - Ve a [vercel.com](https://vercel.com)
   - Importa tu repositorio
   - Vercel detectará automáticamente Next.js
   - Haz clic en "Deploy"

3. **¡Listo!** Tu aplicación estará en línea en minutos

## 📚 Scripts Disponibles

```bash
npm run dev      # Inicia el servidor de desarrollo
npm run build    # Construye la aplicación para producción
npm run start    # Inicia el servidor de producción
npm run lint     # Ejecuta el linter
npm run format   # Formatea el código con Prettier
```

## 🔧 Tecnologías

- **Framework**: Next.js 14 (App Router)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Iconos**: Lucide React
- **Tema**: next-themes

## ⚠️ Aviso Importante

Los datos proporcionados por esta aplicación son aproximados y tienen fines informativos únicamente. No constituyen asesoramiento financiero, contable o de inversión.

Los cálculos se basan en datos históricos que pueden tener variaciones según la fuente consultada. Para decisiones financieras importantes, consulte con un profesional calificado.

## 🤝 Contribuir

¿Tienes ideas para mejorar la calculadora? Las contribuciones son bienvenidas:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 🎨 Nuevas Funcionalidades en Desarrollo

### ✅ Componentes UX Mejorados (Completado)
- **Inputs con íconos y tooltips**: Cada campo explica qué significa
- **Gráficos interactivos**: Visualiza la evolución del dinero en el tiempo
- **Medidores visuales**: Gauge de inflación con colores semánticos
- **Comparaciones visuales**: Antes/después con flechas y porcentajes
- **Indicadores de pasos**: Para procesos complejos multi-etapa
- **Tarjetas de métricas**: Resultados destacados con colores (verde=ganancia, rojo=pérdida)

### 🚧 Próximas Calculadoras

#### 🏠 Calculadora de Inmuebles por m²
Normaliza el valor de propiedades para comparar correctamente:
- Ingresa precio y metros cuadrados
- Calcula precio/m² ajustado por inflación
- Compara con precios históricos
- Determina si ganaste o perdiste valor real

#### 📈 Calculadora de Interés Compuesto
Proyecta inversiones y compara con inflación:
- **Simple**: Capital inicial + tasa de interés
- **Con aportes**: Agrega aportes mensuales
- **Meta de ahorro**: Calcula cuánto ahorrar para llegar a tu objetivo
- Gráficos de crecimiento exponencial
- Comparación automática: ¿ganaste contra la inflación?

### 📚 Documentación

- **[PRODUCT_ROADMAP.md](./PRODUCT_ROADMAP.md)**: Plan completo del producto
- **[UI_COMPONENTS_GUIDE.md](./components/UI_COMPONENTS_GUIDE.md)**: Guía de componentes UX

## 📝 Mejoras Futuras

- [ ] Integración con APIs en tiempo real (BCRA, INDEC)
- [ ] Calculadora de salarios ajustados
- [ ] Comparador de escenarios (ARS vs USD vs inversión)
- [ ] Exportar resultados a PDF
- [ ] Más monedas (EUR, BRL, etc.)
- [ ] Guardar historial de cálculos

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 🆘 Soporte

Si tienes preguntas o encuentras problemas:

1. Revisa la sección "Acerca de" en la aplicación
2. Consulta la documentación de [Next.js](https://nextjs.org/docs)
3. Abre un issue en el repositorio

---

**Creado con ❤️ para entender mejor el impacto de la inflación**
