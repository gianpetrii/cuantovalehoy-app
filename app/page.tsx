"use client";

import { InflationCalculatorEnhanced } from "@/components/inflation/inflation-calculator-enhanced";
import { RealEstateCalculator } from "@/components/real-estate/real-estate-calculator";
import { CompoundInterestCalculator } from "@/components/investment/compound-interest-calculator";
import { TrendingUp, Calculator, Info, Home, PiggyBank, Wallet } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="container flex flex-col items-center justify-center gap-4 py-12 md:py-20">
        <div className="flex max-w-[980px] flex-col items-center gap-4 text-center">
          <h1 className="text-4xl font-extrabold leading-tight tracking-tighter md:text-5xl lg:text-6xl">
            ¿Cuánto Vale{" "}
            <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Hoy?
            </span>
          </h1>
          <p className="max-w-[700px] text-lg text-muted-foreground sm:text-xl">
            Calculadoras financieras para entender tu poder adquisitivo,
            valorar inmuebles y proyectar inversiones. Todo en un solo lugar.
          </p>
        </div>
      </section>

      {/* Info Cards */}
      <section className="container pb-8">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
          <Card>
            <CardContent className="flex flex-col items-center gap-2 p-6 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Wallet className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-bold">Poder Adquisitivo</h3>
              <p className="text-sm text-muted-foreground">
                Calcula cómo cambia el valor de tu dinero en ARS y USD
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex flex-col items-center gap-2 p-6 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Home className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-bold">Inmuebles</h3>
              <p className="text-sm text-muted-foreground">
                Valora propiedades por metro cuadrado
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex flex-col items-center gap-2 p-6 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <PiggyBank className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-bold">Interés Compuesto</h3>
              <p className="text-sm text-muted-foreground">
                Proyecta el crecimiento de tus ahorros e inversiones
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Calculators Section */}
      <section className="container pb-12">
        <div className="mx-auto max-w-6xl">
          <Tabs defaultValue="purchasing-power" className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList className="grid w-full max-w-2xl grid-cols-3">
                <TabsTrigger value="purchasing-power" className="flex items-center gap-2">
                  <Wallet className="h-4 w-4" />
                  <span className="hidden sm:inline">Poder Adquisitivo</span>
                </TabsTrigger>
                <TabsTrigger value="real-estate" className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  <span className="hidden sm:inline">Inmuebles</span>
                </TabsTrigger>
                <TabsTrigger value="investment" className="flex items-center gap-2">
                  <PiggyBank className="h-4 w-4" />
                  <span className="hidden sm:inline">Interés Compuesto</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="purchasing-power">
              <InflationCalculatorEnhanced />
            </TabsContent>

            <TabsContent value="real-estate">
              <RealEstateCalculator />
            </TabsContent>

            <TabsContent value="investment">
              <CompoundInterestCalculator />
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Info Section */}
      <section className="border-t bg-muted/50">
        <div className="container py-12">
          <div className="mx-auto max-w-4xl space-y-6">
            <div className="flex items-start gap-4">
              <Info className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
              <div className="space-y-2">
                <h3 className="text-xl font-bold">¿Cómo funciona?</h3>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    <strong>💰 Calculadora de Poder Adquisitivo:</strong> Ajusta un monto histórico
                    considerando la inflación acumulada entre dos fechas. Incluye gráficos
                    de evolución temporal y medidores visuales para entender el impacto real.
                    También compara si convenía dolarizar tu dinero en el pasado.
                  </p>
                  <p>
                    <strong>🏠 Calculadora de Inmuebles:</strong> Calcula el valor de propiedades
                    normalizando por metro cuadrado. Fundamental para comparar correctamente y
                    saber si ganaste o perdiste valor real al vender.
                  </p>
                  <p>
                    <strong>📈 Calculadora de Inversiones:</strong> Proyecta el crecimiento de
                    tu dinero con interés compuesto y compáralo automáticamente con la inflación
                    para saber si realmente estás ganando poder adquisitivo.
                  </p>
                  <p className="text-sm pt-2 border-t">
                    <strong>📊 Fuentes de datos:</strong> INDEC (inflación ARS), US Bureau of Labor Statistics (inflación USD),
                    BCRA (tipos de cambio). Todos los cálculos incluyen tooltips explicativos y gráficos interactivos
                    para facilitar la comprensión.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

