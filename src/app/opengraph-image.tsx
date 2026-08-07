import { ImageResponse } from "next/og";
import { SITE } from "@/lib/constants";

export const alt = "Smart Radiance — Desarrollo web, SEO y mejora de páginas";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
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
          background:
            "radial-gradient(ellipse 65% 55% at 12% -10%, rgba(208,176,106,0.35), transparent 60%), radial-gradient(ellipse 60% 50% at 95% 15%, rgba(229,221,208,0.9), transparent 55%), radial-gradient(ellipse 50% 40% at 70% 110%, rgba(184,145,74,0.18), transparent 60%), #f7f4ef",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              color: "#8f6e2f",
              fontSize: 28,
              letterSpacing: 14,
              textTransform: "uppercase",
              fontFamily: "monospace",
              marginBottom: 36,
            }}
          >
            Desarrollo web · SEO · Mejora
          </div>

          <div
            style={{
              display: "flex",
              color: "#2a2825",
              fontSize: 88,
              fontWeight: 700,
              letterSpacing: -3,
              fontFamily: "sans-serif",
              lineHeight: 1.05,
              textAlign: "center",
            }}
          >
            Smart&nbsp;
            <span
              style={{
                display: "flex",
                color: "#b8914a",
              }}
            >
              Radiance
            </span>
          </div>

          <div
            style={{
              display: "flex",
              color: "#5c574f",
              fontSize: 36,
              letterSpacing: -1,
              fontFamily: "sans-serif",
              textAlign: "center",
              marginTop: 24,
              maxWidth: 820,
              lineHeight: 1.4,
            }}
          >
            Presencia digital que transmite confianza y convierte
          </div>

          <div
            style={{
              display: "flex",
              color: "#8a847a",
              fontSize: 24,
              letterSpacing: 2,
              textTransform: "uppercase",
              fontFamily: "monospace",
              marginTop: 40,
            }}
          >
            {SITE.name} · {SITE.url.replace("https://", "")}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
