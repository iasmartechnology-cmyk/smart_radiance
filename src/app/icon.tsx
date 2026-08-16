import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/**
 * Browser tab icon — a glowing golden sphere on the site's onyx canvas.
 * A radial gradient gives the sphere a lit, three-dimensional surface; a
 * softer halo behind it reads as glow at both 64px and the 16px the browser
 * tab actually renders.
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
        <div
          style={{
            width: 54,
            height: 54,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background:
              "radial-gradient(circle at 50% 50%, rgba(255,206,110,0.55) 0%, rgba(255,206,110,0) 72%)",
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              display: "flex",
              background:
                "radial-gradient(circle at 34% 28%, #fff8e6 0%, #ffd873 20%, #f5ab2e 52%, #b9741a 84%, #8f5710 100%)",
            }}
          />
        </div>
      </div>
    ),
    { ...size },
  );
}
