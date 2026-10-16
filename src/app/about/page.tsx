import { Reveal } from "@/components/Reveal";
import type { Metadata } from "next";
import Image from "next/image";
import { CountUp } from "@/components/CountUp";
import { Container, CtaBanner, IconBadge, PageHero } from "@/components/ui";
import type { IconName } from "@/components/Icon";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Tech23",
  description:
    "Tech23 TMS is developed by Genius Business Systems (GBS), the team behind the Tech23 ERP platform, with 50+ successful implementations for transport and logistics businesses.",
  alternates: { canonical: "/about" },
};

const values: { icon: IconName; title: string; text: string }[] = [
  { icon: "users", title: "Customer-centric innovation", text: "We put customers' operational needs first in everything we build." },
  { icon: "shield", title: "Security & trust", text: "We protect your data with industry-standard practices." },
  { icon: "layers", title: "Scalability & performance", text: "We design solutions that grow with your fleet and your business." },
  { icon: "refresh", title: "Agility & continuous improvement", text: "We adapt quickly and keep improving the product with every release." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Tech23"
        title="Transport software built by a team that lives in operations"
        intro={`Tech23 TMS is developed by ${site.company}, the team behind the Tech23 ERP platform.`}
      />

      <section className="py-20 sm:py-24">
        <Container className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal from="left">
            <h2 className="text-3xl font-bold tracking-tight">Our story</h2>
            <div className="mt-5 space-y-4 text-lg leading-relaxed text-slate-600">
              <p>
                Genius Business Systems (GBS) builds enterprise software, ERP solutions and custom systems. Our flagship platform, Tech23 ERP,
                is a robust, scalable enterprise solution that brings together workflow optimization, team collaboration and real-time insight.
              </p>
              <p>
                Transport and logistics became our deepest specialization. Tech23 TMS packages that experience into a dedicated transportation
                management system: trip operations, fleet, workshop, fuel, spare parts, procurement and finance on one platform.
              </p>
              <p>We are now bringing Tech23 TMS to trucking and logistics companies in the United States.</p>
            </div>
          </Reveal>
          <Reveal from="right">
          <Image
            src="/images/source/dashboards-team.jpg"
            alt="Team reviewing analytics dashboards"
            width={1024}
            height={683}
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="rounded-3xl shadow-xl"
          />
          </Reveal>
        </Container>
      </section>

      <section className="bg-slate-50 py-16">
        <Container className="grid gap-6 text-center sm:grid-cols-3">
          {[
            [site.implementations, "Successful implementations"],
            ["9", "Integrated TMS modules"],
            ["1", "Platform for operations & finance"],
          ].map(([n, l], i) => (
            <Reveal key={l} delay={i * 120} from="zoom" className="rounded-2xl bg-white p-8 ring-1 ring-slate-200">
              <p className="text-4xl font-extrabold text-brand-600"><CountUp value={n} /></p>
              <p className="mt-2 font-medium text-slate-600">{l}</p>
            </Reveal>
          ))}
        </Container>
      </section>

      <section className="py-20 sm:py-24">
        <Container>
          <div className="grid gap-6 md:grid-cols-2">
            <Reveal from="left" className="rounded-3xl bg-brand-950 p-8 text-white sm:p-10">
              <p className="text-sm font-semibold uppercase tracking-wider text-brand-300">Our vision</p>
              <p className="mt-3 text-xl leading-relaxed text-brand-50">
                To help businesses achieve operational excellence and productivity through tailored ERP solutions and intelligent digital systems.
              </p>
            </Reveal>
            <Reveal from="right" className="rounded-3xl bg-brand-600 p-8 text-white sm:p-10">
              <p className="text-sm font-semibold uppercase tracking-wider text-brand-100">Our mission</p>
              <p className="mt-3 text-xl leading-relaxed text-white">
                To power our clients&apos; success with software, services, support, training and consulting that drive efficiency and help them
                lead their industries.
              </p>
            </Reveal>
          </div>

          <h2 className="mt-20 text-center text-3xl font-bold tracking-tight">Our values</h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i * 100} className="rounded-2xl border border-slate-200 p-6">
                <IconBadge name={v.icon} />
                <h3 className="mt-4 font-semibold">{v.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{v.text}</p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <CtaBanner />
    </>
  );
}
