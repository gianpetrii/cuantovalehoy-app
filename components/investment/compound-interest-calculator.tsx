"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { NumericInput } from "@/components/ui/numeric-input";
import { InputWithIcon } from "@/components/ui/input-with-icon";
import { MetricCard } from "@/components/ui/metric-card";
import { CompoundInterestChart } from "@/components/charts/compound-interest-chart";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { formatCurrency } from "@/lib/services/inflation-service";
import { useInflationData } from "@/lib/hooks/use-inflation-data";
import { Currency } from "@/types/inflation";
import { TrendingUp, TrendingDown, DollarSign, Calculator, Percent, Calendar, PiggyBank } from "lucide-react";

interface CompoundInterestResult {
  initialCapital: number;
  finalCapital: number;
  totalInterest: number;
  totalAmount: number;
  periods: number;
  annualRate: number;
  currency: Currency;
  chartData: Array<{
    period: number;
    capital: number;
    interest: number;
    total: number;
    pessimistic?: number;
    optimistic?: number;
  }>;
  // Scenarios (when variance is used)
  hasVariance?: boolean;
  pessimisticAmount?: number;
  optimisticAmount?: number;
  // Inflation comparison
  inflationAdjustedAmount?: number;
  realGain?: number;
  beatsInflation?: boolean;
}

export function CompoundInterestCalculator() {
  const [currency, setCurrency] = useState<Currency>("ARS");
  const [initialCapital, setInitialCapital] = useState<string>("");
  const [monthlyContribution, setMonthlyContribution] = useState<string>("0");
  const [annualRate, setAnnualRate] = useState<string>("");
  const [rateVariance, setRateVariance] = useState<string>("0");
  const [years, setYears] = useState<string>("5");
  const [frequency, setFrequency] = useState<"daily" | "weekly" | "monthly" | "annual">("monthly");
  const [compareInflation, setCompareInflation] = useState<boolean>(true);
  const [result, setResult] = useState<CompoundInterestResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Ref para scroll automático
  const resultsRef = useRef<HTMLDivElement>(null);
  
  // Obtener datos desde Supabase
  const { data: inflationData, isLoading } = useInflationData(currency);
  
  // Usar fecha actual como inicio
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}`;
  };

  const calculateCompoundInterest = () => {
    try {
      setError(null);

      if (!initialCapital || !annualRate || !years) {
        setError("Por favor completa todos los campos");
        return;
      }

      const capital = parseFloat(initialCapital);
      const contribution = parseFloat(monthlyContribution) || 0;
      const rate = parseFloat(annualRate);
      const variance = parseFloat(rateVariance) || 0;
      const numYears = parseFloat(years);

      if (isNaN(capital) || capital < 0) {
        setError("Por favor ingresa un capital inicial válido");
        return;
      }

      if (isNaN(rate) || rate <= 0) {
        setError("Por favor ingresa una tasa de interés válida");
        return;
      }

      if (isNaN(numYears) || numYears <= 0 || numYears > 50) {
        setError("Por favor ingresa un período entre 1 y 50 años");
        return;
      }

      // Calculate compound interest with contributions
      const periodsPerYear = 
        frequency === "daily" ? 365 :
        frequency === "weekly" ? 52 :
        frequency === "monthly" ? 12 : 1;
      const totalPeriods = Math.floor(numYears * periodsPerYear);
      const ratePerPeriod = rate / 100 / periodsPerYear;
      
      // Adjust contribution based on frequency
      const contributionPerPeriod = 
        frequency === "daily" ? contribution / 30 :
        frequency === "weekly" ? contribution / 4 :
        frequency === "monthly" ? contribution : 
        contribution * 12;

      // Calculate scenarios if variance is provided
      const hasVariance = variance > 0;
      const pessimisticRate = hasVariance ? (rate - variance) / 100 / periodsPerYear : ratePerPeriod;
      const optimisticRate = hasVariance ? (rate + variance) / 100 / periodsPerYear : ratePerPeriod;

      // Generate data for each period (normal scenario + variants if applicable)
      const chartData = [];
      let currentAmount = capital;
      let totalContributed = capital;
      let pessimisticAmount = capital;
      let optimisticAmount = capital;
      let pessimisticContributed = capital;
      let optimisticContributed = capital;

      // For chart display, we'll sample data points to avoid too many points
      // Limit to max 100 data points for performance
      const maxDataPoints = 100;
      const samplingRate = Math.max(1, Math.floor(totalPeriods / maxDataPoints));
      
      for (let i = 0; i <= totalPeriods; i++) {
        const interestEarned = currentAmount - totalContributed;
        
        // Only add data points at sampling intervals or at the end
        if (i % samplingRate === 0 || i === totalPeriods) {
          // Calcular el período en años (redondeado para mejor visualización)
          const periodInYears = frequency === "daily" ? i / 365 : 
                                frequency === "weekly" ? i / 52 :
                                frequency === "monthly" ? i / 12 : i;
          
          const dataPoint: any = {
            period: Math.round(periodInYears * 10) / 10, // Redondear a 1 decimal
            periodLabel: periodInYears >= 1 ? `Año ${Math.round(periodInYears)}` : `${Math.round(periodInYears * 12)} meses`,
            capital: totalContributed,
            interest: Math.max(0, interestEarned),
            total: currentAmount,
          };

          // Add variance scenarios if applicable
          if (hasVariance) {
            dataPoint.pessimistic = pessimisticAmount;
            dataPoint.optimistic = optimisticAmount;
          }

          chartData.push(dataPoint);
        }

        // Apply interest and add contribution for next period
        if (i < totalPeriods) {
          // Normal scenario
          currentAmount = currentAmount * (1 + ratePerPeriod) + contributionPerPeriod;
          totalContributed += contributionPerPeriod;

          // Pessimistic scenario
          if (hasVariance) {
            pessimisticAmount = pessimisticAmount * (1 + pessimisticRate) + contributionPerPeriod;
            pessimisticContributed += contributionPerPeriod;
          }

          // Optimistic scenario
          if (hasVariance) {
            optimisticAmount = optimisticAmount * (1 + optimisticRate) + contributionPerPeriod;
            optimisticContributed += contributionPerPeriod;
          }
        }
      }

      const finalAmount = currentAmount;
      const totalCapitalContributed = capital + (contributionPerPeriod * totalPeriods);
      const totalInterest = finalAmount - totalCapitalContributed;

      // Compare with inflation if requested (usando fecha actual)
      let inflationComparisonData = undefined;
      if (compareInflation && inflationData) {
        try {
          const startDate = getCurrentDate();
          // Calculate end date
          const [startYear, startMonth] = startDate.split("-").map(Number);
          const endYear = startYear + Math.floor(numYears);
          const endMonth = startMonth + Math.round((numYears % 1) * 12);
          const adjustedEndYear = endYear + Math.floor((endMonth - 1) / 12);
          const adjustedEndMonth = ((endMonth - 1) % 12) + 1;
          const endDate = `${adjustedEndYear}-${String(adjustedEndMonth).padStart(2, "0")}`;

          // Buscar datos de inflación
          const fromData = inflationData.find(item => item.date === startDate);
          const toData = inflationData.find(item => item.date === endDate);

          if (fromData && toData) {
            const inflationRate = ((1 + toData.accumulated / 100) / (1 + fromData.accumulated / 100) - 1) * 100;
            const inflationAdjustedAmount = finalAmount * (1 + inflationRate / 100);
            const realGain = ((finalAmount - inflationAdjustedAmount) / inflationAdjustedAmount) * 100;

            inflationComparisonData = {
              inflationAdjustedAmount,
              realGain,
              beatsInflation: realGain > 0,
            };
          }
        } catch (err) {
          console.error("Error calculating inflation:", err);
        }
      }

      setResult({
        initialCapital: capital,
        finalCapital: totalCapitalContributed,
        totalInterest,
        totalAmount: finalAmount,
        periods: totalPeriods,
        annualRate: rate,
        currency,
        chartData,
        hasVariance,
        pessimisticAmount: hasVariance ? pessimisticAmount : undefined,
        optimisticAmount: hasVariance ? optimisticAmount : undefined,
        ...inflationComparisonData,
      });
      
      // Scroll automático a los resultados
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al calcular");
      setResult(null);
    }
  };

  const handleCurrencyChange = (newCurrency: Currency) => {
    setCurrency(newCurrency);
    setStartDate("");
    setResult(null);
    setError(null);
  };

  const currencySymbol = currency === "ARS" ? "$" : "US$";
  const currencyName = currency === "ARS" ? "Pesos Argentinos" : "Dólares";
  // Siempre mostramos años en el gráfico, independiente de la frecuencia
  const periodLabel = "Año";

  return (
    <div className="space-y-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PiggyBank className="h-5 w-5" />
            Calculadora de Interés Compuesto
          </CardTitle>
          <CardDescription>
            Proyecta el crecimiento de tu inversión con interés compuesto y compáralo con la inflación
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Currency Selection */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="currency">Moneda</Label>
              <InfoTooltip content="Elige la moneda en la que invertirás. Esto afectará la comparación con inflación." />
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

          {/* Investment Parameters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <NumericInput
              label="Capital Inicial"
              icon={DollarSign}
              placeholder="100.000"
              value={initialCapital}
              onChange={setInitialCapital}
              min={0}
              decimals={2}
              prefix={currencySymbol}
              tooltip={`¿Con cuánto dinero empiezas? Ingresa el monto en ${currencyName} que vas a invertir.`}
            />

            <NumericInput
              label="Aporte Mensual"
              icon={PiggyBank}
              placeholder="0"
              value={monthlyContribution}
              onChange={setMonthlyContribution}
              min={0}
              decimals={2}
              prefix={currencySymbol}
              tooltip="¿Cuánto vas a aportar cada mes? Deja en 0 si solo quieres invertir el capital inicial."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputWithIcon
              label="Tasa de Interés Anual (%)"
              icon={Percent}
              type="number"
              placeholder="5"
              value={annualRate}
              onChange={(e) => setAnnualRate(e.target.value)}
              step="0.01"
              min="0"
              max="100"
              tooltip="¿Qué porcentaje anual te pagan? Por ejemplo, un plazo fijo puede dar 5% anual, mientras que inversiones más riesgosas pueden dar 10% o más."
            />

            <InputWithIcon
              label="Varianza de Tasa (±%)"
              icon={TrendingUp}
              type="number"
              placeholder="0"
              value={rateVariance}
              onChange={(e) => setRateVariance(e.target.value)}
              step="0.5"
              min="0"
              max="50"
              tooltip="¿Cuánto puede variar la tasa? Por ejemplo, ±2% mostrará escenarios optimista y pesimista. Deja en 0 para ver solo el escenario normal."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputWithIcon
              label="Período (años)"
              icon={Calendar}
              type="number"
              placeholder="5"
              value={years}
              onChange={(e) => setYears(e.target.value)}
              step="0.5"
              min="0.5"
              max="50"
              tooltip="¿Por cuánto tiempo vas a invertir? Puedes usar decimales (ej: 2.5 años)."
            />

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="frequency">Frecuencia de Capitalización</Label>
                <InfoTooltip content="¿Cada cuánto se agregan los intereses al capital? Cuanto más frecuente, mayor es la ganancia por el efecto del interés compuesto." />
              </div>
              <Select
                id="frequency"
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as "daily" | "weekly" | "monthly" | "annual")}
              >
                <option value="daily">📅 Diaria (máxima ganancia)</option>
                <option value="weekly">📅 Semanal</option>
                <option value="monthly">📅 Mensual</option>
                <option value="annual">📅 Anual</option>
              </Select>
            </div>
          </div>

          {/* Inflation Comparison */}
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="compareInflation"
                  checked={compareInflation}
                  onChange={(e) => setCompareInflation(e.target.checked)}
                  className="h-4 w-4"
                />
                <Label htmlFor="compareInflation" className="cursor-pointer">
                  Comparar con inflación
                </Label>
                <InfoTooltip content="Activa esto para ver si tu inversión realmente gana contra la inflación. Es fundamental para saber si estás ganando o perdiendo poder adquisitivo. Se calcula desde hoy." />
              </div>
            </CardContent>
          </Card>

          <Button onClick={calculateCompoundInterest} className="w-full" size="lg">
            <Calculator className="h-4 w-4 mr-2" />
            Calcular Proyección
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
          <h2 className="text-2xl font-bold">Proyección de tu Inversión</h2>

          {/* Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <MetricCard
              title="Capital Inicial"
              value={formatCurrency(result.initialCapital, result.currency)}
              subtitle="Inversión inicial"
              icon={DollarSign}
              variant="default"
            />

            <MetricCard
              title="Capital Total Aportado"
              value={formatCurrency(result.finalCapital, result.currency)}
              subtitle={monthlyContribution !== "0" && parseFloat(monthlyContribution) > 0 ? "Inicial + aportes" : "Sin aportes"}
              icon={PiggyBank}
              variant="default"
              tooltip={monthlyContribution !== "0" && parseFloat(monthlyContribution) > 0 ? "Incluye tu capital inicial más todos los aportes mensuales" : "Solo capital inicial, sin aportes mensuales"}
            />

            <MetricCard
              title="Intereses Ganados"
              value={formatCurrency(result.totalInterest, result.currency)}
              subtitle={`En ${years} año${parseFloat(years) !== 1 ? "s" : ""}`}
              icon={TrendingUp}
              trend="up"
              trendValue={`+${((result.totalInterest / result.finalCapital) * 100).toFixed(1)}%`}
              variant="success"
              tooltip="Total de intereses que ganarás durante el período de inversión"
            />

            <MetricCard
              title="Total Final"
              value={formatCurrency(result.totalAmount, result.currency)}
              subtitle="Capital + Intereses"
              icon={Calculator}
              variant="default"
            />
          </div>

          {/* Variance Scenarios */}
          {result.hasVariance && result.pessimisticAmount && result.optimisticAmount && (
            <Card className="border-primary/50 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  📊 Escenarios según Varianza de Tasa
                  <InfoTooltip content="Estos son los posibles resultados si la tasa de interés varía. El escenario pesimista usa una tasa menor, el optimista usa una tasa mayor." />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <MetricCard
                    title="Escenario Pesimista"
                    value={formatCurrency(result.pessimisticAmount, result.currency)}
                    subtitle={`Tasa: ${(result.annualRate - parseFloat(rateVariance)).toFixed(2)}%`}
                    icon={TrendingDown}
                    variant="danger"
                  />
                  
                  <MetricCard
                    title="Escenario Normal"
                    value={formatCurrency(result.totalAmount, result.currency)}
                    subtitle={`Tasa: ${result.annualRate.toFixed(2)}%`}
                    icon={TrendingUp}
                    variant="default"
                  />
                  
                  <MetricCard
                    title="Escenario Optimista"
                    value={formatCurrency(result.optimisticAmount, result.currency)}
                    subtitle={`Tasa: ${(result.annualRate + parseFloat(rateVariance)).toFixed(2)}%`}
                    icon={TrendingUp}
                    variant="success"
                  />
                </div>

                <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong>Diferencia entre escenarios:</strong>
                  </p>
                  <div className="mt-2 flex justify-between text-sm">
                    <span>Pesimista vs Normal:</span>
                    <span className="font-bold text-destructive">
                      {formatCurrency(result.totalAmount - result.pessimisticAmount, result.currency)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Optimista vs Normal:</span>
                    <span className="font-bold text-green-600 dark:text-green-400">
                      +{formatCurrency(result.optimisticAmount - result.totalAmount, result.currency)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Inflation Comparison */}
          {result.beatsInflation !== undefined && result.inflationAdjustedAmount && (
            <Card className={result.beatsInflation ? "border-green-500/50 bg-green-500/5" : "border-red-500/50 bg-red-500/5"}>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  {result.beatsInflation ? "✅" : "⚠️"} Comparación con Inflación
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Total Final</p>
                    <p className="text-xl font-bold text-green-600 dark:text-green-400">
                      {formatCurrency(result.totalAmount, result.currency)}
                    </p>
                  </div>

                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Ajustado por Inflación</p>
                    <p className="text-xl font-bold text-yellow-600 dark:text-yellow-400">
                      {formatCurrency(result.inflationAdjustedAmount, result.currency)}
                    </p>
                  </div>

                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Ganancia/Pérdida Real</p>
                    <p className={`text-xl font-bold ${result.beatsInflation ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                      {result.realGain && result.realGain > 0 ? "+" : ""}{result.realGain?.toFixed(2)}%
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-sm">
                    {result.beatsInflation ? (
                      <>
                        <strong>¡Excelente!</strong> Tu inversión <strong>SÍ gana contra la inflación</strong>.
                        Después de ajustar por inflación, tendrás un <strong>{result.realGain?.toFixed(2)}%</strong> más
                        de poder adquisitivo real. Esto significa que podrás comprar más cosas que si solo hubieras guardado el dinero.
                      </>
                    ) : (
                      <>
                        <strong>Atención:</strong> Tu inversión <strong>NO gana contra la inflación</strong>.
                        Aunque ganarás {formatCurrency(result.totalInterest, result.currency)} en intereses,
                        la inflación erosionará tu poder adquisitivo en un <strong>{Math.abs(result.realGain || 0).toFixed(2)}%</strong>.
                        Considera buscar inversiones con mayor rendimiento.
                      </>
                    )}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Chart */}
          <CompoundInterestChart
            data={result.chartData}
            title={result.hasVariance ? "Proyección con Escenarios de Varianza" : "Crecimiento de tu Inversión"}
            tooltip={result.hasVariance 
              ? "Las líneas muestran diferentes escenarios: pesimista (rojo, punteado), normal (azul, sólido) y optimista (verde, punteado)"
              : "Muestra cómo crece tu dinero: el área azul es tu capital aportado, el área verde son los intereses ganados"
            }
            currency={currencySymbol}
            periodLabel={periodLabel}
            showVariance={result.hasVariance}
          />

          {/* Explanation Card */}
          <Card className="border-blue-500/50 bg-blue-500/5">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                💡 ¿Cómo funciona el interés compuesto?
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>
                El <strong>interés compuesto</strong> es cuando los intereses que ganas se suman a tu capital
                y también empiezan a generar intereses. Es como una bola de nieve que crece cada vez más rápido.
              </p>
              <p>
                En tu caso, si inviertes <strong>{formatCurrency(result.initialCapital, result.currency)}</strong> al{" "}
                <strong>{result.annualRate}% anual</strong> durante <strong>{years} año{parseFloat(years) !== 1 ? "s" : ""}</strong>,
                terminarás con <strong>{formatCurrency(result.totalAmount, result.currency)}</strong>.
              </p>
              <p>
                Eso significa que ganarás <strong>{formatCurrency(result.totalInterest, result.currency)}</strong> en intereses,
                lo que representa un <strong>{((result.totalInterest / result.initialCapital) * 100).toFixed(1)}%</strong> de ganancia nominal.
              </p>
              {frequency === "monthly" && (
                <p className="text-primary font-medium">
                  ✨ Como elegiste capitalización <strong>mensual</strong>, tus intereses se reinvierten cada mes,
                  lo que genera más ganancia que la capitalización anual.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

