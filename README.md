# Simulador de Inflación y Política Monetaria

Herramienta web para estimar efectos inflacionarios y analizar la postura de política monetaria (expansiva / neutral / restrictiva). Pensada para uso en equipo.

## Qué hace

- **Variables**: inflación general, inflación subyacente, tasa de política, meta de inflación, brecha de producto, crecimiento del PIB y tipo de política.
- **Resultados**: tasa real ex post y ex ante, brechas de inflación vs meta, tasa de Taylor de referencia y desviación respecto a la tasa actual.
- **Gráficos**: comparación de inflación vs meta y de tasas de interés.

## Cómo usar

1. Instalar dependencias: `npm install`
2. Arrancar en desarrollo: `npm run dev`
3. Abrir [http://localhost:3000](http://localhost:3000)

Para compilar para producción: `npm run build` y luego `npm start`.

### Si ves errores "Cannot find module './174.js'" o "middleware-manifest.json"

La carpeta `.next` puede quedar desincronizada. Haz un **reinicio limpio**:

```bash
npm run fresh
npm run dev
```

`npm run fresh` borra `.next` y la caché, y vuelve a compilar. Luego `npm run dev` arranca con un build coherente.

## Despliegue en Vercel

El proyecto está listo para desplegar en [Vercel](https://vercel.com):

1. Sube el repositorio a GitHub (o conéctalo desde Vercel).
2. En Vercel, **Import** el proyecto; detectará Next.js y usará `npm run build` por defecto.
3. Despliega. No hace falta `vercel.json` para una app Next.js estándar.

Opcional: si usas un **dominio propio**, define en Vercel la variable de entorno `NEXT_PUBLIC_SITE_URL` (ej. `https://tudominio.com`) para que los enlaces de Open Graph y las citas usen esa URL. Si no la defines, Vercel usa automáticamente `VERCEL_URL` (tu app en `*.vercel.app`).

## Tecnologías

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Recharts

## Publicidad (Google AdSense)

El sitio está preparado para mostrar anuncios en dos posiciones: un **banner horizontal** debajo de la navegación y un **bloque lateral** (rectángulo) en la sección de inflación en pantallas grandes.

- Sin configurar: se ven **placeholders** grises para que el diseño ya reserve el espacio.
- Para activar anuncios reales:
  1. Regístrate en [Google AdSense](https://www.google.com/adsense/) y solicita la aprobación para tu dominio.
  2. Crea en AdSense las unidades de anuncio que quieras (p. ej. display responsive y rectángulo 300×250) y anota el **ID del anunciante** (`ca-pub-...`) y los **ID de cada slot**.
  3. Crea un archivo `.env.local` en la raíz del proyecto (puedes basarte en `.env.example`) y define:
     - `NEXT_PUBLIC_ADS_ENABLED=true`
     - `NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-XXXXXXXXXXXXXXXX` (tu ID de editor).
  4. En el código, asigna a cada `<AdSlot>` el `slotId` correspondiente (en `src/app/page.tsx` y, si añades más, en los componentes donde uses `<AdSlot />`).

No incluyas claves ni IDs sensibles en el repositorio; usa solo variables de entorno.

## Nota

Herramienta de apoyo al análisis. No sustituye el criterio profesional ni las proyecciones oficiales del banco central.
