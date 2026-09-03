export default function SectionHeading({
  eyebrow,
  title,
  description,
  center = true,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  center?: boolean;
}) {
  return (
    <div className={`max-w-2xl ${center ? "mx-auto text-center" : ""} mb-10 sm:mb-14`}>
      {eyebrow && (
        <span className="inline-block text-sm font-semibold tracking-wide text-sun-700 uppercase mb-3">
          {eyebrow}
        </span>
      )}
      <h2 className="text-3xl sm:text-4xl font-bold text-sky-950 tracking-tight">{title}</h2>
      {description && (
        <p className="mt-4 text-base sm:text-lg text-slate-600">{description}</p>
      )}
    </div>
  );
}
