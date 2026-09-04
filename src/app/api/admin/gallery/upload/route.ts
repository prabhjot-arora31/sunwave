import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";

// Client-side direct-to-Blob upload: the browser uploads straight to Vercel
// Blob storage using a short-lived token issued here, rather than relaying
// the file body through this serverless function - which would hit Vercel's
// request body size limit for anything but the smallest photos (and every
// video).
export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        return {
          allowedContentTypes: [
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/avif",
            "video/mp4",
            "video/webm",
            "video/quicktime",
          ],
          addRandomSuffix: true,
          maximumSizeInBytes: 200 * 1024 * 1024,
        };
      },
      // No onUploadCompleted: the admin gallery page creates the
      // GalleryItem record itself once the client-side upload() call
      // resolves, rather than relying on this webhook - which requires a
      // publicly reachable callback URL and so can't work on localhost
      // during local development anyway.
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload authorization failed" },
      { status: 400 }
    );
  }
}
