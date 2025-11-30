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
 * This service provides inflation data and calculations for ARS and USD.
 * 
 * Data sources:
 * - ARS inflation: INDEC (Instituto Nacional de Estadística y Censos)
 * - USD inflation: US Bureau of Labor Statistics (CPI)
 * - Exchange rates: Banco Central de la República Argentina
 * 
 * For production, you should integrate with real APIs like:
 * - https://api.estadisticasbcra.com/
 * - https://www.datos.gob.ar/
 * - https://api.bluelytics.com.ar/
 */

// Mock data - In production, this should come from an API
const ARS_INFLATION_DATA: InflationData[] = [
  // 2020
  { date: "2020-01", rate: 2.3, accumulated: 0 },
  { date: "2020-02", rate: 2.0, accumulated: 4.3 },
  { date: "2020-03", rate: 3.3, accumulated: 7.7 },
  { date: "2020-04", rate: 1.5, accumulated: 9.3 },
  { date: "2020-05", rate: 1.5, accumulated: 10.9 },
  { date: "2020-06", rate: 2.2, accumulated: 13.3 },
  { date: "2020-07", rate: 1.9, accumulated: 15.4 },
  { date: "2020-08", rate: 2.7, accumulated: 18.4 },
  { date: "2020-09", rate: 2.8, accumulated: 21.6 },
  { date: "2020-10", rate: 3.8, accumulated: 26.2 },
  { date: "2020-11", rate: 3.2, accumulated: 30.2 },
  { date: "2020-12", rate: 4.0, accumulated: 35.4 },
  
  // 2021
  { date: "2021-01", rate: 4.0, accumulated: 40.8 },
  { date: "2021-02", rate: 3.6, accumulated: 45.9 },
  { date: "2021-03", rate: 4.8, accumulated: 52.9 },
  { date: "2021-04", rate: 4.1, accumulated: 59.2 },
  { date: "2021-05", rate: 3.3, accumulated: 64.4 },
  { date: "2021-06", rate: 3.2, accumulated: 69.7 },
  { date: "2021-07", rate: 3.0, accumulated: 74.8 },
  { date: "2021-08", rate: 2.5, accumulated: 79.2 },
  { date: "2021-09", rate: 3.5, accumulated: 85.4 },
  { date: "2021-10", rate: 3.5, accumulated: 91.9 },
  { date: "2021-11", rate: 2.5, accumulated: 96.7 },
  { date: "2021-12", rate: 3.8, accumulated: 104.2 },
  
  // 2022
  { date: "2022-01", rate: 3.9, accumulated: 112.2 },
  { date: "2022-02", rate: 4.7, accumulated: 122.2 },
  { date: "2022-03", rate: 6.7, accumulated: 137.1 },
  { date: "2022-04", rate: 6.0, accumulated: 151.3 },
  { date: "2022-05", rate: 5.1, accumulated: 164.1 },
  { date: "2022-06", rate: 5.3, accumulated: 178.1 },
  { date: "2022-07", rate: 7.4, accumulated: 198.7 },
  { date: "2022-08", rate: 7.0, accumulated: 220.6 },
  { date: "2022-09", rate: 6.2, accumulated: 240.5 },
  { date: "2022-10", rate: 6.3, accumulated: 261.9 },
  { date: "2022-11", rate: 4.9, accumulated: 279.6 },
  { date: "2022-12", rate: 5.1, accumulated: 298.9 },
  
  // 2023
  { date: "2023-01", rate: 6.0, accumulated: 322.8 },
  { date: "2023-02", rate: 6.6, accumulated: 350.7 },
  { date: "2023-03", rate: 7.7, accumulated: 385.4 },
  { date: "2023-04", rate: 8.4, accumulated: 426.2 },
  { date: "2023-05", rate: 7.8, accumulated: 467.3 },
  { date: "2023-06", rate: 6.0, accumulated: 501.3 },
  { date: "2023-07", rate: 6.3, accumulated: 539.2 },
  { date: "2023-08", rate: 12.4, accumulated: 618.4 },
  { date: "2023-09", rate: 12.7, accumulated: 709.6 },
  { date: "2023-10", rate: 8.3, accumulated: 785.8 },
  { date: "2023-11", rate: 12.8, accumulated: 899.1 },
  { date: "2023-12", rate: 25.5, accumulated: 1153.8 },
  
  // 2024
  { date: "2024-01", rate: 20.6, accumulated: 1406.1 },
  { date: "2024-02", rate: 13.2, accumulated: 1605.6 },
  { date: "2024-03", rate: 11.0, accumulated: 1792.2 },
  { date: "2024-04", rate: 8.8, accumulated: 1958.6 },
  { date: "2024-05", rate: 4.2, accumulated: 2040.6 },
  { date: "2024-06", rate: 4.6, accumulated: 2134.1 },
  { date: "2024-07", rate: 4.0, accumulated: 2219.5 },
  { date: "2024-08", rate: 4.2, accumulated: 2316.9 },
  { date: "2024-09", rate: 3.5, accumulated: 2399.8 },
  { date: "2024-10", rate: 2.7, accumulated: 2464.6 },
  { date: "2024-11", rate: 2.4, accumulated: 2523.9 },
];

// USD Inflation data (US CPI)
const USD_INFLATION_DATA: InflationData[] = [
  // 2020
  { date: "2020-01", rate: 0.1, accumulated: 0 },
  { date: "2020-02", rate: 0.1, accumulated: 0.2 },
  { date: "2020-03", rate: -0.4, accumulated: -0.2 },
  { date: "2020-04", rate: -0.8, accumulated: -1.0 },
  { date: "2020-05", rate: -0.1, accumulated: -1.1 },
  { date: "2020-06", rate: 0.6, accumulated: -0.5 },
  { date: "2020-07", rate: 0.6, accumulated: 0.1 },
  { date: "2020-08", rate: 0.4, accumulated: 0.5 },
  { date: "2020-09", rate: 0.2, accumulated: 0.7 },
  { date: "2020-10", rate: 0.0, accumulated: 0.7 },
  { date: "2020-11", rate: 0.2, accumulated: 0.9 },
  { date: "2020-12", rate: 0.4, accumulated: 1.3 },
  
  // 2021
  { date: "2021-01", rate: 0.3, accumulated: 1.6 },
  { date: "2021-02", rate: 0.4, accumulated: 2.0 },
  { date: "2021-03", rate: 0.6, accumulated: 2.6 },
  { date: "2021-04", rate: 0.8, accumulated: 3.4 },
  { date: "2021-05", rate: 0.6, accumulated: 4.0 },
  { date: "2021-06", rate: 0.9, accumulated: 4.9 },
  { date: "2021-07", rate: 0.5, accumulated: 5.4 },
  { date: "2021-08", rate: 0.3, accumulated: 5.7 },
  { date: "2021-09", rate: 0.4, accumulated: 6.1 },
  { date: "2021-10", rate: 0.9, accumulated: 7.0 },
  { date: "2021-11", rate: 0.8, accumulated: 7.8 },
  { date: "2021-12", rate: 0.5, accumulated: 8.3 },
  
  // 2022
  { date: "2022-01", rate: 0.6, accumulated: 8.9 },
  { date: "2022-02", rate: 0.8, accumulated: 9.7 },
  { date: "2022-03", rate: 1.2, accumulated: 11.0 },
  { date: "2022-04", rate: 0.3, accumulated: 11.3 },
  { date: "2022-05", rate: 1.0, accumulated: 12.4 },
  { date: "2022-06", rate: 1.3, accumulated: 13.8 },
  { date: "2022-07", rate: 0.0, accumulated: 13.8 },
  { date: "2022-08", rate: -0.1, accumulated: 13.7 },
  { date: "2022-09", rate: 0.4, accumulated: 14.1 },
  { date: "2022-10", rate: 0.4, accumulated: 14.5 },
  { date: "2022-11", rate: 0.1, accumulated: 14.6 },
  { date: "2022-12", rate: -0.1, accumulated: 14.5 },
  
  // 2023
  { date: "2023-01", rate: 0.5, accumulated: 15.0 },
  { date: "2023-02", rate: 0.4, accumulated: 15.4 },
  { date: "2023-03", rate: 0.1, accumulated: 15.5 },
  { date: "2023-04", rate: 0.4, accumulated: 15.9 },
  { date: "2023-05", rate: 0.1, accumulated: 16.0 },
  { date: "2023-06", rate: 0.2, accumulated: 16.2 },
  { date: "2023-07", rate: 0.2, accumulated: 16.4 },
  { date: "2023-08", rate: 0.6, accumulated: 17.0 },
  { date: "2023-09", rate: 0.4, accumulated: 17.4 },
  { date: "2023-10", rate: 0.0, accumulated: 17.4 },
  { date: "2023-11", rate: 0.1, accumulated: 17.5 },
  { date: "2023-12", rate: -0.1, accumulated: 17.4 },
  
  // 2024
  { date: "2024-01", rate: 0.3, accumulated: 17.7 },
  { date: "2024-02", rate: 0.4, accumulated: 18.1 },
  { date: "2024-03", rate: 0.4, accumulated: 18.5 },
  { date: "2024-04", rate: 0.3, accumulated: 18.8 },
  { date: "2024-05", rate: 0.0, accumulated: 18.8 },
  { date: "2024-06", rate: 0.1, accumulated: 18.9 },
  { date: "2024-07", rate: 0.2, accumulated: 19.1 },
  { date: "2024-08", rate: 0.2, accumulated: 19.3 },
  { date: "2024-09", rate: 0.1, accumulated: 19.4 },
  { date: "2024-10", rate: 0.2, accumulated: 19.6 },
  { date: "2024-11", rate: 0.3, accumulated: 19.9 },
];

// Exchange rate data (ARS/USD)
const EXCHANGE_RATE_DATA: ExchangeRateData[] = [
  // 2020
  { date: "2020-01", official: 60.0, blue: 80.0 },
  { date: "2020-02", official: 62.0, blue: 82.0 },
  { date: "2020-03", official: 64.0, blue: 85.0 },
  { date: "2020-04", official: 66.0, blue: 90.0 },
  { date: "2020-05", official: 68.0, blue: 95.0 },
  { date: "2020-06", official: 70.0, blue: 120.0 },
  { date: "2020-07", official: 72.0, blue: 130.0 },
  { date: "2020-08", official: 74.0, blue: 135.0 },
  { date: "2020-09", official: 76.0, blue: 140.0 },
  { date: "2020-10", official: 78.0, blue: 180.0 },
  { date: "2020-11", official: 80.0, blue: 170.0 },
  { date: "2020-12", official: 84.0, blue: 150.0 },
  
  // 2021
  { date: "2021-01", official: 88.0, blue: 145.0 },
  { date: "2021-02", official: 90.0, blue: 148.0 },
  { date: "2021-03", official: 92.0, blue: 150.0 },
  { date: "2021-04", official: 94.0, blue: 152.0 },
  { date: "2021-05", official: 95.0, blue: 155.0 },
  { date: "2021-06", official: 96.0, blue: 165.0 },
  { date: "2021-07", official: 97.0, blue: 175.0 },
  { date: "2021-08", official: 98.0, blue: 180.0 },
  { date: "2021-09", official: 99.0, blue: 182.0 },
  { date: "2021-10", official: 100.0, blue: 195.0 },
  { date: "2021-11", official: 102.0, blue: 200.0 },
  { date: "2021-12", official: 103.0, blue: 205.0 },
  
  // 2022
  { date: "2022-01", official: 105.0, blue: 210.0 },
  { date: "2022-02", official: 108.0, blue: 215.0 },
  { date: "2022-03", official: 112.0, blue: 220.0 },
  { date: "2022-04", official: 116.0, blue: 210.0 },
  { date: "2022-05", official: 120.0, blue: 205.0 },
  { date: "2022-06", official: 125.0, blue: 230.0 },
  { date: "2022-07", official: 130.0, blue: 280.0 },
  { date: "2022-08", official: 135.0, blue: 290.0 },
  { date: "2022-09", official: 145.0, blue: 285.0 },
  { date: "2022-10", official: 155.0, blue: 290.0 },
  { date: "2022-11", official: 165.0, blue: 310.0 },
  { date: "2022-12", official: 177.0, blue: 350.0 },
  
  // 2023
  { date: "2023-01", official: 188.0, blue: 370.0 },
  { date: "2023-02", official: 200.0, blue: 390.0 },
  { date: "2023-03", official: 215.0, blue: 400.0 },
  { date: "2023-04", official: 230.0, blue: 480.0 },
  { date: "2023-05", official: 245.0, blue: 500.0 },
  { date: "2023-06", official: 260.0, blue: 520.0 },
  { date: "2023-07", official: 280.0, blue: 550.0 },
  { date: "2023-08", official: 350.0, blue: 700.0 },
  { date: "2023-09", official: 365.0, blue: 800.0 },
  { date: "2023-10", official: 380.0, blue: 900.0 },
  { date: "2023-11", official: 400.0, blue: 1000.0 },
  { date: "2023-12", official: 800.0, blue: 1050.0 },
  
  // 2024
  { date: "2024-01", official: 850.0, blue: 1100.0 },
  { date: "2024-02", official: 880.0, blue: 1050.0 },
  { date: "2024-03", official: 900.0, blue: 1050.0 },
  { date: "2024-04", official: 920.0, blue: 1050.0 },
  { date: "2024-05", official: 940.0, blue: 1100.0 },
  { date: "2024-06", official: 960.0, blue: 1200.0 },
  { date: "2024-07", official: 980.0, blue: 1300.0 },
  { date: "2024-08", official: 1000.0, blue: 1350.0 },
  { date: "2024-09", official: 1020.0, blue: 1250.0 },
  { date: "2024-10", official: 1040.0, blue: 1200.0 },
  { date: "2024-11", official: 1060.0, blue: 1150.0 },
];

/**
 * Get inflation data for a specific currency
 */
export function getInflationData(currency: Currency): InflationData[] {
  return currency === "ARS" ? ARS_INFLATION_DATA : USD_INFLATION_DATA;
}

/**
 * Get inflation data for a specific date
 */
export function getInflationForDate(
  currency: Currency,
  date: string
): InflationData | null {
  const data = getInflationData(currency);
  return data.find((item) => item.date === date) || null;
}

/**
 * Get exchange rate for a specific date
 */
export function getExchangeRate(date: string): ExchangeRateData | null {
  return EXCHANGE_RATE_DATA.find((item) => item.date === date) || null;
}

/**
 * Calculate accumulated inflation between two dates
 */
export function calculateAccumulatedInflation(
  currency: Currency,
  fromDate: string,
  toDate: string
): number {
  const data = getInflationData(currency);
  
  const fromData = data.find((item) => item.date === fromDate);
  const toData = data.find((item) => item.date === toDate);
  
  if (!fromData || !toData) {
    throw new Error("Date not found in inflation data");
  }
  
  // Calculate the accumulated inflation between the two dates
  // Formula: ((1 + toAccumulated/100) / (1 + fromAccumulated/100) - 1) * 100
  const fromMultiplier = 1 + fromData.accumulated / 100;
  const toMultiplier = 1 + toData.accumulated / 100;
  
  return ((toMultiplier / fromMultiplier - 1) * 100);
}

/**
 * Calculate inflation-adjusted amount
 */
export function calculateInflationAdjustment(
  input: CalculationInput
): CalculationResult {
  const inflationRate = calculateAccumulatedInflation(
    input.currency,
    input.fromDate,
    input.toDate
  );
  
  const adjustedAmount = input.amount * (1 + inflationRate / 100);
  
  return {
    originalAmount: input.amount,
    adjustedAmount,
    inflationRate,
    fromDate: input.fromDate,
    toDate: input.toDate,
    currency: input.currency,
  };
}

/**
 * Convert between currencies
 */
export function convertCurrency(input: ConversionInput): ConversionResult {
  const exchangeData = getExchangeRate(input.date);
  
  if (!exchangeData) {
    throw new Error("Exchange rate not found for date");
  }
  
  const rate =
    input.exchangeRateType === "official"
      ? exchangeData.official
      : exchangeData.blue;
  
  let convertedAmount: number;
  
  if (input.fromCurrency === "ARS" && input.toCurrency === "USD") {
    convertedAmount = input.amount / rate;
  } else if (input.fromCurrency === "USD" && input.toCurrency === "ARS") {
    convertedAmount = input.amount * rate;
  } else {
    // Same currency
    convertedAmount = input.amount;
  }
  
  return {
    originalAmount: input.amount,
    convertedAmount,
    exchangeRate: rate,
    fromCurrency: input.fromCurrency,
    toCurrency: input.toCurrency,
    date: input.date,
    exchangeRateType: input.exchangeRateType,
  };
}

/**
 * Get available date range for a currency
 */
export function getAvailableDateRange(currency: Currency): {
  minDate: string;
  maxDate: string;
} {
  const data = getInflationData(currency);
  return {
    minDate: data[0].date,
    maxDate: data[data.length - 1].date,
  };
}

/**
 * Get all available dates for a currency
 */
export function getAvailableDates(currency: Currency): string[] {
  const data = getInflationData(currency);
  return data.map((item) => item.date);
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

