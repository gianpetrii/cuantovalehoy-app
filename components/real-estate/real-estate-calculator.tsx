"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CustomSelect, SelectItem } from "@/components/ui/custom-select";
import { Label } from "@/components/ui/label";
import { NumericInput } from "@/components/ui/numeric-input";
import { InputWithIcon } from "@/components/ui/input-with-icon";
import { MetricCard } from "@/components/ui/metric-card";
import { ResultComparison } from "@/components/ui/result-comparison";
import { InflationTimelineChart } from "@/components/charts/inflation-timeline-chart";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { MonthYearPicker } from "@/components/ui/month-year-picker";
import { formatDateDisplay, formatCurrency } from "@/lib/services/inflation-service";
import { useInflationData } from "@/lib/hooks/use-inflation-data";
import { Currency } from "@/types/inflation";
import { Home, Ruler, DollarSign, Calculator, TrendingUp, TrendingDown, Calendar } from "lucide-react";

interface RealEstateResult {
  originalPrice: number;
  originalPricePerSqm: number;
  adjustedPrice: number;
  adjustedPricePerSqm: number;
  inflationRate: number;
  currency: Currency;
  fromDate: string;
  toDate: string;
  squareMeters: number;
}

export function RealEstateCalculator() {
  const [currency, setCurrency] = useState<Currency>("ARS");
  const [price, setPrice] = useState<string>("");
  const [squareMeters, setSquareMeters] = useState<string>("");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [currentPrice, setCurrentPrice] = useState<string>("");
  const [result, setResult] = useState<RealEstateResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Ref para scroll automático
  const resultsRef = useRef<HTMLDivElement>(null);

  // Obtener datos desde Supabase
  const { data: inflationData, isLoading } = useInflationData(currency);
  const availableDates = inflationData?.map(item => item.date) || [];

  const handleCalculate = () => {
    try {
      setError(null);
      
      if (!inflationData) {
        setError("Cargando datos...");
        return;
      }
      
      if (!price || !squareMeters || !fromDate || !toDate) {
        setError("Por favor completa todos los campos obligatorios");
        return;
      }

      const numPrice = parseFloat(price);
      const numSqm = parseFloat(squareMeters);

      if (isNaN(numPrice) || numPrice <= 0) {
        setError("Por favor ingresa un precio válido");
        return;
      }

      if (isNaN(numSqm) || numSqm <= 0) {
        setError("Por favor ingresa una cantidad válida de metros cuadrados");
        return;
      }

      if (fromDate >= toDate) {
        setError("La fecha de compra debe ser anterior a la fecha de comparación");
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
      const adjustedAmount = numPrice * (1 + inflationRate / 100);

      // Calculate price per square meter
      const originalPricePerSqm = numPrice / numSqm;
      const adjustedPricePerSqm = adjustedAmount / numSqm;

      setResult({
        originalPrice: numPrice,
        originalPricePerSqm,
        adjustedPrice: adjustedAmount,
        adjustedPricePerSqm,
        inflationRate,
        currency,
        fromDate,
        toDate,
        squareMeters: numSqm,
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
    setFromDate("");
    setToDate("");
    setResult(null);
    setError(null);
  };

  // Generate timeline data for price per sqm
  const getTimelineData = () => {
    if (!result || !inflationData) return [];

    const fromIndex = inflationData.findIndex(d => d.date === result.fromDate);
    const toIndex = inflationData.findIndex(d => d.date === result.toDate);

    if (fromIndex === -1 || toIndex === -1) return [];

    const relevantData = inflationData.slice(fromIndex, toIndex + 1);
    const baseAccumulated = inflationData[fromIndex].accumulated;

    return relevantData.map(item => {
      const relativeInflation = ((1 + item.accumulated / 100) / (1 + baseAccumulated / 100) - 1) * 100;
      const adjustedPricePerSqm = result.originalPricePerSqm * (1 + relativeInflation / 100);
      
      return {
        date: item.date,
        value: adjustedPricePerSqm,
      };
    });
  };

  // Calculate if selling at current price is profitable
  const getRealGainLoss = () => {
    if (!result || !currentPrice) return null;

    const numCurrentPrice = parseFloat(currentPrice);
    if (isNaN(numCurrentPrice) || numCurrentPrice <= 0) return null;

    const currentPricePerSqm = numCurrentPrice / result.squareMeters;
    const realChange = ((currentPricePerSqm - result.adjustedPricePerSqm) / result.adjustedPricePerSqm) * 100;

    return {
      currentPrice: numCurrentPrice,
      currentPricePerSqm,
      realChange,
      isProfit: realChange > 0,
    };
  };

  const currencySymbol = currency === "ARS" ? "$" : "US$";
  const currencyName = currency === "ARS" ? "Pesos Argentinos" : "Dólares";
  const realGainLoss = getRealGainLoss();

  return (
    <div className="space-y-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            Calculadora de Valor de Inmuebles por m²
          </CardTitle>
          <CardDescription>
            Calcula el valor real de tu propiedad ajustado por inflación, normalizado por metro cuadrado
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Currency Selection */}
          <CustomSelect
            label="Moneda"
            tooltip="Elige la moneda en la que compraste o valuaste el inmueble."
            value={currency}
            onValueChange={(value) => handleCurrencyChange(value as Currency)}
            id="currency"
          >
            <SelectItem value="ARS">💵 Peso Argentino (ARS)</SelectItem>
            <SelectItem value="USD">💵 Dólar Estadounidense (USD)</SelectItem>
          </CustomSelect>

          {/* Property Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <NumericInput
              label="Precio del Inmueble"
              icon={DollarSign}
              placeholder="10.000.000"
              value={price}
              onChange={setPrice}
              min={0}
              decimals={2}
              prefix={currencySymbol}
              tooltip={`¿Cuánto pagaste por el inmueble o cuánto lo valuaste? Ingresa el precio total en ${currencyName}.`}
            />

            <InputWithIcon
              label="Metros Cuadrados (m²)"
              icon={Ruler}
              type="number"
              placeholder="50"
              value={squareMeters}
              onChange={(e) => setSquareMeters(e.target.value)}
              step="0.01"
              min="0"
              tooltip="¿Cuántos metros cuadrados tiene la propiedad? Esto nos permite normalizar el valor para comparar correctamente."
            />
          </div>

          {/* Date Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MonthYearPicker
              label="Mes de Compra/Valuación"
              value={fromDate}
              onChange={setFromDate}
              minDate="2020-01"
              tooltip="¿En qué mes compraste o valuaste el inmueble? Esta será la fecha de referencia."
            />

            <MonthYearPicker
              label="Mes de Comparación"
              value={toDate}
              onChange={setToDate}
              minDate="2020-01"
              tooltip="¿A qué mes quieres comparar? Por ejemplo, el mes actual para ver cuánto debería valer."
            />
          </div>

          <Button onClick={handleCalculate} className="w-full" size="lg">
            <Calculator className="h-4 w-4 mr-2" />
            Calcular Valor por m²
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
          <h2 className="text-2xl font-bold">Análisis del Inmueble</h2>

          {/* Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <MetricCard
              title="Precio Original"
              value={formatCurrency(result.originalPrice, result.currency)}
              subtitle={formatDateDisplay(result.fromDate)}
              icon={Home}
              variant="default"
            />

            <MetricCard
              title="Precio/m² Original"
              value={formatCurrency(result.originalPricePerSqm, result.currency)}
              subtitle={`${result.squareMeters} m²`}
              icon={Ruler}
              variant="default"
            />

            <MetricCard
              title="Precio/m² Ajustado"
              value={formatCurrency(result.adjustedPricePerSqm, result.currency)}
              subtitle={formatDateDisplay(result.toDate)}
              icon={TrendingUp}
              trend="up"
              trendValue={`+${result.inflationRate.toFixed(1)}%`}
              variant="warning"
              tooltip="Este es el valor por m² que debería tener tu inmueble para mantener el mismo poder adquisitivo"
            />

            <MetricCard
              title="Precio Total Ajustado"
              value={formatCurrency(result.adjustedPrice, result.currency)}
              subtitle="Por inflación"
              icon={DollarSign}
              variant="warning"
            />
          </div>

          {/* Comparison */}
          <ResultComparison
            title="Evolución del Valor por m²"
            beforeLabel={formatDateDisplay(result.fromDate)}
            beforeValue={formatCurrency(result.originalPricePerSqm, result.currency)}
            afterLabel={formatDateDisplay(result.toDate) + " (ajustado)"}
            afterValue={formatCurrency(result.adjustedPricePerSqm, result.currency)}
            changePercentage={result.inflationRate}
            changeLabel="de inflación"
          />

          {/* Timeline Chart */}
          <InflationTimelineChart
            data={getTimelineData()}
            title="Evolución del Precio por m²"
            tooltip="Muestra cómo debería evolucionar el precio por m² para mantener el valor real"
            currency={currencySymbol}
            valueLabel="Precio/m²"
          />

          {/* Optional: Current Selling Price Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">¿Estás vendiendo o tasando?</CardTitle>
              <CardDescription>
                Ingresa el precio actual de venta para ver si ganaste o perdiste valor real
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <NumericInput
                label="Precio de Venta Actual (opcional)"
                icon={DollarSign}
                placeholder="25.000.000"
                value={currentPrice}
                onChange={setCurrentPrice}
                min={0}
                decimals={2}
                prefix={currencySymbol}
                tooltip="Si estás vendiendo o tasando el inmueble hoy, ingresa el precio para ver si ganaste o perdiste valor real contra la inflación."
              />

              {realGainLoss && (
                <div className="space-y-4 pt-4 border-t">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <MetricCard
                      title="Precio/m² Actual"
                      value={formatCurrency(realGainLoss.currentPricePerSqm, result.currency)}
                      subtitle="Precio de venta"
                      icon={DollarSign}
                      variant="default"
                    />

                    <MetricCard
                      title="Precio/m² Ajustado"
                      value={formatCurrency(result.adjustedPricePerSqm, result.currency)}
                      subtitle="Por inflación"
                      icon={TrendingUp}
                      variant="warning"
                    />

                    <MetricCard
                      title="Ganancia/Pérdida Real"
                      value={`${realGainLoss.realChange > 0 ? "+" : ""}${realGainLoss.realChange.toFixed(2)}%`}
                      subtitle={realGainLoss.isProfit ? "Ganaste valor" : "Perdiste valor"}
                      icon={realGainLoss.isProfit ? TrendingUp : TrendingDown}
                      trend={realGainLoss.isProfit ? "up" : "down"}
                      trendValue={realGainLoss.isProfit ? "Ganancia" : "Pérdida"}
                      variant={realGainLoss.isProfit ? "success" : "danger"}
                      tooltip="Compara el precio de venta actual con el valor ajustado por inflación para ver si realmente ganaste o perdiste"
                    />
                  </div>

                  <Card className={realGainLoss.isProfit ? "border-green-500/50 bg-green-500/5" : "border-red-500/50 bg-red-500/5"}>
                    <CardContent className="pt-6">
                      <p className="text-sm">
                        {realGainLoss.isProfit ? (
                          <>
                            ✅ <strong>¡Buenas noticias!</strong> Si vendes a {formatCurrency(realGainLoss.currentPrice, result.currency)}, 
                            estarás ganando <strong>{realGainLoss.realChange.toFixed(2)}%</strong> de valor real por encima de la inflación.
                            El precio por m² actual ({formatCurrency(realGainLoss.currentPricePerSqm, result.currency)}) 
                            supera el valor ajustado ({formatCurrency(result.adjustedPricePerSqm, result.currency)}).
                          </>
                        ) : (
                          <>
                            ⚠️ <strong>Atención:</strong> Si vendes a {formatCurrency(realGainLoss.currentPrice, result.currency)}, 
                            estarás perdiendo <strong>{Math.abs(realGainLoss.realChange).toFixed(2)}%</strong> de valor real contra la inflación.
                            El precio por m² actual ({formatCurrency(realGainLoss.currentPricePerSqm, result.currency)}) 
                            está por debajo del valor ajustado ({formatCurrency(result.adjustedPricePerSqm, result.currency)}).
                          </>
                        )}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Explanation Card */}
          <Card className="border-blue-500/50 bg-blue-500/5">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                💡 ¿Por qué calcular por m²?
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>
                <strong>Normalizar por metro cuadrado es fundamental</strong> para comparar correctamente el valor de propiedades.
                Dos inmuebles pueden tener precios muy diferentes simplemente por su tamaño.
              </p>
              <p>
                Tu inmueble de <strong>{result.squareMeters} m²</strong> costó{" "}
                <strong>{formatCurrency(result.originalPrice, result.currency)}</strong> en{" "}
                {formatDateDisplay(result.fromDate)}, lo que equivale a{" "}
                <strong>{formatCurrency(result.originalPricePerSqm, result.currency)}/m²</strong>.
              </p>
              <p>
                Para mantener el mismo valor real hoy ({formatDateDisplay(result.toDate)}), 
                debería valer <strong>{formatCurrency(result.adjustedPricePerSqm, result.currency)}/m²</strong>, 
                es decir, un total de <strong>{formatCurrency(result.adjustedPrice, result.currency)}</strong>.
              </p>
              {result.inflationRate > 50 && (
                <p className="text-destructive font-medium">
                  ⚠️ La alta inflación ({result.inflationRate.toFixed(1)}%) significa que necesitas vender 
                  a un precio mucho mayor para no perder poder adquisitivo.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

