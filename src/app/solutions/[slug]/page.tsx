import { Reveal } from "@/components/Reveal";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/Icon";
import { JsonLd } from "@/components/JsonLd";
import { ProductMockup } from "@/components/ProductMockup";
import { Button, Container, CtaBanner, DemoButton, IconBadge, SectionHeading } from "@/components/ui";
import { getModule, modules } from "@/content/modules";
import { site } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return modules.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: PageProps<"/solutions/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const m = getModule(slug);
  if (!m) return {};
  return {
    title: m.seoTitle,
    description: m.seoDescription,
    keywords: m.keywords,
    alternates: { canonical: `/solutions/${m.slug}` },
    openGraph: { title: `${m.name} | ${site.name}`, description: m.seoDescription, url: `/solutions/${m.slug}` },
  };
}

export default async function ModulePage({ params }: PageProps<"/solutions/[slug]">) {
  const { slug } = await params;
  const m = getModule(slug);
  if (!m) notFound();

  const related = modules.filter((x) => x.slug !== m.slug).slice(0, 3);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: site.url },
            { "@type": "ListItem", position: 2, name: "Solutions", item: `${site.url}/solutions` },
            { "@type": "ListItem", position: 3, name: m.name, item: `${site.url}/solutions/${m.slug}` },
          ],
        }}
      />

      <section className="relative overflow-hidden bg-brand-950">
        <div className="bg-grid absolute inset-0" aria-hidden="true" />
        <div className="animate-glow absolute -right-32 -top-32 h-96 w-96 rounded-full bg-brand-600/40 blur-3xl" aria-hidden="true" />
        <Container className="relative grid items-center gap-12 py-14 sm:py-20 lg:grid-cols-2">
          <div>
            <nav aria-label="Breadcrumb" className="hero-in text-sm text-brand-300">
              <Link href="/" className="hover:text-white">Home</Link> <span aria-hidden="true">/</span>{" "}
              <Link href="/solutions" className="hover:text-white">Solutions</Link> <span aria-hidden="true">/</span>{" "}
              <span className="text-brand-100">{m.navLabel}</span>
            </nav>
            <p style={{ "--d": "80ms" } as React.CSSProperties} className="hero-in mt-6 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-brand-300">
              <Icon name={m.icon} className="h-5 w-5" /> {m.name}
            </p>
            <h1 style={{ "--d": "160ms" } as React.CSSProperties} className="hero-in mt-3 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">{m.headline}</h1>
            <p style={{ "--d": "240ms" } as React.CSSProperties} className="hero-in mt-5 text-lg leading-relaxed text-brand-100">{m.intro}</p>
            <div style={{ "--d": "320ms" } as React.CSSProperties} className="hero-in mt-8 flex flex-col gap-3 sm:flex-row">
              <DemoButton variant="light" />
              <Button href="/solutions" variant="outline-light">All Solutions</Button>
            </div>
          </div>
          <div className="animate-float">
            <ProductMockup variant={m.mockup} />
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-24">
        <Container>
          <SectionHeading eyebrow="Key capabilities" title={`What you get with ${m.name}`} />
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {m.features.map((f, i) => (
              <Reveal key={f.title} delay={(i % 3) * 120} className="rounded-2xl border border-slate-200 p-6 transition hover:border-brand-300 hover:shadow-lg hover:shadow-brand-900/5">
                <IconBadge name={f.icon} />
                <h3 className="mt-5 text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.description}</p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-slate-50 py-20 sm:py-24">
        <Container className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <SectionHeading
            center={false}
            eyebrow="Business outcomes"
            title="Results that show up on the bottom line"
            intro={`${m.name} is fully connected to the rest of Tech23 TMS, so the results carry through to costing, profitability and financial reporting.`}
          />
          <ul className="grid gap-4 sm:grid-cols-2">
            {m.outcomes.map((o, i) => (
              <Reveal as="li" key={o} delay={i * 100} from="right" className="flex items-start gap-3 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white"><Icon name="check" className="h-4 w-4" /></span>
                <span className="font-medium text-slate-800">{o}</span>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      <section className="py-20 sm:py-24">
        <Container>
          <SectionHeading eyebrow="Connected modules" title="Works seamlessly with" />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {related.map((r, i) => (
              <Reveal key={r.slug} delay={i * 120}>
              <Link href={`/solutions/${r.slug}`} className="group block h-full rounded-2xl border border-slate-200 p-6 transition hover:border-brand-300 hover:shadow-lg">
                <IconBadge name={r.icon} />
                <h3 className="mt-4 font-semibold group-hover:text-brand-700">{r.name}</h3>
                <p className="mt-1.5 text-sm text-slate-600">{r.summary}</p>
              </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <CtaBanner title={`See ${m.name} in action`} />
    </>
  );
}
