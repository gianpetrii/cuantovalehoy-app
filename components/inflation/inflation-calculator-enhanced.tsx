"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { NumericInput } from "@/components/ui/numeric-input";
import { MetricCard } from "@/components/ui/metric-card";
import { ResultComparison } from "@/components/ui/result-comparison";
import { InflationTimelineChart } from "@/components/charts/inflation-timeline-chart";
import { ComparisonBarChart } from "@/components/charts/comparison-bar-chart";
import { InflationGauge } from "@/components/charts/inflation-gauge";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { MonthYearPicker } from "@/components/ui/month-year-picker";
import { formatDateDisplay, formatCurrency } from "@/lib/services/inflation-service";
import { useInflationData, useExchangeRates } from "@/lib/hooks/use-inflation-data";
import { Currency, CalculationResult } from "@/types/inflation";
import { TrendingUp, Calculator, DollarSign, Calendar, Flame, ArrowRightLeft } from "lucide-react";

export function InflationCalculatorEnhanced() {
  const [currency, setCurrency] = useState<Currency>("ARS");
  const [amount, setAmount] = useState<string>("");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dollarizationResult, setDollarizationResult] = useState<any>(null);
  const [showDollarization, setShowDollarization] = useState(true);
  const [autoOpenToDate, setAutoOpenToDate] = useState(false);
  
  // Ref para scroll automático
  const resultsRef = useRef<HTMLDivElement>(null);

  // Obtener datos desde Supabase
  const { data: inflationData, isLoading: inflationLoading } = useInflationData(currency);
  const { data: exchangeRates, isLoading: exchangeLoading } = useExchangeRates();
  
  const availableDates = inflationData?.map(item => item.date) || [];
  
  // Calcular días entre fechas
  const daysBetween = fromDate && toDate ? 
    Math.abs(Math.floor((new Date(toDate).getTime() - new Date(fromDate).getTime()) / (1000 * 60 * 60 * 24))) : 0;

  const handleCalculate = () => {
    try {
      setError(null);
      
      if (!inflationData || !exchangeRates) {
        setError("Cargando datos...");
        return;
      }
      
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

      // Las fechas ya vienen en formato YYYY-MM
      const fromDateYM = fromDate;
      const toDateYM = toDate;

      // Buscar datos de inflación
      const fromData = inflationData.find(item => item.date === fromDateYM);
      const toData = inflationData.find(item => item.date === toDateYM);

      if (!fromData || !toData) {
        setError("No hay datos disponibles para el período seleccionado");
        return;
      }

      // Calcular inflación
      const inflationRate = ((1 + toData.accumulated / 100) / (1 + fromData.accumulated / 100) - 1) * 100;
      const adjustedAmount = numAmount * (1 + inflationRate / 100);

      const calculationResult: CalculationResult = {
        originalAmount: numAmount,
        adjustedAmount,
        inflationRate,
        fromDate: fromDateYM,
        toDate: toDateYM,
        currency,
      };

      setResult(calculationResult);

      // Si es ARS, calcular comparación con dolarización
      if (currency === "ARS" && showDollarization) {
        try {
          const fromRate = exchangeRates.find(item => item.date === fromDateYM);
          const toRate = exchangeRates.find(item => item.date === toDateYM);

          if (fromRate && toRate) {
            const dollarAmount = numAmount / fromRate.blue;
            const finalUSD = dollarAmount * toRate.blue;
            const difference = finalUSD - adjustedAmount;
            const percentageDifference = (difference / adjustedAmount) * 100;

            setDollarizationResult({
              arsAmount: numAmount,
              dollarAmount,
              finalARS: adjustedAmount,
              finalUSD,
              difference,
              percentageDifference,
              wasBetter: finalUSD > adjustedAmount ? "USD" : "ARS",
            });
          }
        } catch (err) {
          console.error("Error calculating dollarization:", err);
          setDollarizationResult(null);
        }
      } else {
        setDollarizationResult(null);
      }
      
      // Scroll automático a los resultados
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al calcular");
      setResult(null);
      setDollarizationResult(null);
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
    if (!result || !inflationData) return [];

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
            Calculadora de Poder Adquisitivo
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
          <NumericInput
            label="Monto"
            icon={DollarSign}
            placeholder="10.000"
            value={amount}
            onChange={setAmount}
            min={0}
            decimals={2}
            prefix={currencySymbol}
            tooltip={`¿Cuánto dinero tenías? Por ejemplo, tu salario, ahorros, o el precio de algo que compraste. Ingresa el monto en ${currencyName}.`}
          />

          {/* Date Selection */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <MonthYearPicker
                label="Mes de Origen"
                value={fromDate}
                onChange={setFromDate}
                minDate="2020-01"
                tooltip="¿En qué mes tenías ese dinero? Los datos de inflación se publican mensualmente."
              />

              <MonthYearPicker
                label="Mes de Destino"
                value={toDate}
                onChange={setToDate}
                minDate="2020-01"
                tooltip="¿A qué mes quieres ajustar? Por ejemplo, el mes actual para ver cuánto vale ahora ese dinero."
              />
            </div>
            
            {/* Preview de días seleccionados */}
            {fromDate && toDate && (
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
                <Calendar className="h-4 w-4" />
                <span>
                  <strong>{daysBetween}</strong> día{daysBetween !== 1 ? "s" : ""} seleccionado{daysBetween !== 1 ? "s" : ""}
                  {daysBetween > 365 && ` (${(daysBetween / 365).toFixed(1)} años)`}
                </span>
              </div>
            )}
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
        <div ref={resultsRef} className="space-y-6 scroll-mt-6">
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

          {/* Dollarization Comparison - Only for ARS */}
          {dollarizationResult && result.currency === "ARS" && (
            <Card className={dollarizationResult.wasWorthIt ? "border-green-500/50 bg-green-500/5" : "border-yellow-500/50 bg-yellow-500/5"}>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <ArrowRightLeft className="h-5 w-5" />
                  ¿Convenía Dolarizar?
                </CardTitle>
                <CardDescription>
                  Comparación: mantener en pesos vs convertir a dólares
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Comparison Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Option A - Keep ARS */}
                  <Card className="border-red-500/30">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Opción A: Mantener en Pesos</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Monto original:</span>
                        <span className="font-medium">{formatCurrency(dollarizationResult.originalARS, "ARS")}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Inflación ARS:</span>
                        <span className="font-medium text-destructive">+{dollarizationResult.arsInflation.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between text-sm pt-2 border-t">
                        <span className="text-muted-foreground">Valor ajustado:</span>
                        <span className="font-bold">{formatCurrency(dollarizationResult.adjustedARS, "ARS")}</span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Option B - Dollarize */}
                  <Card className={dollarizationResult.wasWorthIt ? "border-green-500/30" : "border-yellow-500/30"}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Opción B: Dolarizar (Blue)</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Convertías a:</span>
                        <span className="font-medium">{formatCurrency(dollarizationResult.initialUSD, "USD")}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">TC inicial:</span>
                        <span className="text-xs">${dollarizationResult.initialExchangeRate.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Inflación USD:</span>
                        <span className="font-medium text-green-600">+{dollarizationResult.usdInflation.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">USD ajustado:</span>
                        <span className="font-medium">{formatCurrency(dollarizationResult.adjustedUSD, "USD")}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">TC final:</span>
                        <span className="text-xs">${dollarizationResult.finalExchangeRate.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm pt-2 border-t">
                        <span className="text-muted-foreground">Hoy serían:</span>
                        <span className="font-bold">{formatCurrency(dollarizationResult.finalARS, "ARS")}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Result */}
                <Card className={dollarizationResult.wasWorthIt ? "bg-green-500/10 border-green-500" : "bg-yellow-500/10 border-yellow-500"}>
                  <CardContent className="pt-6">
                    <div className="text-center space-y-2">
                      <div className="text-3xl font-bold">
                        {dollarizationResult.wasWorthIt ? "✅" : "⚠️"}
                      </div>
                      <div className="text-lg font-semibold">
                        {dollarizationResult.wasWorthIt ? "¡SÍ convenía dolarizar!" : "Resultado mixto"}
                      </div>
                      <div className="text-2xl font-bold">
                        {dollarizationResult.dollarizationGain > 0 ? "+" : ""}
                        {dollarizationResult.dollarizationGain.toFixed(1)}%
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {dollarizationResult.wasWorthIt ? (
                          <>
                            Dolarizando hubieras ganado <strong>{dollarizationResult.dollarizationGain.toFixed(1)}%</strong> más
                            que manteniendo en pesos. La diferencia es de{" "}
                            <strong>{formatCurrency(dollarizationResult.finalARS - dollarizationResult.adjustedARS, "ARS")}</strong>.
                          </>
                        ) : (
                          <>
                            La diferencia entre ambas opciones es de solo{" "}
                            <strong>{Math.abs(dollarizationResult.dollarizationGain).toFixed(1)}%</strong>.
                            Ambas estrategias tuvieron resultados similares.
                          </>
                        )}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Explanation */}
                <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-md">
                  <p>
                    <strong>💡 Cómo se calcula:</strong> Se convierte el monto a USD al tipo de cambio blue de la fecha inicial,
                    se ajusta por la inflación estadounidense (CPI), y se reconvierte a ARS al tipo de cambio blue actual.
                    Esto muestra si convenía &quot;dolarizar&quot; tu dinero en el pasado.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

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

