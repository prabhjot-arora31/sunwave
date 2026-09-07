import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";

export const SITE_SETTINGS_CACHE_TAG = "site-settings";
export const SITE_SETTINGS_ID = 1;

export type SubsidySlab = { capacity: string; subsidy: string };

export type SiteSettingsData = {
  yearsExperience: string;
  happyCustomers: string;
  mwCapacity: string;
  citiesServed: string;
  loanAmount: string;
  interestRate: string;
  loanTenure: string;
  loanProcessing: string;
  financePartners: string[];
  subsidySlabs: SubsidySlab[];
};

// Matches the values these fields held as hardcoded content before this
// feature existed - used whenever no settings row has been saved yet, or a
// DB hiccup happens during a prerendered build.
export const DEFAULT_SITE_SETTINGS: SiteSettingsData = {
  yearsExperience: "3",
  happyCustomers: "700+",
  mwCapacity: "3",
  citiesServed: "10",
  loanAmount: "Up to ₹5,00,000 - ₹6,00,000",
  interestRate: "Starting at 5% p.a.",
  loanTenure: "Up to 10 years",
  loanProcessing: "Minimal documentation, 48-hour approval",
  financePartners: ["Bank of India (BOI)", "Bank of Maharashtra", "Punjab National Bank", "Bank of Baroda"],
  subsidySlabs: [
    { capacity: "1 kW", subsidy: "₹30,000" },
    { capacity: "2 kW", subsidy: "₹60,000" },
    { capacity: "3 kW and above", subsidy: "₹78,000" },
  ],
};

export const getSiteSettings = unstable_cache(
  async (): Promise<SiteSettingsData> => {
    try {
      const row = await prisma.siteSettings.findUnique({ where: { id: SITE_SETTINGS_ID } });
      if (!row) return DEFAULT_SITE_SETTINGS;

      return {
        yearsExperience: row.yearsExperience,
        happyCustomers: row.happyCustomers,
        mwCapacity: row.mwCapacity,
        citiesServed: row.citiesServed,
        loanAmount: row.loanAmount,
        interestRate: row.interestRate,
        loanTenure: row.loanTenure,
        loanProcessing: row.loanProcessing,
        financePartners: row.financePartners as string[],
        subsidySlabs: row.subsidySlabs as SubsidySlab[],
      };
    } catch {
      // Never fail a prerendered page over a DB hiccup - fall back to the
      // last known-good hardcoded values.
      return DEFAULT_SITE_SETTINGS;
    }
  },
  ["public-site-settings"],
  { revalidate: 3600, tags: [SITE_SETTINGS_CACHE_TAG] }
);
