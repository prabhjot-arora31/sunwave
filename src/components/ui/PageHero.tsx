import Container from "@/components/ui/Container";

export default function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <section className="bg-gradient-to-b from-sky-950 to-sky-900 py-16 sm:py-20">
      <Container>
        {eyebrow && (
          <span className="inline-block text-sm font-semibold tracking-wide text-sun-400 uppercase mb-3">
            {eyebrow}
          </span>
        )}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
          {title}
        </h1>
        {description && (
          <p className="mt-4 max-w-2xl text-slate-300 text-base sm:text-lg">{description}</p>
        )}
      </Container>
    </section>
  );
}
