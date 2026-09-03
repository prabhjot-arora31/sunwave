import type { Metadata } from "next";
import { ImageOff, Video as VideoIcon } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import CtaBanner from "@/components/ui/CtaBanner";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import PhotoGrid from "@/components/gallery/PhotoGrid";
import { getGalleryPhotos, getGalleryVideos } from "@/lib/galleryFiles";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Photos and videos from Sun Wave's completed residential, commercial and industrial solar installations.",
  alternates: { canonical: "/gallery" },
};

export default function GalleryPage() {
  const photos = getGalleryPhotos();
  const videos = getGalleryVideos();

  return (
    <>
      <PageHero
        eyebrow="Our Work"
        title="Project Gallery"
        description="Real installations from real customers - a look at the systems we've built across homes and businesses."
      />

      <section className="py-20 bg-white">
        <Container>
          <SectionHeading eyebrow="Photos" title="Completed Installations" />
          {photos.length > 0 ? (
            <PhotoGrid photos={photos} />
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-16 rounded-2xl bg-slate-50 border border-dashed border-slate-200">
              <ImageOff className="h-8 w-8 text-slate-400 mb-3" />
              <p className="text-sm text-slate-500">Photos coming soon.</p>
            </div>
          )}
        </Container>
      </section>

      <section className="py-20 bg-slate-50">
        <Container>
          <SectionHeading eyebrow="Videos" title="See It In Action" />
          {videos.length > 0 ? (
            <div className="grid sm:grid-cols-2 gap-6">
              {videos.map((video) => (
                <div key={video.src} className="rounded-2xl overflow-hidden bg-black border border-slate-200">
                  <video src={video.src} controls playsInline className="w-full aspect-video" />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-16 rounded-2xl bg-white border border-dashed border-slate-200">
              <VideoIcon className="h-8 w-8 text-slate-400 mb-3" />
              <p className="text-sm text-slate-500">Videos coming soon.</p>
            </div>
          )}
        </Container>
      </section>

      <CtaBanner
        title="Like What You See?"
        description="Get a free consultation and see what we can build for your property."
      />
    </>
  );
}
