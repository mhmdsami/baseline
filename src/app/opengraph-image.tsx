import { ImageResponse } from "next/og";
import { colors, site } from "@/lib/site";
import { displayFontBase64 } from "./og-font";

export const alt = site.tagline;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const display = Buffer.from(displayFontBase64, "base64");

export default async function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: colors.background,
        color: colors.foreground,
        padding: 72,
      }}
    >
      <div
        style={{
          display: "flex",
          fontSize: 20,
          letterSpacing: 4,
          textTransform: "uppercase",
          color: colors.primary,
        }}
      >
        {site.name}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ display: "flex", fontSize: 76, lineHeight: 1.05, maxWidth: 900 }}>{site.tagline}</div>
        <div style={{ display: "flex", fontSize: 24, color: colors.foreground, opacity: 0.7 }}>
          {new URL(site.url).host}
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts: [{ name: "Instrument Serif", data: display, style: "normal", weight: 400 }],
    },
  );
}
