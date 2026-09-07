import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";

// Same private-store upload pattern as the lead-side documents uploader,
// duplicated (not shared) so it lives under /api/admin/customers/* - the
// proxy's permission gate keys off the URL prefix, so a customer document
// upload needs its own route to be correctly gated by customers.edit
// instead of leads.edit.
export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      token: process.env.DOCS_BLOB_READ_WRITE_TOKEN,
      onBeforeGenerateToken: async () => {
        return {
          access: "private",
          allowedContentTypes: [
            "image/jpeg",
            "image/png",
            "image/webp",
            "application/pdf",
          ],
          addRandomSuffix: true,
          maximumSizeInBytes: 20 * 1024 * 1024,
        };
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload authorization failed" },
      { status: 400 }
    );
  }
}
