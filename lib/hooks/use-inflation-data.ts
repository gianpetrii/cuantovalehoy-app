import { useQuery } from "@tanstack/react-query";
import { Currency } from "@/types/inflation";
import { fetchInflationData, fetchExchangeRateData } from "@/lib/services/inflation-db";
import {
  calculateAnnualInflationRate,
  calculateAnnualDevaluationRate,
} from "@/lib/utils/inflation-projection";

/**
 * Hook para obtener datos de inflación
 */
export function useInflationData(currency: Currency) {
  return useQuery({
    queryKey: ['inflation', currency],
    queryFn: () => fetchInflationData(currency),
    staleTime: 1000 * 60 * 60, // 1 hora
    gcTime: 1000 * 60 * 60 * 24, // 24 horas
  });
}

/**
 * Hook para obtener tipos de cambio
 */
export function useExchangeRates() {
  return useQuery({
    queryKey: ['exchange-rates'],
    queryFn: () => fetchExchangeRateData(),
    staleTime: 1000 * 60 * 60, // 1 hora
    gcTime: 1000 * 60 * 60 * 24, // 24 horas
  });
}

/**
 * Hook para obtener fechas disponibles
 */
export function useAvailableDates(currency: Currency) {
  const { data: inflationData, ...rest } = useInflationData(currency);
  
  return {
    ...rest,
    data: inflationData?.map(item => item.date) || [],
  };
}

/**
 * Hook para obtener tasas anuales proyectadas de inflación y devaluación
 */
export function useProjectedInflationRates(currency: Currency) {
  const { data: inflationData, isLoading: inflationLoading } =
    useInflationData(currency);
  const { data: arsInflationData, isLoading: arsLoading } =
    useInflationData("ARS");
  const { data: usdInflationData, isLoading: usdLoading } =
    useInflationData("USD");
  const { data: exchangeRates, isLoading: exchangeLoading } =
    useExchangeRates();

  const arsAnnualRate = arsInflationData
    ? calculateAnnualInflationRate(arsInflationData)
    : 0;
  const usdAnnualRate = usdInflationData
    ? calculateAnnualInflationRate(usdInflationData)
    : 0;
  const devaluationRate = exchangeRates
    ? calculateAnnualDevaluationRate(exchangeRates, "blue")
    : 0;

  const currencyAnnualRate =
    currency === "ARS" ? arsAnnualRate : usdAnnualRate;

  return {
    arsAnnualRate,
    usdAnnualRate,
    devaluationRate,
    currencyAnnualRate,
    inflationData,
    exchangeRates,
    isLoading:
      inflationLoading || arsLoading || usdLoading || exchangeLoading,
  };
}
