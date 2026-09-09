// Next.js shows this instantly the moment a navigation starts, while the
// target page's own data/render is still in flight - without this file,
// there is zero visual feedback until the next page is fully ready.
export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="h-10 w-10 rounded-full border-4 border-slate-200 border-t-sun-600 animate-spin" />
    </div>
  );
}
