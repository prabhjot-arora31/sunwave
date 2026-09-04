import { NextRequest, NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";
import { ZodError } from "zod";
import { prisma } from "@/lib/prisma";
import { createGalleryItemSchema } from "@/lib/gallerySchema";
import { GALLERY_CACHE_TAG } from "@/lib/gallery";

export async function GET() {
  const items = await prisma.galleryItem.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  try {
    const data = createGalleryItemSchema.parse(body);

    const maxOrder = await prisma.galleryItem.aggregate({ _max: { order: true } });
    const item = await prisma.galleryItem.create({
      data: {
        url: data.url,
        type: data.type,
        caption: data.caption,
        order: (maxOrder._max.order ?? 0) + 1,
      },
    });

    revalidateTag(GALLERY_CACHE_TAG, "max");
    revalidatePath("/gallery");
    return NextResponse.json({ item }, { status: 201 });
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation failed", issues: err.flatten().fieldErrors },
        { status: 422 }
      );
    }
    console.error("Failed to create gallery item:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
