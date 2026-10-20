import { Reveal } from "@/components/Reveal";
import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { Icon } from "@/components/Icon";
import { Container, PageHero } from "@/components/ui";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Contact the Tech23 TMS team about transportation management software for your trucking or logistics business.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <PageHero eyebrow="Contact" title="Let's talk about your fleet" intro="Questions about Tech23 TMS, pricing or implementation? Our team will get back to you promptly." />
      <section className="py-16 sm:py-20">
        <Container className="grid gap-12 lg:grid-cols-12">
          <div className="space-y-5 lg:col-span-4">
            {[
              { icon: "mail" as const, label: "Email", value: site.email, href: `mailto:${site.email}` },
              { icon: "phone" as const, label: site.phoneLabel, value: site.phone, href: `tel:${site.phone.replace(/\s/g, "")}` },
              { icon: "building" as const, label: "Headquarters", value: site.hq },
              { icon: "globe" as const, label: "Customer login", value: "register.tech23.net", href: site.loginUrl },
            ].filter((c) => c.value).map((c, i) => (
              <Reveal key={c.label} delay={i * 100} from="left" className="flex gap-4 rounded-2xl border border-slate-200 p-5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600"><Icon name={c.icon} className="h-5 w-5" /></span>
                <div className="min-w-0">
                  <p className="text-sm text-slate-500">{c.label}</p>
                  {c.href ? (
                    <a href={c.href} className="break-words font-semibold text-slate-900 hover:text-brand-700" {...(c.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>{c.value}</a>
                  ) : (
                    <p className="font-semibold text-slate-900">{c.value}</p>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal from="right" className="rounded-3xl border border-slate-200 p-6 shadow-sm sm:p-10 lg:col-span-8">
            <h2 className="text-2xl font-bold tracking-tight">Send us a message</h2>
            <p className="mt-2 text-slate-600">Fill in the form and we&apos;ll be in touch.</p>
            <div className="mt-8"><ContactForm /></div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
