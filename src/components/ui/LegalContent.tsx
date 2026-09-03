import { ReactNode } from "react";
import Container from "@/components/ui/Container";

export default function LegalContent({ children }: { children: ReactNode }) {
  return (
    <section className="py-16 bg-white">
      <Container className="max-w-3xl!">
        <div className="prose-legal space-y-6 text-slate-600 leading-relaxed [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-sky-950 [&_h2]:mt-8 [&_h2]:mb-2 [&_p]:mb-0 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_li]:text-slate-600">
          {children}
        </div>
      </Container>
    </section>
  );
}
