import Link from "next/link";

export const metadata = {
  title: "Términos y condiciones",
  description: "Términos y condiciones de uso de Econosfera, herramienta didáctica de economía.",
};

export default function TerminosCondicionesPage() {
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
            Términos y condiciones
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Última actualización: febrero 2025
          </p>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-slate-600 dark:text-slate-400 text-sm">
          <section>
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">1. Aceptación</h2>
            <p>
              El uso del sitio &quot;Econosfera&quot; implica la aceptación de los presentes términos y condiciones. 
              Si no estás de acuerdo con ellos, no utilices la herramienta.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">2. Objeto y uso</h2>
            <p>
              Esta herramienta tiene fines exclusivamente didácticos y de apoyo al aprendizaje en economía (inflación, 
              política monetaria, macroeconomía y microeconomía). Está dirigida a estudiantes y docentes. Los resultados 
              de los simuladores son ilustrativos y no constituyen asesoría financiera, económica ni profesional.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">3. Limitación de responsabilidad</h2>
            <p>
              Los contenidos y simulaciones se ofrecen &quot;tal cual&quot;. No se garantiza que los resultados reflejen la realidad 
              económica actual ni que estén libres de errores. La herramienta no sustituye el criterio profesional ni las 
              proyecciones o datos oficiales de bancos centrales e institutos de estadística. El usuario utiliza el sitio bajo 
              su propia responsabilidad.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">4. Propiedad intelectual</h2>
            <p>
              Los textos, diseño y funcionalidad del sitio están protegidos por las leyes aplicables. Se permite el uso 
              personal y educativo. No está permitido el uso comercial no autorizado ni la modificación o redistribución 
              del código o contenidos sin autorización.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">5. Enlaces a terceros</h2>
            <p>
              El sitio puede incluir enlaces a sitios externos (por ejemplo, Banxico, INEGI). No nos hacemos responsables 
              del contenido ni de las prácticas de privacidad de esos sitios. Te recomendamos revisar sus políticas antes 
              de proporcionar datos.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">6. Modificaciones</h2>
            <p>
              Nos reservamos el derecho de modificar estos términos y el contenido del sitio en cualquier momento. Los 
              cambios entrarán en vigor al publicarse en esta página. El uso continuado del sitio tras las modificaciones 
              implica la aceptación de los nuevos términos.
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
