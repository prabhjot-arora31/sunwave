import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { prisma } from "@/lib/prisma";
import { reviewSchema } from "@/lib/reviewSchema";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  try {
    const data = reviewSchema.parse(body);

    const review = await prisma.review.create({
      data: {
        name: data.name,
        city: data.city,
        rating: data.rating,
        systemType: data.systemType,
        comment: data.comment,
        source: data.source,
        status: "pending",
      },
      select: { id: true },
    });

    return NextResponse.json({ ok: true, id: review.id }, { status: 201 });
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation failed", issues: err.flatten().fieldErrors },
        { status: 422 }
      );
    }
    console.error("Failed to create review:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
