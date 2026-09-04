import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin } from "lucide-react";
import Container from "@/components/ui/Container";
import SocialIcon from "@/components/ui/SocialIcon";
import { company, footerLinks } from "@/data/site";

const socialPlatforms = ["facebook", "instagram", "linkedin", "youtube"] as const;

export default function Footer() {
  return (
    <footer className="bg-sky-950 text-slate-300">
      <Container className="py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="inline-flex items-center bg-white rounded-lg px-3 py-2 mb-4">
              <Image src="/logo.png" alt="Sun Wave" width={395} height={182} className="h-8 w-auto" />
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              {company.fullName} helps homes and businesses switch to clean, reliable solar
              power with end-to-end installation, subsidy and finance support.
            </p>
            <div className="flex items-center gap-3 mt-5">
              {socialPlatforms.map((platform) => (
                <a
                  key={platform}
                  href="#"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 hover:bg-sun-500 transition-colors"
                  aria-label={`Sun Wave on ${platform}`}
                >
                  <SocialIcon platform={platform} className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-white uppercase tracking-wide mb-4">
              Solutions
            </h2>
            <ul className="space-y-2.5 text-sm">
              {footerLinks.quick.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-sun-400 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-white uppercase tracking-wide mb-4">
              Company
            </h2>
            <ul className="space-y-2.5 text-sm">
              {footerLinks.company.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-sun-400 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
              {footerLinks.legal.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-sun-400 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-white uppercase tracking-wide mb-4">
              Contact Us
            </h2>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-sun-400" />
                <span>{company.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-sun-400" />
                <a href={`tel:${company.phone}`} className="hover:text-sun-400">
                  {company.phone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-sun-400" />
                <a href={`mailto:${company.email}`} className="hover:text-sun-400">
                  {company.email}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </Container>

      <div className="border-t border-white/10">
        <Container className="py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
          <p>
            &copy; {new Date().getFullYear()} {company.fullName}. All rights reserved.
          </p>
          <p>Made with the power of the sun.</p>
        </Container>
      </div>
    </footer>
  );
}
