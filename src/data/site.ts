export const company = {
  name: "Sun Wave",
  fullName: "Sun Wave Solar Energy Pvt. Ltd.",
  tagline: "Switch to Solar & Save on Electricity",
  phone: "+91 90286 44679",
  phoneDisplay: "90286 44679",
  whatsapp: "919028644679",
  email: "paramjeetbadan806@gmail.com",
  address: "Plot No. 57, Kabir Nagar, Nari Road, Nagpur, Maharashtra - 440026",
  hours: "Mon - Sat, 9:00 AM - 7:00 PM",
  yearFounded: 2023,
  gstin: "", // add the real GSTIN here once available - hidden on invoices until set
  socials: {
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
    linkedin: "https://linkedin.com",
    youtube: "https://youtube.com",
  },
};

type NavLink = { label: string; href: string };
type NavGroup = NavLink | { label: string; items: NavLink[] };

// Each entry is either a single link (has `href`) or a dropdown group (has
// `items`) - the header renders the two shapes differently (plain link vs
// hover dropdown), grouping what used to be 11 flat items into a much less
// cramped 6 top-level slots.
export const navGroups: NavGroup[] = [
  { label: "Home", href: "/" },
  {
    label: "Solutions",
    items: [
      { label: "Solar Products", href: "/solar-products" },
      { label: "Residential", href: "/residential" },
      { label: "Commercial", href: "/commercial" },
    ],
  },
  {
    label: "Financing",
    items: [
      { label: "Subsidy", href: "/subsidy" },
      { label: "Finance", href: "/finance" },
    ],
  },
  {
    label: "Resources",
    items: [
      { label: "Gallery", href: "/gallery" },
      { label: "Blog", href: "/blog" },
      { label: "Reviews", href: "/reviews" },
    ],
  },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const footerLinks = {
  quick: [
    { label: "Solar Products", href: "/solar-products" },
    { label: "Residential Solar", href: "/residential" },
    { label: "Commercial Solar", href: "/commercial" },
    { label: "Subsidy", href: "/subsidy" },
    { label: "Finance", href: "/finance" },
  ],
  company: [
    { label: "Gallery", href: "/gallery" },
    { label: "Blog", href: "/blog" },
    { label: "Reviews", href: "/reviews" },
    { label: "About Us", href: "/about" },
    { label: "Contact Us", href: "/contact" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms & Conditions", href: "/terms-and-conditions" },
    { label: "Disclaimer", href: "/disclaimer" },
  ],
};

