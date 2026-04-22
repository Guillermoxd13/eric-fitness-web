import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Eric Fitness · Entrenamiento premium";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "80px",
          background:
            "radial-gradient(ellipse 90% 70% at 20% 10%, rgba(239,68,68,0.35), transparent 60%), radial-gradient(ellipse 70% 50% at 100% 100%, rgba(239,68,68,0.22), transparent 60%), #0a0a0a",
          color: "#fff",
          fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "20px",
              background: "#ef4444",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "36px",
              boxShadow: "0 0 40px rgba(239,68,68,0.6)",
            }}
          >
            🏋️
          </div>
          <div
            style={{
              fontSize: "28px",
              fontWeight: 600,
              letterSpacing: "2px",
              color: "#ef4444",
            }}
          >
            ERIC FITNESS
          </div>
        </div>

        <div
          style={{
            fontSize: "72px",
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: "-1px",
            maxWidth: "960px",
          }}
        >
          Entrena con el método completo de{" "}
          <span style={{ color: "#ef4444" }}>Erickson Zambrano</span>
        </div>

        <div
          style={{
            marginTop: "28px",
            fontSize: "28px",
            color: "rgba(255,255,255,0.7)",
          }}
        >
          Fuerza · HIIT · Movilidad · Vídeo HD
        </div>

        <div
          style={{
            marginTop: "auto",
            fontSize: "22px",
            color: "rgba(255,255,255,0.4)",
          }}
        >
          eric-fitness-web.vercel.app
        </div>
      </div>
    ),
    { ...size },
  );
}
