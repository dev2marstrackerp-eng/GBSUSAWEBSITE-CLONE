import Link from "next/link";
import { Icon, type IconName } from "@/components/Icon";
import { Reveal } from "@/components/Reveal";
import { site } from "@/lib/site";

export function Container({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return <div className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>;
}

type ButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "light" | "outline-light";
  className?: string;
};

const buttonStyles = {
  primary: "bg-brand-600 text-white hover:bg-brand-700 shadow-lg shadow-brand-600/25",
  secondary: "border border-slate-300 bg-white text-slate-800 hover:border-brand-600 hover:text-brand-700",
  light: "bg-white text-brand-800 hover:bg-brand-50 shadow-lg shadow-black/10",
  "outline-light": "border border-white/40 text-white hover:bg-white/10",
};

export function Button({ href, children, variant = "primary", className = "" }: ButtonProps) {
  const external = href.startsWith("http");
  const cls = `inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 ${buttonStyles[variant]} ${className}`;
  return external ? (
    <a href={href} className={cls} target="_blank" rel="noopener noreferrer">{children}</a>
  ) : (
    <Link href={href} className={cls}>{children}</Link>
  );
}

export function DemoButton({ variant = "primary", className = "", label = "Book a Live Demo" }: { variant?: ButtonProps["variant"]; className?: string; label?: string }) {
  return (
    <Button href="/book-a-demo" variant={variant} className={className}>
      {label}
      <Icon name="arrow" className="h-4 w-4" />
    </Button>
  );
}

export function SectionHeading({ eyebrow, title, intro, center = true, dark = false }: { eyebrow?: string; title: string; intro?: string; center?: boolean; dark?: boolean }) {
  return (
    <Reveal className={`max-w-3xl ${center ? "mx-auto text-center" : ""}`}>
      {eyebrow && <p className={`text-sm font-semibold uppercase tracking-wider ${dark ? "text-brand-300" : "text-brand-600"}`}>{eyebrow}</p>}
      <h2 className={`mt-2 text-3xl font-bold tracking-tight sm:text-4xl ${dark ? "text-white" : ""}`}>{title}</h2>
      {intro && <p className={`mt-4 text-lg leading-relaxed ${dark ? "text-brand-100" : "text-slate-600"}`}>{intro}</p>}
    </Reveal>
  );
}

export function IconBadge({ name, className = "" }: { name: IconName; className?: string }) {
  return (
    <span className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-brand-100 ${className}`}>
      <Icon name={name} className="h-5 w-5" />
    </span>
  );
}

export function PageHero({ eyebrow, title, intro, children }: { eyebrow: string; title: string; intro: string; children?: React.ReactNode }) {
  return (
    <section className="relative overflow-hidden bg-brand-950 text-white">
      <div className="bg-grid absolute inset-0" aria-hidden="true" />
      <div className="animate-glow absolute -top-40 right-0 h-96 w-96 rounded-full bg-brand-600/40 blur-3xl" aria-hidden="true" />
      <Container className="relative py-16 sm:py-20 lg:py-24">
        <p className="hero-in text-sm font-semibold uppercase tracking-wider text-brand-300">{eyebrow}</p>
        <h1 style={{ "--d": "100ms" } as React.CSSProperties} className="hero-in mt-3 max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl">{title}</h1>
        <p style={{ "--d": "200ms" } as React.CSSProperties} className="hero-in mt-5 max-w-2xl text-lg leading-relaxed text-brand-100">{intro}</p>
        <div style={{ "--d": "300ms" } as React.CSSProperties} className="hero-in">{children}</div>
      </Container>
    </section>
  );
}

export function CtaBanner({ title = "Ready to take control of your fleet?", text = "See Tech23 TMS running on real trucking workflows. Book a live demo with our team." }: { title?: string; text?: string }) {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <Reveal from="zoom" className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-700 via-brand-800 to-brand-950 px-6 py-12 text-center sm:px-12 sm:py-16">
          <div className="bg-grid absolute inset-0" aria-hidden="true" />
          <div className="relative">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">{title}</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-brand-100">{text}</p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <DemoButton variant="light" />
              <Button href={`mailto:${site.email}`} variant="outline-light">Talk to Sales</Button>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
