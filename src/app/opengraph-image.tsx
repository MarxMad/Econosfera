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
          background: "#020617",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: 64,
            border: "1px solid #334155",
            borderRadius: 40,
          }}
        >
          <div
            style={{
              fontSize: 72,
              fontWeight: 900,
              color: "white",
              letterSpacing: "-0.04em",
              marginBottom: 24,
            }}
          >
            ECONOSFERA
          </div>
          <div
            style={{
              fontSize: 28,
              fontWeight: 600,
              color: "#94a3b8",
              textAlign: "center",
              marginBottom: 32,
            }}
          >
            La terminal de simulación para economistas y actuarios.
          </div>
          <div style={{ display: "flex", gap: 16 }}>
            <span style={{ padding: "10px 20px", backgroundColor: "#1e3a5f", borderRadius: 12, color: "#60a5fa", fontSize: 18, fontWeight: 700 }}>
              Simuladores Macro
            </span>
            <span style={{ padding: "10px 20px", backgroundColor: "#064e3b", borderRadius: 12, color: "#34d399", fontSize: 18, fontWeight: 700 }}>
              Valuación de Activos
            </span>
            <span style={{ padding: "10px 20px", backgroundColor: "#422006", borderRadius: 12, color: "#fbbf24", fontSize: 18, fontWeight: 700 }}>
              Análisis IA
            </span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
