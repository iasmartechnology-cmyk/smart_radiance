import type { ReactElement } from "react";
import { SITE } from "@/constants/site";

const SPARKLE_PATH =
  "M50 8 C51.5 18 55 22 66 24.5 C55 27 51.5 31 50 40 C48.5 31 45 27 34 24.5 C45 22 48.5 18 50 8 Z";

function BrandMark({ size = 84 }: { size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "22%",
        background: "#fcf9f8",
        border: "1px solid rgba(208, 197, 175, 0.6)",
      }}
    >
      <svg width={size * 0.78} height={size * 0.78} viewBox="0 0 100 100" fill="none">
        <path d={SPARKLE_PATH} fill="#d4af37" />
        <circle cx="50" cy="44" r="8" fill="#735c00" />
      </svg>
    </div>
  );
}

export function BrandCard(): ReactElement {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        background: "#fcf9f8",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "-20%",
          right: "-12%",
          width: "55%",
          height: "55%",
          borderRadius: "50%",
          background: "rgba(212, 175, 55, 0.14)",
          filter: "blur(60px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-25%",
          left: "-14%",
          width: "50%",
          height: "50%",
          borderRadius: "50%",
          background: "rgba(181, 179, 172, 0.25)",
          filter: "blur(70px)",
        }}
      />
      <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
        <BrandMark size={104} />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 72, fontWeight: 700, letterSpacing: "-0.03em", color: "#1c1b1b" }}>
            {SITE.name}
          </div>
          <div
            style={{
              fontSize: 30,
              fontWeight: 500,
              letterSpacing: "-0.01em",
              color: "#735c00",
              marginTop: 8,
            }}
          >
            {SITE.tagline}
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", bottom: 48, fontSize: 22, color: "#4d4635" }}>
        Transformación digital avanzada
      </div>
    </div>
  );
}
