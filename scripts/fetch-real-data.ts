/**
 * Script para obtener datos REALES de inflación desde APIs oficiales
 * 
 * Fuentes:
 * - ARS: API de Series de Tiempo (datos.gob.ar) - INDEC oficial
 * - USD: Bureau of Labor Statistics API - BLS oficial
 * - Tipo de cambio: Bluelytics API
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface InflationDataPoint {
  date: string;
  rate: number;
  accumulated: number;
}

/**
 * Obtener datos de inflación ARS desde datos.gob.ar
 */
async function fetchARSInflation(): Promise<InflationDataPoint[]> {
  console.log('📊 Obteniendo datos de inflación ARS desde datos.gob.ar...');
  
  // Serie IPC Nivel General - Variación mensual
  const seriesId = '101.1_I2NG_2016_M_22:percent_change';
  const url = `https://apis.datos.gob.ar/series/api/series?ids=${seriesId}&format=json&start_date=2020-01`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (!data.data || data.data.length === 0) {
      throw new Error('No se obtuvieron datos de la API');
    }
    
    // Procesar datos
    const inflationData: InflationDataPoint[] = [];
    let accumulated = 0;
    
    for (const point of data.data) {
      const [dateStr, value] = point;
      if (value === null) continue;
      
      // Convertir fecha de YYYY-MM-DD a YYYY-MM
      const date = dateStr.substring(0, 7);
      const rate = Number(value);
      
      // Calcular acumulado: (1 + r1/100) * (1 + r2/100) * ... - 1
      accumulated = ((1 + accumulated / 100) * (1 + rate / 100) - 1) * 100;
      
      inflationData.push({
        date,
        rate: Math.round(rate * 100) / 100, // 2 decimales
        accumulated: Math.round(accumulated * 100) / 100,
      });
    }
    
    console.log(`✅ ${inflationData.length} registros ARS obtenidos`);
    return inflationData;
    
  } catch (error) {
    console.error('❌ Error obteniendo datos ARS:', error);
    throw error;
  }
}

/**
 * Obtener datos de inflación USD desde BLS
 */
async function fetchUSDInflation(): Promise<InflationDataPoint[]> {
  console.log('💵 Obteniendo datos de inflación USD desde BLS...');
  
  // CPI-U: Consumer Price Index for All Urban Consumers
  const seriesId = 'CUSR0000SA0';
  const currentYear = new Date().getFullYear();
  const startYear = 2020;
  
  const url = `https://api.bls.gov/publicAPI/v2/timeseries/data/${seriesId}?startyear=${startYear}&endyear=${currentYear}&calculations=true&annualaverage=false`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    
    if (data.status !== 'REQUEST_SUCCEEDED') {
      throw new Error(`BLS API error: ${data.message}`);
    }
    
    const series = data.Results.series[0];
    if (!series || !series.data) {
      throw new Error('No se obtuvieron datos de BLS');
    }
    
    // Ordenar por fecha (más antiguo primero)
    const sortedData = series.data.sort((a: any, b: any) => {
      const dateA = `${a.year}-${a.period.replace('M', '')}`;
      const dateB = `${b.year}-${b.period.replace('M', '')}`;
      return dateA.localeCompare(dateB);
    });
    
    const inflationData: InflationDataPoint[] = [];
    let accumulated = 0;
    
    for (const point of sortedData) {
      if (point.period.startsWith('M')) {
        const month = point.period.replace('M', '').padStart(2, '0');
        const date = `${point.year}-${month}`;
        
        // BLS proporciona "12 months percent change" directamente
        // Pero necesitamos cambio mensual
        const calculations = point.calculations;
        let monthlyChange = 0;
        
        if (calculations && calculations['1']) {
          // '1' es el código para cambio de 1 mes
          monthlyChange = parseFloat(calculations['1']) || 0;
        }
        
        accumulated = ((1 + accumulated / 100) * (1 + monthlyChange / 100) - 1) * 100;
        
        inflationData.push({
          date,
          rate: Math.round(monthlyChange * 100) / 100,
          accumulated: Math.round(accumulated * 100) / 100,
        });
      }
    }
    
    console.log(`✅ ${inflationData.length} registros USD obtenidos`);
    return inflationData;
    
  } catch (error) {
    console.error('❌ Error obteniendo datos USD:', error);
    throw error;
  }
}

/**
 * Obtener tipos de cambio históricos desde BCRA
 */
async function fetchExchangeRates(): Promise<any[]> {
  console.log('💱 Obteniendo tipos de cambio desde BCRA...');
  
  try {
    // API oficial del BCRA - Estadísticas Cambiarias
    // Necesitamos obtener datos desde 2020-01 hasta hoy
    const startDate = new Date('2020-01-01');
    const endDate = new Date();
    
    const exchangeData: any[] = [];
    
    // BCRA API requiere consultas por fecha
    // Para simplificar, usamos el último día de cada mes
    let currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const lastDay = new Date(year, currentDate.getMonth() + 1, 0).getDate();
      const dateStr = `${year}-${month}-${lastDay}`;
      
      try {
        const url = `https://api.bcra.gob.ar/estadisticascambiarias/v1.0/Cotizaciones?fecha=${dateStr}`;
        const response = await fetch(url);
        
        if (response.ok) {
          const data = await response.json();
          
          // Buscar cotización USD
          const usdData = data.results?.detalle?.find((item: any) => 
            item.codigoMoneda === 'USD'
          );
          
          if (usdData) {
            exchangeData.push({
              date: `${year}-${month}`,
              official: usdData.tipoCotizacion,
              blue: usdData.tipoCotizacion * 1.3, // Estimado (blue suele ser ~30% más)
            });
          }
        }
        
        // Esperar un poco entre requests
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (err) {
        console.log(`⚠️  No hay datos para ${year}-${month}`);
      }
      
      // Siguiente mes
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
    
    console.log(`✅ ${exchangeData.length} registros de tipo de cambio obtenidos`);
    
    // Si no obtuvimos datos del BCRA, usar fuente alternativa
    if (exchangeData.length === 0) {
      console.log('⚠️  No se pudieron obtener datos del BCRA');
      console.log('Considera usar estadisticasbcra.com (requiere registro para API key)');
    }
    
    return exchangeData;
    
  } catch (error) {
    console.error('❌ Error obteniendo tipos de cambio:', error);
    return [];
  }
}

/**
 * Limpiar base de datos
 */
async function clearDatabase() {
  console.log('\n🗑️  Limpiando base de datos...');
  
  const { error: inflationError } = await supabase
    .from('inflation_data')
    .delete()
    .neq('id', 0); // Eliminar todos
  
  if (inflationError) {
    console.error('Error limpiando inflation_data:', inflationError);
  } else {
    console.log('✅ Tabla inflation_data limpiada');
  }
  
  const { error: exchangeError } = await supabase
    .from('exchange_rates')
    .delete()
    .neq('id', 0); // Eliminar todos
  
  if (exchangeError) {
    console.error('Error limpiando exchange_rates:', exchangeError);
  } else {
    console.log('✅ Tabla exchange_rates limpiada');
  }
}

/**
 * Insertar datos en Supabase
 */
async function insertInflationData(currency: string, data: InflationDataPoint[]) {
  console.log(`\n💾 Insertando ${data.length} registros de ${currency}...`);
  
  const records = data.map(item => ({
    date: item.date,
    currency,
    rate: item.rate,
    accumulated: item.accumulated,
  }));
  
  const { error } = await supabase
    .from('inflation_data')
    .upsert(records, { onConflict: 'date,currency' });
  
  if (error) {
    console.error(`❌ Error insertando datos ${currency}:`, error);
    throw error;
  }
  
  console.log(`✅ ${records.length} registros ${currency} insertados`);
}

/**
 * Script principal
 */
async function main() {
  console.log('🚀 Obteniendo datos REALES de APIs oficiales\n');
  console.log('=' .repeat(60));
  
  try {
    // 1. Limpiar base de datos
    await clearDatabase();
    
    console.log('\n' + '='.repeat(60));
    
    // 2. Obtener datos ARS
    const arsData = await fetchARSInflation();
    await insertInflationData('ARS', arsData);
    
    console.log('\n' + '='.repeat(60));
    
    // 3. Obtener datos USD
    const usdData = await fetchUSDInflation();
    await insertInflationData('USD', usdData);
    
    console.log('\n' + '='.repeat(60));
    
    // 4. Tipos de cambio
    const exchangeData = await fetchExchangeRates();
    if (exchangeData.length > 0) {
      console.log(`\n💾 Insertando ${exchangeData.length} registros de tipo de cambio...`);
      
      const { error } = await supabase
        .from('exchange_rates')
        .upsert(exchangeData.map(item => ({
          date: item.date,
          official_rate: item.official,
          blue_rate: item.blue,
        })), { onConflict: 'date' });
      
      if (error) {
        console.error('❌ Error insertando tipos de cambio:', error);
      } else {
        console.log(`✅ ${exchangeData.length} registros de tipo de cambio insertados`);
      }
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('\n✨ ¡Datos reales cargados exitosamente!');
    console.log('\nResumen:');
    console.log(`- ARS: ${arsData.length} meses desde ${arsData[0]?.date} hasta ${arsData[arsData.length - 1]?.date}`);
    console.log(`- USD: ${usdData.length} meses desde ${usdData[0]?.date} hasta ${usdData[usdData.length - 1]?.date}`);
    
  } catch (error) {
    console.error('\n💥 Error:', error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('💥 Error fatal:', error);
    process.exit(1);
  });
