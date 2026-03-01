/**
 * Script de actualización diaria de datos de inflación
 * 
 * Este script debe ejecutarse diariamente para mantener los datos actualizados.
 * Se puede configurar como cron job o GitHub Action.
 * 
 * Ejecutar: npx tsx scripts/daily-update.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

// Solo cargar .env.local si existe (desarrollo local)
const envPath = path.resolve(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Faltan variables de entorno de Supabase');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓' : '✗');
  console.error('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✓' : '✗');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Obtener último mes disponible en la BD
 */
async function getLastAvailableDate(currency: string): Promise<string | null> {
  const { data, error } = await supabase
    .from('inflation_data')
    .select('date')
    .eq('currency', currency)
    .order('date', { ascending: false })
    .limit(1);
  
  if (error || !data || data.length === 0) {
    return null;
  }
  
  return data[0].date;
}

/**
 * Verificar si hay nuevos datos disponibles en la API
 */
async function checkForNewARSData(): Promise<boolean> {
  const lastDate = await getLastAvailableDate('ARS');
  if (!lastDate) return true;
  
  console.log(`📅 Último dato ARS en BD: ${lastDate}`);
  
  // Verificar si hay datos más recientes en la API
  const seriesId = '101.1_I2NG_2016_M_22:percent_change';
  const url = `https://apis.datos.gob.ar/series/api/series?ids=${seriesId}&format=json&limit=1`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.data && data.data.length > 0) {
      const latestDate = data.data[0][0].substring(0, 7);
      console.log(`📅 Último dato ARS en API: ${latestDate}`);
      return latestDate > lastDate;
    }
  } catch (error) {
    console.error('Error verificando datos ARS:', error);
  }
  
  return false;
}

/**
 * Verificar si hay nuevos datos USD
 */
async function checkForNewUSDData(): Promise<boolean> {
  const lastDate = await getLastAvailableDate('USD');
  if (!lastDate) return true;
  
  console.log(`📅 Último dato USD en BD: ${lastDate}`);
  
  // BLS publica datos con ~2 semanas de retraso
  const today = new Date();
  const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const expectedDate = `${lastMonth.getFullYear()}-${String(lastMonth.getMonth() + 1).padStart(2, '0')}`;
  
  console.log(`📅 Dato USD esperado: ${expectedDate}`);
  return expectedDate > lastDate;
}

/**
 * Actualizar solo los datos nuevos
 */
async function updateNewData() {
  console.log('🔄 Verificando actualizaciones...\n');
  
  let updated = false;
  
  // Verificar ARS
  const hasNewARS = await checkForNewARSData();
  if (hasNewARS) {
    console.log('✨ Hay nuevos datos ARS disponibles');
    console.log('Ejecuta: npx tsx scripts/fetch-real-data.ts para actualizar');
    updated = true;
  } else {
    console.log('✅ Datos ARS están actualizados');
  }
  
  console.log('');
  
  // Verificar USD
  const hasNewUSD = await checkForNewUSDData();
  if (hasNewUSD) {
    console.log('✨ Hay nuevos datos USD disponibles');
    console.log('Ejecuta: npx tsx scripts/fetch-real-data.ts para actualizar');
    updated = true;
  } else {
    console.log('✅ Datos USD están actualizados');
  }
  
  if (!updated) {
    console.log('\n✅ Todos los datos están actualizados');
  }
  
  return updated;
}

/**
 * Actualizar automáticamente si hay datos nuevos
 */
async function autoUpdate() {
  const hasNewARS = await checkForNewARSData();
  const hasNewUSD = await checkForNewUSDData();
  
  if (hasNewARS || hasNewUSD) {
    console.log('\n🔄 Ejecutando actualización automática...');
    
    try {
      // Importar y ejecutar el script de actualización
      const { execSync } = require('child_process');
      execSync('npx tsx scripts/fetch-real-data.ts', { 
        stdio: 'inherit',
        env: process.env 
      });
      
      return true;
    } catch (error) {
      console.error('❌ Error ejecutando actualización:', error);
      throw error;
    }
  }
  
  return false;
}

/**
 * Main
 */
async function main() {
  console.log('🚀 Actualización diaria de datos de inflación');
  console.log('='.repeat(60));
  console.log(`Fecha: ${new Date().toISOString()}\n`);
  
  try {
    const updated = await autoUpdate();
    
    if (!updated) {
      console.log('\n✅ No hay actualizaciones disponibles');
      console.log('Los datos están al día');
    } else {
      console.log('\n✅ Datos actualizados correctamente');
    }
    
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
