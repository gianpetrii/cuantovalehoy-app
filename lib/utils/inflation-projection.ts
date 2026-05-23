import { InflationData, ExchangeRateData } from "@/types/inflation";

/**
 * Calcula la inflación anual proyectada a partir de los últimos 12 meses disponibles.
 * Compone las tasas mensuales: (1+r1)(1+r2)... - 1
 */
export function calculateAnnualInflationRate(
  inflationData: InflationData[]
): number {
  if (!inflationData || inflationData.length === 0) return 0;

  const sorted = [...inflationData].sort((a, b) =>
    b.date.localeCompare(a.date)
  );
  const last12Months = sorted.slice(0, 12);

  if (last12Months.length === 0) return 0;

  const compoundFactor = last12Months.reduce(
    (acc, item) => acc * (1 + item.rate / 100),
    1
  );

  if (last12Months.length < 12) {
    const annualized =
      (Math.pow(compoundFactor, 12 / last12Months.length) - 1) * 100;
    return Math.round(annualized * 100) / 100;
  }

  return Math.round((compoundFactor - 1) * 100 * 100) / 100;
}

/**
 * Calcula la devaluación anual del peso (crecimiento del tipo de cambio ARS/USD)
 * a partir de los últimos 12 meses de datos de cambio.
 */
export function calculateAnnualDevaluationRate(
  exchangeRates: ExchangeRateData[],
  rateType: "official" | "blue" = "blue"
): number {
  if (!exchangeRates || exchangeRates.length < 2) return 0;

  const sorted = [...exchangeRates].sort((a, b) =>
    b.date.localeCompare(a.date)
  );
  const last12Months = sorted.slice(0, 12);

  if (last12Months.length < 2) return 0;

  const getRate = (item: ExchangeRateData) =>
    rateType === "blue" ? item.blue : item.official;

  let compoundFactor = 1;
  for (let i = 0; i < last12Months.length - 1; i++) {
    const current = getRate(last12Months[i]);
    const previous = getRate(last12Months[i + 1]);
    if (previous > 0) {
      compoundFactor *= current / previous;
    }
  }

  const months = last12Months.length - 1;
  const annualized =
    (Math.pow(compoundFactor, 12 / months) - 1) * 100;

  return Math.round(annualized * 100) / 100;
}

/**
 * Obtiene el tipo de cambio más reciente disponible.
 */
export function getLatestExchangeRate(
  exchangeRates: ExchangeRateData[],
  rateType: "official" | "blue" = "blue"
): number {
  if (!exchangeRates || exchangeRates.length === 0) return 0;

  const sorted = [...exchangeRates].sort((a, b) =>
    b.date.localeCompare(a.date)
  );
  const latest = sorted[0];
  return rateType === "blue" ? latest.blue : latest.official;
}

/**
 * Ajusta un monto por inflación anual compuesta durante N años.
 * Retorna el valor real en términos de poder adquisitivo de hoy.
 */
export function adjustForAnnualInflation(
  amount: number,
  annualInflationRate: number,
  years: number
): number {
  if (annualInflationRate <= 0 || years <= 0) return amount;
  const inflationFactor = Math.pow(1 + annualInflationRate / 100, years);
  return amount / inflationFactor;
}

/**
 * Calcula la ganancia/pérdida real en porcentaje.
 * Positivo = ganas poder adquisitivo, Negativo = pierdes.
 */
export function calculateRealGainPercent(
  realValue: number,
  initialAmount: number
): number {
  if (initialAmount <= 0) return 0;
  return ((realValue - initialAmount) / initialAmount) * 100;
}
