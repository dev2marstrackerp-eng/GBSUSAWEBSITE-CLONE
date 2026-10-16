"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Icon } from "@/components/Icon";
import { Logo } from "@/components/Logo";
import { modules } from "@/content/modules";
import { mainNav, site } from "@/lib/site";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);

  // Close menus whenever the route changes (adjust state during render, no effect needed).
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
    setSolutionsOpen(false);
  }

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80">
      {/* Blur lives on a background layer: backdrop-filter on <header> itself would become the
          containing block for the fixed mobile menu and collapse it to the header's height. */}
      <div className="absolute inset-0 -z-10 bg-white/90 backdrop-blur" aria-hidden="true" />
      <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:h-18 lg:px-8">
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          <div
            className="relative"
            onMouseEnter={() => setSolutionsOpen(true)}
            onMouseLeave={() => setSolutionsOpen(false)}
          >
            <button
              type="button"
              className={`flex items-center gap-1 rounded-md px-3 py-2 text-sm font-semibold ${isActive("/solutions") ? "text-brand-700" : "text-slate-700 hover:text-brand-700"}`}
              aria-expanded={solutionsOpen}
              aria-controls="solutions-menu"
              onClick={() => setSolutionsOpen((v) => !v)}
            >
              Solutions
              <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor" aria-hidden="true"><path d="M5.2 7.2a.75.75 0 0 1 1.06 0L10 10.94l3.74-3.74a.75.75 0 1 1 1.06 1.06l-4.27 4.27a.75.75 0 0 1-1.06 0L5.2 8.26a.75.75 0 0 1 0-1.06Z" /></svg>
            </button>
            {solutionsOpen && (
              <div id="solutions-menu" className="animate-menu absolute left-1/2 top-full w-[640px] -translate-x-1/2 pt-2">
                <div className="grid grid-cols-2 gap-1 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl">
                  {modules.map((m) => (
                    <Link key={m.slug} href={`/solutions/${m.slug}`} className="flex gap-3 rounded-xl p-3 hover:bg-brand-50">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                        <Icon name={m.icon} className="h-5 w-5" />
                      </span>
                      <span>
                        <span className="block text-sm font-semibold text-slate-900">{m.navLabel}</span>
                        <span className="mt-0.5 block text-xs leading-snug text-slate-500">{m.summary}</span>
                      </span>
                    </Link>
                  ))}
                  <Link href="/solutions" className="col-span-2 mt-1 rounded-xl bg-slate-50 px-3 py-2.5 text-center text-sm font-semibold text-brand-700 hover:bg-brand-50">
                    View the full platform →
                  </Link>
                </div>
              </div>
            )}
          </div>
          {mainNav.slice(1).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-md px-3 py-2 text-sm font-semibold ${isActive(item.href) ? "text-brand-700" : "text-slate-700 hover:text-brand-700"}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a href={site.loginUrl} className="text-sm font-semibold text-slate-700 hover:text-brand-700" target="_blank" rel="noopener noreferrer">
            Log in
          </a>
          <Link href="/book-a-demo" className="rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-brand-600/25 hover:bg-brand-700">
            Book a Demo
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100 lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          <Icon name={open ? "close" : "menu"} />
        </button>
      </div>

      {open && (
        <div id="mobile-menu" className="animate-menu fixed inset-x-0 bottom-0 top-16 z-50 overflow-y-auto border-t border-slate-200 bg-white lg:hidden">
          <nav className="space-y-1 px-4 py-4" aria-label="Mobile">
            <p className="px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Solutions</p>
            {modules.map((m) => (
              <Link key={m.slug} href={`/solutions/${m.slug}`} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[15px] font-medium text-slate-800 hover:bg-brand-50">
                <Icon name={m.icon} className="h-5 w-5 text-brand-600" />
                {m.navLabel}
              </Link>
            ))}
            <div className="my-3 border-t border-slate-100" />
            {mainNav.map((item) => (
              <Link key={item.href} href={item.href} className="block rounded-lg px-3 py-2.5 text-[15px] font-semibold text-slate-800 hover:bg-brand-50">
                {item.label === "Solutions" ? "All Solutions" : item.label}
              </Link>
            ))}
            <div className="grid gap-2 pt-4">
              <Link href="/book-a-demo" className="rounded-lg bg-brand-600 px-4 py-3 text-center font-semibold text-white">Book a Live Demo</Link>
              <a href={site.loginUrl} className="rounded-lg border border-slate-300 px-4 py-3 text-center font-semibold text-slate-800" target="_blank" rel="noopener noreferrer">Log in</a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
