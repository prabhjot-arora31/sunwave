import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";

export const GALLERY_CACHE_TAG = "gallery";

export type GalleryDisplayItem = {
  src: string;
  caption: string;
};

export const getPublicGallery = unstable_cache(
  async () => {
    try {
      const items = await prisma.galleryItem.findMany({
        orderBy: [{ order: "asc" }, { createdAt: "asc" }],
      });

      const photos: GalleryDisplayItem[] = items
        .filter((i) => i.type === "photo")
        .map((i) => ({ src: i.url, caption: i.caption ?? "" }));

      const videos: GalleryDisplayItem[] = items
        .filter((i) => i.type === "video")
        .map((i) => ({ src: i.url, caption: i.caption ?? "" }));

      return { photos, videos };
    } catch {
      // A DB hiccup here must never fail the build (this page is prerendered
      // at build time) or take down the live page - fall back to an empty
      // gallery, which the page already renders as a graceful "coming soon"
      // placeholder.
      return { photos: [], videos: [] };
    }
  },
  ["public-gallery-items"],
  { revalidate: 3600, tags: [GALLERY_CACHE_TAG] }
);
