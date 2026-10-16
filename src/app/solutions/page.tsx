import { Reveal } from "@/components/Reveal";
import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { ProductMockup } from "@/components/ProductMockup";
import { Container, CtaBanner, DemoButton, IconBadge, PageHero } from "@/components/ui";
import { modules } from "@/content/modules";

export const metadata: Metadata = {
  title: "Solutions: Transportation, Fleet, Maintenance, Fuel & More",
  description:
    "Explore the Tech23 TMS platform: transportation management, fleet management, workshop maintenance, fuel, spare parts inventory, procurement, driver management, costing and financial analytics.",
  alternates: { canonical: "/solutions" },
};

export default function SolutionsPage() {
  return (
    <>
      <PageHero
        eyebrow="The Tech23 TMS platform"
        title="One platform for fleet operations and cost control"
        intro="Nine connected modules that share one database, so a gallon of fuel, a spare part or a repair hour flows straight to the truck, the trip and the books."
      >
        <div className="mt-8"><DemoButton variant="light" /></div>
      </PageHero>

      <section className="py-20 sm:py-24">
        <Container className="space-y-6">
          {modules.map((m, i) => (
            <article key={m.slug} className="grid items-center gap-8 rounded-3xl border border-slate-200 p-6 sm:p-10 lg:grid-cols-2 lg:gap-14">
              <Reveal from={i % 2 ? "right" : "left"} className={i % 2 ? "lg:order-2" : ""}>
                <IconBadge name={m.icon} />
                <h2 className="mt-5 text-2xl font-bold tracking-tight sm:text-3xl">{m.name}</h2>
                <p className="mt-3 leading-relaxed text-slate-600">{m.intro}</p>
                <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                  {m.features.slice(0, 4).map((f) => (
                    <li key={f.title} className="flex items-start gap-2 text-sm font-medium text-slate-700">
                      <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" /> {f.title}
                    </li>
                  ))}
                </ul>
                <Link href={`/solutions/${m.slug}`} className="mt-6 inline-flex items-center gap-1 font-semibold text-brand-600 hover:text-brand-700">
                  Explore {m.navLabel} <Icon name="arrow" className="h-4 w-4" />
                </Link>
              </Reveal>
              <ProductMockup variant={m.mockup} />
            </article>
          ))}
        </Container>
      </section>

      <CtaBanner />
    </>
  );
}
