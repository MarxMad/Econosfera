import { ImageResponse } from "next/og";

export const alt = "Econosfera - Herramienta didáctica de inflación, macro y microeconomía";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #1d3557 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 48,
          }}
        >
          <div
            style={{
              fontSize: 72,
              fontWeight: 800,
              color: "white",
              letterSpacing: "-0.02em",
              marginBottom: 16,
            }}
          >
            Econosfera
          </div>
          <div
            style={{
              fontSize: 28,
              color: "rgba(203, 213, 225, 0.95)",
              marginBottom: 8,
              textAlign: "center",
            }}
          >
            Inflación, macro y micro. Simuladores y prácticas para economía.
          </div>
          <div
            style={{
              fontSize: 20,
              color: "rgba(148, 163, 184, 0.9)",
              textAlign: "center",
            }}
          >
            Datos de referencia · Fuentes oficiales · Exportar y compartir
          </div>
          <div
            style={{
              marginTop: 32,
              padding: "14px 28px",
              backgroundColor: "#fbbf24",
              color: "#0f172a",
              fontSize: 22,
              fontWeight: 700,
              borderRadius: 12,
            }}
          >
            Herramienta didáctica
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
