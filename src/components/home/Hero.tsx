import Link from "next/link";
import { Phone, ArrowRight, CheckCircle2 } from "lucide-react";
import Container from "@/components/ui/Container";
import { stats } from "@/data/site";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-sky-950 via-sky-900 to-sky-950">
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, #fbbf24 0%, transparent 35%), radial-gradient(circle at 85% 15%, #f59e0b 0%, transparent 30%)",
        }}
      />
      <Container className="relative py-20 sm:py-28">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold text-sun-300 mb-6">
              Sun Wave Energies - PM Surya Ghar Yojana Affiliated Partner
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
              Switch to Solar &amp;{" "}
              <span className="text-sun-400">Save on Electricity</span>
            </h1>
            <p className="mt-6 text-lg text-slate-300 max-w-xl">
              Reduce your electricity bill by up to 99% to 100% with a rooftop solar system designed
              for your home, business or industry - with full subsidy and EMI support.
            </p>

            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
              {["25-year warranty", "Govt. subsidy assistance", "Easy EMI options"].map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-slate-200">
                  <CheckCircle2 className="h-4 w-4 text-leaf-500" />
                  {f}
                </li>
              ))}
            </ul>

            <div className="mt-9 flex flex-col sm:flex-row gap-4">
              <Link
                href="/contact#quote-form"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-sun-700 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-sun-500/20 hover:bg-sun-800 transition-colors"
              >
                Get Free Consultation
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contact#quote-form"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white/10 border border-white/20 px-7 py-3.5 text-sm font-semibold text-white hover:bg-white/20 transition-colors"
              >
                Get Free Quote
              </Link>
              <a
                href="tel:+919876543210"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-7 py-3.5 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
              >
                <Phone className="h-4 w-4" />
                Call Now
              </a>
            </div>

            <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-6 border-t border-white/10 pt-8">
              {stats.map((s) => (
                <div key={s.label}>
                  <p className="text-2xl sm:text-3xl font-extrabold text-white">{s.value}</p>
                  <p className="text-xs text-slate-400 mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="aspect-4/3 w-full rounded-3xl bg-gradient-to-br from-sun-400/20 to-sky-800 border border-white/10 shadow-2xl flex items-center justify-center overflow-hidden">
              <svg viewBox="0 0 400 300" className="w-full h-full">
                <rect width="400" height="300" fill="#0f1b33" />
                <circle cx="330" cy="55" r="34" fill="#fbbf24" opacity="0.9" />
                <rect x="40" y="170" width="320" height="90" fill="#1c3a66" />
                {Array.from({ length: 4 }).map((_, row) =>
                  Array.from({ length: 6 }).map((_, col) => (
                    <rect
                      key={`${row}-${col}`}
                      x={55 + col * 50}
                      y={180 + row * 20}
                      width="44"
                      height="16"
                      fill="#1e3a8a"
                      stroke="#3b5a8f"
                      strokeWidth="1"
                    />
                  ))
                )}
                <polygon points="20,170 380,170 340,120 60,120" fill="#f8fafc" opacity="0.06" />
                <rect x="180" y="230" width="8" height="70" fill="#475569" />
                <rect x="120" y="300" width="160" height="0" fill="none" />
              </svg>
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl px-6 py-4 hidden sm:block">
              <p className="text-xs text-slate-500">Estimated Monthly Savings</p>
              <p className="text-2xl font-extrabold text-leaf-600">₹4,200+</p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
