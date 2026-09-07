import { NextRequest, NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";
import { ZodError } from "zod";
import { prisma } from "@/lib/prisma";
import { siteSettingsSchema } from "@/lib/siteSettingsSchema";
import { getSiteSettings, SITE_SETTINGS_CACHE_TAG, SITE_SETTINGS_ID } from "@/lib/siteSettings";

export async function GET() {
  const settings = await getSiteSettings();
  return NextResponse.json({ settings });
}

export async function PUT(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  try {
    const data = siteSettingsSchema.parse(body);

    await prisma.siteSettings.upsert({
      where: { id: SITE_SETTINGS_ID },
      update: data,
      create: { id: SITE_SETTINGS_ID, ...data },
    });

    revalidateTag(SITE_SETTINGS_CACHE_TAG, "max");
    revalidatePath("/");
    revalidatePath("/subsidy");
    revalidatePath("/finance");
    revalidatePath("/about");

    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation failed", issues: err.flatten().fieldErrors },
        { status: 422 }
      );
    }
    console.error("Failed to save site settings:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
