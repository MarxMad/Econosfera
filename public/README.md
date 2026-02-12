# Imágenes y archivos estáticos

Coloca aquí tus archivos estáticos. Se sirven desde la raíz del sitio.

## Ejemplos

| Archivo que pones aquí     | URL para usar en el código / navegador |
|---------------------------|----------------------------------------|
| `public/logo.png`         | `/logo.png`                            |
| `public/images/logo.png` | `/images/logo.png`                     |
| `public/favicon.ico`      | `/favicon.ico`                         |

## Uso en componentes

Con `<img>`:
```jsx
<img src="/logo.png" alt="Logo" />
```

Con el componente `Image` de Next.js (recomendado):
```jsx
import Image from "next/image";

<Image src="/logo.png" alt="Logo" width={120} height={40} />
```
