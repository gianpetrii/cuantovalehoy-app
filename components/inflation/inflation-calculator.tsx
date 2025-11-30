"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import {
  calculateInflationAdjustment,
  getAvailableDates,
  formatDateDisplay,
  formatCurrency,
} from "@/lib/services/inflation-service";
import { Currency, CalculationResult } from "@/types/inflation";
import { TrendingUp, Calculator } from "lucide-react";

export function InflationCalculator() {
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

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Calculadora de Inflación
        </CardTitle>
        <CardDescription>
          Calcula el valor ajustado por inflación entre dos fechas
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="currency">Moneda</Label>
          <Select
            id="currency"
            value={currency}
            onChange={(e) => handleCurrencyChange(e.target.value as Currency)}
          >
            <option value="ARS">Peso Argentino (ARS)</option>
            <option value="USD">Dólar Estadounidense (USD)</option>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">Monto</Label>
          <Input
            id="amount"
            type="number"
            placeholder="Ingresa el monto"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            step="0.01"
            min="0"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fromDate">Fecha de Origen</Label>
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
            <Label htmlFor="toDate">Fecha de Destino</Label>
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
          Calcular
        </Button>

        {error && (
          <div className="p-4 bg-destructive/10 text-destructive rounded-md text-sm">
            {error}
          </div>
        )}

        {result && (
          <div className="p-6 bg-primary/5 rounded-lg space-y-3 border border-primary/20">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Monto Original:</span>
              <span className="text-lg font-semibold">
                {formatCurrency(result.originalAmount, result.currency)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Período:</span>
              <span className="text-sm">
                {formatDateDisplay(result.fromDate)} → {formatDateDisplay(result.toDate)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Inflación Acumulada:</span>
              <span className="text-lg font-semibold text-destructive">
                {result.inflationRate.toFixed(2)}%
              </span>
            </div>
            <div className="pt-3 border-t border-primary/20">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Valor Ajustado:</span>
                <span className="text-2xl font-bold text-primary">
                  {formatCurrency(result.adjustedAmount, result.currency)}
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

