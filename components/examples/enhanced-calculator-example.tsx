"use client";

import * as React from "react";
import {
  DollarSign,
  Calendar,
  TrendingUp,
  Home,
  Calculator,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InputWithIcon } from "@/components/ui/input-with-icon";
import { MetricCard } from "@/components/ui/metric-card";
import { ResultComparison } from "@/components/ui/result-comparison";
import { StepIndicator } from "@/components/ui/step-indicator";
import { InflationTimelineChart } from "@/components/charts/inflation-timeline-chart";
import { ComparisonBarChart } from "@/components/charts/comparison-bar-chart";
import { InflationGauge } from "@/components/charts/inflation-gauge";

/**
 * EJEMPLO de cómo usar los nuevos componentes UX
 * Este es un template que muestra todas las funcionalidades juntas
 * 
 * Características demostradas:
 * - Inputs con íconos y tooltips explicativos
 * - Indicador de pasos para procesos complejos
 * - Tarjetas de métricas con colores semánticos
 * - Comparaciones visuales antes/después
 * - Múltiples tipos de gráficos
 * - Medidor de inflación con colores
 */
export function EnhancedCalculatorExample() {
  const [step, setStep] = React.useState(0);

  // Datos de ejemplo
  const timelineData = [
    { date: "2020-01", value: 10000 },
    { date: "2020-06", value: 12500 },
    { date: "2021-01", value: 16000 },
    { date: "2021-06", value: 20000 },
    { date: "2022-01", value: 26000 },
    { date: "2022-06", value: 35000 },
    { date: "2023-01", value: 48000 },
    { date: "2023-06", value: 68000 },
    { date: "2024-01", value: 95000 },
    { date: "2024-06", value: 130000 },
  ];

  const comparisonData = [
    { name: "Valor Original", value: 10000, color: "hsl(var(--primary))" },
    { name: "Valor Ajustado", value: 130000, color: "hsl(var(--chart-2))" },
  ];

  const steps = [
    {
      label: "Datos Iniciales",
      description: "Ingresa los valores",
      icon: DollarSign,
    },
    {
      label: "Período",
      description: "Selecciona fechas",
      icon: Calendar,
    },
    {
      label: "Cálculo",
      description: "Procesando",
      icon: Calculator,
    },
    {
      label: "Resultados",
      description: "Ver análisis",
      icon: TrendingUp,
    },
  ];

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold">Calculadora Mejorada</h1>
        <p className="text-muted-foreground">
          Ejemplo de UX optimizada con iconos, tooltips y gráficos
        </p>
      </div>

      {/* Step Indicator */}
      <StepIndicator steps={steps} currentStep={step} />

      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle>Paso 1: Ingresa tus Datos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <InputWithIcon
            label="Monto Inicial"
            icon={DollarSign}
            type="number"
            placeholder="10000"
            tooltip="El dinero que tenías en el pasado. Por ejemplo, tu salario de hace 3 años."
          />

          <InputWithIcon
            label="Fecha de Origen"
            icon={Calendar}
            type="month"
            tooltip="¿Cuándo tenías ese dinero? Selecciona el mes y año."
          />

          <InputWithIcon
            label="Fecha de Destino"
            icon={Calendar}
            type="month"
            tooltip="¿A qué fecha quieres ajustar? Por ejemplo, hoy para ver cuánto vale ahora."
          />

          <Button onClick={() => setStep(3)} className="w-full">
            Calcular Inflación
          </Button>
        </CardContent>
      </Card>

      {/* Results Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Resultados del Análisis</h2>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricCard
            title="Valor Original"
            value="$10,000"
            subtitle="Enero 2020"
            icon={DollarSign}
            variant="default"
          />

          <MetricCard
            title="Valor Ajustado"
            value="$130,000"
            subtitle="Junio 2024"
            icon={TrendingUp}
            trend="up"
            trendValue="+1,200%"
            variant="success"
            tooltip="Este es el valor equivalente hoy, considerando la inflación acumulada"
          />

          <MetricCard
            title="Inflación Total"
            value="1,200%"
            subtitle="En 4.5 años"
            icon={TrendingUp}
            trend="up"
            trendValue="Alta"
            variant="danger"
          />
        </div>

        {/* Comparison */}
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

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <InflationTimelineChart
            data={timelineData}
            title="Evolución del Valor en el Tiempo"
            currency="$"
          />

          <ComparisonBarChart
            data={comparisonData}
            title="Antes vs Después"
            currency="$"
          />
        </div>

        {/* Inflation Gauge */}
        <InflationGauge
          percentage={1200}
          title="Medidor de Inflación"
        />
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-blue-500/50 bg-blue-500/5">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Home className="h-5 w-5" />
              ¿Qué significa esto?
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Si tenías $10,000 en enero 2020, necesitarías $130,000 hoy para
            tener el mismo poder de compra. La inflación hizo que tu dinero
            valga menos con el tiempo.
          </CardContent>
        </Card>

        <Card className="border-green-500/50 bg-green-500/5">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Consejo
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Para protegerte de la inflación, considera invertir tu dinero en
            instrumentos que superen la tasa de inflación, como bonos ajustados
            por CER o dólares.
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

