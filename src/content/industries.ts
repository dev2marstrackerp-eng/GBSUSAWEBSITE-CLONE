import type { IconName } from "@/components/Icon";

export const industries: {
  slug: string;
  name: string;
  icon: IconName;
  summary: string;
  challenges: string[];
  solutions: string[];
}[] = [
  {
    slug: "trucking",
    name: "Trucking & Freight Carriers",
    icon: "truck",
    summary: "Asset-based carriers running truckload, LTL, flatbed or specialized freight who need tight control of trip cost and truck uptime.",
    challenges: ["Volatile fuel cost per mile", "Unplanned breakdowns and downtime", "Slow trip-to-invoice cycles", "No clear profit per truck or lane"],
    solutions: ["Trip planning, dispatch & automated invoicing", "Preventive maintenance & job cards", "Fuel & mileage controls", "Vehicle, trip and route P&L"],
  },
  {
    slug: "distribution",
    name: "Distribution & Private Fleets",
    icon: "warehouse",
    summary: "Manufacturers, distributors and wholesalers running their own delivery fleets alongside warehouses and stores.",
    challenges: ["Delivery fleet costs hidden in overheads", "Parts and stock spread across depots", "Driver accountability", "Disconnected purchasing"],
    solutions: ["Fleet register & utilization tracking", "Spare parts inventory & stock transfers", "Driver records, scoring & mobile app", "Procurement with multi-level approvals"],
  },
  {
    slug: "logistics",
    name: "Logistics & 3PL Providers",
    icon: "globe",
    summary: "Logistics businesses coordinating owned and contracted capacity for multiple customers and contracts.",
    challenges: ["Customers demanding shipment visibility", "Many invoice formats and rate structures", "Margins varying by customer", "Operations and finance out of sync"],
    solutions: ["Customer portal for shipment visibility", "Multi-format dynamic invoicing", "Customer and contract profitability", "Integrated accounting & dashboards"],
  },
];
