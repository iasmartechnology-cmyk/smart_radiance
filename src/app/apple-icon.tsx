import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};
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
            "radial-gradient(circle at 38% 32%, #fffcfa 0%, #e6c98f 38%, #b8914a 100%)",
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 9999,
            border: "3px solid rgba(255,252,250,0.45)",
            background: "transparent",
            position: "absolute",
          }}
        />
        <div
          style={{
            width: 22,
            height: 22,
            borderRadius: 9999,
            background: "#8f6e2f",
          }}
        />
      </div>
    ),
    {
      ...size,
    },
  );
}
