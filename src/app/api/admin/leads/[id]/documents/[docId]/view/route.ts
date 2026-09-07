import { NextRequest, NextResponse } from "next/server";
import { get } from "@vercel/blob";
import { prisma } from "@/lib/prisma";

function parseId(idParam: string): number | null {
  const id = Number(idParam);
  return Number.isInteger(id) && id > 0 ? id : null;
}

// Streams a private document blob back to the (already admin-authenticated,
// via the /admin proxy matcher) browser. Never expose document.url directly
// to the client - it's a private blob URL that still requires this
// server-side, token-authenticated fetch to actually read.
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; docId: string }> }
) {
  const { docId: docIdParam } = await params;
  const docId = parseId(docIdParam);
  if (docId === null) return NextResponse.json({ error: "Invalid document id" }, { status: 400 });

  const document = await prisma.customerDocument.findUnique({ where: { id: docId } });
  if (!document) return NextResponse.json({ error: "Document not found" }, { status: 404 });

  const result = await get(document.url, {
    access: "private",
    token: process.env.DOCS_BLOB_READ_WRITE_TOKEN,
  });
  if (!result || result.statusCode !== 200) {
    return NextResponse.json({ error: "Document could not be retrieved" }, { status: 404 });
  }

  return new NextResponse(result.stream, {
    headers: {
      "Content-Type": result.blob.contentType,
      "Content-Disposition": `inline; filename="${document.fileName}"`,
      "Cache-Control": "no-store",
    },
  });
}
