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
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Grid Background Effect */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(59, 130, 246, 0.1) 1px, transparent 0)',
            backgroundSize: '32px 32px',
          }}
        />

        {/* Glow Effects */}
        <div style={{ position: 'absolute', top: -100, left: -100, width: 400, height: 400, background: 'rgba(37, 99, 235, 0.15)', filter: 'blur(100px)', borderRadius: '100%' }} />
        <div style={{ position: 'absolute', bottom: -100, right: -100, width: 400, height: 400, background: 'rgba(16, 185, 129, 0.1)', filter: 'blur(100px)', borderRadius: '100%' }} />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 64,
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 40,
            background: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24 }}>
            <div style={{ width: 64, height: 64, backgroundColor: '#2563eb', borderRadius: 16, display: 'flex', alignItems: 'center', justifyItems: 'center', padding: 12 }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-3 3" />
              </svg>
            </div>
            <div
              style={{
                fontSize: 88,
                fontWeight: 900,
                color: "white",
                letterSpacing: "-0.04em",
              }}
            >
              ECONOSFERA
            </div>
          </div>

          <div
            style={{
              fontSize: 32,
              fontWeight: 600,
              color: "#94a3b8",
              marginBottom: 40,
              textAlign: "center",
              maxWidth: 800,
              lineHeight: 1.4,
            }}
          >
            La terminal de simulación para economistas y actuarios.
          </div>

          <div style={{ display: 'flex', gap: 16 }}>
            <div style={{ padding: '10px 20px', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: 12, color: '#60a5fa', fontSize: 18, fontWeight: 700 }}>Simuladores Macro</div>
            <div style={{ padding: '10px 20px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: 12, color: '#34d399', fontSize: 18, fontWeight: 700 }}>Valuación de Activos</div>
            <div style={{ padding: '10px 20px', background: 'rgba(251, 191, 36, 0.1)', border: '1px solid rgba(251, 191, 36, 0.3)', borderRadius: 12, color: '#fbbf24', fontSize: 18, fontWeight: 700 }}>Análisis IA</div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
