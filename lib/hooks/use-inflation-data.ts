import { useQuery } from "@tanstack/react-query";
import { Currency } from "@/types/inflation";
import { fetchInflationData, fetchExchangeRateData } from "@/lib/services/inflation-db";

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
