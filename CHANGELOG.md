# Changelog - ¿Cuánto Vale Hoy?

## [2.0.0] - 2024-11-30

### 🎉 Lanzamiento Mayor - UX Mejorada y Nuevas Funcionalidades

#### ✨ Nuevos Componentes UX

**Componentes de Input:**
- ✅ `InfoTooltip` - Tooltips con ícono de ayuda para explicar conceptos
- ✅ `InputWithIcon` - Inputs mejorados con ícono, label y tooltip integrado

**Componentes de Visualización:**
- ✅ `MetricCard` - Tarjetas de métricas con colores semánticos
- ✅ `ResultComparison` - Comparación visual antes/después con flechas
- ✅ `StepIndicator` - Indicador de pasos para procesos multi-etapa
- ✅ `Tabs` - Sistema de pestañas para organizar calculadoras

**Componentes de Gráficos:**
- ✅ `InflationTimelineChart` - Gráfico de línea para evolución temporal
- ✅ `ComparisonBarChart` - Gráfico de barras para comparaciones
- ✅ `CompoundInterestChart` - Gráfico de área apilada para interés compuesto
- ✅ `InflationGauge` - Medidor visual de inflación con colores

#### 🚀 Nuevas Calculadoras

**1. Calculadora de Inflación Mejorada** (`inflation-calculator-enhanced.tsx`)
- Interfaz completamente rediseñada con nuevos componentes UX
- Tooltips explicativos en cada campo
- Múltiples visualizaciones:
  - Tarjetas de métricas con colores semánticos
  - Comparación visual antes/después
  - Gráfico de evolución temporal
  - Gráfico de barras comparativo
  - Medidor de inflación (gauge)
- Explicaciones contextuales para usuarios no técnicos
- Cálculo de meses transcurridos
- Alertas visuales para inflación alta

**2. Calculadora de Inmuebles por m²** (`real-estate-calculator.tsx`)
- Normalización de valor por metro cuadrado
- Cálculo de precio/m² original y ajustado
- Comparación con precio de venta actual (opcional)
- Determinación de ganancia/pérdida real
- Gráfico de evolución del precio/m²
- Explicaciones de por qué normalizar por m²
- Alertas visuales según ganancia/pérdida

**3. Calculadora de Interés Compuesto** (`compound-interest-calculator.tsx`)
- Proyección de inversiones con interés compuesto
- Capitalización mensual o anual
- Comparación automática con inflación
- Gráfico de área apilada (capital + intereses)
- Cálculo de ganancia/pérdida real
- Explicaciones de cómo funciona el interés compuesto
- Alertas si la inversión no gana contra inflación

#### 🎨 Mejoras de Diseño

**Página Principal:**
- Nuevo título: "¿Cuánto Vale Hoy?"
- Sistema de tabs para organizar las 4 calculadoras
- Tarjetas informativas actualizadas
- Sección de información expandida

**Tema:**
- Agregados colores para gráficos (`--chart-1` a `--chart-5`)
- Soporte para modo claro y oscuro
- Colores semánticos consistentes:
  - 🟢 Verde: Ganancia, positivo
  - 🔴 Rojo: Pérdida, inflación alta
  - 🟡 Amarillo: Precaución, inflación media
  - 🔵 Azul: Información neutral

#### 📚 Documentación

- ✅ `UI_COMPONENTS_GUIDE.md` - Guía completa de componentes con ejemplos
- ✅ `PRODUCT_ROADMAP.md` - Plan detallado del producto y funcionalidades
- ✅ `enhanced-calculator-example.tsx` - Ejemplo completo de uso
- ✅ `CHANGELOG.md` - Este archivo

#### 🔧 Mejoras Técnicas

- Actualizado `package.json` con nombre correcto: `cuantovalehoy-app`
- Agregada librería `recharts` para gráficos
- Componente `Tabs` para organización
- Componente `Tooltip` mejorado con API compatible
- Exports organizados en archivos índice
- Código completamente tipado con TypeScript

#### 🎯 Filosofía de Diseño

1. **Simplicidad para No Técnicos**
   - Tooltips en todos los términos técnicos
   - Lenguaje simple y directo
   - Íconos que ayudan a identificar campos

2. **Visual > Números**
   - Cada resultado tiene múltiples visualizaciones
   - Gráficos de evolución temporal
   - Comparaciones con flechas y colores
   - Medidores con colores semánticos

3. **Educativo**
   - Explica conceptos mientras calculas
   - Contexto en cada resultado
   - Ejemplos y casos de uso

4. **Mobile-First**
   - Todos los componentes responsive
   - Touch-friendly
   - Grids adaptativos

---

## [1.0.0] - 2024-11 (Anterior)

### Funcionalidades Base

- Calculadora de inflación simple (ARS/USD)
- Conversión con inflación
- Datos del INDEC y CPI
- Tipo de cambio oficial y blue
- Interfaz básica con shadcn/ui

---

## 🚀 Próximas Versiones

### [2.1.0] - Planificado
- Refactorizar calculadora de conversión con nuevos componentes
- Calculadora de interés compuesto con aportes periódicos
- Calculadora de meta de ahorro
- Más tooltips y explicaciones

### [2.2.0] - Planificado
- Comparador de escenarios
- Calculadora de salarios ajustados
- Gráficos de comparación múltiple
- Exportar resultados a PDF

### [3.0.0] - Futuro
- Integración con APIs en tiempo real
- Guardar historial de cálculos
- Autenticación de usuarios
- Comparación con promedio de zona (inmuebles)
- Más monedas (EUR, BRL, etc.)

---

**Creado con ❤️ para entender mejor el impacto de la inflación en Argentina**

