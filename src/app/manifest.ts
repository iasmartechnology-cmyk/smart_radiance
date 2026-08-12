import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

/**
 * Web app manifest — carried over from the previous site and updated to the
 * current palette and generated icons.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: site.shortName,
    description: site.description,
    start_url: "/",
    display: "standalone",
    background_color: "#171721",
    theme_color: "#171721",
    lang: site.lang,
    icons: [
      { src: "/icon", sizes: "64x64", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
