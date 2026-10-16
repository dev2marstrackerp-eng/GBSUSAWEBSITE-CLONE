import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AppShowcase } from "@/components/AppShowcase";
import { Icon, type IconName } from "@/components/Icon";
import { JsonLd } from "@/components/JsonLd";
import { Reveal } from "@/components/Reveal";
import { ProductMockup } from "@/components/ProductMockup";
import { WebShowcase } from "@/components/WebShowcase";
import { Button, Container, CtaBanner, DemoButton, IconBadge, SectionHeading } from "@/components/ui";
import { faqs } from "@/content/faqs";
import { industries } from "@/content/industries";
import { modules } from "@/content/modules";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const whyTech23: { icon: IconName; title: string; text: string }[] = [
  { icon: "gauge", title: "Maximize truck utilization", text: "Keep every tractor and trailer earning, and see idle assets instantly." },
  { icon: "fuel", title: "Reduce fuel & maintenance costs", text: "Control your two biggest variable costs with audits, alerts and preventive maintenance." },
  { icon: "route", title: "Improve on-time delivery", text: "Better route planning, dispatch visibility and delay alerts keep customers on schedule." },
  { icon: "eye", title: "Complete operational visibility", text: "Trips, trucks, drivers, parts and costs on one platform, with one version of the truth." },
  { icon: "invoice", title: "Automate invoicing & reports", text: "Invoices generate from closed trips. Reports build themselves." },
];

const spotlights = [
  {
    slug: "transportation-management",
    eyebrow: "Transportation Management",
    title: "From load to invoice without re-keying a thing",
    text: "Plan trips, dispatch trucks and drivers, track progress and close trips with actual costs. Closed trips invoice automatically in each customer's preferred format.",
    points: ["Route & trip planning", "Live dispatch board", "Trip closure with actuals", "Multi-format dynamic invoicing"],
    mockup: "dispatch" as const,
  },
  {
    slug: "workshop-maintenance",
    eyebrow: "Workshop & Preventive Maintenance",
    title: "Less downtime. Fewer roadside surprises.",
    text: "Schedule preventive maintenance by mileage, hours or date. Run your shop on digital job cards with labor and parts charged to every unit.",
    points: ["Preventive maintenance schedules", "Digital job cards & inspections", "Parts issued from inventory", "Downtime & repair cost analysis"],
    mockup: "workshop" as const,
  },
  {
    slug: "costing-profitability",
    eyebrow: "Costing & Profitability",
    title: "See the true margin on every truck, trip and lane",
    text: "Because fuel, maintenance, tires, driver and overhead costs are captured at the source, profitability is calculated, not estimated.",
    points: ["Vehicle-wise profit & loss", "Trip and route costing", "Customer profitability", "Cost per mile trends"],
    mockup: "costing" as const,
  },
];

const smartFeatures: { icon: IconName; title: string }[] = [
  { icon: "gauge", title: "Fuel & mileage controls" },
  { icon: "moon", title: "Driver fatigue monitoring" },
  { icon: "bell", title: "Document expiry alerts by email & WhatsApp" },
  { icon: "invoice", title: "Multi-format dynamic invoicing" },
  { icon: "phone", title: "Driver mobile app" },
  { icon: "portal", title: "Customer portal" },
  { icon: "dollar", title: "Vehicle-wise profit & loss" },
  { icon: "tire", title: "Tire cost-per-mile tracking" },
  { icon: "shield", title: "Multi-level approvals & audit trail" },
];

const steps = [
  { title: "Live demo", text: "We walk through Tech23 TMS using trucking workflows like yours." },
  { title: "Configure", text: "Our team sets up your fleet, locations, cost centers, workflows and approvals." },
  { title: "Migrate & train", text: "We load your master data and train dispatch, shop, stores and finance users." },
  { title: "Go live & grow", text: "Launch with ongoing support, then add modules as your operation scales." },
];

export default function Home() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-brand-950">
        <div className="bg-grid absolute inset-0" aria-hidden="true" />
        <div className="animate-glow absolute -left-40 top-20 h-96 w-96 rounded-full bg-brand-600/40 blur-3xl" aria-hidden="true" />
        <div className="absolute -right-20 -top-20 h-[28rem] w-[28rem] rounded-full bg-brand-500/30 blur-3xl" aria-hidden="true" />
        <Container className="relative grid items-center gap-12 py-16 sm:py-20 lg:grid-cols-12 lg:py-28">
          <div className="lg:col-span-6">
            <p className="hero-in inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-200">
              <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-brand-400" /></span>
              Tech23 Transport Management System
            </p>
            <h1 style={{ "--d": "100ms" } as React.CSSProperties} className="hero-in mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Complete Control of Your Fleet.{" "}
              <span className="bg-gradient-to-r from-brand-300 to-brand-100 bg-clip-text text-transparent">Every Trip. Every Cost.</span>
            </h1>
            <p style={{ "--d": "200ms" } as React.CSSProperties} className="hero-in mt-6 max-w-xl text-lg leading-relaxed text-brand-100">
              Integrated transportation management software for trucking and logistics companies. Trip management, fleet maintenance,
              fuel, spare parts, procurement and financial reporting run on one platform.
            </p>
            <div style={{ "--d": "300ms" } as React.CSSProperties} className="hero-in mt-8 flex flex-col gap-3 sm:flex-row">
              <DemoButton variant="light" />
              <Button href="/solutions" variant="outline-light">Explore the Platform</Button>
            </div>
            <ul style={{ "--d": "400ms" } as React.CSSProperties} className="hero-in mt-10 grid max-w-lg grid-cols-1 gap-3 text-sm text-brand-100 sm:grid-cols-2">
              {["Built for trucking fleets", "Operations + finance in one system", "Web-based, with mobile apps", `${site.implementations} implementations`].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <Icon name="check" className="h-4 w-4 text-brand-300" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div style={{ "--d": "300ms" } as React.CSSProperties} className="hero-in lg:col-span-6">
            <div className="animate-float">
              <ProductMockup variant="overview" className="lg:translate-x-6" />
            </div>
          </div>
        </Container>
      </section>

      {/* Problem → solution */}
      <section className="border-b border-slate-100 bg-white py-14">
        <Container className="grid gap-8 md:grid-cols-3">
          {[
            { icon: "fuel" as const, title: "Rising fuel costs", text: "Fuel and mileage controls flag every gallon that doesn't add up." },
            { icon: "clipboard" as const, title: "Manual processes", text: "Spreadsheets and paper give way to one connected workflow from dispatch to invoice." },
            { icon: "wrench" as const, title: "Unplanned breakdowns", text: "Preventive maintenance and digital job cards keep trucks on the road." },
          ].map((p, i) => (
            <Reveal key={p.title} delay={i * 120} className="flex gap-4">
              <IconBadge name={p.icon} />
              <div>
                <h2 className="text-base font-semibold">{p.title}</h2>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">{p.text}</p>
              </div>
            </Reveal>
          ))}
        </Container>
      </section>

      {/* Mobile apps showcase */}
      <AppShowcase />

      {/* Web apps showcase */}
      <WebShowcase />

      {/* Modules */}
      <section className="bg-slate-50 py-20 sm:py-24" id="platform">
        <Container>
          <SectionHeading
            eyebrow="One integrated platform"
            title="Everything your trucking operation runs on"
            intro="Tech23 TMS connects trips, trucks, drivers, the shop, stores, purchasing and finance, so every operational event carries its true cost."
          />
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {modules.map((m, i) => (
              <Reveal key={m.slug} delay={(i % 3) * 120}>
              <Link
                href={`/solutions/${m.slug}`}
                className="group block h-full rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-xl hover:shadow-brand-900/5"
              >
                <IconBadge name={m.icon} className="transition group-hover:bg-brand-600 group-hover:text-white" />
                <h3 className="mt-5 text-lg font-semibold">{m.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{m.summary}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-600">
                  Learn more <Icon name="arrow" className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </span>
              </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Why Tech23 */}
      <section className="py-20 sm:py-24">
        <Container className="grid gap-12 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">
            <SectionHeading
              center={false}
              eyebrow="Why Tech23 TMS"
              title="Built to cut cost and raise utilization"
              intro="The transport and logistics sector is changing fast. Tech23 TMS gives fleet operators the visibility and control to stay profitable."
            />
            <div className="mt-8"><DemoButton /></div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
            {whyTech23.map((w, i) => (
              <Reveal key={w.title} delay={(i % 2) * 120} from="right" className={`rounded-2xl border border-slate-200 p-6 transition hover:border-brand-300 hover:shadow-lg ${i === 4 ? "sm:col-span-2" : ""}`}>
                <IconBadge name={w.icon} />
                <h3 className="mt-4 font-semibold">{w.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{w.text}</p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Spotlights */}
      <section className="bg-slate-50 py-20 sm:py-24">
        <Container className="space-y-20 lg:space-y-28">
          {spotlights.map((s, i) => (
            <div key={s.slug} className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
              <Reveal from={i % 2 ? "right" : "left"} className={i % 2 ? "lg:order-2" : ""}>
                <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">{s.eyebrow}</p>
                <h2 className="mt-2 text-3xl font-bold tracking-tight">{s.title}</h2>
                <p className="mt-4 text-lg leading-relaxed text-slate-600">{s.text}</p>
                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                  {s.points.map((p) => (
                    <li key={p} className="flex items-start gap-2 text-sm font-medium text-slate-700">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white"><Icon name="check" className="h-3 w-3" /></span>
                      {p}
                    </li>
                  ))}
                </ul>
                <Link href={`/solutions/${s.slug}`} className="mt-8 inline-flex items-center gap-1 font-semibold text-brand-600 hover:text-brand-700">
                  Explore {s.eyebrow} <Icon name="arrow" className="h-4 w-4" />
                </Link>
              </Reveal>
              <ProductMockup variant={s.mockup} />
            </div>
          ))}
        </Container>
      </section>

      {/* Smart features */}
      <section className="relative overflow-hidden bg-brand-950 py-20 sm:py-24">
        <div className="bg-grid absolute inset-0" aria-hidden="true" />
        <Container className="relative">
          <SectionHeading dark eyebrow="Smart features" title="The details that protect your margin" intro="Controls and automation built into every Tech23 TMS deployment." />
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {smartFeatures.map((f, i) => (
              <Reveal key={f.title} delay={(i % 3) * 100} className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-5 transition hover:border-brand-400/50 hover:bg-white/10">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-600 text-white"><Icon name={f.icon} className="h-5 w-5" /></span>
                <span className="font-medium text-white">{f.title}</span>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Industries */}
      <section className="bg-slate-50 py-20 sm:py-24">
        <Container>
          <SectionHeading eyebrow="Industries we serve" title="Made for operators who move freight" />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {industries.map((ind, i) => (
              <Reveal key={ind.slug} delay={i * 120} className="rounded-2xl border border-slate-200 bg-white p-7 transition hover:shadow-lg">
                <IconBadge name={ind.icon} />
                <h3 className="mt-5 text-lg font-semibold">{ind.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{ind.summary}</p>
              </Reveal>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/industries" className="inline-flex items-center gap-1 font-semibold text-brand-600 hover:text-brand-700">
              See how Tech23 TMS fits your operation <Icon name="arrow" className="h-4 w-4" />
            </Link>
          </div>
        </Container>
      </section>

      {/* Success story */}
      <section className="py-20 sm:py-24">
        <Container>
          <Reveal from="zoom" className="grid items-center gap-10 rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-brand-50 p-8 sm:p-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">Customer success</p>
              <div className="mt-5 inline-block rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
                <Image src="/images/source/client-siginon.png" alt="Siginon Group logo" width={200} height={92} className="h-14 w-auto" />
              </div>
            </div>
            <div className="lg:col-span-8">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Siginon Group transformed its transport operations with Tech23</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {["Reduced fuel costs", "Improved fleet visibility", "Faster deliveries", "Enhanced client satisfaction"].map((o) => (
                  <p key={o} className="flex items-center gap-2 font-medium text-slate-800">
                    <Icon name="check" className="h-5 w-5 text-brand-600" /> {o}
                  </p>
                ))}
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Implementation */}
      <section className="bg-slate-50 py-20 sm:py-24">
        <Container>
          <SectionHeading eyebrow="Getting started" title="From demo to go-live with a team that knows transport" />
          <ol className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <Reveal as="li" key={s.title} delay={i * 150} className="relative rounded-2xl border border-slate-200 bg-white p-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-600 font-bold text-white">{i + 1}</span>
                <h3 className="mt-4 font-semibold">{s.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{s.text}</p>
              </Reveal>
            ))}
          </ol>
        </Container>
      </section>

      {/* FAQ */}
      <section className="py-20 sm:py-24">
        <Container className="max-w-4xl">
          <SectionHeading eyebrow="FAQ" title="Frequently asked questions" />
          <Reveal className="mt-12 divide-y divide-slate-200 rounded-2xl border border-slate-200">
            {faqs.map((f) => (
              <details key={f.q} className="group p-6 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-slate-900">
                  {f.q}
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600 transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 leading-relaxed text-slate-600">{f.a}</p>
              </details>
            ))}
          </Reveal>
        </Container>
      </section>

      <CtaBanner />
    </>
  );
}
