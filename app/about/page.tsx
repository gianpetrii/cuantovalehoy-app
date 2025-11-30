import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="container py-12 md:py-20">
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">Acerca de la Calculadora de Inflación</h1>
          <p className="text-lg text-muted-foreground">
            Herramienta para entender el impacto real de la inflación en tu poder adquisitivo.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>¿Qué es esta herramienta?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              La Calculadora de Inflación es una herramienta que te permite calcular
              cómo la inflación afecta el valor del dinero a lo largo del tiempo,
              tanto en pesos argentinos como en dólares estadounidenses.
            </p>
            <p>
              Con esta calculadora puedes entender cuánto valdría hoy un monto del
              pasado, o comparar el poder adquisitivo entre diferentes períodos de tiempo.
              También puedes realizar conversiones entre monedas considerando tanto el
              tipo de cambio como la inflación en ambas monedas.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fuentes de Datos</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <span className="font-semibold">Inflación ARS:</span>
                <span className="text-muted-foreground">
                  Datos del INDEC (Instituto Nacional de Estadística y Censos de Argentina)
                  basados en el Índice de Precios al Consumidor (IPC).
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold">Inflación USD:</span>
                <span className="text-muted-foreground">
                  Datos del US Bureau of Labor Statistics basados en el Consumer Price
                  Index (CPI).
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold">Tipos de Cambio:</span>
                <span className="text-muted-foreground">
                  Datos históricos del Banco Central de la República Argentina (BCRA)
                  para el tipo de cambio oficial, y fuentes de mercado para el tipo
                  de cambio blue/paralelo.
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Funcionalidades</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary" />
                Cálculo de inflación para ARS y USD
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary" />
                Ajuste de valores históricos por inflación
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary" />
                Conversión entre ARS y USD
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary" />
                Tipo de cambio oficial y blue
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary" />
                Conversión con ajuste de inflación
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary" />
                Datos desde 2020 hasta la actualidad
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary" />
                Interfaz intuitiva y responsive
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary" />
                Modo oscuro/claro
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Aviso Importante</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Los datos proporcionados por esta herramienta son aproximados y tienen
              fines informativos únicamente. No constituyen asesoramiento financiero,
              contable o de inversión.
            </p>
            <p className="text-sm text-muted-foreground">
              Los cálculos se basan en datos históricos que pueden tener variaciones
              según la fuente consultada. Para decisiones financieras importantes,
              consulte con un profesional calificado.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

