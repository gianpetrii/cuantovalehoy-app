# 🎨 Guía de Componentes UX - ¿Cuánto Vale Hoy?

Esta guía explica cómo usar los componentes de UI mejorados para crear una experiencia de usuario intuitiva y accesible.

## 📋 Índice

1. [Componentes de Input](#componentes-de-input)
2. [Componentes de Visualización](#componentes-de-visualización)
3. [Componentes de Gráficos](#componentes-de-gráficos)
4. [Componentes de Navegación](#componentes-de-navegación)
5. [Mejores Prácticas](#mejores-prácticas)

---

## 🔤 Componentes de Input

### InfoTooltip

Tooltip informativo con ícono de ayuda. Úsalo para explicar conceptos financieros.

```tsx
import { InfoTooltip } from "@/components/ui/info-tooltip";

<InfoTooltip 
  content="La inflación es el aumento generalizado de precios"
  side="top"
/>
```

**Cuándo usar:**
- Al lado de términos técnicos (inflación, interés compuesto, etc.)
- Para explicar qué significa cada campo de entrada
- Cuando el espacio es limitado pero la explicación es necesaria

---

### InputWithIcon

Input mejorado con ícono, label y tooltip integrado.

```tsx
import { InputWithIcon } from "@/components/ui/input-with-icon";
import { DollarSign } from "lucide-react";

<InputWithIcon
  label="Monto Inicial"
  icon={DollarSign}
  type="number"
  placeholder="10000"
  tooltip="El dinero que tenías en el pasado. Por ejemplo, tu salario de hace 3 años."
/>
```

**Cuándo usar:**
- Para TODOS los inputs de las calculadoras
- Reemplaza los inputs básicos para mejor UX
- El ícono ayuda a identificar rápidamente el campo

**Íconos recomendados:**
- 💵 `DollarSign` - Montos en dinero
- 📅 `Calendar` - Fechas
- 📏 `Ruler` - Metros cuadrados
- 📊 `TrendingUp` - Tasas de interés
- 🏠 `Home` - Inmuebles
- 💼 `Briefcase` - Inversiones

---

## 📊 Componentes de Visualización

### MetricCard

Tarjeta para mostrar métricas importantes con colores semánticos.

```tsx
import { MetricCard } from "@/components/ui/metric-card";
import { TrendingUp } from "lucide-react";

<MetricCard
  title="Valor Ajustado"
  value="$130,000"
  subtitle="Junio 2024"
  icon={TrendingUp}
  trend="up"
  trendValue="+1,200%"
  variant="success"
  tooltip="Este es el valor equivalente hoy"
/>
```

**Variantes:**
- `default` - Gris neutro
- `success` - Verde (ganancia, positivo)
- `warning` - Amarillo (precaución)
- `danger` - Rojo (pérdida, inflación alta)

**Cuándo usar:**
- Para mostrar resultados principales
- KPIs importantes (valor inicial, final, diferencia)
- Comparaciones rápidas

---

### ResultComparison

Comparación visual antes/después con flecha.

```tsx
import { ResultComparison } from "@/components/ui/result-comparison";

<ResultComparison
  title="Comparación de Poder Adquisitivo"
  beforeLabel="Enero 2020"
  beforeValue="$10,000"
  afterLabel="Junio 2024"
  afterValue="$130,000"
  changePercentage={1200}
  changeLabel="de inflación"
  variant="danger"
/>
```

**Cuándo usar:**
- Mostrar cambio de valor en el tiempo
- Comparar escenarios (ahorrar en ARS vs USD)
- Antes/después de ajuste por inflación

---

### StepIndicator

Indicador de pasos para procesos multi-etapa.

```tsx
import { StepIndicator } from "@/components/ui/step-indicator";
import { DollarSign, Calendar, Calculator, TrendingUp } from "lucide-react";

const steps = [
  { label: "Datos", icon: DollarSign },
  { label: "Período", icon: Calendar },
  { label: "Cálculo", icon: Calculator },
  { label: "Resultados", icon: TrendingUp },
];

<StepIndicator steps={steps} currentStep={2} />
```

**Cuándo usar:**
- Calculadoras con múltiples pasos
- Conversión con inflación (tiene varios pasos)
- Wizards de configuración

---

## 📈 Componentes de Gráficos

### InflationTimelineChart

Gráfico de línea para mostrar evolución temporal.

```tsx
import { InflationTimelineChart } from "@/components/charts/inflation-timeline-chart";

const data = [
  { date: "2020-01", value: 10000 },
  { date: "2020-06", value: 12500 },
  { date: "2021-01", value: 16000 },
  // ...
];

<InflationTimelineChart
  data={data}
  title="Evolución del Valor"
  currency="$"
  valueLabel="Valor Ajustado"
/>
```

**Cuándo usar:**
- Mostrar cómo cambia el valor mes a mes
- Visualizar tendencias de inflación
- Comparar evolución ARS vs USD

---

### ComparisonBarChart

Gráfico de barras para comparaciones.

```tsx
import { ComparisonBarChart } from "@/components/charts/comparison-bar-chart";

const data = [
  { name: "Valor Original", value: 10000 },
  { name: "Valor Ajustado", value: 130000 },
  { name: "Si invertías", value: 200000 },
];

<ComparisonBarChart
  data={data}
  title="Comparación de Escenarios"
  currency="$"
/>
```

**Cuándo usar:**
- Comparar 2-4 valores diferentes
- Mostrar antes vs después
- Comparar escenarios (ARS vs USD vs inversión)

---

### CompoundInterestChart

Gráfico de área apilada para interés compuesto.

```tsx
import { CompoundInterestChart } from "@/components/charts/compound-interest-chart";

const data = [
  { period: 0, capital: 10000, interest: 0, total: 10000 },
  { period: 1, capital: 12000, interest: 800, total: 12800 },
  { period: 2, capital: 14000, interest: 2100, total: 16100 },
  // ...
];

<CompoundInterestChart
  data={data}
  title="Proyección de Inversión"
  currency="$"
  periodLabel="Año"
/>
```

**Cuándo usar:**
- Calculadora de interés compuesto
- Mostrar crecimiento de inversión
- Visualizar capital vs intereses

---

### InflationGauge

Medidor visual de inflación con colores.

```tsx
import { InflationGauge } from "@/components/charts/inflation-gauge";

<InflationGauge
  percentage={125.5}
  title="Inflación Acumulada"
/>
```

**Colores automáticos:**
- 🟢 Verde: < 10% (inflación baja)
- 🟡 Amarillo: 10-50% (inflación media)
- 🔴 Rojo: > 50% (inflación alta)

**Cuándo usar:**
- Mostrar inflación total de forma visual
- Dar contexto rápido (¿es mucha o poca inflación?)
- Como resumen en la parte superior

---

## 🎯 Mejores Prácticas

### 1. **Siempre usa tooltips para términos técnicos**

❌ Malo:
```tsx
<Label>Tasa de Interés Compuesto</Label>
```

✅ Bueno:
```tsx
<InputWithIcon
  label="Tasa de Interés"
  icon={TrendingUp}
  tooltip="El porcentaje que ganas cada año. Por ejemplo, un plazo fijo da 5% anual."
/>
```

### 2. **Usa colores semánticos**

- 🟢 Verde = Ganancia, positivo, buenas noticias
- 🔴 Rojo = Pérdida, inflación alta, precaución
- 🟡 Amarillo = Advertencia, neutral
- 🔵 Azul = Información, neutral

### 3. **Muestra múltiples visualizaciones**

Para cada resultado importante, muestra:
1. **Número grande** (MetricCard)
2. **Comparación** (ResultComparison)
3. **Gráfico temporal** (InflationTimelineChart)
4. **Contexto visual** (InflationGauge)

### 4. **Explica en lenguaje simple**

❌ Malo:
```
"IPC acumulado: 1,200%"
```

✅ Bueno:
```
"Inflación Total: 1,200%"
+ Tooltip: "Esto significa que los precios subieron 12 veces en este período"
```

### 5. **Usa íconos consistentes**

Mantén los mismos íconos para los mismos conceptos:
- 💵 Dinero = `DollarSign`
- 📅 Fecha = `Calendar`
- 📈 Crecimiento = `TrendingUp`
- 📉 Caída = `TrendingDown`
- 🏠 Inmueble = `Home`
- 💼 Inversión = `Briefcase`

### 6. **Mobile-first**

Todos los componentes son responsive. Usa grids:

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <MetricCard ... />
  <MetricCard ... />
  <MetricCard ... />
</div>
```

---

## 📱 Ejemplo Completo

Ver `components/examples/enhanced-calculator-example.tsx` para un ejemplo completo que usa todos los componentes juntos.

---

## 🎨 Personalización de Colores

Los colores de los gráficos están definidos en `app/globals.css`:

```css
:root {
  --chart-1: 221.2 83.2% 53.3%; /* Azul primario */
  --chart-2: 142.1 76.2% 36.3%; /* Verde */
  --chart-3: 262.1 83.3% 57.8%; /* Púrpura */
  --chart-4: 346.8 77.2% 49.8%; /* Rojo */
  --chart-5: 24.6 95% 53.1%;    /* Naranja */
}
```

---

## 🚀 Próximos Pasos

1. Implementar estas mejoras en las calculadoras existentes
2. Crear calculadora de inmuebles con estos componentes
3. Crear calculadora de interés compuesto
4. Agregar más tooltips explicativos
5. Crear tutoriales interactivos

---

**¿Preguntas?** Todos los componentes tienen comentarios JSDoc con ejemplos de uso.

