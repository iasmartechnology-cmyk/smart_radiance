import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Branded social card generated at build time — onyx, ivory, cobalt. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background:
            "linear-gradient(160deg, #12121b 0%, #1e1e2a 55%, #171721 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", color: "#5266eb", fontSize: 26, letterSpacing: 3, textTransform: "uppercase" }}>
          Agencia digital · Web &amp; SEO
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            color: "#ededf3",
            fontSize: 96,
            fontWeight: 500,
            lineHeight: 1.05,
            letterSpacing: 1,
          }}
        >
          <span>Llevamos tu negocio</span>
          <span>a la cima.</span>
        </div>
        <div style={{ display: "flex", color: "#c3c3cc", fontSize: 28 }}>
          Diseño web · Optimización · Posicionamiento SEO
        </div>
      </div>
    ),
    size,
  );
}
