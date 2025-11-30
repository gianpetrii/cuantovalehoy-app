export type Currency = "ARS" | "USD";

export interface InflationData {
  date: string; // YYYY-MM format
  rate: number; // Monthly inflation rate as percentage
  accumulated: number; // Accumulated inflation from base date
}

export interface ExchangeRateData {
  date: string; // YYYY-MM format
  official: number; // Official exchange rate ARS/USD
  blue: number; // Blue/parallel exchange rate ARS/USD
}

export interface CalculationInput {
  amount: number;
  fromDate: string; // YYYY-MM format
  toDate: string; // YYYY-MM format
  currency: Currency;
}

export interface CalculationResult {
  originalAmount: number;
  adjustedAmount: number;
  inflationRate: number; // Total inflation between dates
  fromDate: string;
  toDate: string;
  currency: Currency;
}

export interface ConversionInput {
  amount: number;
  fromCurrency: Currency;
  toCurrency: Currency;
  date: string; // YYYY-MM format
  exchangeRateType: "official" | "blue";
}

export interface ConversionResult {
  originalAmount: number;
  convertedAmount: number;
  exchangeRate: number;
  fromCurrency: Currency;
  toCurrency: Currency;
  date: string;
  exchangeRateType: "official" | "blue";
}

export interface InflationCalculatorState {
  // ARS Inflation calculation
  arsAmount: string;
  arsFromDate: string;
  arsToDate: string;
  arsResult: CalculationResult | null;

  // USD Inflation calculation
  usdAmount: string;
  usdFromDate: string;
  usdToDate: string;
  usdResult: CalculationResult | null;

  // Cross-currency conversion with inflation
  crossAmount: string;
  crossFromDate: string;
  crossToDate: string;
  crossFromCurrency: Currency;
  crossToCurrency: Currency;
  crossExchangeRateType: "official" | "blue";
  crossResult: {
    originalConversion: ConversionResult;
    futureConversion: ConversionResult;
    inflationAdjustment: CalculationResult;
  } | null;

  // Loading states
  isCalculating: boolean;
  error: string | null;
}

