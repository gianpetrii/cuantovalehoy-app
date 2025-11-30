export default function TermsPage() {
  return (
    <div className="container py-12 md:py-20">
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">Términos y Condiciones</h1>
          <p className="text-muted-foreground">
            Última actualización: {new Date().toLocaleDateString("es-ES")}
          </p>
        </div>

        <div className="space-y-6">
          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">1. Aceptación de términos</h2>
            <p className="text-muted-foreground">
              Al acceder y utilizar Base App, aceptas estar sujeto a estos
              términos y condiciones. Si no estás de acuerdo con alguna parte de
              estos términos, no debes usar nuestra aplicación.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">2. Uso del servicio</h2>
            <p className="text-muted-foreground">
              Te otorgamos una licencia limitada, no exclusiva, no transferible
              y revocable para usar Base App de acuerdo con estos términos.
            </p>
            <p className="text-muted-foreground">Te comprometes a:</p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>Proporcionar información precisa y actualizada</li>
              <li>Mantener la seguridad de tu cuenta</li>
              <li>No usar el servicio para actividades ilegales</li>
              <li>No intentar acceder sin autorización a nuestros sistemas</li>
              <li>No interferir con el funcionamiento del servicio</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">3. Cuentas de usuario</h2>
            <p className="text-muted-foreground">
              Eres responsable de mantener la confidencialidad de tu cuenta y
              contraseña. Aceptas la responsabilidad de todas las actividades que
              ocurran bajo tu cuenta.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">4. Contenido del usuario</h2>
            <p className="text-muted-foreground">
              Conservas todos los derechos sobre el contenido que publicas en
              Base App. Al publicar contenido, nos otorgas una licencia mundial,
              no exclusiva y libre de regalías para usar, modificar y mostrar ese
              contenido en relación con el servicio.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">5. Propiedad intelectual</h2>
            <p className="text-muted-foreground">
              Base App y su contenido original, características y funcionalidad
              son propiedad exclusiva de Base App y están protegidos por leyes
              internacionales de derechos de autor, marcas registradas y otras
              leyes de propiedad intelectual.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">6. Terminación</h2>
            <p className="text-muted-foreground">
              Podemos terminar o suspender tu cuenta inmediatamente, sin previo
              aviso, por cualquier motivo, incluyendo si violas estos términos.
              Puedes cancelar tu cuenta en cualquier momento.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">7. Limitación de responsabilidad</h2>
            <p className="text-muted-foreground">
              En ningún caso Base App, sus directores, empleados o afiliados
              serán responsables de daños indirectos, incidentales, especiales,
              consecuentes o punitivos resultantes del uso o la imposibilidad de
              usar el servicio.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">8. Cambios a los términos</h2>
            <p className="text-muted-foreground">
              Nos reservamos el derecho de modificar estos términos en cualquier
              momento. Te notificaremos sobre cambios significativos. El uso
              continuado del servicio después de los cambios constituye la
              aceptación de los nuevos términos.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">9. Ley aplicable</h2>
            <p className="text-muted-foreground">
              Estos términos se regirán e interpretarán de acuerdo con las leyes
              aplicables, sin tener en cuenta sus disposiciones sobre conflictos
              de leyes.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">10. Contacto</h2>
            <p className="text-muted-foreground">
              Si tienes preguntas sobre estos términos, contáctanos en:
              contacto@baseapp.com
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

