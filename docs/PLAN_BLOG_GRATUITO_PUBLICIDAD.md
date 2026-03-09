# Plan: Blog gratuito + publicidad

**Objetivo:** Sacar más provecho del blog haciéndolo gratuito, orientado a guías y tips para estudiantes de finanzas, contabilidad y economía. Monetizar con publicidad en la página principal del blog y dentro de cada artículo.

---

## 1. Cambio de estrategia

| Antes | Después |
|-------|---------|
| Blog exclusivo para suscriptores Pro/Researcher | Blog 100% gratuito, sin paywall |
| Contenido premium (análisis extensos) | Guías prácticas, tips y contenido técnico para estudiantes |
| Sin publicidad | Publicidad en página principal y en cada artículo |

**Beneficios esperados:**
- **Tráfico orgánico:** Contenido gratuito indexable mejora SEO y atrae estudiantes.
- **Embudo de conversión:** Estudiantes que encuentran guías útiles → conocen los simuladores → se registran.
- **Ingresos por ads:** AdSense o banners de afiliados monetizan el tráfico gratuito.
- **Autoridad:** Posicionar Econosfera como recurso educativo de referencia.

---

## 2. Enfoque de contenido: guías y tips para estudiantes

### Pilares de contenido

1. **Cómo usar los simuladores**
   - Guía paso a paso del simulador de inflación (tasa real, poder adquisitivo).
   - Cómo interpretar el simulador IS-LM.
   - Uso del simulador DCF para valuación.
   - Regla de Taylor: qué hace cada variable y cómo leer los resultados.
   - Simulador de oferta y demanda: ejemplos prácticos.

2. **Teoría aplicada**
   - Conceptos que aparecen en exámenes: brecha de producto, NAIRU, curva de Phillips.
   - Fórmulas clave con ejemplos numéricos (multiplicador, VPN, TIR).
   - Diferencias entre inflación subyacente y general (con datos INEGI).

3. **Problemas técnicos que enfrentan estudiantes**
   - Cómo leer una minuta de Banxico (estructura, qué buscar).
   - Interpretar un intervalo de confianza y un p-valor.
   - Fuentes de datos: INEGI, Banxico, FRED.
   - Errores frecuentes en regresión (multicolinealidad, heterocedasticidad).

4. **Por carrera**
   - **Finanzas:** DCF, CAPM, duration, Black-Scholes.
   - **Contabilidad:** Punto de equilibrio, razones financieras, flujo de efectivo.
   - **Economía:** IS-LM, política monetaria, brecha de producto.

### Formato sugerido

- **Extensión:** 800–2.000 palabras (5–10 min lectura).
- **Tono:** Didáctico, directo, con ejemplos.
- **Elementos:** Capturas del simulador, fórmulas en cajas, enlaces al glosario y a los simuladores.
- **CTA:** "Pruébalo en Econosfera" al final de cada guía.

---

## 3. Publicidad: dónde y cómo

### Ubicaciones

| Ubicación | Formato | Componente |
|-----------|---------|------------|
| **Página principal del blog** (`/blog`) | Banner horizontal (728x90) o responsive | Nuevo: `BlogAdBanner` |
| **Artículos individuales** (`/blog/[slug]`) | Banner después del header / antes del contenido | Nuevo: `BlogAdBanner` en el layout del artículo |
| **Dentro del artículo** | Banner o rectángulo (300x250) a mitad del contenido | Entre párrafos o después de la primera sección |

### Opciones de monetización

1. **Google AdSense** (si está aprobado)
   - Crear unidades específicas para blog: `NEXT_PUBLIC_ADSENSE_SLOT_BLOG_1`, `NEXT_PUBLIC_ADSENSE_SLOT_BLOG_2`.
   - Formato responsive o `rectangle` para dentro del artículo.

2. **Banners de afiliados** (XM, broker)
   - Reutilizar lógica de `GlosarioAdBanner`: si no hay AdSense, mostrar XM o affiliate.
   - Crear `BlogAdBanner` similar a `GlosarioAdBanner`.

3. **Placeholder** (desarrollo)
   - Mientras no hay ads configurados, mostrar bloque con "Publicidad" para reservar espacio.

---

## 4. Checklist de implementación

### Fase 1: Quitar el paywall

- [ ] **`src/app/blog/page.tsx`:** Eliminar la comprobación `if (!isPremium) return <BlogPaywall />`. Mostrar siempre el listado de posts.
- [ ] **`src/app/blog/[slug]/page.tsx`:** Eliminar la comprobación `if (!isPremium) return <BlogPaywall forArticle />`. Mostrar siempre el contenido del artículo.
- [ ] **Opcional:** Mantener `BlogPaywall` en el código por si se quiere usar en otro contexto; o eliminarlo si ya no se usa.

### Fase 2: Crear componente de publicidad para blog

- [ ] **Crear `src/components/blog/BlogAdBanner.tsx`:**
  - Similar a `GlosarioAdBanner`.
  - Props: `slotId` (opcional), `format` (leaderboard, rectangle), `label`.
  - Prioridad: AdSense → XM/affiliate → placeholder.
  - Soporte para formato `rectangle` (300x250) para dentro del artículo.

- [ ] **Añadir variables de entorno** (en `src/lib/ads.ts` o documentar en README):
  ```
  NEXT_PUBLIC_ADSENSE_SLOT_BLOG_1=   # Banner página principal
  NEXT_PUBLIC_ADSENSE_SLOT_BLOG_2=   # Banner dentro de artículos
  ```

### Fase 3: Integrar publicidad en las páginas

- [ ] **`/blog` (página principal):**
  - Añadir `<BlogAdBanner />` debajo del header (título y descripción).
  - Opcional: otro banner al final, antes del footer.

- [ ] **`/blog/[slug]` (artículo individual):**
  - Añadir `<BlogAdBanner format="leaderboard" />` después del header del artículo (fecha, autor) y antes del contenido.
  - Añadir `<BlogAdBanner format="rectangle" />` a mitad del contenido (por ejemplo, después del primer bloque de párrafos o entre secciones H2). Para esto puede ser necesario modificar `blogContent.tsx` para insertar un componente de anuncio, o usar un wrapper que inyecte el anuncio cada N párrafos.

### Fase 4: Ajustes de contenido y SEO

- [ ] **Actualizar metadata** del blog: descripción orientada a "guías gratuitas para estudiantes".
- [ ] **Añadir categoría** `guia` o `tips` en `BlogCategory` si se desea filtrar por tipo.
- [ ] **Crear primeros artículos** siguiendo el enfoque de guías (ver `docs/BLOG_TEMAS_ARTICULOS.md` y adaptar temas a formato "cómo usar" o "guía paso a paso").

---

## 5. Estructura de archivos a crear/modificar

```
src/
├── app/
│   └── blog/
│       ├── page.tsx          # Quitar paywall, añadir BlogAdBanner
│       └── [slug]/
│           └── page.tsx      # Quitar paywall, añadir BlogAdBanner(s)
├── components/
│   └── blog/
│       ├── BlogAdBanner.tsx  # NUEVO: banner de publicidad para blog
│       └── BlogPaywall.tsx   # Mantener o eliminar
└── lib/
    └── ads.ts               # Añadir ADSENSE_SLOT_BLOG_1, ADSENSE_SLOT_BLOG_2
```

---

## 6. Ejemplo de integración

### Página principal del blog

```tsx
// src/app/blog/page.tsx
export default async function BlogPage() {
  const posts = getBlogPosts();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-6xl mx-auto px-4 py-10 sm:py-14">
        <header>...</header>

        {/* Banner de publicidad - visible para todos */}
        <BlogAdBanner label="Publicidad" />

        <ul className="grid gap-6 ...">
          {posts.map((post) => (...))}
        </ul>
      </div>
    </div>
  );
}
```

### Artículo individual

```tsx
// src/app/blog/[slug]/page.tsx
return (
  <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
    <article className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
      <nav>...</nav>
      <header>...</header>

      {/* Banner antes del contenido */}
      <BlogAdBanner slotId={process.env.NEXT_PUBLIC_ADSENSE_SLOT_BLOG_2} format="leaderboard" label="Publicidad" />

      <div className="prose ...">
        {ContentComponent && <ContentComponent />}
      </div>

      {/* Opcional: banner al final */}
      <BlogAdBanner format="rectangle" label="Publicidad" />

      <footer>...</footer>
    </article>
  </div>
);
```

---

## 7. Ideas de artículos para el nuevo enfoque

| Título | Categoría | Enfoque |
|--------|-----------|---------|
| Cómo usar el simulador de Regla de Taylor en 5 minutos | política-monetaria | Guía paso a paso |
| Guía del simulador IS-LM: qué hace cada variable | macroeconomia | Uso del simulador |
| DCF paso a paso: flujos, WACC y valor terminal | finanzas | Teoría aplicada |
| Cómo leer una minuta de Banxico (guía por secciones) | politica-monetaria | Tips para estudiantes |
| Punto de equilibrio: fórmula y ejemplo con el simulador | finanzas / contadores | Guía + simulador |
| Interpretar un p-valor sin morir en el intento | metodologia | Problema técnico |
| Fuentes de datos para economistas: INEGI, Banxico, FRED | datos | Recursos |
| Inflación subyacente vs general: qué es y por qué importa | politica-monetaria | Teoría |
| Errores frecuentes al hacer una regresión lineal | metodologia | Tips técnicos |

---

## 8. Métricas a seguir

- **Tráfico:** Visitas a `/blog` y a `/blog/[slug]`.
- **Tiempo en página:** Engagement con el contenido.
- **Conversión:** Clics a "Ir al simulador" o registro desde el blog.
- **Ingresos por ads:** Impresiones, CTR, RPM (si AdSense).

---

*Documento creado para guiar la transición del blog a modelo gratuito con monetización por publicidad.*
