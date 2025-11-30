"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import {
  convertCurrency,
  calculateInflationAdjustment,
  getAvailableDates,
  formatDateDisplay,
  formatCurrency,
} from "@/lib/services/inflation-service";
import { Currency } from "@/types/inflation";
import { ArrowRightLeft, DollarSign } from "lucide-react";

export function CurrencyConverter() {
  const [amount, setAmount] = useState<string>("");
  const [fromCurrency, setFromCurrency] = useState<Currency>("ARS");
  const [toCurrency, setToCurrency] = useState<Currency>("USD");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [exchangeRateType, setExchangeRateType] = useState<"official" | "blue">("blue");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const availableDates = getAvailableDates("ARS"); // Use ARS dates for exchange rates

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

      // Step 1: Convert from source currency at origin date
      const initialConversion = convertCurrency({
        amount: numAmount,
        fromCurrency,
        toCurrency,
        date: fromDate,
        exchangeRateType,
      });

      // Step 2: Apply inflation to the converted amount in the target currency
      const inflationAdjusted = calculateInflationAdjustment({
        amount: initialConversion.convertedAmount,
        fromDate,
        toDate,
        currency: toCurrency,
      });

      // Step 3: For comparison, show what the exchange would be at the future date
      const futureConversion = convertCurrency({
        amount: numAmount,
        fromCurrency,
        toCurrency,
        date: toDate,
        exchangeRateType,
      });

      setResult({
        originalAmount: numAmount,
        originalCurrency: fromCurrency,
        targetCurrency: toCurrency,
        initialConversion,
        inflationAdjusted,
        futureConversion,
        fromDate,
        toDate,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al calcular");
      setResult(null);
    }
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setResult(null);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Conversión con Ajuste de Inflación
        </CardTitle>
        <CardDescription>
          Convierte entre ARS y USD considerando la inflación en el tiempo
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="conv-amount">Monto</Label>
          <Input
            id="conv-amount"
            type="number"
            placeholder="Ingresa el monto"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            step="0.01"
            min="0"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="space-y-2">
            <Label htmlFor="from-currency">Moneda de Origen</Label>
            <Select
              id="from-currency"
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value as Currency)}
            >
              <option value="ARS">Peso Argentino (ARS)</option>
              <option value="USD">Dólar (USD)</option>
            </Select>
          </div>

          <div className="flex justify-center">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={swapCurrencies}
              className="h-10 w-10"
            >
              <ArrowRightLeft className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="to-currency">Moneda de Destino</Label>
            <Select
              id="to-currency"
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value as Currency)}
            >
              <option value="ARS">Peso Argentino (ARS)</option>
              <option value="USD">Dólar (USD)</option>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="exchange-type">Tipo de Cambio</Label>
          <Select
            id="exchange-type"
            value={exchangeRateType}
            onChange={(e) => setExchangeRateType(e.target.value as "official" | "blue")}
          >
            <option value="official">Oficial</option>
            <option value="blue">Blue/Paralelo</option>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="conv-from-date">Fecha de Origen</Label>
            <Select
              id="conv-from-date"
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
            <Label htmlFor="conv-to-date">Fecha de Destino</Label>
            <Select
              id="conv-to-date"
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
          <ArrowRightLeft className="h-4 w-4 mr-2" />
          Calcular Conversión
        </Button>

        {error && (
          <div className="p-4 bg-destructive/10 text-destructive rounded-md text-sm">
            {error}
          </div>
        )}

        {result && (
          <div className="space-y-4">
            <div className="p-6 bg-primary/5 rounded-lg space-y-3 border border-primary/20">
              <h4 className="font-semibold text-sm text-muted-foreground mb-3">
                Paso 1: Conversión Inicial ({formatDateDisplay(result.fromDate)})
              </h4>
              <div className="flex justify-between items-center">
                <span className="text-sm">Monto Original:</span>
                <span className="font-semibold">
                  {formatCurrency(result.originalAmount, result.originalCurrency)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Tipo de Cambio:</span>
                <span className="font-semibold">
                  {result.initialConversion.exchangeRate.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Convertido a {result.targetCurrency}:</span>
                <span className="font-semibold text-primary">
                  {formatCurrency(result.initialConversion.convertedAmount, result.targetCurrency)}
                </span>
              </div>
            </div>

            <div className="p-6 bg-primary/5 rounded-lg space-y-3 border border-primary/20">
              <h4 className="font-semibold text-sm text-muted-foreground mb-3">
                Paso 2: Ajuste por Inflación en {result.targetCurrency}
              </h4>
              <div className="flex justify-between items-center">
                <span className="text-sm">Período:</span>
                <span className="text-sm">
                  {formatDateDisplay(result.fromDate)} → {formatDateDisplay(result.toDate)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Inflación Acumulada:</span>
                <span className="font-semibold text-destructive">
                  {result.inflationAdjusted.inflationRate.toFixed(2)}%
                </span>
              </div>
              <div className="pt-3 border-t border-primary/20">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Valor Final Ajustado:</span>
                  <span className="text-2xl font-bold text-primary">
                    {formatCurrency(result.inflationAdjusted.adjustedAmount, result.targetCurrency)}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6 bg-muted/50 rounded-lg space-y-3 border">
              <h4 className="font-semibold text-sm text-muted-foreground mb-3">
                Comparación: Conversión Directa en {formatDateDisplay(result.toDate)}
              </h4>
              <div className="flex justify-between items-center">
                <span className="text-sm">Tipo de Cambio Actual:</span>
                <span className="font-semibold">
                  {result.futureConversion.exchangeRate.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Conversión sin ajuste:</span>
                <span className="font-semibold">
                  {formatCurrency(result.futureConversion.convertedAmount, result.targetCurrency)}
                </span>
              </div>
              <div className="pt-3 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Diferencia:</span>
                  <span className={`font-semibold ${
                    result.inflationAdjusted.adjustedAmount > result.futureConversion.convertedAmount
                      ? "text-green-600"
                      : "text-red-600"
                  }`}>
                    {formatCurrency(
                      Math.abs(result.inflationAdjusted.adjustedAmount - result.futureConversion.convertedAmount),
                      result.targetCurrency
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

