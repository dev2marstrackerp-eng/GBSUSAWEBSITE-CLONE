import Link from "next/link";
import { Icon } from "@/components/Icon";
import { Logo } from "@/components/Logo";
import { Container } from "@/components/ui";
import { modules } from "@/content/modules";
import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="bg-brand-950 text-brand-100">
      <Container className="py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo dark />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-brand-200">
              Integrated transportation management software for trucking companies, fleet operators and logistics businesses.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <span className="text-xs text-brand-300">A product of</span>
              <span className="text-sm font-extrabold tracking-wide text-white">{site.company}</span>
            </div>
          </div>

          <div className="lg:col-span-4">
            <p className="text-sm font-semibold text-white">Solutions</p>
            <ul className="mt-4 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
              {modules.map((m) => (
                <li key={m.slug}>
                  <Link href={`/solutions/${m.slug}`} className="hover:text-white">{m.navLabel}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <p className="text-sm font-semibold text-white">Company</p>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="/industries" className="hover:text-white">Industries</Link></li>
              <li><Link href="/about" className="hover:text-white">About Tech23</Link></li>
              <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
              <li><Link href="/book-a-demo" className="hover:text-white">Book a Demo</Link></li>
              <li><a href={site.loginUrl} className="hover:text-white" target="_blank" rel="noopener noreferrer">Customer Login</a></li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <p className="text-sm font-semibold text-white">Contact</p>
            <ul className="mt-4 space-y-3 text-sm">
              {site.email && <li className="flex gap-2"><Icon name="mail" className="mt-0.5 h-4 w-4 shrink-0 text-brand-300" /><a href={`mailto:${site.email}`} className="break-all hover:text-white">{site.email}</a></li>}
              {site.phone && <li className="flex gap-2"><Icon name="phone" className="mt-0.5 h-4 w-4 shrink-0 text-brand-300" /><a href={`tel:${site.phone.replace(/\s/g, "")}`} className="hover:text-white">{site.phone}</a></li>}
              <li><Link href="/contact" className="hover:text-white">Send us a message</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-brand-300 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} {site.company}. All rights reserved.</p>
          <p>Tech23 TMS: complete control of your fleet.</p>
        </div>
      </Container>
    </footer>
  );
}
