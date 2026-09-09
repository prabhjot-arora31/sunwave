"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Phone, ChevronDown } from "lucide-react";
import Container from "@/components/ui/Container";
import NavDropdown from "@/components/layout/NavDropdown";
import { company, navGroups } from "@/data/site";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  // Hides the header while scrolling down past the top of the page, and
  // brings it back the moment the user scrolls up - gives more room to
  // content-heavy pages while keeping nav one scroll-up away.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    lastY.current = window.scrollY;
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        const y = window.scrollY;
        const diff = y - lastY.current;
        if (y < 80) setHidden(false);
        else if (diff > 4) setHidden(true);
        else if (diff < -4) setHidden(false);
        lastY.current = y;
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-100 shadow-sm transition-transform duration-300 ease-out ${
        hidden && !open ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <Container className="max-w-[1400px]!">
        <div className="flex items-center justify-between gap-4 py-3.5">
          <Link href="/" className="flex items-center shrink-0" onClick={() => setOpen(false)}>
            <Image src="/logo.png" alt="Sun Wave" width={395} height={182} className="h-12 w-auto" priority />
          </Link>

          <nav className="hidden lg:flex items-center gap-6 min-w-0">
            {navGroups.map((group) =>
              "items" in group ? (
                <NavDropdown key={group.label} label={group.label} items={group.items} />
              ) : (
                <Link
                  key={group.href}
                  href={group.href}
                  className="text-sm font-medium text-slate-700 hover:text-sun-600 transition-colors whitespace-nowrap"
                >
                  {group.label}
                </Link>
              )
            )}
          </nav>

          <div className="hidden lg:flex items-center gap-4 shrink-0">
            <a
              href={`tel:${company.phone.replace(/\s/g, "")}`}
              className="flex items-center gap-1.5 text-sm font-semibold text-sky-950 hover:text-sun-600 whitespace-nowrap"
            >
              <Phone className="h-4 w-4 shrink-0" />
              {company.phoneDisplay}
            </a>
            <Link
              href="/contact#quote-form"
              className="shrink-0 whitespace-nowrap rounded-full bg-sun-700 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-sun-800 hover:-translate-y-0.5 hover:shadow-lg transition-all"
            >
              Get Free Quote
            </Link>
          </div>

          <button
            className="lg:hidden p-2 text-sky-950 shrink-0"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </Container>

      {open && (
        <div className="lg:hidden border-t border-slate-100 bg-white max-h-[calc(100vh-4rem)] overflow-y-auto">
          <Container className="py-4 flex flex-col gap-1">
            {navGroups.map((group) =>
              "items" in group ? (
                <div key={group.label} className="border-b border-slate-50 last:border-0">
                  <button
                    type="button"
                    onClick={() => setExpandedGroup(expandedGroup === group.label ? null : group.label)}
                    className="w-full flex items-center justify-between py-2.5 text-sm font-medium text-slate-700"
                    aria-expanded={expandedGroup === group.label}
                  >
                    {group.label}
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${expandedGroup === group.label ? "rotate-180" : ""}`}
                    />
                  </button>
                  {expandedGroup === group.label && (
                    <div className="pb-2 pl-4 flex flex-col gap-1">
                      {group.items.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setOpen(false)}
                          className="py-2 text-sm text-slate-600 hover:text-sun-600"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={group.href}
                  href={group.href}
                  onClick={() => setOpen(false)}
                  className="py-2.5 text-sm font-medium text-slate-700 hover:text-sun-600 border-b border-slate-50 last:border-0"
                >
                  {group.label}
                </Link>
              )
            )}
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
                className="flex-1 text-center rounded-full bg-sun-700 px-4 py-2.5 text-sm font-semibold text-white transition-transform active:scale-95"
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
