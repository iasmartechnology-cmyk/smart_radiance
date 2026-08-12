import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/**
 * Browser tab icon — a summit mark in the site's own palette.
 * Kept to two shapes so it still reads at 16px: an ivory peak with a cobalt
 * cap, echoing the ascent the whole site is built around.
 */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#171721",
        }}
      >
        <svg width="64" height="64" viewBox="0 0 64 64">
          {/* Peak */}
          <path d="M8 50 L32 12 L56 50 Z" fill="#ededf3" />
          {/* Snow cap */}
          <path d="M32 12 L41 26 L32 21 L23 26 Z" fill="#5266eb" />
        </svg>
      </div>
    ),
    { ...size },
  );
}
