import { Reveal } from "@/components/Reveal";
import type { Metadata } from "next";
import Image from "next/image";
import { Icon } from "@/components/Icon";
import { Container, CtaBanner, DemoButton, IconBadge, PageHero } from "@/components/ui";
import { industries } from "@/content/industries";

export const metadata: Metadata = {
  title: "Industries: Trucking, Distribution & Logistics",
  description:
    "Tech23 TMS serves trucking and freight carriers, distribution companies with private fleets, and logistics and 3PL providers across the United States.",
  alternates: { canonical: "/industries" },
};

export default function IndustriesPage() {
  return (
    <>
      <PageHero
        eyebrow="Industries we serve"
        title="Transportation software for the businesses that keep America moving"
        intro="Whether you run a for-hire carrier, a private delivery fleet or a multi-customer logistics operation, Tech23 TMS gives you control of every trip and every cost."
      >
        <div className="mt-8"><DemoButton variant="light" /></div>
      </PageHero>

      <section className="py-20 sm:py-24">
        <Container className="space-y-8">
          {industries.map((ind) => (
            <Reveal as="article" key={ind.slug} id={ind.slug} className="scroll-mt-24 rounded-3xl border border-slate-200 p-6 sm:p-10">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                <IconBadge name={ind.icon} className="h-14 w-14" />
                <div>
                  <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{ind.name}</h2>
                  <p className="mt-2 max-w-3xl leading-relaxed text-slate-600">{ind.summary}</p>
                </div>
              </div>
              <div className="mt-8 grid gap-6 md:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-6">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Common challenges</h3>
                  <ul className="mt-4 space-y-3">
                    {ind.challenges.map((c) => (
                      <li key={c} className="flex items-start gap-2 text-slate-700">
                        <Icon name="alert" className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" /> {c}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-2xl bg-brand-50 p-6">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-brand-700">How Tech23 TMS helps</h3>
                  <ul className="mt-4 space-y-3">
                    {ind.solutions.map((s) => (
                      <li key={s} className="flex items-start gap-2 font-medium text-slate-800">
                        <Icon name="check" className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" /> {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          ))}
        </Container>
      </section>

      <section className="bg-slate-50 py-20">
        <Container className="grid items-center gap-10 lg:grid-cols-2">
          <Reveal from="left">
          <Image
            src="/images/source/transport-hero.webp"
            alt="Freight moving from warehouse to truck with route tracking"
            width={1024}
            height={563}
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="rounded-3xl shadow-xl"
          />
          </Reveal>
          <Reveal from="right">
            <h2 className="text-3xl font-bold tracking-tight">Fleets of every size</h2>
            <p className="mt-4 text-lg leading-relaxed text-slate-600">
              From growing regional carriers to established multi-depot operations, Tech23 TMS scales with your fleet. Start with the modules you
              need now and add more as you grow.
            </p>
          </Reveal>
        </Container>
      </section>

      <CtaBanner />
    </>
  );
}
