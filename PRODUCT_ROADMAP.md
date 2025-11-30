# 🗺️ Roadmap del Producto - ¿Cuánto Vale Hoy?

## 🎯 Visión del Producto

**¿Cuánto Vale Hoy?** es una plataforma educativa y práctica que ayuda a las personas a entender el impacto de la inflación en su dinero y tomar mejores decisiones financieras.

### Público Objetivo
- 👥 Personas sin conocimientos técnicos financieros
- 💼 Trabajadores que quieren entender su salario real
- 🏠 Propietarios que quieren valorar su inmueble
- 💰 Ahorristas que buscan proteger su dinero

### Diferenciadores
- ✅ **Simplicidad**: Interfaz intuitiva con tooltips explicativos
- ✅ **Visual**: Gráficos que hacen fácil entender conceptos complejos
- ✅ **Educativo**: Explica conceptos financieros en lenguaje simple
- ✅ **Contextualizado**: Enfocado en Argentina (ARS + USD)
- ✅ **Mobile-first**: Optimizado para celulares

---

## 📊 Funcionalidades Propuestas

### ✅ FASE 1: Fundamentos (Completado)

#### 1.1 Calculadora de Inflación Simple
**Estado**: Implementado ✅

- Ajuste por inflación ARS (datos INDEC)
- Ajuste por inflación USD (datos CPI)
- Selección de fechas
- Resultado con % de inflación

**Mejoras pendientes**:
- [ ] Integrar nuevos componentes UX (InputWithIcon, MetricCard)
- [ ] Agregar gráfico de evolución temporal
- [ ] Agregar medidor de inflación (gauge)
- [ ] Tooltips explicativos en cada campo

#### 1.2 Conversión con Inflación
**Estado**: Implementado ✅

- Conversión ARS ↔ USD
- Tipo de cambio oficial y blue
- Ajuste por inflación de ambas monedas

**Mejoras pendientes**:
- [ ] Indicador de pasos (StepIndicator)
- [ ] Explicación visual del flujo
- [ ] Comparación "¿convenía dolarizar?"
- [ ] Gráfico de evolución del tipo de cambio

---

### 🚧 FASE 2: Expansión (En Desarrollo)

#### 2.1 Calculadora de Valor de Inmuebles por m²
**Estado**: Diseñado, pendiente implementación 🔨

**Propósito**: Normalizar el valor de propiedades para comparar correctamente

**Inputs**:
- 💵 Precio del inmueble
- 📐 Metros cuadrados
- 📅 Fecha de compra/valuación
- 📅 Fecha de comparación
- 💱 Moneda (ARS/USD)

**Outputs**:
- Precio/m² original
- Precio/m² ajustado por inflación
- Precio total ajustado
- % de variación real
- Gráfico de evolución del m²

**Casos de uso**:
```
"Compré un depto de 50m² a $10M en 2020.
¿Cuánto vale el m² hoy ajustado por inflación?"

Resultado:
- Precio/m² 2020: $200,000
- Precio/m² 2024 (ajustado): $524,780
- Si vendo hoy a $25M → $500,000/m² → Perdí valor real
```

**Funcionalidades adicionales** (futuro):
- Comparar con precio promedio de la zona
- Calcular si conviene vender o seguir alquilando
- Proyección de valor futuro

#### 2.2 Calculadora de Interés Compuesto Simple
**Estado**: Diseñado, pendiente implementación 🔨

**Propósito**: Proyectar inversiones y compararlas con inflación

**Inputs**:
- 💰 Capital inicial
- 📈 Tasa de interés anual (%)
- 📅 Plazo (años/meses)
- 🔄 Frecuencia de capitalización (mensual/anual)
- 💱 Moneda (ARS/USD)

**Outputs**:
- Capital final
- Intereses ganados
- Gráfico de crecimiento (área apilada)
- **Comparación con inflación**:
  - Ganancia nominal
  - Ganancia real (después de inflación)
  - ¿Ganaste o perdiste poder adquisitivo?

**Casos de uso**:
```
"Tengo $100,000 ARS. Si los pongo en un plazo fijo al 5% mensual
por 12 meses, ¿gano o pierdo contra la inflación?"

Resultado:
- Capital final: $179,585
- Intereses: $79,585 (+79.6%)
- Inflación del período: 120%
- Resultado: Perdiste -20% de poder adquisitivo real
```

**Visualización**:
- Gráfico de área: Capital + Intereses
- Línea de inflación superpuesta
- Zona verde = ganancia real, zona roja = pérdida real

---

### 🎯 FASE 3: Avanzado (Futuro)

#### 3.1 Calculadora de Interés Compuesto con Aportes
**Estado**: Planificado 📋

**Diferencia**: Permite aportes mensuales/anuales

**Inputs adicionales**:
- 💸 Aporte periódico
- 📅 Frecuencia de aportes

**Caso de uso**:
```
"Si ahorro $10,000 por mes durante 5 años al 5% mensual,
¿cuánto tendré?"
```

#### 3.2 Calculadora de Meta de Ahorro
**Estado**: Planificado 📋

**Propósito**: Calcular cuánto ahorrar para llegar a una meta

**Inputs**:
- 🎯 Meta de dinero (ej: US$50,000)
- 📈 Tasa de interés esperada
- 📅 Plazo disponible
- 💰 Capital inicial (opcional)

**Output**:
- Aporte mensual necesario
- Proyección mes a mes
- Alternativas (más plazo = menos aporte)

#### 3.3 Calculadora de Salarios Ajustados
**Estado**: Idea 💡

**Propósito**: Ver evolución real del salario

**Inputs**:
- Salario histórico
- Fecha
- Aumentos recibidos

**Output**:
- Salario ajustado por inflación
- ¿Ganaste o perdiste poder adquisitivo?
- Cuánto deberías ganar hoy

#### 3.4 Comparador de Escenarios
**Estado**: Idea 💡

**Propósito**: Comparar múltiples estrategias financieras

**Ejemplos**:
- Ahorrar en ARS vs USD vs invertir
- Comprar inmueble vs invertir el dinero
- Pagar deuda vs invertir

---

## 🎨 Mejoras de UX Implementadas

### Componentes Nuevos Creados

#### Inputs Mejorados
- ✅ `InfoTooltip` - Tooltips con ícono de ayuda
- ✅ `InputWithIcon` - Inputs con ícono y tooltip integrado

#### Visualización de Datos
- ✅ `MetricCard` - Tarjetas de métricas con colores semánticos
- ✅ `ResultComparison` - Comparación antes/después visual
- ✅ `StepIndicator` - Indicador de pasos multi-etapa

#### Gráficos
- ✅ `InflationTimelineChart` - Evolución temporal (línea)
- ✅ `ComparisonBarChart` - Comparación de valores (barras)
- ✅ `CompoundInterestChart` - Interés compuesto (área apilada)
- ✅ `InflationGauge` - Medidor de inflación con colores

### Principios de Diseño

1. **🎯 Claridad sobre complejidad**
   - Lenguaje simple, sin jerga
   - Tooltips en todos los términos técnicos

2. **👁️ Visual primero**
   - Cada resultado tiene un gráfico
   - Colores semánticos (verde=bueno, rojo=malo)

3. **📱 Mobile-first**
   - Todo responsive
   - Touch-friendly

4. **🎓 Educativo**
   - Explica conceptos mientras calculas
   - Contexto en cada resultado

5. **⚡ Rápido y directo**
   - Resultados instantáneos
   - Sin pasos innecesarios

---

## 📈 Métricas de Éxito

### Engagement
- [ ] Tiempo promedio en la app > 3 minutos
- [ ] Cálculos por sesión > 2
- [ ] Tasa de rebote < 40%

### Educación
- [ ] % de usuarios que leen tooltips > 30%
- [ ] % de usuarios que usan múltiples calculadoras > 40%

### Adopción
- [ ] Usuarios activos mensuales
- [ ] Compartidos en redes sociales
- [ ] Retorno de usuarios > 20%

---

## 🛠️ Stack Técnico

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS
- **Componentes**: shadcn/ui (customizados)
- **Gráficos**: Recharts
- **Íconos**: Lucide React
- **Tema**: next-themes (dark/light)

### Datos
- **Inflación ARS**: INDEC (hardcoded, actualización manual)
- **Inflación USD**: CPI (hardcoded, actualización manual)
- **Tipo de cambio**: Histórico hardcoded

### Futuro
- [ ] API para datos en tiempo real (BCRA, INDEC)
- [ ] Base de datos para guardar cálculos del usuario
- [ ] Autenticación (opcional)
- [ ] Exportar a PDF

---

## 📋 Backlog Priorizado

### Alta Prioridad (Próximas 2 semanas)
1. ✅ Crear componentes UX base
2. ✅ Documentar componentes
3. [ ] Refactorizar calculadora de inflación con nuevos componentes
4. [ ] Refactorizar conversión con inflación
5. [ ] Implementar calculadora de inmuebles
6. [ ] Implementar calculadora de interés compuesto simple

### Media Prioridad (Próximo mes)
7. [ ] Agregar más gráficos a calculadoras existentes
8. [ ] Implementar interés compuesto con aportes
9. [ ] Implementar calculadora de meta de ahorro
10. [ ] Mejorar diseño de landing page
11. [ ] Agregar ejemplos pre-cargados

### Baja Prioridad (Futuro)
12. [ ] Comparador de escenarios
13. [ ] Calculadora de salarios
14. [ ] Integración con APIs externas
15. [ ] Exportar resultados a PDF
16. [ ] Guardar historial de cálculos
17. [ ] Modo de comparación lado a lado

---

## 🎯 Próximos Pasos Inmediatos

### 1. Refactorizar Calculadoras Existentes
- Usar `InputWithIcon` en todos los inputs
- Agregar tooltips explicativos
- Mostrar resultados con `MetricCard`
- Agregar gráficos de evolución

### 2. Implementar Calculadora de Inmuebles
- Crear componente `RealEstateCalculator`
- Implementar lógica de cálculo por m²
- Agregar gráfico de evolución del m²
- Agregar comparación con promedio de zona (futuro)

### 3. Implementar Calculadora de Interés Compuesto
- Crear componente `CompoundInterestCalculator`
- Implementar lógica de cálculo
- Usar `CompoundInterestChart` para visualización
- Agregar comparación con inflación

### 4. Testing y Refinamiento
- Probar en mobile
- Ajustar tooltips según feedback
- Optimizar performance de gráficos
- Mejorar accesibilidad

---

## 💡 Ideas Adicionales

### Contenido Educativo
- [ ] Sección "¿Qué es la inflación?"
- [ ] Blog con casos de uso reales
- [ ] Videos explicativos cortos
- [ ] Glosario de términos financieros

### Engagement
- [ ] Compartir resultados en redes
- [ ] Generar imagen con el resultado
- [ ] Comparar con amigos
- [ ] Newsletter con datos de inflación

### Monetización (Opcional, futuro)
- [ ] Versión premium con más funciones
- [ ] API para desarrolladores
- [ ] Asesoría financiera personalizada
- [ ] Publicidad contextual

---

## 📞 Contacto y Contribuciones

Este es un proyecto en evolución. Las sugerencias y contribuciones son bienvenidas.

**Creado con ❤️ para ayudar a entender el impacto de la inflación en Argentina**

