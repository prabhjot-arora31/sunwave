import { readdirSync, statSync } from "fs";
import { join } from "path";

const PHOTO_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".avif"];
const VIDEO_EXTENSIONS = [".mp4", ".webm", ".mov"];

export type GalleryItem = {
  src: string;
  caption: string;
};

function toCaption(filename: string): string {
  const withoutExt = filename.replace(/\.[^.]+$/, "");
  return withoutExt
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function listFiles(folder: string, extensions: string[]): GalleryItem[] {
  const dir = join(process.cwd(), "public", "gallery", folder);
  let entries: string[];
  try {
    entries = readdirSync(dir);
  } catch {
    return [];
  }

  return entries
    .filter((name) => {
      const lower = name.toLowerCase();
      if (!extensions.some((ext) => lower.endsWith(ext))) return false;
      return statSync(join(dir, name)).isFile();
    })
    .sort((a, b) => a.localeCompare(b))
    .map((name) => ({
      src: `/gallery/${folder}/${name}`,
      caption: toCaption(name),
    }));
}

export function getGalleryPhotos(): GalleryItem[] {
  return listFiles("photos", PHOTO_EXTENSIONS);
}

export function getGalleryVideos(): GalleryItem[] {
  return listFiles("videos", VIDEO_EXTENSIONS);
}
