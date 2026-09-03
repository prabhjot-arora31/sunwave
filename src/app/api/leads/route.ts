import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { prisma } from "@/lib/prisma";
import { leadSchema } from "@/lib/leadSchema";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  try {
    const data = leadSchema.parse(body);

    const lead = await prisma.lead.create({
      data: {
        fullName: data.fullName,
        mobile: data.mobile,
        whatsapp: data.whatsapp,
        email: data.email,
        address: data.address,
        city: data.city,
        pincode: data.pincode,
        propertyType: data.propertyType,
        monthlyBill: data.monthlyBill,
        monthlyUnits: data.monthlyUnits,
        connectionType: data.connectionType,
        capacity: data.capacity,
        roofType: data.roofType,
        installDate: data.installDate ? new Date(data.installDate) : undefined,
        battery: data.battery,
        finance: data.finance,
        subsidy: data.subsidy,
        message: data.message,
        source: data.source,
      },
      select: { id: true },
    });

    return NextResponse.json({ ok: true, id: lead.id }, { status: 201 });
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation failed", issues: err.flatten().fieldErrors },
        { status: 422 }
      );
    }
    console.error("Failed to create lead:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
