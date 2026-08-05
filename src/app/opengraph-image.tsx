import { ImageResponse } from "next/og";
import { BrandCard } from "@/lib/og-layout";

export const alt = "Smart Radiance — Automatización inteligente para tu empresa";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const runtime = "edge";

export default function OpengraphImage() {
  return new ImageResponse(<BrandCard />, {
    ...size,
  });
}
