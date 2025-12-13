import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="container py-12 md:py-20">
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">Acerca de CuantoValeHoy</h1>
          <p className="text-lg text-muted-foreground">
            Un proyecto personal para ayudar a entender el impacto real de la inflación en tu poder adquisitivo.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>¿Qué es esta herramienta?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              CuantoValeHoy es un proyecto personal que nació de la necesidad de entender mejor
              cómo la inflación afecta nuestro dinero día a día. Es una herramienta gratuita
              que te permite calcular el poder adquisitivo real de tu dinero a lo largo del tiempo,
              tanto en pesos argentinos como en dólares estadounidenses.
            </p>
            <p>
              Incluye calculadoras para inflación, valuación de inmuebles por m², e interés compuesto,
              todas diseñadas para ser fáciles de usar y entender, incluso si no tenés conocimientos técnicos.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>¿Por qué este proyecto?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Este proyecto es un hobbie personal con el objetivo de promover la educación financiera.
              Creo que todos deberíamos tener acceso a herramientas que nos ayuden a entender mejor
              nuestras finanzas personales y el impacto de la inflación en nuestro día a día.
            </p>
            <p>
              La educación financiera es fundamental para tomar mejores decisiones con nuestro dinero,
              y esta herramienta busca hacer ese conocimiento más accesible para todos.
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
                Calculadora de poder adquisitivo (ARS y USD)
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary" />
                Comparación con dolarización (¿convenía dolarizar?)
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary" />
                Calculadora de valor de inmuebles por m²
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary" />
                Calculadora de interés compuesto con escenarios
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary" />
                Gráficos interactivos y visualizaciones
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
            <CardTitle>Importante</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              <strong>Este es un proyecto personal de hobbie.</strong> Los datos proporcionados
              son aproximados y tienen fines educativos e informativos únicamente. No constituyen
              asesoramiento financiero, contable o de inversión.
            </p>
            <p className="text-sm text-muted-foreground">
              Los cálculos se basan en datos históricos que pueden tener variaciones
              según la fuente consultada. Para decisiones financieras importantes,
              consultá con un profesional calificado.
            </p>
            <p className="text-sm text-muted-foreground">
              Si encontrás algún error o tenés sugerencias, ¡no dudes en escribirme!
              Aunque este es un proyecto que mantengo en mi tiempo libre, siempre
              estoy abierto a recibir feedback para mejorarlo.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

