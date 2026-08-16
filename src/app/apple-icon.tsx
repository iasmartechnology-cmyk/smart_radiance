import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/**
 * Home-screen icon for iOS — the same glowing golden sphere, scaled up.
 * A slightly stronger specular highlight reads well at this larger size,
 * where there's room for the extra detail.
 */
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
          background: "#171721",
        }}
      >
        <div
          style={{
            width: 148,
            height: 148,
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
              position: "relative",
              width: 100,
              height: 100,
              borderRadius: "50%",
              display: "flex",
              background:
                "radial-gradient(circle at 34% 28%, #fff8e6 0%, #ffd873 20%, #f5ab2e 52%, #b9741a 84%, #8f5710 100%)",
            }}
          >
            {/* Specular highlight */}
            <div
              style={{
                position: "absolute",
                top: 18,
                left: 22,
                width: 22,
                height: 14,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.55)",
                display: "flex",
              }}
            />
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
