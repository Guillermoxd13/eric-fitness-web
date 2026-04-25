import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Eric/Fit · Entrena como quien va en serio";
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
          justifyContent: "space-between",
          padding: "72px 80px",
          background:
            "radial-gradient(ellipse 80% 60% at 80% -10%, rgba(239,68,68,0.28), transparent 60%), radial-gradient(ellipse 60% 50% at 10% 110%, rgba(239,68,68,0.2), transparent 60%), #0a0a0b",
          color: "#fff",
          fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
        }}
      >
        {/* Logo + eyebrow row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: "6px",
              fontSize: "34px",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              lineHeight: 1,
            }}
          >
            <span>ERIC</span>
            <span style={{ display: "inline-flex", alignItems: "baseline" }}>
              <span style={{ color: "#ef4444" }}>/</span>
              <span>FIT</span>
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              fontFamily:
                "ui-monospace, SFMono-Regular, Consolas, Liberation Mono, monospace",
              fontSize: "14px",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.45)",
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: "20px",
                height: "1px",
                background: "rgba(255,255,255,0.3)",
              }}
            />
            <span>Temporada 2026</span>
          </div>
        </div>

        {/* Hero copy */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "26px",
          }}
        >
          <div
            style={{
              fontSize: "108px",
              fontWeight: 800,
              lineHeight: 0.92,
              letterSpacing: "-0.045em",
              maxWidth: "1040px",
            }}
          >
            <div>Entrena</div>
            <div>como quien</div>
            <div>
              <span
                style={{
                  color: "#ef4444",
                  fontStyle: "italic",
                }}
              >
                va en serio
              </span>
              .
            </div>
          </div>

          <div
            style={{
              fontSize: "26px",
              color: "rgba(255,255,255,0.65)",
              maxWidth: "780px",
              lineHeight: 1.4,
            }}
          >
            El método completo de Erickson Zambrano. Fuerza, hipertrofia y movilidad.
          </div>
        </div>

        {/* Footer row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontFamily:
              "ui-monospace, SFMono-Regular, Consolas, Liberation Mono, monospace",
            fontSize: "16px",
            color: "rgba(255,255,255,0.4)",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          <span>eric-fitness-web.vercel.app</span>
          <span>Erickson Zambrano · Método completo</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
