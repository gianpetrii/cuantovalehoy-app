import {
  InflationData,
  ExchangeRateData,
  CalculationInput,
  CalculationResult,
  ConversionInput,
  ConversionResult,
  Currency,
} from "@/types/inflation";

/**
 * Inflation Service
 * 
 * This service provides utility functions for inflation calculations.
 * Data is fetched from Supabase (see inflation-db.ts and hooks/use-inflation-data.ts)
 * 
 * Data sources:
 * - ARS inflation: INDEC via API de Series de Tiempo (datos.gob.ar)
 * - USD inflation: US Bureau of Labor Statistics (BLS CPI)
 * - Exchange rates: Historical data + DolarAPI for current rates
 */

/**
 * Get inflation data for a specific currency (legacy function for old components)
 * @deprecated Use useInflationData hook instead
 */
export function getInflationData(currency: Currency): InflationData[] {
  console.warn('getInflationData is deprecated. Use useInflationData hook instead.');
  return [];
}

/**
 * Get inflation data for a specific date (legacy function)
 * @deprecated Use useInflationData hook and filter the data
 */
export function getInflationForDate(
  currency: Currency,
  date: string
): InflationData | null {
  console.warn('getInflationForDate is deprecated. Use useInflationData hook instead.');
  return null;
}

/**
 * Get exchange rate for a specific date (legacy function)
 * @deprecated Use useExchangeRates hook instead
 */
export function getExchangeRate(date: string): ExchangeRateData | null {
  console.warn('getExchangeRate is deprecated. Use useExchangeRates hook instead.');
  return null;
}

/**
 * Calculate accumulated inflation between two dates
 */
export function calculateAccumulatedInflation(
  fromAccumulated: number,
  toAccumulated: number
): number {
  // Formula: ((1 + toAccumulated/100) / (1 + fromAccumulated/100) - 1) * 100
  const fromMultiplier = 1 + fromAccumulated / 100;
  const toMultiplier = 1 + toAccumulated / 100;
  
  return ((toMultiplier / fromMultiplier - 1) * 100);
}

/**
 * Calculate inflation-adjusted amount (legacy function)
 * @deprecated Components should use data from hooks directly
 */
export function calculateInflationAdjustment(
  input: CalculationInput
): CalculationResult {
  console.warn('calculateInflationAdjustment is deprecated. Use data from hooks directly.');
  
  return {
    originalAmount: input.amount,
    adjustedAmount: input.amount,
    inflationRate: 0,
    fromDate: input.fromDate,
    toDate: input.toDate,
    currency: input.currency,
  };
}

/**
 * Convert between currencies (legacy function)
 * @deprecated Use exchange rate data from hooks
 */
export function convertCurrency(input: ConversionInput): ConversionResult {
  console.warn('convertCurrency is deprecated. Use exchange rate data from hooks.');
  
  return {
    originalAmount: input.amount,
    convertedAmount: input.amount,
    exchangeRate: 1,
    fromCurrency: input.fromCurrency,
    toCurrency: input.toCurrency,
    date: input.date,
    exchangeRateType: input.exchangeRateType,
  };
}

/**
 * Get available date range for a currency (legacy function)
 * @deprecated Use data from hooks
 */
export function getAvailableDateRange(currency: Currency): {
  minDate: string;
  maxDate: string;
} {
  console.warn('getAvailableDateRange is deprecated. Use data from hooks.');
  return {
    minDate: '2020-01',
    maxDate: new Date().toISOString().slice(0, 7),
  };
}

/**
 * Get all available dates for a currency (legacy function)
 * @deprecated Use useAvailableDates hook
 */
export function getAvailableDates(currency: Currency): string[] {
  console.warn('getAvailableDates is deprecated. Use useAvailableDates hook.');
  return [];
}

/**
 * Calculate dollarization comparison (legacy function)
 * @deprecated Use data from hooks and calculate in component
 */
export function calculateDollarizationComparison(
  arsAmount: number,
  fromDate: string,
  toDate: string,
  exchangeRateType: "official" | "blue" = "blue"
) {
  console.warn('calculateDollarizationComparison is deprecated. Use data from hooks.');
  
  return {
    originalARS: arsAmount,
    initialUSD: 0,
    initialExchangeRate: 0,
    adjustedUSD: 0,
    usdInflation: 0,
    finalARS: 0,
    finalExchangeRate: 0,
    adjustedARS: 0,
    arsInflation: 0,
    dollarizationGain: 0,
    wasWorthIt: false,
  };
}

/**
 * Format date for display (YYYY-MM to Month Year)
 */
export function formatDateDisplay(date: string): string {
  const [year, month] = date.split("-");
  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];
  return `${monthNames[parseInt(month) - 1]} ${year}`;
}

/**
 * Format currency amount
 */
export function formatCurrency(amount: number, currency: Currency): string {
  const symbol = currency === "ARS" ? "$" : "US$";
  return `${symbol} ${amount.toLocaleString("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
