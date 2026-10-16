import Link from "next/link";

export function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2.5" aria-label="Tech23 TMS home">
      <svg viewBox="0 0 40 40" className="h-9 w-9" aria-hidden="true">
        <rect width="40" height="40" rx="10" className="fill-brand-600" />
        <path d="M9 14h22M20 14v16" stroke="white" strokeWidth="4" strokeLinecap="round" />
        <circle cx="30" cy="28" r="3.5" className="fill-brand-300" />
      </svg>
      <span className="leading-none">
        <span className={`block text-lg font-extrabold tracking-tight ${dark ? "text-white" : "text-slate-900"}`}>
          Tech23 <span className={dark ? "text-brand-300" : "text-brand-600"}>TMS</span>
        </span>
        <span className={`block text-[10px] font-medium uppercase tracking-[0.18em] ${dark ? "text-brand-200" : "text-slate-500"}`}>
          Transport Management
        </span>
      </span>
    </Link>
  );
}
