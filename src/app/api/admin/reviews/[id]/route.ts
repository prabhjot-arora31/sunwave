import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { REVIEW_STATUSES } from "@/lib/reviewStatus";

const updateSchema = z.object({
  status: z.enum(REVIEW_STATUSES).optional(),
});

function parseId(idParam: string): number | null {
  const id = Number(idParam);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const id = parseId((await params).id);
  if (id === null) return NextResponse.json({ error: "Invalid review id" }, { status: 400 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  try {
    const review = await prisma.review.update({ where: { id }, data: parsed.data });
    revalidatePath("/");
    return NextResponse.json({ review });
  } catch {
    return NextResponse.json({ error: "Review not found" }, { status: 404 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const id = parseId((await params).id);
  if (id === null) return NextResponse.json({ error: "Invalid review id" }, { status: 400 });

  try {
    await prisma.review.delete({ where: { id } });
    revalidatePath("/");
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Review not found" }, { status: 404 });
  }
}
