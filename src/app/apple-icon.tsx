import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(circle at 30% 20%, #ff6b6b 0%, #ef4444 55%, #b91c1c 100%)",
          borderRadius: "36px",
          color: "white",
          fontWeight: 800,
          fontSize: "110px",
          letterSpacing: "-2px",
          boxShadow: "inset 0 0 40px rgba(0,0,0,0.25)",
        }}
      >
        E
      </div>
    ),
    { ...size },
  );
}
