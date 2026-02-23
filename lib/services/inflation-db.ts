import { supabase } from "@/lib/supabase/client";
import {
  InflationData,
  ExchangeRateData,
  Currency,
} from "@/types/inflation";

/**
 * Servicio de base de datos para inflación
 * Maneja todas las consultas a Supabase
 */

// Cache en memoria
let inflationCache: Map<string, InflationData[]> = new Map();
let exchangeRateCache: ExchangeRateData[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_TTL = 1000 * 60 * 60; // 1 hora

/**
 * Obtener datos de inflación desde Supabase
 */
export async function fetchInflationData(currency: Currency): Promise<InflationData[]> {
  const cacheKey = `inflation_${currency}`;
  const now = Date.now();
  
  if (inflationCache.has(cacheKey) && (now - cacheTimestamp) < CACHE_TTL) {
    return inflationCache.get(cacheKey)!;
  }

  const { data, error } = await supabase
    .from('inflation_data')
    .select('date, rate, accumulated')
    .eq('currency', currency)
    .order('date', { ascending: true });

  if (error) {
    console.error('Error fetching inflation data:', error);
    throw new Error(`Error al obtener datos de inflación: ${error.message}`);
  }

  if (!data || data.length === 0) {
    throw new Error(`No hay datos de inflación disponibles para ${currency}`);
  }

  const inflationData: InflationData[] = data.map(item => ({
    date: item.date,
    rate: Number(item.rate),
    accumulated: Number(item.accumulated),
  }));

  inflationCache.set(cacheKey, inflationData);
  cacheTimestamp = now;

  return inflationData;
}

/**
 * Obtener datos de tipo de cambio desde Supabase
 */
export async function fetchExchangeRateData(): Promise<ExchangeRateData[]> {
  const now = Date.now();
  
  if (exchangeRateCache && (now - cacheTimestamp) < CACHE_TTL) {
    return exchangeRateCache;
  }

  const { data, error } = await supabase
    .from('exchange_rates')
    .select('date, official_rate, blue_rate')
    .order('date', { ascending: true });

  if (error) {
    console.error('Error fetching exchange rate data:', error);
    throw new Error(`Error al obtener datos de tipo de cambio: ${error.message}`);
  }

  if (!data || data.length === 0) {
    throw new Error('No hay datos de tipo de cambio disponibles');
  }

  const exchangeData: ExchangeRateData[] = data.map(item => ({
    date: item.date,
    official: Number(item.official_rate),
    blue: Number(item.blue_rate),
  }));

  exchangeRateCache = exchangeData;
  cacheTimestamp = now;

  return exchangeData;
}

/**
 * Limpiar cache
 */
export function clearCache() {
  inflationCache.clear();
  exchangeRateCache = null;
  cacheTimestamp = 0;
}
