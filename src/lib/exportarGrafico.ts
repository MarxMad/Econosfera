/** Utilidades para exportar gráficos como PNG */

export async function exportarGraficoComoPNG(
  elementoId: string,
  nombreArchivo: string = "grafico.png"
): Promise<void> {
  const elemento = document.getElementById(elementoId);
  if (!elemento) {
    throw new Error(`Elemento con id "${elementoId}" no encontrado`);
  }

  // Buscar el SVG dentro del elemento
  const svg = elemento.querySelector("svg");
  if (!svg) {
    throw new Error("No se encontró un SVG en el elemento");
  }

  // Obtener el contenido SVG como string
  const svgData = new XMLSerializer().serializeToString(svg);
  const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
  const svgUrl = URL.createObjectURL(svgBlob);

  // Crear una imagen y cargar el SVG
  const img = new Image();
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("No se pudo obtener el contexto del canvas");
  }

  return new Promise((resolve, reject) => {
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Error al crear el blob"));
          return;
        }
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = nombreArchivo;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        URL.revokeObjectURL(svgUrl);
        resolve();
      }, "image/png");
    };

    img.onerror = () => {
      URL.revokeObjectURL(svgUrl);
      reject(new Error("Error al cargar la imagen SVG"));
    };

    img.src = svgUrl;
  });
}

/** Obtiene el gráfico como data URL (para incrustar en PDF u otro uso). */
export function getGraficoAsDataUrl(elementoId: string): Promise<string> {
  const elemento = document.getElementById(elementoId);
  if (!elemento) return Promise.reject(new Error(`Elemento no encontrado: ${elementoId}`));
  const svg = elemento.querySelector("svg");
  if (!svg) return Promise.reject(new Error("No se encontró SVG en el elemento"));

  const svgData = new XMLSerializer().serializeToString(svg);
  const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
  const svgUrl = URL.createObjectURL(svgBlob);
  const img = new Image();
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    URL.revokeObjectURL(svgUrl);
    return Promise.reject(new Error("No se pudo obtener contexto del canvas"));
  }

  return new Promise((resolve, reject) => {
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      const dataUrl = canvas.toDataURL("image/png");
      URL.revokeObjectURL(svgUrl);
      resolve(dataUrl);
    };
    img.onerror = () => {
      URL.revokeObjectURL(svgUrl);
      reject(new Error("Error al cargar la imagen SVG"));
    };
    img.src = svgUrl;
  });
}

/** Versión simplificada usando html2canvas si está disponible, o método SVG */
export async function exportarElementoComoPNG(
  elementoId: string,
  nombreArchivo: string = "grafico.png"
): Promise<void> {
  try {
    // Intentar usar html2canvas si está disponible (más preciso para elementos complejos)
    const html2canvas = (window as any).html2canvas;
    if (html2canvas) {
      const elemento = document.getElementById(elementoId);
      if (!elemento) throw new Error(`Elemento no encontrado: ${elementoId}`);

      const canvas = await html2canvas(elemento, {
        backgroundColor: "#ffffff",
        scale: 2,
      });

      canvas.toBlob((blob: Blob | null) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = nombreArchivo;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, "image/png");
      return;
    }
  } catch (e) {
    console.warn("html2canvas no disponible, usando método SVG", e);
  }

  // Fallback: método SVG
  return exportarGraficoComoPNG(elementoId, nombreArchivo);
}
