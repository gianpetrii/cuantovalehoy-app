"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CustomSelect, SelectItem } from "@/components/ui/custom-select";
import { Label } from "@/components/ui/label";
import { NumericInput } from "@/components/ui/numeric-input";
import { InputWithIcon } from "@/components/ui/input-with-icon";
import { MetricCard } from "@/components/ui/metric-card";
import { CompoundInterestChart } from "@/components/charts/compound-interest-chart";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { formatCurrency } from "@/lib/services/inflation-service";
import { useProjectedInflationRates } from "@/lib/hooks/use-inflation-data";
import {
  adjustForAnnualInflation,
  calculateRealGainPercent,
  getLatestExchangeRate,
} from "@/lib/utils/inflation-projection";
import { Currency } from "@/types/inflation";
import { TrendingUp, TrendingDown, DollarSign, Calculator, Percent, Calendar, PiggyBank } from "lucide-react";

type InflationComparisonMode = "local" | "usd-adjusted";

interface InflationComparisonResult {
  mode: InflationComparisonMode;
  localInflationRate: number;
  realValueLocal: number;
  realGainLocal: number;
  beatsInflationLocal: boolean;
  usdInflationRate?: number;
  devaluationRate?: number;
  exchangeRateToday?: number;
  finalUSD?: number;
  realValueUSD?: number;
  equivalentInitialUSD?: number;
  realGainUSD?: number;
  beatsInflationUSD?: boolean;
}

interface CompoundInterestResult {
  initialCapital: number;
  totalContributed: number;
  finalCapital: number;
  totalInterest: number;
  totalAmount: number;
  periods: number;
  annualRate: number;
  currency: Currency;
  years: number;
  chartData: Array<{
    period: number;
    capital: number;
    interest: number;
    total: number;
    pessimistic?: number;
    optimistic?: number;
  }>;
  hasVariance?: boolean;
  pessimisticAmount?: number;
  optimisticAmount?: number;
  inflationComparison?: InflationComparisonResult;
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
  const [inflationMode, setInflationMode] = useState<InflationComparisonMode>("local");
  const [projectedInflationLocal, setProjectedInflationLocal] = useState<string>("");
  const [projectedInflationUSD, setProjectedInflationUSD] = useState<string>("");
  const [projectedDevaluation, setProjectedDevaluation] = useState<string>("");
  const [ratesInitialized, setRatesInitialized] = useState(false);
  const [result, setResult] = useState<CompoundInterestResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const resultsRef = useRef<HTMLDivElement>(null);
  
  const {
    arsAnnualRate,
    usdAnnualRate,
    devaluationRate,
    currencyAnnualRate,
    exchangeRates,
    isLoading: ratesLoading,
  } = useProjectedInflationRates(currency);

  // Inicializar tasas proyectadas desde datos históricos
  useEffect(() => {
    if (ratesLoading || ratesInitialized) return;

    const localRate = currency === "ARS" ? arsAnnualRate : usdAnnualRate;
    if (localRate > 0) {
      setProjectedInflationLocal(localRate.toFixed(1));
    }
    if (usdAnnualRate > 0) {
      setProjectedInflationUSD(usdAnnualRate.toFixed(1));
    }
    if (devaluationRate > 0) {
      setProjectedDevaluation(devaluationRate.toFixed(1));
    }
    setRatesInitialized(true);
  }, [
    ratesLoading,
    ratesInitialized,
    arsAnnualRate,
    usdAnnualRate,
    devaluationRate,
    currency,
    currencyAnnualRate,
  ]);

  // Actualizar tasa local al cambiar moneda
  useEffect(() => {
    if (ratesLoading) return;
    const localRate = currency === "ARS" ? arsAnnualRate : usdAnnualRate;
    if (localRate > 0) {
      setProjectedInflationLocal(localRate.toFixed(1));
    }
    if (currency === "USD") {
      setInflationMode("local");
    }
  }, [currency, arsAnnualRate, usdAnnualRate, ratesLoading]);

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

      if (compareInflation) {
        const localRate = parseFloat(projectedInflationLocal);
        if (isNaN(localRate) || localRate < 0) {
          setError("Ingresá una tasa de inflación anual válida para la comparación");
          return;
        }
        if (
          currency === "ARS" &&
          inflationMode === "usd-adjusted"
        ) {
          const usdRate = parseFloat(projectedInflationUSD);
          const devalRate = parseFloat(projectedDevaluation);
          if (isNaN(usdRate) || usdRate < 0) {
            setError("Ingresá una tasa de inflación USD válida");
            return;
          }
          if (isNaN(devalRate) || devalRate < 0) {
            setError("Ingresá una tasa de devaluación válida");
            return;
          }
        }
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

      let inflationComparison: InflationComparisonResult | undefined;

      if (compareInflation) {
        const localRate = parseFloat(projectedInflationLocal);
        const usdRate = parseFloat(projectedInflationUSD);
        const devalRate = parseFloat(projectedDevaluation);

        if (!isNaN(localRate) && localRate >= 0) {
          const realValueLocal = adjustForAnnualInflation(
            finalAmount,
            localRate,
            numYears
          );
          const realGainLocal = calculateRealGainPercent(
            realValueLocal,
            totalCapitalContributed
          );

          inflationComparison = {
            mode: inflationMode,
            localInflationRate: localRate,
            realValueLocal,
            realGainLocal,
            beatsInflationLocal: realGainLocal > 0,
          };

          if (
            currency === "ARS" &&
            inflationMode === "usd-adjusted" &&
            exchangeRates &&
            exchangeRates.length > 0 &&
            !isNaN(usdRate) &&
            usdRate >= 0 &&
            !isNaN(devalRate) &&
            devalRate >= 0
          ) {
            const exchangeRateToday = getLatestExchangeRate(
              exchangeRates,
              "blue"
            );

            if (exchangeRateToday > 0) {
              const futureExchangeRate =
                exchangeRateToday *
                Math.pow(1 + devalRate / 100, numYears);
              const finalUSD = finalAmount / futureExchangeRate;
              const realValueUSD = adjustForAnnualInflation(
                finalUSD,
                usdRate,
                numYears
              );
              const equivalentInitialUSD =
                totalCapitalContributed / exchangeRateToday;
              const realGainUSD = calculateRealGainPercent(
                realValueUSD,
                equivalentInitialUSD
              );

              inflationComparison = {
                ...inflationComparison,
                usdInflationRate: usdRate,
                devaluationRate: devalRate,
                exchangeRateToday,
                finalUSD,
                realValueUSD,
                equivalentInitialUSD,
                realGainUSD,
                beatsInflationUSD: realGainUSD > 0,
              };
            }
          }
        }
      }

      setResult({
        initialCapital: capital,
        totalContributed: totalCapitalContributed,
        finalCapital: totalCapitalContributed,
        totalInterest,
        totalAmount: finalAmount,
        periods: totalPeriods,
        annualRate: rate,
        currency,
        years: numYears,
        chartData,
        hasVariance,
        pessimisticAmount: hasVariance ? pessimisticAmount : undefined,
        optimisticAmount: hasVariance ? optimisticAmount : undefined,
        inflationComparison,
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
          <CustomSelect
            label="Moneda"
            tooltip="Elige la moneda en la que invertirás. Esto afectará la comparación con inflación."
            value={currency}
            onValueChange={(value) => handleCurrencyChange(value as Currency)}
            id="currency"
          >
            <SelectItem value="ARS">💵 Peso Argentino (ARS)</SelectItem>
            <SelectItem value="USD">💵 Dólar Estadounidense (USD)</SelectItem>
          </CustomSelect>

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

            <CustomSelect
              label="Frecuencia de Capitalización"
              tooltip="¿Cada cuánto se agregan los intereses al capital? Cuanto más frecuente, mayor es la ganancia por el efecto del interés compuesto."
              value={frequency}
              onValueChange={(value) => setFrequency(value as "daily" | "weekly" | "monthly" | "annual")}
              id="frequency"
            >
              <SelectItem value="daily">📅 Diaria (máxima ganancia)</SelectItem>
              <SelectItem value="weekly">📅 Semanal</SelectItem>
              <SelectItem value="monthly">📅 Mensual</SelectItem>
              <SelectItem value="annual">📅 Anual</SelectItem>
            </CustomSelect>
          </div>

          {/* Inflation Comparison */}
          <Card className="bg-muted/50">
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="compareInflation"
                  checked={compareInflation}
                  onChange={(e) => setCompareInflation(e.target.checked)}
                  className="h-4 w-4 rounded border-input accent-primary cursor-pointer"
                />
                <Label htmlFor="compareInflation" className="cursor-pointer">
                  Comparar con inflación
                </Label>
                <InfoTooltip content="Proyecta el poder adquisitivo real de tu inversión usando tasas anuales basadas en los últimos 12 meses. Podés editar las tasas según tu expectativa." />
              </div>

              {compareInflation && (
                <div className="space-y-4 pl-6 border-l-2 border-primary/30">
                  {currency === "ARS" && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Modo de comparación</Label>
                      <div className="space-y-2">
                        <label className="flex items-start gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="inflationMode"
                            value="local"
                            checked={inflationMode === "local"}
                            onChange={() => setInflationMode("local")}
                            className="mt-1 h-4 w-4 accent-primary cursor-pointer"
                          />
                          <span className="text-sm">
                            <strong>Inflación en pesos (ARS)</strong>
                            <span className="block text-muted-foreground">
                              ¿Cuánto valdrá tu inversión en poder adquisitivo real en pesos?
                            </span>
                          </span>
                        </label>
                        <label className="flex items-start gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="inflationMode"
                            value="usd-adjusted"
                            checked={inflationMode === "usd-adjusted"}
                            onChange={() => setInflationMode("usd-adjusted")}
                            className="mt-1 h-4 w-4 accent-primary cursor-pointer"
                          />
                          <span className="text-sm">
                            <strong>Inflación en dólares + tipo de cambio</strong>
                            <span className="block text-muted-foreground">
                              Convierte a USD considerando devaluación del peso e inflación del dólar
                            </span>
                          </span>
                        </label>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputWithIcon
                      label={`Inflación anual proyectada (${currency === "ARS" ? "ARS" : "USD"})`}
                      icon={Percent}
                      type="number"
                      placeholder="0"
                      value={projectedInflationLocal}
                      onChange={(e) => setProjectedInflationLocal(e.target.value)}
                      step="0.1"
                      min="0"
                      max="1000"
                      tooltip={
                        ratesLoading
                          ? "Cargando datos históricos..."
                          : `Basado en los últimos 12 meses: ${currencyAnnualRate.toFixed(1)}% anual. Podés editarlo según tu expectativa.`
                      }
                    />

                    {currency === "ARS" && inflationMode === "usd-adjusted" && (
                      <>
                        <InputWithIcon
                          label="Inflación anual proyectada (USD)"
                          icon={Percent}
                          type="number"
                          placeholder="0"
                          value={projectedInflationUSD}
                          onChange={(e) => setProjectedInflationUSD(e.target.value)}
                          step="0.1"
                          min="0"
                          max="100"
                          tooltip={
                            ratesLoading
                              ? "Cargando datos históricos..."
                              : `Basado en los últimos 12 meses: ${usdAnnualRate.toFixed(1)}% anual (CPI USA).`
                          }
                        />
                        <InputWithIcon
                          label="Devaluación anual proyectada (ARS/USD)"
                          icon={TrendingDown}
                          type="number"
                          placeholder="0"
                          value={projectedDevaluation}
                          onChange={(e) => setProjectedDevaluation(e.target.value)}
                          step="0.1"
                          min="0"
                          max="1000"
                          tooltip={
                            ratesLoading
                              ? "Cargando datos históricos..."
                              : `Basado en dólar blue últimos 12 meses: ${devaluationRate.toFixed(1)}% anual.`
                          }
                        />
                      </>
                    )}
                  </div>

                  {!ratesLoading && currencyAnnualRate === 0 && (
                    <p className="text-sm text-yellow-600 dark:text-yellow-400">
                      No hay suficientes datos históricos. Ingresá manualmente la tasa de inflación esperada.
                    </p>
                  )}
                </div>
              )}
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

          {/* Inflation Comparison Results */}
          {result.inflationComparison && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  Análisis de Poder Adquisitivo Real
                  <InfoTooltip content="Compara tu ganancia nominal con la inflación proyectada para saber si realmente ganás poder de compra." />
                </CardTitle>
                <CardDescription>
                  Proyección a {result.years} año{result.years !== 1 ? "s" : ""} usando inflación anual del{" "}
                  {result.inflationComparison.localInflationRate.toFixed(1)}%
                  {result.currency === "ARS" ? " (ARS)" : " (USD)"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Nominal vs Real (local currency) */}
                <div
                  className={`rounded-lg border p-4 ${
                    result.inflationComparison.beatsInflationLocal
                      ? "border-green-500/50 bg-green-500/5"
                      : "border-red-500/50 bg-red-500/5"
                  }`}
                >
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    {result.inflationComparison.beatsInflationLocal ? "✅" : "⚠️"}
                    En {result.currency === "ARS" ? "pesos (ARS)" : "dólares (USD)"}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Valor nominal final</p>
                      <p className="text-xl font-bold">
                        {formatCurrency(result.totalAmount, result.currency)}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Valor real (hoy)</p>
                      <p className="text-xl font-bold text-yellow-600 dark:text-yellow-400">
                        {formatCurrency(
                          result.inflationComparison.realValueLocal,
                          result.currency
                        )}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Poder adquisitivo</p>
                      <p
                        className={`text-xl font-bold ${
                          result.inflationComparison.beatsInflationLocal
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {result.inflationComparison.realGainLocal > 0 ? "+" : ""}
                        {result.inflationComparison.realGainLocal.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                  <p className="text-sm mt-4 text-muted-foreground">
                    {result.inflationComparison.beatsInflationLocal ? (
                      <>
                        Tu inversión <strong>supera la inflación</strong> en{" "}
                        {result.currency === "ARS" ? "pesos" : "dólares"}. Ganás poder de compra real.
                      </>
                    ) : (
                      <>
                        Tu inversión <strong>no supera la inflación</strong>. Aunque el monto nominal crece,
                        perdés aproximadamente{" "}
                        <strong>
                          {Math.abs(result.inflationComparison.realGainLocal).toFixed(1)}%
                        </strong>{" "}
                        de poder adquisitivo.
                      </>
                    )}
                  </p>
                </div>

                {/* USD-adjusted comparison (ARS only) */}
                {result.inflationComparison.mode === "usd-adjusted" &&
                  result.inflationComparison.realValueUSD !== undefined && (
                    <div
                      className={`rounded-lg border p-4 ${
                        result.inflationComparison.beatsInflationUSD
                          ? "border-green-500/50 bg-green-500/5"
                          : "border-red-500/50 bg-red-500/5"
                      }`}
                    >
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        {result.inflationComparison.beatsInflationUSD ? "✅" : "⚠️"}
                        En dólares (poder adquisitivo global)
                        <InfoTooltip content="Convierte tu inversión a USD usando la devaluación proyectada del peso, y ajusta por inflación del dólar. Útil para ver si preservás valor frente al dólar." />
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Capital en USD (hoy)</p>
                          <p className="text-lg font-bold">
                            US${" "}
                            {result.inflationComparison.equivalentInitialUSD?.toLocaleString(
                              "es-AR",
                              { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                            )}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Valor en USD (futuro)</p>
                          <p className="text-lg font-bold">
                            US${" "}
                            {result.inflationComparison.finalUSD?.toLocaleString("es-AR", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Valor real USD (hoy)</p>
                          <p className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                            US${" "}
                            {result.inflationComparison.realValueUSD.toLocaleString("es-AR", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Poder adquisitivo USD</p>
                          <p
                            className={`text-lg font-bold ${
                              result.inflationComparison.beatsInflationUSD
                                ? "text-green-600 dark:text-green-400"
                                : "text-red-600 dark:text-red-400"
                            }`}
                          >
                            {(result.inflationComparison.realGainUSD ?? 0) > 0 ? "+" : ""}
                            {result.inflationComparison.realGainUSD?.toFixed(1)}%
                          </p>
                        </div>
                      </div>
                      <p className="text-sm mt-4 text-muted-foreground">
                        Tasas usadas: devaluación{" "}
                        {result.inflationComparison.devaluationRate?.toFixed(1)}% anual, inflación USD{" "}
                        {result.inflationComparison.usdInflationRate?.toFixed(1)}% anual. Tipo de cambio
                        actual (blue): ${" "}
                        {result.inflationComparison.exchangeRateToday?.toLocaleString("es-AR")} ARS/USD.
                      </p>
                      <p className="text-sm mt-2">
                        {result.inflationComparison.beatsInflationUSD ? (
                          <>
                            Tu inversión <strong>preserva valor en dólares</strong>. Incluso considerando
                            devaluación e inflación del dólar, ganás poder adquisitivo internacional.
                          </>
                        ) : (
                          <>
                            Tu inversión <strong>no preserva valor en dólares</strong>. Aunque crezca en
                            pesos, al convertir y ajustar por inflación USD perdés poder adquisitivo global.
                            Considerá activos dolarizados o inversiones con mayor rendimiento real.
                          </>
                        )}
                      </p>
                    </div>
                  )}
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

