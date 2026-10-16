// Central site settings. Update the US contact details and production domain
// here once confirmed — every page, the sitemap and structured data read from this file.
export const site = {
  name: "Tech23 TMS",
  fullName: "Tech23 Transport Management System",
  tagline: "Complete Control of Your Fleet. Every Trip. Every Cost.",
  description:
    "Tech23 TMS is integrated transportation management software for US trucking and logistics companies — trips, dispatch, fleet maintenance, fuel, spare parts, procurement, costing and financial reporting in one platform.",
  // TODO: replace with the production domain before go-live.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.tech23tms.com",
  demoUrl: "https://register.tech23.net/",
  loginUrl: "https://register.tech23.net/login",
  company: "Genius Business Systems (GBS)",
  // TODO: replace with the US sales line / email once assigned.
  email: "sales@gbsafrica.net",
  phone: "+254 769 317332",
  phoneLabel: "Sales (global HQ)",
  hq: "Nairobi, Kenya",
  implementations: "50+",
} as const;

export const mainNav = [
  { label: "Solutions", href: "/solutions" },
  { label: "Industries", href: "/industries" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;
