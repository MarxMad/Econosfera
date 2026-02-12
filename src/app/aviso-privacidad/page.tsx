import Link from "next/link";

export const metadata = {
  title: "Aviso de privacidad",
  description: "Aviso de privacidad de Econosfera, herramienta didáctica de economía.",
};

export default function AvisoPrivacidadPage() {
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950">
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50">
        <div className="max-w-3xl mx-auto px-4 py-6">
          <Link
            href="/"
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline mb-2 inline-block"
          >
            ← Volver al inicio
          </Link>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            Aviso de privacidad
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Última actualización: febrero 2025
          </p>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-slate-600 dark:text-slate-400 text-sm">
          <section>
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">1. Responsable</h2>
            <p>
              La herramienta didáctica &quot;Econosfera&quot; es un sitio web orientado al apoyo educativo. 
              No recopilamos ni almacenamos datos personales identificables. Los únicos datos que se guardan en tu dispositivo 
              son los de preferencia de cookies (aceptación del banner) y, si el sitio lo utilizara en el futuro, preferencias 
              de visualización, en tu navegador (localStorage).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">2. Datos que se recaban</h2>
            <p>
              En la versión actual no se recaban datos personales. El sitio puede utilizar cookies técnicas o de preferencias 
              (por ejemplo, para recordar que aceptaste el aviso de cookies). No se utilizan cookies de publicidad ni de 
              seguimiento sin tu consentimiento.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">3. Finalidad</h2>
            <p>
              Cualquier dato almacenado localmente tiene como finalidad el correcto funcionamiento del sitio y la mejora de 
              la experiencia de uso (por ejemplo, recordar que ya aceptaste las cookies).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">4. Tus derechos</h2>
            <p>
              Puedes eliminar en cualquier momento los datos almacenados en tu navegador (cookies, localStorage) desde la 
              configuración de tu navegador. Si en el futuro se recabaran datos personales, tendrás derecho a acceder, 
              rectificar, cancelar u oponerte a su tratamiento, conforme a la legislación aplicable.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">5. Contacto</h2>
            <p>
              Para cualquier duda sobre este aviso de privacidad, puedes contactar a través del medio que se indique 
              en el sitio (por ejemplo, institución educativa o responsable del proyecto).
            </p>
          </section>
        </div>

        <p className="mt-8">
          <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
            ← Volver al inicio
          </Link>
        </p>
      </main>
    </div>
  );
}
