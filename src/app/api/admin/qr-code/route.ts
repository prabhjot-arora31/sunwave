import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.sunwavesolar.in";

// Generates a printable QR code pointing at a page on this site, e.g. for
// handing customers a link to /reviews after an installation. Protected by
// the same /api/admin/* auth as everything else in the admin panel.
export async function GET(req: NextRequest) {
  const path = req.nextUrl.searchParams.get("path") || "/reviews";
  const targetUrl = new URL(path, siteUrl).toString();

  const buffer = await QRCode.toBuffer(targetUrl, {
    type: "png",
    width: 640,
    margin: 2,
    color: { dark: "#0b1220", light: "#ffffff" },
  });

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "no-store",
    },
  });
}
