export default function PrivacyPage() {
  return (
    <div className="container py-12 md:py-20">
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">Política de Privacidad</h1>
          <p className="text-muted-foreground">
            Última actualización: {new Date().toLocaleDateString("es-ES")}
          </p>
        </div>

        <div className="space-y-6">
          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">1. Información que recopilamos</h2>
            <p className="text-muted-foreground">
              Recopilamos información que nos proporcionas directamente cuando
              creas una cuenta, utilizas nuestros servicios o te comunicas con
              nosotros. Esto puede incluir:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>Nombre y dirección de correo electrónico</li>
              <li>Información de perfil</li>
              <li>Contenido que creas o compartes</li>
              <li>Comunicaciones con nosotros</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">2. Cómo usamos tu información</h2>
            <p className="text-muted-foreground">
              Utilizamos la información que recopilamos para:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>Proporcionar, mantener y mejorar nuestros servicios</li>
              <li>Procesar transacciones y enviarte información relacionada</li>
              <li>Enviarte comunicaciones técnicas y actualizaciones</li>
              <li>Responder a tus comentarios y preguntas</li>
              <li>Proteger contra fraude y abuso</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">3. Compartir información</h2>
            <p className="text-muted-foreground">
              No compartimos tu información personal con terceros excepto en las
              siguientes circunstancias:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>Con tu consentimiento</li>
              <li>Para cumplir con obligaciones legales</li>
              <li>Para proteger nuestros derechos y seguridad</li>
              <li>Con proveedores de servicios que nos ayudan a operar</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">4. Seguridad</h2>
            <p className="text-muted-foreground">
              Tomamos medidas razonables para proteger tu información personal
              contra pérdida, robo, uso indebido y acceso no autorizado.
              Utilizamos Firebase Authentication y seguimos las mejores
              prácticas de seguridad.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">5. Tus derechos</h2>
            <p className="text-muted-foreground">
              Tienes derecho a:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>Acceder a tu información personal</li>
              <li>Corregir información inexacta</li>
              <li>Solicitar la eliminación de tu información</li>
              <li>Oponerte al procesamiento de tu información</li>
              <li>Exportar tus datos</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">6. Cookies</h2>
            <p className="text-muted-foreground">
              Utilizamos cookies y tecnologías similares para mejorar tu
              experiencia, analizar el uso del sitio y personalizar el
              contenido.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">7. Cambios a esta política</h2>
            <p className="text-muted-foreground">
              Podemos actualizar esta política de privacidad ocasionalmente. Te
              notificaremos sobre cambios significativos publicando la nueva
              política en esta página.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold">8. Contacto</h2>
            <p className="text-muted-foreground">
              Si tienes preguntas sobre esta política de privacidad, contáctanos
              en: contacto@baseapp.com
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

