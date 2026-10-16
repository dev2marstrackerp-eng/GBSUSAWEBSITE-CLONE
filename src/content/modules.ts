import type { IconName } from "@/components/Icon";
import type { MockupVariant } from "@/components/ProductMockup";

export type Feature = { title: string; description: string; icon: IconName };

export type Module = {
  slug: string;
  name: string;
  navLabel: string;
  icon: IconName;
  summary: string;
  headline: string;
  intro: string;
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  features: Feature[];
  outcomes: string[];
  mockup: MockupVariant;
};

export const modules: Module[] = [
  {
    slug: "transportation-management",
    name: "Transportation Management",
    navLabel: "Transportation Management",
    icon: "route",
    summary: "Plan, dispatch and close every trip, then invoice straight from the trip record.",
    headline: "Trip planning, dispatch and execution in one workflow",
    intro:
      "Tech23 TMS takes every load from order to invoice. Dispatchers plan routes, assign trucks and drivers, and track progress. When the trip is closed, it flows straight into billing, so nothing is keyed in twice.",
    seoTitle: "Transportation Management Software for Trucking Companies",
    seoDescription:
      "Trip planning, dispatch, trip closure and automated invoicing for US trucking and logistics companies. Tech23 TMS connects every load to its true cost.",
    keywords: ["transportation management software", "trucking dispatch software", "trip management", "TMS"],
    features: [
      { icon: "route", title: "Route & trip planning", description: "Build trips with origin, destination, route, cargo and customer details, then assign the right truck, trailer and driver." },
      { icon: "dispatch", title: "Dispatch board", description: "See every planned, in-transit and completed trip on one board and spot delays before customers call." },
      { icon: "check", title: "Trip closure", description: "Close trips with actual mileage, fuel, expenses and proof-of-delivery documents attached to the record." },
      { icon: "invoice", title: "Multi-format dynamic invoicing", description: "Generate customer invoices automatically from closed trips, using the invoice format each customer requires." },
      { icon: "alert", title: "Delay & exception alerts", description: "Get alerts when a trip runs behind schedule or deviates from plan, so dispatch can react fast." },
      { icon: "portal", title: "Customer portal", description: "Give customers self-service visibility of their shipments and documents. Fewer status calls, more trust." },
    ],
    outcomes: [
      "Higher truck utilization",
      "Better route planning and on-time delivery",
      "Faster billing cycles with automated invoicing",
      "Full visibility of every trip, from dispatch to cash",
    ],
    mockup: "dispatch",
  },
  {
    slug: "fleet-management",
    name: "Fleet Management",
    navLabel: "Fleet Management",
    icon: "truck",
    summary: "One record per truck and trailer: utilization, documents, tires and performance.",
    headline: "Know the status, cost and performance of every unit",
    intro:
      "Tech23 TMS keeps a complete digital record for every tractor, trailer and asset. Utilization, documents, tires, maintenance history and profitability sit in one place, so fleet managers can decide with confidence.",
    seoTitle: "Fleet Management Software for US Trucking Fleets",
    seoDescription:
      "Vehicle records, utilization, document expiry alerts, tire management and vehicle-wise profit and loss for trucking fleets with Tech23 TMS.",
    keywords: ["fleet management software", "truck fleet management", "tire management", "vehicle utilization"],
    features: [
      { icon: "truck", title: "Complete vehicle records", description: "Registration, specifications, assignments, documents and full service history for every unit." },
      { icon: "gauge", title: "Utilization tracking", description: "See which trucks are earning and which are idle, by day, week or month." },
      { icon: "bell", title: "Document expiry alerts", description: "Automatic email and WhatsApp reminders before registrations, permits and insurance expire." },
      { icon: "tire", title: "Tire management", description: "Cost-per-mile analysis, PSI tracking, rotation history and retreading. Make every tire earn its keep." },
      { icon: "pin", title: "Fleet tracking integration", description: "Geo-fencing, delay alerts and driver scoring through your connected tracking provider." },
      { icon: "chart", title: "Vehicle-wise P&L", description: "Revenue against every operating cost, per vehicle, so you know which units actually make money." },
    ],
    outcomes: [
      "Fewer idle trucks and better asset returns",
      "No missed renewals or compliance lapses",
      "Lower tire spend per mile",
      "Clear profit picture per unit",
    ],
    mockup: "fleet",
  },
  {
    slug: "workshop-maintenance",
    name: "Workshop & Preventive Maintenance",
    navLabel: "Workshop & Maintenance",
    icon: "wrench",
    summary: "Preventive maintenance schedules, job cards and inspections that cut unplanned downtime.",
    headline: "Keep trucks on the road, not in the shop",
    intro:
      "Unplanned breakdowns cost more than repairs. They cost loads, customers and reputation. Tech23 TMS schedules preventive maintenance, runs the workshop through digital job cards and tracks every hour and part spent on each unit.",
    seoTitle: "Fleet Maintenance & Workshop Management Software",
    seoDescription:
      "Preventive maintenance scheduling, job cards, inspections and repair cost tracking for trucking fleets. Reduce downtime with Tech23 TMS.",
    keywords: ["fleet maintenance software", "preventive maintenance trucks", "job card software", "workshop management"],
    features: [
      { icon: "calendar", title: "Preventive maintenance schedules", description: "Service plans by mileage, engine hours or date, with automatic reminders before work is due." },
      { icon: "clipboard", title: "Digital job cards", description: "Open, assign and close job cards with labor, parts and outside work captured against the vehicle." },
      { icon: "check", title: "Inspections", description: "Standard inspection checklists so defects are caught early and recorded consistently." },
      { icon: "box", title: "Parts issued to the job", description: "Spare parts issue directly from inventory to the job card, so every repair has its true cost." },
      { icon: "clock", title: "Downtime tracking", description: "Measure how long each unit is off the road and why, and find the repeat offenders." },
      { icon: "chart", title: "Maintenance cost analysis", description: "Repair and service cost per vehicle, per mile and per category to guide replace-or-repair decisions." },
    ],
    outcomes: [
      "Fewer roadside breakdowns",
      "Lower maintenance cost per mile",
      "Accountable workshop labor and parts usage",
      "Data-driven replacement decisions",
    ],
    mockup: "workshop",
  },
  {
    slug: "fuel-management",
    name: "Fuel Management",
    navLabel: "Fuel Management",
    icon: "fuel",
    summary: "Control fuel purchases, issues and consumption, and catch losses fast.",
    headline: "Fuel is your biggest variable cost. Control it.",
    intro:
      "Tech23 TMS records every gallon purchased and issued, links it to the truck, driver and trip, and flags consumption that does not add up. Fuel audits and tank readings give you a full fuel trail.",
    seoTitle: "Fuel Management Software for Trucking Fleets",
    seoDescription:
      "Track fuel purchases, issues, tank readings and consumption per truck and trip. Fuel audits and mileage controls in Tech23 TMS reduce fuel cost and loss.",
    keywords: ["fuel management software", "fleet fuel tracking", "fuel cost control", "fuel audit"],
    features: [
      { icon: "fuel", title: "Fuel purchases & issues", description: "Record fuel bought from vendors and issued to trucks, linked to the trip, vehicle and driver." },
      { icon: "gauge", title: "Fuel & mileage controls", description: "Expected vs. actual consumption per vehicle and route, with exceptions flagged automatically." },
      { icon: "clipboard", title: "Fuel audits", description: "Structured audits that reconcile fuel bought, issued and consumed." },
      { icon: "tank", title: "Tank readings", description: "Track on-site tank dips and deliveries so yard fuel is fully accounted for." },
      { icon: "link", title: "Delivery note linking", description: "Tie each fuel delivery to its supplier delivery note and invoice for clean reconciliation." },
      { icon: "chart", title: "Fuel cost analytics", description: "Fuel cost per mile, per truck, per route and per customer." },
    ],
    outcomes: [
      "Lower fuel cost per mile",
      "Early detection of fuel loss and misuse",
      "Clean reconciliation of fuel invoices",
      "Accurate fuel cost in every trip margin",
    ],
    mockup: "fuel",
  },
  {
    slug: "inventory-spare-parts",
    name: "Inventory & Spare Parts",
    navLabel: "Inventory & Spare Parts",
    icon: "box",
    summary: "Spare parts stock, workshop issues, transfers and replenishment.",
    headline: "The right part, in the right shop, at the right time",
    intro:
      "Every hour a truck waits for a part is lost revenue. Tech23 TMS tracks spare parts across stores and locations, issues them to workshop jobs, and signals when stock needs replenishing.",
    seoTitle: "Spare Parts Inventory Software for Fleets",
    seoDescription:
      "Spare parts tracking, stock transfers, workshop issues and replenishment for trucking fleets with Tech23 TMS inventory management.",
    keywords: ["spare parts inventory software", "fleet parts management", "stock control", "workshop inventory"],
    features: [
      { icon: "box", title: "Spare parts tracking", description: "Real-time stock levels by part, store and location, with full movement history." },
      { icon: "wrench", title: "Workshop issues", description: "Issue parts against job cards so every part is charged to the right vehicle and repair." },
      { icon: "transfer", title: "Stock transfers", description: "Move stock between yards and stores with full traceability." },
      { icon: "refresh", title: "Replenishment", description: "Reorder levels flag low stock so critical parts never run out." },
      { icon: "cart", title: "Linked to procurement", description: "Turn shortages into purchase requests in a few clicks." },
      { icon: "chart", title: "Stock valuation & reports", description: "Stock value, slow movers and usage by vehicle or category." },
    ],
    outcomes: [
      "Less downtime waiting for parts",
      "Reduced dead and excess stock",
      "Every part traced to a vehicle",
      "Accurate inventory valuation",
    ],
    mockup: "inventory",
  },
  {
    slug: "procurement",
    name: "Procurement",
    navLabel: "Procurement",
    icon: "cart",
    summary: "Purchase requests, supplier quotations, approvals and purchase orders.",
    headline: "Controlled purchasing from request to receipt",
    intro:
      "Tech23 TMS gives operations a disciplined buying process. Requests are raised, quotations compared, multi-level approvals applied and purchase orders issued, all with a full audit trail.",
    seoTitle: "Procurement Software for Trucking & Logistics Companies",
    seoDescription:
      "Purchase requests, supplier quotations, approvals and purchase orders for fleet operators. Tech23 TMS brings spend control and audit trails to procurement.",
    keywords: ["procurement software", "purchase order approval", "supplier quotations", "fleet purchasing"],
    features: [
      { icon: "clipboard", title: "Purchase requests", description: "Workshop, stores and operations raise requests with justification and the vehicle they relate to." },
      { icon: "compare", title: "Supplier quotations", description: "Collect and compare supplier quotes side by side before you commit." },
      { icon: "shield", title: "Multi-level approvals", description: "Role-based approval workflows, with mobile-friendly approve and reject." },
      { icon: "invoice", title: "Purchase orders", description: "Issue POs from approved requests and track them through receipt." },
      { icon: "box", title: "Goods receipt into stock", description: "Received items update inventory automatically." },
      { icon: "eye", title: "Full audit trail", description: "Every request, approval and change is logged for transparency and compliance." },
    ],
    outcomes: [
      "Spend under control",
      "Better supplier pricing through quotation comparison",
      "Faster approvals from anywhere",
      "Audit-ready purchasing records",
    ],
    mockup: "procurement",
  },
  {
    slug: "driver-management",
    name: "Driver Management",
    navLabel: "Driver Management",
    icon: "driver",
    summary: "Driver assignments, records, documents and performance scoring.",
    headline: "Safer, more accountable drivers",
    intro:
      "Drivers are your fleet's front line. Tech23 TMS keeps their records, documents and assignments organized, tracks performance and fatigue, and keeps them connected through a driver mobile app.",
    seoTitle: "Driver Management Software for Trucking Fleets",
    seoDescription:
      "Driver records, assignments, document expiry alerts, performance scoring and fatigue monitoring in Tech23 TMS, plus a driver mobile app.",
    keywords: ["driver management software", "driver scoring", "truck driver records", "driver app"],
    features: [
      { icon: "driver", title: "Driver profiles & records", description: "Licenses, certifications, contact details, history and documents in one profile." },
      { icon: "route", title: "Trip assignments", description: "Assign drivers to trips and vehicles, with full assignment history." },
      { icon: "star", title: "Performance scoring", description: "Score drivers on key driving metrics, fuel efficiency and on-time delivery." },
      { icon: "moon", title: "Fatigue monitoring", description: "Track driving and rest patterns so fatigued drivers are not dispatched." },
      { icon: "bell", title: "Document expiry alerts", description: "Automatic reminders before licenses and certifications lapse." },
      { icon: "phone", title: "Driver mobile app", description: "Drivers get trip details, instructions and updates, and report back from the road." },
    ],
    outcomes: [
      "Safer driving habits",
      "Greater driver accountability",
      "No expired licenses on the road",
      "Better dispatcher–driver communication",
    ],
    mockup: "drivers",
  },
  {
    slug: "costing-profitability",
    name: "Costing & Profitability",
    navLabel: "Costing & Profitability",
    icon: "dollar",
    summary: "True cost and margin per vehicle, trip, route and customer.",
    headline: "Know exactly where you make and lose money",
    intro:
      "Fuel, maintenance, tires, driver costs and overheads are all captured at the source, so Tech23 TMS can show the real margin on every vehicle, trip, route and customer without spreadsheet guesswork.",
    seoTitle: "Trucking Cost & Profitability Analysis Software",
    seoDescription:
      "Vehicle, trip, route and customer profitability for trucking companies. Tech23 TMS captures every operating cost to show your true margins.",
    keywords: ["trucking profitability", "cost per mile software", "trip costing", "route profitability"],
    features: [
      { icon: "truck", title: "Vehicle profit & loss", description: "Revenue and every operating cost per truck, for any period." },
      { icon: "route", title: "Trip costing", description: "Fuel, driver expenses, tolls and other trip costs against trip revenue." },
      { icon: "pin", title: "Route profitability", description: "Compare lanes and routes to find which ones pay and which ones drain margin." },
      { icon: "users", title: "Customer profitability", description: "See which customers and contracts deliver the best returns." },
      { icon: "gauge", title: "Cost per mile", description: "Cost per mile by vehicle, category and cost type." },
      { icon: "chart", title: "Trend analysis", description: "Track margins over time and catch cost creep early." },
    ],
    outcomes: [
      "Pricing grounded in real costs",
      "Unprofitable lanes and customers identified",
      "Cost overruns caught early",
      "Margin visibility for management",
    ],
    mockup: "costing",
  },
  {
    slug: "financial-integration-analytics",
    name: "Financial Integration & Analytics",
    navLabel: "Finance & Analytics",
    icon: "chart",
    summary: "Operations flow straight into accounting, with live dashboards and approvals.",
    headline: "Operations and finance on the same numbers",
    intro:
      "Tech23 TMS is built on the Tech23 ERP platform, so trips, fuel, maintenance and purchasing post straight to the books. Live dashboards and automated reports give management one version of the truth.",
    seoTitle: "Transport Financial Reporting & Analytics Dashboards",
    seoDescription:
      "Full accounting, reconciliation, fixed assets and real-time analytics dashboards connected to fleet operations in Tech23 TMS.",
    keywords: ["transport accounting software", "fleet analytics dashboard", "trucking financial reporting", "ERP for trucking"],
    features: [
      { icon: "invoice", title: "Full accounting", description: "General ledger, receivables, payables and reconciliation built in, not bolted on." },
      { icon: "truck", title: "Fixed asset register", description: "Trucks and trailers managed as fixed assets with depreciation." },
      { icon: "link", title: "Operations-to-finance posting", description: "Trips, fuel, parts and purchases post automatically to the right accounts." },
      { icon: "chart", title: "Live dashboards", description: "Interactive charts and KPIs with filters by division, location, date and team, plus drill-down to detail." },
      { icon: "shield", title: "Approvals & audit trail", description: "Role-based access, multi-level approvals and a complete audit trail." },
      { icon: "download", title: "Automated reports", description: "Scheduled operational and financial reports you can export and share with stakeholders." },
    ],
    outcomes: [
      "Faster month-end close",
      "One version of the truth",
      "Real-time management visibility",
      "Fewer manual reconciliations",
    ],
    mockup: "finance",
  },
];

export const getModule = (slug: string) => modules.find((m) => m.slug === slug);
