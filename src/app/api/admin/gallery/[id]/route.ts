import { NextRequest, NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";
import { del } from "@vercel/blob";
import { prisma } from "@/lib/prisma";
import { updateGalleryItemSchema } from "@/lib/gallerySchema";
import { GALLERY_CACHE_TAG } from "@/lib/gallery";

function parseId(idParam: string): number | null {
  const id = Number(idParam);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const id = parseId((await params).id);
  if (id === null) return NextResponse.json({ error: "Invalid gallery item id" }, { status: 400 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = updateGalleryItemSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  try {
    const item = await prisma.galleryItem.update({ where: { id }, data: parsed.data });
    revalidateTag(GALLERY_CACHE_TAG, "max");
    revalidatePath("/gallery");
    return NextResponse.json({ item });
  } catch {
    return NextResponse.json({ error: "Gallery item not found" }, { status: 404 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const id = parseId((await params).id);
  if (id === null) return NextResponse.json({ error: "Invalid gallery item id" }, { status: 400 });

  const item = await prisma.galleryItem.findUnique({ where: { id } });
  if (!item) return NextResponse.json({ error: "Gallery item not found" }, { status: 404 });

  try {
    await del(item.url);
  } catch (err) {
    console.error("Failed to delete blob, removing DB record anyway:", err);
  }

  await prisma.galleryItem.delete({ where: { id } });
  revalidateTag(GALLERY_CACHE_TAG, "max");
  revalidatePath("/gallery");
  return NextResponse.json({ ok: true });
}
