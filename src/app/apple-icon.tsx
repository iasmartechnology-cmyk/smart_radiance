import { ImageResponse } from "next/og";

export const alt = "Smart Radiance";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";
export const runtime = "edge";

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#fcf9f8",
        borderRadius: "22%",
      }}
    >
      <svg width="120" height="120" viewBox="0 0 100 100" fill="none">
        <path
          d="M50 8 C51.5 18 55 22 66 24.5 C55 27 51.5 31 50 40 C48.5 31 45 27 34 24.5 C45 22 48.5 18 50 8 Z"
          fill="#d4af37"
        />
        <circle cx="50" cy="44" r="8" fill="#735c00" />
      </svg>
    </div>,
    {
      ...size,
    },
  );
}
