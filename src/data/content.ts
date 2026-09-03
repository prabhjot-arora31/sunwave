export const benefits = [
  {
    title: "Lower Electricity Bills",
    description:
      "Cut your monthly electricity bill by up to 90% by generating your own power from the sun.",
    icon: "IndianRupee",
  },
  {
    title: "Government Subsidy",
    description:
      "Avail subsidy of up to ₹78,000 under the PM Surya Ghar Muft Bijli Yojana for residential rooftops.",
    icon: "Landmark",
  },
  {
    title: "25 Year Performance",
    description:
      "Tier-1 panels with 25-year performance warranty and industry-leading efficiency.",
    icon: "ShieldCheck",
  },
  {
    title: "Low Maintenance",
    description:
      "Solar systems require minimal upkeep - just periodic cleaning and an annual check-up.",
    icon: "Wrench",
  },
  {
    title: "Eco-Friendly Energy",
    description:
      "Reduce your carbon footprint and contribute to a cleaner, greener planet.",
    icon: "Leaf",
  },
  {
    title: "Quick Installation",
    description:
      "Most rooftop systems are designed, approved and installed within 7-15 days.",
    icon: "Clock",
  },
];

export const solarSegments = [
  {
    title: "Residential Solar",
    description:
      "Rooftop solar systems for homes and villas, sized from 1kW to 20kW+, with subsidy and EMI support.",
    icon: "Home",
    href: "/residential",
    features: ["On-grid & hybrid options", "Net metering support", "1kW - 20kW+ capacity"],
  },
  {
    title: "Commercial Solar",
    description:
      "Solar solutions for offices, shops, schools and hospitals to reduce operating costs.",
    icon: "Building2",
    href: "/commercial",
    features: ["Accelerated depreciation", "Custom capacity design", "10kW - 500kW"],
  },
  {
    title: "Industrial Solar",
    description:
      "Large-scale rooftop & ground-mount systems for factories and industrial units.",
    icon: "Factory",
    href: "/commercial",
    features: ["Open access & group captive", "500kW - MW scale", "PPA options available"],
  },
];

export const gridTypes = [
  {
    title: "On-Grid Solar",
    description:
      "Connected to the electricity grid. Excess power is exported and adjusted against your bill via net metering. Most economical option, no battery required.",
    icon: "Zap",
    bestFor: "Areas with reliable grid supply",
  },
  {
    title: "Off-Grid Solar",
    description:
      "Fully independent system with battery backup. Works without grid connection, ideal for remote locations or frequent outages.",
    icon: "BatteryCharging",
    bestFor: "Remote areas & farms",
  },
  {
    title: "Hybrid Solar",
    description:
      "Combines grid connectivity with battery backup, giving you savings from net metering plus power during outages.",
    icon: "Blend",
    bestFor: "Homes wanting backup + savings",
  },
];

export const subsidySlabs = [
  { capacity: "Up to 2 kW", subsidy: "₹30,000 per kW" },
  { capacity: "Above 2 kW up to 3 kW", subsidy: "₹18,000 per kW (additional)" },
  { capacity: "Above 3 kW", subsidy: "Capped at ₹78,000" },
];

export const subsidySteps = [
  "Register on the PM Surya Ghar Muft Bijli Yojana portal with your electricity consumer number.",
  "Get a feasibility approval from your DISCOM (electricity distribution company).",
  "Sun Wave installs the rooftop solar plant matched to your sanctioned capacity.",
  "Submit plant details and get the net meter installed by the DISCOM.",
  "After net meter inspection, receive the commissioning certificate.",
  "Submit bank details on the portal - subsidy is credited directly to your account within 30 days.",
];

export const financePartners = [
  "SBI Solar Loan",
  "HDFC Bank",
  "Bank of Baroda",
  "Canara Bank",
  "Tata Capital",
  "Bajaj Finserv",
];

export const financeFeatures = [
  { label: "Loan amount", value: "Up to ₹15,00,000" },
  { label: "Interest rate", value: "Starting at 7.5% p.a." },
  { label: "Tenure", value: "Up to 10 years" },
  { label: "Processing", value: "Minimal documentation, 48-hour approval" },
];

export const whyChooseUs = [
  {
    title: "Certified Installers",
    description: "MNRE empanelled and certified solar installation team.",
    icon: "BadgeCheck",
  },
  {
    title: "Quality Components",
    description: "Only Tier-1 panels, BIS certified inverters and structures.",
    icon: "Layers",
  },
  {
    title: "End-to-End Service",
    description: "From site survey to subsidy paperwork, we handle everything.",
    icon: "ClipboardCheck",
  },
  {
    title: "25 Year Warranty",
    description: "Panel performance warranty backed by manufacturer guarantee.",
    icon: "ShieldCheck",
  },
  {
    title: "Pan-India Service",
    description: "Sales, installation and after-sales service across 40+ cities.",
    icon: "MapPin",
  },
  {
    title: "Transparent Pricing",
    description: "No hidden costs - detailed quotation before you commit.",
    icon: "FileText",
  },
];

export const installationProcess = [
  {
    step: 1,
    title: "Free Site Survey",
    description: "Our engineer visits your property to assess roof space, shadow and load.",
    icon: "ClipboardList",
  },
  {
    step: 2,
    title: "Custom Design & Quote",
    description: "We design a system sized to your consumption and share a detailed quotation.",
    icon: "Ruler",
  },
  {
    step: 3,
    title: "Subsidy & Loan Assistance",
    description: "We help you apply for government subsidy and solar loan, if required.",
    icon: "Landmark",
  },
  {
    step: 4,
    title: "Installation",
    description: "Certified technicians install panels, inverter and wiring within 7-15 days.",
    icon: "Wrench",
  },
  {
    step: 5,
    title: "Net Meter & Commissioning",
    description: "We coordinate with the DISCOM for net meter installation and inspection.",
    icon: "Gauge",
  },
  {
    step: 6,
    title: "Monitoring & AMC",
    description: "Track generation via our app and opt for annual maintenance plans.",
    icon: "MonitorSmartphone",
  },
];

export const testimonials = [
  {
    name: "Rajesh Mehta",
    location: "Gurugram, Haryana",
    rating: 5,
    system: "5 kW Residential On-Grid",
    quote:
      "My electricity bill dropped from ₹6,500 to almost zero. The Sun Wave team handled the subsidy paperwork end-to-end.",
  },
  {
    name: "Priya Sharma",
    location: "Jaipur, Rajasthan",
    rating: 5,
    system: "3 kW Residential Hybrid",
    quote:
      "Professional installation and great after-sales support. Highly recommend for anyone considering rooftop solar.",
  },
  {
    name: "Anil Kumar",
    location: "Pune, Maharashtra",
    rating: 4,
    system: "50 kW Commercial",
    quote:
      "We installed solar for our factory and saved almost 40% on our monthly power bill within the first year.",
  },
  {
    name: "Sunita Rao",
    location: "Hyderabad, Telangana",
    rating: 5,
    system: "2 kW Residential On-Grid",
    quote:
      "Quick site survey, transparent pricing and installation completed in just 10 days. Very happy with the service.",
  },
];

export const projects = [
  { title: "Residential Rooftop - 5kW", location: "Gurugram, Haryana", type: "Residential", capacity: "5 kW" },
  { title: "Villa Rooftop - 8kW Hybrid", location: "Jaipur, Rajasthan", type: "Residential", capacity: "8 kW" },
  { title: "Retail Showroom - 25kW", location: "Pune, Maharashtra", type: "Commercial", capacity: "25 kW" },
  { title: "School Campus - 40kW", location: "Ahmedabad, Gujarat", type: "Commercial", capacity: "40 kW" },
  { title: "Textile Factory - 500kW", location: "Surat, Gujarat", type: "Industrial", capacity: "500 kW" },
  { title: "Cold Storage Unit - 100kW", location: "Nashik, Maharashtra", type: "Industrial", capacity: "100 kW" },
];

export const faqs = [
  {
    question: "How much does a solar system cost?",
    answer:
      "Costs depend on capacity and components. A typical residential 3kW system costs approximately ₹1,80,000 - ₹2,10,000 before subsidy. Request a free quote for exact pricing.",
  },
  {
    question: "How much subsidy will I get?",
    answer:
      "Under the PM Surya Ghar Muft Bijli Yojana, residential rooftop owners can get up to ₹78,000 subsidy depending on system capacity (up to 3kW).",
  },
  {
    question: "How much roof space is required?",
    answer:
      "On average, 1 kW of solar requires about 80-100 sq. ft. of shadow-free roof area. A 3kW system typically needs 250-300 sq. ft.",
  },
  {
    question: "How long does installation take?",
    answer:
      "Most residential installations are completed within 7-15 days after the site survey and design approval, subject to DISCOM approvals.",
  },
  {
    question: "Do I need a battery?",
    answer:
      "Not necessarily. On-grid systems don't need batteries and rely on net metering. A battery is only required for off-grid or hybrid systems that need backup power.",
  },
  {
    question: "What is net metering?",
    answer:
      "Net metering lets you export surplus solar power to the grid and draw from it when needed, with your DISCOM billing you only for the net units consumed.",
  },
  {
    question: "Is financing available?",
    answer:
      "Yes, we assist with solar loans from leading banks and NBFCs at competitive interest rates with tenures up to 10 years.",
  },
  {
    question: "What warranty do you offer?",
    answer:
      "Solar panels come with a 25-year performance warranty, inverters typically carry 5-10 years, and we provide a 5-year workmanship warranty on installation.",
  },
];

export const capacityGuide = [
  { capacity: "1 kW", monthlyUnits: "~120 units", monthlyBill: "₹800 - ₹1,200", roofArea: "80-100 sq.ft.", idealFor: "Small home, 1-2 BHK" },
  { capacity: "2 kW", monthlyUnits: "~240 units", monthlyBill: "₹1,500 - ₹2,200", roofArea: "160-200 sq.ft.", idealFor: "2-3 BHK home" },
  { capacity: "3 kW", monthlyUnits: "~360 units", monthlyBill: "₹2,200 - ₹3,200", roofArea: "250-300 sq.ft.", idealFor: "3-4 BHK home" },
  { capacity: "5 kW", monthlyUnits: "~600 units", monthlyBill: "₹3,800 - ₹5,500", roofArea: "400-500 sq.ft.", idealFor: "Large home / villa" },
  { capacity: "10 kW", monthlyUnits: "~1200 units", monthlyBill: "₹7,500 - ₹11,000", roofArea: "800-1000 sq.ft.", idealFor: "Villa / small business" },
];
