# Plan de indexación SEO del glosario de conceptos

**Estado:** Implementado (tareas 1–8). Build en verde. Tras desplegar, ejecutar tarea 9 (validar JSON-LD y enviar sitemap en Search Console).

---

**Objetivo:** Que cada concepto del glosario tenga una URL propia indexable en Google y aparezca en resultados de búsqueda para consultas como "qué es inflación subyacente", "definición de PIB", "Regla de Taylor", etc.

**Estado actual:** Una sola página `/glosario` con todos los términos; el contenido se filtra en el cliente. Google indexa solo esa URL, no cada concepto por separado.

---

## 1. Estrategia de URLs

| Aspecto | Decisión |
|--------|----------|
| **Estructura** | Una URL por término: `/glosario/[slug]` |
| **Slug** | Derivado del nombre del término: minúsculas, sin acentos, espacios → guiones. Ej: `Inflación subyacente` → `inflacion-subyacente` |
| **Canonical** | Cada página de término tendrá `canonical: /glosario/[slug]` para evitar duplicados |
| **Página índice** | `/glosario` sigue siendo el listado/buscador; enlaza a cada término |

**Reglas para el slug:**
- Normalizar: `trim`, minúsculas, reemplazar secuencias de espacios por un guión.
- Eliminar o mapear caracteres especiales: á→a, é→e, ñ→n, etc. (o mantener ñ si la URL es UTF-8).
- Eliminar paréntesis y su contenido para el slug si se desea consistencia (ej. "UPA / EPS" → `upa-eps`).
- Garantizar unicidad: si dos términos generan el mismo slug, añadir sufijo (ej. `-macro`, `-2`) o usar un id numérico estable.

**Ejemplos de URLs objetivo:**
- `/glosario/inflacion-subyacente`
- `/glosario/regla-de-taylor`
- `/glosario/pib`
- `/glosario/curva-is`
- `/glosario/desviacion-estandar`

---

## 2. Implementación técnica (Next.js App Router)

### 2.1 Crear ruta dinámica por término

- **Ruta:** `src/app/glosario/[slug]/page.tsx`
- **Contenido:** Página que recibe `params.slug`, resuelve el término desde `glosario.ts` (por slug) y renderiza:
  - Título H1: nombre del término
  - Categoría (módulo) como etiqueta
  - Definición (párrafo)
  - Fórmula (si existe) en bloque destacado
  - Ejemplo (si existe)
  - Breadcrumb: Inicio > Glosario > [Término]
  - Enlace “Ver todos los términos” → `/glosario`
  - Enlaces a términos relacionados (opcional: mismo módulo o términos que aparecen en la definición)

### 2.2 Función de slug y resolución

- Añadir en `src/lib/glosario.ts` (o en `src/lib/glosarioSeo.ts`):
  - `terminoToSlug(termino: string): string` — genera slug a partir del nombre.
  - `getTerminoBySlug(slug: string): TerminoGlosario | null` — busca en `TERMINOS` por slug (precomputar un `Map<slug, termino>` o recorrer y comparar).
  - Exportar `getTodosLosSlugs(): string[]` para `generateStaticParams` y sitemap.

- Al construir el slug, asegurar que sea estable (misma entrada siempre genera el mismo slug) y que no haya colisiones; si las hay, asignar slugs únicos (ej. añadiendo el módulo o un id).

### 2.3 Generación estática (SSG)

- En `src/app/glosario/[slug]/page.tsx` usar `generateStaticParams()` que devuelva `getTodosLosSlugs().map(slug => ({ slug }))`.
- Así todas las páginas de términos se pre-renderizan en build y Google recibe HTML completo por URL.

### 2.4 Página 404 para términos inexistentes

- Si `getTerminoBySlug(slug)` es `null`, mostrar `notFound()` de Next.js para devolver 404 y no indexar URLs inválidas.

---

## 3. Metadatos por página de término

Para cada `/glosario/[slug]` definir `metadata` (o `generateMetadata`) con:

| Campo | Origen | Ejemplo |
|-------|--------|--------|
| **title** | `{termino.termino} | Glosario Económico` o `Qué es {termino} - Definición \| Econosfera` | "Inflación subyacente \| Glosario Económico" |
| **description** | Primeros ~155 caracteres de `termino.definicion` (recortar en palabra completa) | Texto de la definición sin cortar a mitad de palabra. |
| **keywords** | Término, módulo, 2–3 términos relacionados (ej. inflación, Banxico, INPC) | ["inflación subyacente", "INPC", "meta de inflación"] |
| **openGraph** | title, description, url: `/glosario/[slug]`, type: "article" o "website" | Para compartir en redes. |
| **canonical** | `alternates.canonical`: URL absoluta de la página (usar `NEXT_PUBLIC_SITE_URL` o dominio de prod). | Evita contenido duplicado. |
| **robots** | `index, follow` (por defecto); solo cambiar si se quiere no indexar algún término concreto. | — |

Objetivo: que el snippet de Google muestre título y descripción útiles y que la URL sea clara y estable.

---

## 4. Datos estructurados (JSON-LD) para SEO

Incluir en cada página de término un script JSON-LD para que Google pueda mostrar resultados enriquecidos (definición, glosario).

### 4.1 Esquema recomendado: `DefinedTerm` (Schema.org)

- Tipo: `DefinedTerm` dentro de `DefinedTermSet` (el glosario).
- Campos útiles:
  - `name`: nombre del término.
  - `description`: la definición completa.
  - `inDefinedTermSet`: referencia al `DefinedTermSet` (nombre "Glosario Económico Econosfera", url del sitio).
  - `termCode`: opcional; podría ser el slug.

Ejemplo mínimo por término:

```json
{
  "@context": "https://schema.org",
  "@type": "DefinedTerm",
  "name": "Inflación subyacente",
  "description": "Indicador de precios que excluye los componentes más volátiles del INPC...",
  "inDefinedTermSet": {
    "@type": "DefinedTermSet",
    "name": "Glosario de Términos Económicos",
    "url": "https://econosfera.vercel.app/glosario"
  }
}
```

- Inyectar en la página con `<script type="application/ld+json">` (en el layout de la página o en el componente de la ruta `[slug]`).
- Alternativa: si Google admite mejor el tipo **Glossary** o **FAQPage** para listas de definiciones, se puede añadir además una página `/glosario` con un único JSON-LD que liste todos los términos como `DefinedTerm` dentro de un `DefinedTermSet`; para las páginas individuales, `DefinedTerm` por término es suficiente.

---

## 5. Sitemap

- **Incluir todas las URLs de términos** en el sitemap para que Google las descubra.
- Opciones:
  - **A)** Ampliar `src/app/sitemap.ts`: construir la lista de slugs desde `getTodosLosSlugs()` y añadir entradas `{ url: `${base}/glosario/${slug}`, lastModified, changeFrequency: "monthly", priority: 0.7 }`.  
    Nota: Sitemaps de Next.js suelen tener un límite práctico (50k URLs); con ~130 términos no hay problema.
  - **B)** Sitemap index: `sitemap.xml` con un enlace a `sitemap-glosario.xml` y en otra ruta (o función) generar solo las URLs de `/glosario` y `/glosario/[slug]`.  
  Para este proyecto, **A)** es suficiente.

- Mantener la entrada actual de `/glosario` con `priority` algo mayor (ej. 0.85) que las de términos (ej. 0.7).

---

## 6. Enlaces internos

- **Desde la página índice `/glosario`:**
  - En el listado de resultados, hacer que cada término sea un enlace a `/glosario/[slug]` (no solo un bloque div). Así cada concepto tiene al menos un enlace interno desde una página fuerte.

- **Desde el simulador:**
  - Donde ya se mencione un concepto (tooltips, ayudas, resultados), enlazar a `/glosario/[slug]` cuando tenga sentido (ej. “Ver definición de inflación subyacente”).

- **Desde otras páginas:**
  - En `/manual`, `/pricing` o textos informativos, enlazar a 2–3 términos clave (ej. “política monetaria”, “PIB”) a sus URLs del glosario.

- **En la página del término:**
  - Enlace “Ver todos los términos” a `/glosario`.
  - Opcional: “Términos relacionados” (mismo módulo) con enlaces a sus slugs.

Objetivo: que el contenido del glosario quede bien conectado y que las páginas de términos reciban enlaces internos desde páginas con más autoridad.

---

## 7. Contenido y buenas prácticas on-page

- **Una sola H1** por página: el nombre del término.
- **Estructura:** H1 > definición (párrafo) > fórmula (si existe, en `<figure>` o sección con encabezado) > ejemplo (si existe).
- **Texto visible:** La definición, fórmula y ejemplo deben estar en HTML visible (no solo en JSON-LD); el crawler debe ver el mismo contenido que el usuario.
- **Velocidad y Core Web Vitals:** Las páginas son estáticas (SSG); mantener sin bloqueos de JS innecesarios en contenido above-the-fold.
- **Móvil:** Misma URL que escritorio; diseño responsive (ya aplicado en el proyecto).
- **Idioma:** Marcar `lang="es"` en el layout; las páginas del glosario son español.

---

## 8. Robots y crawling

- **robots.txt:** Mantener `allow: /`; no bloquear `/glosario` ni `/glosario/*`. Incluir `sitemap` con la URL del sitemap (ya está).
- **No indexar:** No poner `noindex` en las páginas de términos salvo que haya una razón (ej. borrador o término deprecado); en ese caso usar `robots: { index: false }` en metadata de esa ruta.

---

## 9. Validación y monitoreo

- **Antes de publicar:**
  - Probar varias URLs `/glosario/[slug]` (términos con acentos, espacios, paréntesis).
  - Comprobar que `generateStaticParams` incluye todos los términos y que no hay 404 en build.
  - Validar un ejemplo de JSON-LD en [Google Rich Results Test](https://search.google.com/test/rich-results) o en [Schema.org Validator](https://validator.schema.org/).
  - Revisar que el sitemap generado liste todas las URLs de términos y que no haya rotas.

- **Después de desplegar:**
  - En Google Search Console: enviar sitemap actualizado; revisar “Cobertura” o “Pages” para que las URLs del glosario pasen a “Indexed” con el tiempo.
  - Consultas de ejemplo en Google: “qué es [término]”, “[término] definición”, “[término] economía” y comprobar si aparece la página del glosario.
  - Opcional: enlazar desde un blog o redes a 2–3 términos clave para dar señales de relevancia.

---

## 10. Resumen de tareas (checklist)

| # | Tarea | Prioridad | Estado |
|---|--------|-----------|--------|
| 1 | Añadir `terminoToSlug`, `getTerminoBySlug`, `getTodosLosSlugs` (en glosario.ts o módulo SEO). | Alta | ✅ Hecho |
| 2 | Crear `src/app/glosario/[slug]/page.tsx` con SSG, contenido del término y `notFound()` si no existe. | Alta | ✅ Hecho |
| 3 | Añadir `generateMetadata` (o `metadata`) por término: title, description, keywords, openGraph, canonical. | Alta | ✅ Hecho |
| 4 | Incluir JSON-LD `DefinedTerm` en la página del término. | Media | ✅ Hecho |
| 5 | Ampliar `sitemap.ts` con todas las URLs `/glosario/[slug]`. | Alta | ✅ Hecho |
| 6 | En el componente Glosario (listado), convertir cada término en enlace a `/glosario/[slug]`. | Alta | ✅ Hecho |
| 7 | Añadir breadcrumb (y opcionalmente BreadcrumbList en JSON-LD) en la página del término. | Media | ✅ Hecho |
| 8 | Opcional: enlaces desde simulador/manual a términos concretos. | Baja | ✅ Hecho (manual: Regla de Taylor, DCF, glosario) |
| 9 | Validar JSON-LD y sitemap; enviar sitemap en Search Console tras el deploy. | Alta | Pendiente (post-deploy) |

Con esto, cada concepto del glosario queda asociado a una URL única, con metadatos y datos estructurados adecuados para que Google las indexe y las muestre en resultados de búsqueda (SEO).
