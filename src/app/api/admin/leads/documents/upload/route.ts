import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";

// Same client-direct-upload pattern as the gallery uploader, but the blob is
// private: these are government ID / financial documents (Aadhaar, PAN,
// bank details), so the URL alone must not be enough to view the file -
// only an authenticated admin route (see [docId]/view) can read it back.
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
