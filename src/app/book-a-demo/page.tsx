import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { Icon } from "@/components/Icon";
import { ProductMockup } from "@/components/ProductMockup";
import { Container } from "@/components/ui";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Book a Live Demo",
  description: "Book a live demo of Tech23 TMS and see trip management, fleet maintenance, fuel control and profitability reporting on workflows that match your operation.",
  alternates: { canonical: "/book-a-demo" },
};

export default function BookDemoPage() {
  return (
    <section className="relative overflow-hidden bg-brand-950 py-14 sm:py-20">
      <div className="bg-grid absolute inset-0" aria-hidden="true" />
      <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-brand-600/40 blur-3xl" aria-hidden="true" />
      <Container className="relative grid gap-12 lg:grid-cols-12">
        <div className="hero-in lg:col-span-5">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-300">Book a live demo</p>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">See Tech23 TMS on your workflows</h1>
          <p className="mt-5 text-lg leading-relaxed text-brand-100">A product specialist will walk you through the modules that matter to your operation and answer your questions.</p>
          <ul className="mt-8 space-y-4">
            {[
              "A personalized walkthrough, not a canned video",
              "Trip-to-invoice, maintenance, fuel and profitability views",
              "Implementation scope and timeline for your fleet",
              "Integration questions answered for your current tools",
            ].map((t) => (
              <li key={t} className="flex items-start gap-3 text-brand-50">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-600"><Icon name="check" className="h-3.5 w-3.5 text-white" /></span>
                {t}
              </li>
            ))}
          </ul>
          <div className="mt-10 hidden lg:block"><ProductMockup variant="overview" /></div>
        </div>
        <div className="lg:col-span-7">
          <div style={{ "--d": "200ms" } as React.CSSProperties} className="hero-in rounded-3xl bg-white p-6 shadow-2xl sm:p-10">
            <h2 className="text-2xl font-bold tracking-tight">Request your demo</h2>
            <p className="mt-2 text-slate-600">
              Prefer to register directly?{" "}
              <a href={site.demoUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-700 hover:underline">Use the Tech23 registration portal</a>.
            </p>
            <div className="mt-8"><ContactForm demo /></div>
          </div>
        </div>
      </Container>
    </section>
  );
}
