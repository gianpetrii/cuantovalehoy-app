"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { InputWithIcon } from "@/components/ui/input-with-icon";
import { MetricCard } from "@/components/ui/metric-card";
import { ResultComparison } from "@/components/ui/result-comparison";
import { InflationTimelineChart } from "@/components/charts/inflation-timeline-chart";
import { ComparisonBarChart } from "@/components/charts/comparison-bar-chart";
import { InflationGauge } from "@/components/charts/inflation-gauge";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import {
  calculateInflationAdjustment,
  getAvailableDates,
  formatDateDisplay,
  formatCurrency,
  getInflationData,
} from "@/lib/services/inflation-service";
import { Currency, CalculationResult } from "@/types/inflation";
import { TrendingUp, Calculator, DollarSign, Calendar, Flame } from "lucide-react";

export function InflationCalculatorEnhanced() {
  const [currency, setCurrency] = useState<Currency>("ARS");
  const [amount, setAmount] = useState<string>("");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const availableDates = getAvailableDates(currency);

  const handleCalculate = () => {
    try {
      setError(null);
      
      if (!amount || !fromDate || !toDate) {
        setError("Por favor completa todos los campos");
        return;
      }

      const numAmount = parseFloat(amount);
      if (isNaN(numAmount) || numAmount <= 0) {
        setError("Por favor ingresa un monto válido");
        return;
      }

      if (fromDate >= toDate) {
        setError("La fecha de origen debe ser anterior a la fecha de destino");
        return;
      }

      const calculationResult = calculateInflationAdjustment({
        amount: numAmount,
        fromDate,
        toDate,
        currency,
      });

      setResult(calculationResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al calcular");
      setResult(null);
    }
  };

  const handleCurrencyChange = (newCurrency: Currency) => {
    setCurrency(newCurrency);
    setFromDate("");
    setToDate("");
    setResult(null);
    setError(null);
  };

  // Generate timeline data for chart
  const getTimelineData = () => {
    if (!result) return [];

    const inflationData = getInflationData(result.currency);
    const fromIndex = inflationData.findIndex(d => d.date === result.fromDate);
    const toIndex = inflationData.findIndex(d => d.date === result.toDate);

    if (fromIndex === -1 || toIndex === -1) return [];

    const relevantData = inflationData.slice(fromIndex, toIndex + 1);
    const baseAccumulated = inflationData[fromIndex].accumulated;

    return relevantData.map(item => {
      const relativeInflation = ((1 + item.accumulated / 100) / (1 + baseAccumulated / 100) - 1) * 100;
      const adjustedValue = result.originalAmount * (1 + relativeInflation / 100);
      
      return {
        date: item.date,
        value: adjustedValue,
      };
    });
  };

  // Generate comparison data for bar chart
  const getComparisonData = () => {
    if (!result) return [];

    return [
      {
        name: "Valor Original",
        value: result.originalAmount,
        color: "hsl(var(--muted-foreground))",
      },
      {
        name: "Valor Ajustado",
        value: result.adjustedAmount,
        color: result.inflationRate > 50 ? "hsl(var(--destructive))" : "hsl(var(--primary))",
      },
    ];
  };

  const currencySymbol = currency === "ARS" ? "$" : "US$";
  const currencyName = currency === "ARS" ? "Pesos Argentinos" : "Dólares";

  return (
    <div className="space-y-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Calculadora de Inflación
          </CardTitle>
          <CardDescription>
            Descubre cuánto vale tu dinero hoy, ajustado por inflación
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Currency Selection */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="currency">Moneda</Label>
              <InfoTooltip content="Elige la moneda en la que quieres calcular. ARS usa datos del INDEC, USD usa datos del CPI estadounidense." />
            </div>
            <Select
              id="currency"
              value={currency}
              onChange={(e) => handleCurrencyChange(e.target.value as Currency)}
              className="w-full"
            >
              <option value="ARS">💵 Peso Argentino (ARS)</option>
              <option value="USD">💵 Dólar Estadounidense (USD)</option>
            </Select>
          </div>

          {/* Amount Input */}
          <InputWithIcon
            label="Monto"
            icon={DollarSign}
            type="number"
            placeholder="10000"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            step="0.01"
            min="0"
            tooltip={`¿Cuánto dinero tenías? Por ejemplo, tu salario, ahorros, o el precio de algo que compraste. Ingresa el monto en ${currencyName}.`}
          />

          {/* Date Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="fromDate" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  Fecha de Origen
                </Label>
                <InfoTooltip content="¿Cuándo tenías ese dinero? Selecciona el mes y año en el pasado." />
              </div>
              <Select
                id="fromDate"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              >
                <option value="">Selecciona una fecha</option>
                {availableDates.map((date) => (
                  <option key={date} value={date}>
                    {formatDateDisplay(date)}
                  </option>
                ))}
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="toDate" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  Fecha de Destino
                </Label>
                <InfoTooltip content="¿A qué fecha quieres ajustar? Por ejemplo, hoy para ver cuánto vale ahora ese dinero." />
              </div>
              <Select
                id="toDate"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              >
                <option value="">Selecciona una fecha</option>
                {availableDates.map((date) => (
                  <option key={date} value={date}>
                    {formatDateDisplay(date)}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <Button onClick={handleCalculate} className="w-full" size="lg">
            <Calculator className="h-4 w-4 mr-2" />
            Calcular Inflación
          </Button>

          {error && (
            <div className="p-4 bg-destructive/10 text-destructive rounded-md text-sm">
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Section */}
      {result && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Resultados del Análisis</h2>

          {/* Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MetricCard
              title="Valor Original"
              value={formatCurrency(result.originalAmount, result.currency)}
              subtitle={formatDateDisplay(result.fromDate)}
              icon={DollarSign}
              variant="default"
            />

            <MetricCard
              title="Valor Ajustado"
              value={formatCurrency(result.adjustedAmount, result.currency)}
              subtitle={formatDateDisplay(result.toDate)}
              icon={TrendingUp}
              trend="up"
              trendValue={`+${result.inflationRate.toFixed(1)}%`}
              variant={result.inflationRate > 100 ? "danger" : result.inflationRate > 50 ? "warning" : "success"}
              tooltip="Este es el valor equivalente en la fecha de destino, considerando la inflación acumulada del período"
            />

            <MetricCard
              title="Inflación Acumulada"
              value={`${result.inflationRate.toFixed(2)}%`}
              subtitle={`En ${getMonthsDifference(result.fromDate, result.toDate)} meses`}
              icon={Flame}
              trend={result.inflationRate > 50 ? "up" : result.inflationRate > 10 ? "neutral" : "down"}
              trendValue={result.inflationRate > 50 ? "Alta" : result.inflationRate > 10 ? "Media" : "Baja"}
              variant={result.inflationRate > 50 ? "danger" : result.inflationRate > 10 ? "warning" : "success"}
            />
          </div>

          {/* Comparison */}
          <ResultComparison
            title="Comparación de Poder Adquisitivo"
            beforeLabel={formatDateDisplay(result.fromDate)}
            beforeValue={formatCurrency(result.originalAmount, result.currency)}
            afterLabel={formatDateDisplay(result.toDate)}
            afterValue={formatCurrency(result.adjustedAmount, result.currency)}
            changePercentage={result.inflationRate}
            changeLabel="de inflación"
            variant={result.inflationRate > 50 ? "danger" : "default"}
          />

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <InflationTimelineChart
              data={getTimelineData()}
              title="Evolución del Valor en el Tiempo"
              tooltip="Muestra cómo el valor de tu dinero cambia mes a mes debido a la inflación"
              currency={currencySymbol}
              valueLabel="Valor Ajustado"
            />

            <ComparisonBarChart
              data={getComparisonData()}
              title="Comparación Visual"
              tooltip="Compara el valor original con el valor ajustado por inflación"
              currency={currencySymbol}
            />
          </div>

          {/* Inflation Gauge */}
          <InflationGauge
            percentage={result.inflationRate}
            title="Medidor de Inflación"
            tooltip="Visualización del nivel de inflación: verde (baja), amarillo (media), rojo (alta)"
          />

          {/* Explanation Card */}
          <Card className="border-blue-500/50 bg-blue-500/5">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                💡 ¿Qué significa esto?
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>
                Si tenías <strong>{formatCurrency(result.originalAmount, result.currency)}</strong> en{" "}
                <strong>{formatDateDisplay(result.fromDate)}</strong>, necesitarías{" "}
                <strong>{formatCurrency(result.adjustedAmount, result.currency)}</strong> en{" "}
                <strong>{formatDateDisplay(result.toDate)}</strong> para tener el mismo poder de compra.
              </p>
              <p>
                La inflación de <strong>{result.inflationRate.toFixed(2)}%</strong> significa que los precios{" "}
                {result.inflationRate > 100 ? "más que se duplicaron" : "aumentaron significativamente"} en este período.
              </p>
              {result.inflationRate > 50 && (
                <p className="text-destructive font-medium">
                  ⚠️ Esta es una inflación alta que erosiona significativamente el valor del dinero. 
                  Considera invertir en activos que protejan contra la inflación.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

// Helper function to calculate months difference
function getMonthsDifference(fromDate: string, toDate: string): number {
  const [fromYear, fromMonth] = fromDate.split("-").map(Number);
  const [toYear, toMonth] = toDate.split("-").map(Number);
  
  return (toYear - fromYear) * 12 + (toMonth - fromMonth);
}

