import { company } from "@/data/site";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.sunwavesolar.in";

export default function StructuredData() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: company.fullName,
    alternateName: company.name,
    url: siteUrl,
    telephone: company.phone,
    email: company.email,
    priceRange: "₹₹",
    image: `${siteUrl}/opengraph-image`,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Plot No. 57, Kabir Nagar, Nari Road",
      addressLocality: "Nagpur",
      addressRegion: "Maharashtra",
      postalCode: "440026",
      addressCountry: "IN",
    },
    areaServed: "IN",
    sameAs: Object.values(company.socials),
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "09:00",
      closes: "19:00",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
