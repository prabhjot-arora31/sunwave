import { NextRequest, NextResponse } from "next/server";
import { del } from "@vercel/blob";
import { prisma } from "@/lib/prisma";

function parseId(idParam: string): number | null {
  const id = Number(idParam);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; docId: string }> }
) {
  const { docId: docIdParam } = await params;
  const docId = parseId(docIdParam);
  if (docId === null) return NextResponse.json({ error: "Invalid document id" }, { status: 400 });

  const document = await prisma.customerDocument.findUnique({ where: { id: docId } });
  if (!document) return NextResponse.json({ error: "Document not found" }, { status: 404 });

  try {
    await del(document.url, { token: process.env.DOCS_BLOB_READ_WRITE_TOKEN });
  } catch (err) {
    console.error("Failed to delete blob, removing DB record anyway:", err);
  }

  await prisma.customerDocument.delete({ where: { id: docId } });
  return NextResponse.json({ ok: true });
}
