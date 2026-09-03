import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  const logoBase64 = readFileSync(join(process.cwd(), "public", "logo.png")).toString("base64");
  const logoSrc = `data:image/png;base64,${logoBase64}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0b1220",
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(251,191,36,0.35) 0%, transparent 35%), radial-gradient(circle at 85% 15%, rgba(245,158,11,0.3) 0%, transparent 30%)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "white",
            borderRadius: 24,
            padding: "24px 40px",
            marginBottom: 36,
          }}
        >
          <img src={logoSrc} width={480} height={221} alt="Sun Wave" />
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 32,
            color: "#fbbf24",
            marginTop: 20,
            fontWeight: 600,
          }}
        >
          Switch to Solar &amp; Save on Electricity
        </div>
      </div>
    ),
    { ...size }
  );
}
