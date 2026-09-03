"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Phone } from "lucide-react";
import Container from "@/components/ui/Container";
import { company, navLinks } from "@/data/site";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-100 shadow-sm">
      <Container>
        <div className="flex items-center justify-between gap-4 py-3.5">
          <Link href="/" className="flex items-center shrink-0" onClick={() => setOpen(false)}>
            <Image src="/logo.png" alt="Sun Wave" width={395} height={182} className="h-9 w-auto" priority />
          </Link>

          <nav className="hidden xl:flex items-center gap-6 min-w-0">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-slate-700 hover:text-sun-600 transition-colors whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden xl:flex items-center gap-4 shrink-0">
            <a
              href={`tel:${company.phone.replace(/\s/g, "")}`}
              className="flex items-center gap-1.5 text-sm font-semibold text-sky-950 hover:text-sun-600 whitespace-nowrap"
            >
              <Phone className="h-4 w-4 shrink-0" />
              {company.phoneDisplay}
            </a>
            <Link
              href="/contact#quote-form"
              className="shrink-0 whitespace-nowrap rounded-full bg-sun-700 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-sun-800 transition-colors"
            >
              Get Free Quote
            </Link>
          </div>

          <button
            className="xl:hidden p-2 text-sky-950 shrink-0"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </Container>

      {open && (
        <div className="xl:hidden border-t border-slate-100 bg-white">
          <Container className="py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="py-2.5 text-sm font-medium text-slate-700 hover:text-sun-600 border-b border-slate-50 last:border-0"
              >
                {link.label}
              </Link>
            ))}
            <div className="flex items-center gap-3 mt-4">
              <a
                href={`tel:${company.phone.replace(/\s/g, "")}`}
                className="flex-1 flex items-center justify-center gap-2 rounded-full border border-slate-200 px-4 py-2.5 text-sm font-semibold text-sky-950"
              >
                <Phone className="h-4 w-4" /> Call Us
              </a>
              <Link
                href="/contact#quote-form"
                onClick={() => setOpen(false)}
                className="flex-1 text-center rounded-full bg-sun-700 px-4 py-2.5 text-sm font-semibold text-white"
              >
                Get Free Quote
              </Link>
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}
