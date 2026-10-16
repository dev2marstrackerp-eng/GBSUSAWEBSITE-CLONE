"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import { centerSelected, Roll } from "@/components/AppShowcase";
import { Icon, type IconName } from "@/components/Icon";
import { DemoButton } from "@/components/ui";

// Web app showcase. Desktop browser windows drawn in HTML/CSS: each app has a real-looking
// shell (nested sidebar menus, top bar, breadcrumbs) and several working screens. An animated
// cursor walks the menus on autoplay; visitors can click any menu, tab or feature themselves.

const FRAME_W = 1120;
const FRAME_H = 680;
const AUTOPLAY_MS = 5200;

type View = { id: string; icon: IconName; title: string; path: string; text: string; Render: () => React.ReactElement };
type NavItem = { label: string; view?: string; badge?: string };
type NavGroup = { label: string; icon: IconName; view?: string; children?: NavItem[] };
type Theme = { sidebar: string; text: string; muted: string; active: string; hover: string; logo: string };

type WebApp = {
  id: string;
  icon: IconName;
  name: string;
  category: string;
  host: string;
  tagline: string;
  text: string;
  accent: string;
  theme: Theme;
  nav: NavGroup[];
  views: View[];
};

/* ---------- Small UI pieces ---------- */

const stagger = (i: number) => ({ "--i": i } as React.CSSProperties);

const tones = {
  green: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  blue: "bg-brand-50 text-brand-700 ring-brand-600/20",
  amber: "bg-amber-50 text-amber-700 ring-amber-600/20",
  red: "bg-red-50 text-red-700 ring-red-600/20",
  slate: "bg-slate-100 text-slate-600 ring-slate-500/20",
  violet: "bg-violet-50 text-violet-700 ring-violet-600/20",
} as const;
type Tone = keyof typeof tones;

function Pill({ tone, children }: { tone: Tone; children: React.ReactNode }) {
  return <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ring-inset ${tones[tone]}`}>{children}</span>;
}

function Kpi({ label, value, delta, up = true, i }: { label: string; value: string; delta: string; up?: boolean; i: number }) {
  return (
    <div className="app-pop rounded-xl border border-slate-200 bg-white p-4" style={stagger(i)}>
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
      <p className={`mt-1 text-xs font-semibold ${up ? "text-emerald-600" : "text-red-600"}`}>{delta}</p>
    </div>
  );
}

function Card({ title, action, children, className = "", i = 0 }: { title: string; action?: React.ReactNode; children: React.ReactNode; className?: string; i?: number }) {
  return (
    <div className={`app-pop rounded-xl border border-slate-200 bg-white p-4 ${className}`} style={stagger(i)}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-900">{title}</p>
        {action}
      </div>
      {children}
    </div>
  );
}

function Tabs({ items, active, onChange }: { items: string[]; active: number; onChange: (i: number) => void }) {
  return (
    <div className="flex gap-1 rounded-lg bg-slate-100 p-1 text-xs font-semibold">
      {items.map((t, i) => (
        <button key={t} type="button" onClick={() => onChange(i)} className={`rounded-md px-3 py-1.5 transition ${i === active ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}>
          {t}
        </button>
      ))}
    </div>
  );
}

function SearchBox({ placeholder }: { placeholder: string }) {
  return (
    <div className="flex h-9 w-64 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-400">
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
      {placeholder}
    </div>
  );
}

function PrimaryBtn({ children }: { children: React.ReactNode }) {
  return <span className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-brand-600 px-3.5 text-xs font-semibold text-white shadow-sm">{children}</span>;
}

function Bars({ values, color = "from-brand-600 to-brand-400", labels }: { values: number[]; color?: string; labels: string[] }) {
  return (
    <div>
      <div className="mt-4 flex h-36 items-end gap-3 border-b border-slate-100">
        {values.map((v, i) => (
          <div key={i} className={`app-grow-y flex-1 rounded-t-md bg-gradient-to-t ${color}`} style={{ height: `${v}%`, ...stagger(i) }} />
        ))}
      </div>
      <div className="mt-2 flex gap-3 text-[10px] text-slate-400">
        {labels.map((l, i) => <span key={i} className="flex-1 text-center">{l}</span>)}
      </div>
    </div>
  );
}

function Donut({ parts, center, sub }: { parts: { v: number; c: string }[]; center: string; sub: string }) {
  const offsets = parts.map((_, i) => parts.slice(0, i).reduce((a, p) => a + p.v, 0));
  return (
    <div className="relative h-32 w-32 shrink-0">
      <svg viewBox="0 0 36 36" className="h-32 w-32 -rotate-90" aria-hidden="true">
        <circle cx="18" cy="18" r="14" fill="none" stroke="#f1f5f9" strokeWidth="5" />
        {parts.map((p, i) => (
          <circle key={i} cx="18" cy="18" r="14" fill="none" stroke={p.c} strokeWidth="5" pathLength={100} strokeDasharray={`${p.v} ${100 - p.v}`} strokeDashoffset={-offsets[i]} className="app-pop" style={stagger(i + 2)} />
        ))}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-bold text-slate-900">{center}</span>
        <span className="text-[10px] text-slate-500">{sub}</span>
      </div>
    </div>
  );
}

function Table({ cols, rows, widths }: { cols: string[]; rows: React.ReactNode[][]; widths: string }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="grid gap-3 border-b border-slate-200 bg-slate-50 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500" style={{ gridTemplateColumns: widths }}>
        {cols.map((c) => <span key={c}>{c}</span>)}
      </div>
      {rows.map((r, i) => (
        <div key={i} className="app-pop grid items-center gap-3 border-b border-slate-100 px-4 py-2.5 text-xs text-slate-700 last:border-0" style={{ gridTemplateColumns: widths, ...stagger(i) }}>
          {r.map((c, j) => <span key={j} className="min-w-0 truncate">{c}</span>)}
        </div>
      ))}
    </div>
  );
}

/* ---------- Workshop views ---------- */

function WorkshopDashboard() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-4">
        <Kpi i={0} label="Open job cards" value="42" delta="▼ 8 vs last week" />
        <Kpi i={1} label="Avg. repair time" value="6.4 h" delta="▼ 1.2 h faster" />
        <Kpi i={2} label="Downtime this month" value="312 h" delta="▼ 18%" />
        <Kpi i={3} label="Repair cost (MTD)" value="$48.2k" delta="▲ 4% vs budget" up={false} />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <Card i={4} title="Downtime hours by fleet group" className="col-span-2" action={<span className="text-[11px] text-slate-400">Last 7 days</span>}>
          <Bars values={[48, 72, 35, 88, 60, 42, 66]} labels={["Tractors", "Trailers", "Tankers", "Tippers", "Reefers", "Vans", "Lowbeds"]} color="from-amber-500 to-amber-300" />
        </Card>
        <Card i={5} title="Job card status">
          <div className="mt-3 flex items-center gap-4">
            <Donut center="42" sub="open" parts={[{ v: 45, c: "#1d5fe0" }, { v: 25, c: "#f59e0b" }, { v: 30, c: "#10b981" }]} />
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-brand-600" />In progress 19</li>
              <li className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-amber-500" />Awaiting parts 10</li>
              <li className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-500" />Ready for QC 13</li>
            </ul>
          </div>
        </Card>
      </div>
      <Card i={6} title="Preventive maintenance due this week" action={<span className="text-xs font-semibold text-brand-600">View schedule →</span>}>
        <div className="mt-3 grid grid-cols-4 gap-3">
          {[["TX-4821", "25k mi service", "In 120 mi", "amber"], ["TX-3307", "Brake inspection", "Today", "red"], ["TR-0912", "Tire rotation", "Thu", "blue"], ["TX-5120", "Oil & filters", "Fri", "blue"]].map(([v, t, d, tone]) => (
            <div key={v} className="rounded-lg border border-slate-100 bg-slate-50 p-3">
              <div className="flex items-center justify-between"><span className="text-xs font-bold text-slate-900">{v}</span><Pill tone={tone as Tone}>{d}</Pill></div>
              <p className="mt-1 text-xs text-slate-500">{t}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function WorkshopJobs() {
  const [tab, setTab] = useState(0);
  const all: [string, string, string, string, string, Tone, string, string][] = [
    ["JC-1186", "TX-4821", "Brake overhaul, front axle", "M. Ruiz", "Bay 2", "blue", "In progress", "$1,240"],
    ["JC-1185", "TX-3307", "25,000 mi service", "A. Smith", "Bay 1", "green", "Completed", "$612"],
    ["JC-1184", "TR-0912", "Tire rotation & alignment", "D. Lee", "Bay 4", "amber", "Awaiting parts", "$388"],
    ["JC-1183", "TX-5120", "A/C not cooling", "M. Ruiz", "Bay 3", "blue", "In progress", "$450"],
    ["JC-1182", "TK-0218", "Coolant leak", "J. Brown", "Bay 5", "amber", "Awaiting parts", "$920"],
    ["JC-1181", "TX-2290", "Pre-trip defect: lights", "A. Smith", "Bay 1", "green", "Completed", "$96"],
    ["JC-1180", "TX-1045", "Clutch replacement", "D. Lee", "Bay 6", "slate", "Open", "$2,310"],
  ];
  const filters = ["All", "Open", "In progress", "Awaiting parts", "Completed"];
  const rows = tab === 0 ? all : all.filter((r) => r[6] === filters[tab]);
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Tabs items={filters.map((f, i) => (i === 0 ? `All 42` : f))} active={tab} onChange={setTab} />
        <div className="flex gap-2"><SearchBox placeholder="Search job card, vehicle, technician…" /><PrimaryBtn>+ New job card</PrimaryBtn></div>
      </div>
      <div key={tab}>
        <Table
          widths="0.8fr 0.8fr 2fr 1fr 0.7fr 1.1fr 0.7fr"
          cols={["Job card", "Vehicle", "Complaint", "Technician", "Bay", "Status", "Cost"]}
          rows={rows.map((r) => [<b key="a" className="text-slate-900">{r[0]}</b>, r[1], r[2], r[3], r[4], <Pill key="p" tone={r[5]}>{r[6]}</Pill>, <b key="c" className="text-slate-900">{r[7]}</b>])}
        />
      </div>
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>Showing {rows.length} of 42 · Labor and parts post to each vehicle&apos;s cost ledger</span>
        <span className="flex gap-1">{[1, 2, 3].map((p) => <span key={p} className={`flex h-7 w-7 items-center justify-center rounded-md ${p === 1 ? "bg-brand-600 text-white" : "border border-slate-200"}`}>{p}</span>)}</span>
      </div>
    </div>
  );
}

function WorkshopPM() {
  const days = ["Mon 20", "Tue 21", "Wed 22", "Thu 23", "Fri 24", "Sat 25", "Sun 26"];
  const rows: [string, number, number, string, string][] = [
    ["TX-4821", 0, 2, "bg-brand-500", "25k mi service"],
    ["TX-3307", 1, 1, "bg-red-500", "Brake inspection"],
    ["TR-0912", 3, 1, "bg-amber-500", "Tire rotation"],
    ["TX-5120", 4, 2, "bg-brand-500", "Oil & filters"],
    ["TK-0218", 2, 3, "bg-violet-500", "Annual DOT inspection"],
    ["TX-1045", 5, 1, "bg-emerald-500", "Greasing"],
  ];
  return (
    <div className="grid grid-cols-4 gap-4">
      <Card i={0} title="PM schedule · Week 43" className="col-span-3" action={<Tabs items={["Week", "Month"]} active={0} onChange={() => {}} />}>
        <div className="mt-4 grid grid-cols-[90px_repeat(7,1fr)] text-[11px]">
          <span />
          {days.map((d) => <span key={d} className="border-l border-slate-100 pb-2 text-center font-semibold text-slate-500">{d}</span>)}
          {rows.map(([v, start, len, color, label], i) => (
            <div key={v} className="contents">
              <span className="flex h-11 items-center font-semibold text-slate-800">{v}</span>
              <div className="relative col-span-7 grid h-11 grid-cols-7 border-t border-slate-100">
                {days.map((d) => <span key={d} className="border-l border-slate-100" />)}
                <span
                  className={`app-grow-x absolute top-2 flex h-7 items-center rounded-md px-2 text-[10px] font-semibold text-white shadow-sm ${color}`}
                  style={{ left: `calc(${(start / 7) * 100}% + 4px)`, width: `calc(${(len / 7) * 100}% - 8px)`, ...stagger(i) }}
                >
                  <span className="truncate">{label}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
      <div className="space-y-4">
        <Card i={1} title="Triggers">
          <ul className="mt-3 space-y-2.5 text-xs text-slate-600">
            {[["gauge", "Every 25,000 mi"], ["clock", "Every 500 engine hours"], ["calendar", "Every 90 days"]].map(([ic, t]) => (
              <li key={t} className="flex items-center gap-2"><span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-50 text-brand-600"><Icon name={ic as IconName} className="h-3.5 w-3.5" /></span>{t}</li>
            ))}
          </ul>
        </Card>
        <Card i={2} title="Compliance">
          <p className="mt-2 text-3xl font-bold text-slate-900">96%</p>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100"><div className="app-grow-x h-full w-[96%] rounded-full bg-emerald-500" /></div>
          <p className="mt-2 text-xs text-slate-500">PMs completed on time, last 90 days</p>
        </Card>
      </div>
    </div>
  );
}

function WorkshopParts() {
  const parts: [string, string, number, number, string][] = [
    ["BRK-PAD-22", "Brake pads, front (set)", 14, 40, "Bay store A"],
    ["FLT-OIL-90", "Oil filter, Cummins X15", 6, 30, "Bay store A"],
    ["TIR-295-75", "Steer tire 295/75R22.5", 3, 12, "Tire shed"],
    ["CLT-KIT-15", "Clutch kit 15.5\"", 2, 4, "Main store"],
    ["BLT-SRP-08", "Serpentine belt", 22, 25, "Main store"],
  ];
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="col-span-2 space-y-4">
        <div className="flex items-center justify-between"><SearchBox placeholder="Search part number or description…" /><PrimaryBtn>Issue parts</PrimaryBtn></div>
        <Table
          widths="1fr 2fr 1.6fr 1fr"
          cols={["Part no.", "Description", "Stock level", "Location"]}
          rows={parts.map(([no, d, q, max, loc], i) => {
            const pct = (q / max) * 100;
            return [
              <b key="n" className="text-slate-900">{no}</b>,
              d,
              <span key="s" className="flex items-center gap-2">
                <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100"><span className={`app-grow-x block h-full rounded-full ${pct < 30 ? "bg-red-500" : pct < 60 ? "bg-amber-500" : "bg-emerald-500"}`} style={{ width: `${pct}%`, ...stagger(i) }} /></span>
                <b className="w-6 text-right text-slate-900">{q}</b>
              </span>,
              loc,
            ];
          })}
        />
      </div>
      <div className="space-y-4">
        <Card i={1} title="Issue to job card">
          <div className="mt-3 space-y-2 text-xs">
            <div className="rounded-lg border border-slate-200 px-3 py-2 text-slate-700">JC-1186 · TX-4821</div>
            <div className="flex justify-between rounded-lg border border-slate-200 px-3 py-2 text-slate-700"><span>BRK-PAD-22 × 2</span><b>$312.00</b></div>
            <div className="app-pick rounded-lg bg-brand-600 py-2 text-center font-semibold text-white">Issue & charge vehicle</div>
          </div>
        </Card>
        <Card i={2} title="Reorder alerts" action={<Pill tone="red">3</Pill>}>
          <ul className="mt-2 space-y-1.5 text-xs text-slate-600">
            <li>TIR-295-75 below minimum</li><li>CLT-KIT-15 below minimum</li><li>FLT-OIL-90 PR-2291 raised</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}

/* ---------- Hospital scheduling views ---------- */

const doctors = [
  { n: "Dr. Sarah Lee", s: "Nephrology", c: "bg-teal-500" },
  { n: "Dr. Raj Patel", s: "Cardiology", c: "bg-rose-500" },
  { n: "Dr. Ada Okoro", s: "General", c: "bg-brand-500" },
  { n: "Dr. Mei Chen", s: "Pediatrics", c: "bg-violet-500" },
];

function HospitalCalendar() {
  const [mode, setMode] = useState(0);
  const hours = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00"];
  const appts: { d: number; start: number; len: number; name: string; type: string; tone: string; cls?: string }[] = [
    { d: 0, start: 0, len: 1, name: "Ahmed Khan", type: "Follow-up", tone: "bg-teal-50 border-teal-500 text-teal-900" },
    { d: 0, start: 1.5, len: 2, name: "Dialysis · Room 3", type: "Fatima Ali", tone: "bg-teal-100 border-teal-600 text-teal-900" },
    { d: 0, start: 4.5, len: 1, name: "Grace Mwangi", type: "Consultation", tone: "bg-teal-50 border-teal-500 text-teal-900", cls: "app-drop" },
    { d: 1, start: 0.5, len: 1, name: "John Doe", type: "ECG review", tone: "bg-rose-50 border-rose-500 text-rose-900" },
    { d: 1, start: 2, len: 1.5, name: "Omar Said", type: "Stress test", tone: "bg-rose-50 border-rose-500 text-rose-900" },
    { d: 1, start: 4, len: 1, name: "Lunch", type: "Blocked", tone: "bg-slate-100 border-slate-300 text-slate-500" },
    { d: 2, start: 0, len: 0.5, name: "Walk-in", type: "Triage", tone: "bg-brand-50 border-brand-500 text-brand-900" },
    { d: 2, start: 1, len: 1, name: "Amina Yusuf", type: "Consultation", tone: "bg-brand-50 border-brand-500 text-brand-900" },
    { d: 2, start: 3, len: 1, name: "Rajesh Kumar", type: "Lab review", tone: "bg-brand-50 border-brand-500 text-brand-900", cls: "app-slide" },
    { d: 3, start: 0.5, len: 1.5, name: "Vaccination clinic", type: "6 children", tone: "bg-violet-50 border-violet-500 text-violet-900" },
    { d: 3, start: 3.5, len: 1, name: "Leo Brown", type: "Check-up", tone: "bg-violet-50 border-violet-500 text-violet-900" },
  ];
  const ROW = 64;
  return (
    <div className="grid grid-cols-[1fr_240px] gap-4">
      <div className="app-pop rounded-xl border border-slate-200 bg-white" style={stagger(0)}>
        <div className="flex items-center justify-between border-b border-slate-200 p-3">
          <div className="flex items-center gap-2">
            <span className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700">Today</span>
            <span className="text-sm font-bold text-slate-900">Wednesday, Oct 22</span>
          </div>
          <Tabs items={["Day", "Week", "Month"]} active={mode} onChange={setMode} />
        </div>
        <div className="grid grid-cols-[56px_repeat(4,1fr)] border-b border-slate-200 text-xs">
          <span />
          {doctors.map((d) => (
            <div key={d.n} className="flex items-center gap-2 border-l border-slate-100 px-3 py-2">
              <span className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold text-white ${d.c}`}>{d.n.split(" ")[1][0]}{d.n.split(" ")[2][0]}</span>
              <div><p className="font-semibold text-slate-900">{d.n}</p><p className="text-[10px] text-slate-500">{d.s}</p></div>
            </div>
          ))}
        </div>
        <div className="relative grid grid-cols-[56px_repeat(4,1fr)]" style={{ height: hours.length * ROW - 20 }}>
          <div>{hours.map((h) => <div key={h} className="pr-2 text-right text-[10px] text-slate-400" style={{ height: ROW }}>{h}</div>)}</div>
          {doctors.map((d, di) => (
            <div key={d.n} className="relative border-l border-slate-100" style={{ backgroundImage: `repeating-linear-gradient(to bottom, #f1f5f9 0 1px, transparent 1px ${ROW}px)` }}>
              {appts.filter((a) => a.d === di).map((a, i) => (
                <div key={a.name} className={`app-pop absolute inset-x-1.5 overflow-hidden rounded-md border-l-[3px] px-2 py-1 ${a.tone} ${a.cls ?? ""}`} style={{ top: a.start * ROW + 2, height: a.len * ROW - 4, ...stagger(i + di) }}>
                  <p className="truncate text-[11px] font-semibold">{a.name}</p>
                  <p className="truncate text-[10px] opacity-75">{a.type}</p>
                </div>
              ))}
            </div>
          ))}
          <div className="pointer-events-none absolute inset-x-0 flex items-center" style={{ top: 2.3 * ROW }}>
            <span className="ml-[50px] h-2.5 w-2.5 rounded-full bg-red-500" /><span className="h-px flex-1 bg-red-500" />
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <Card i={1} title="October 2026">
          <div className="mt-3 grid grid-cols-7 gap-1 text-center text-[10px]">
            {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => <span key={i} className="font-semibold text-slate-400">{d}</span>)}
            {Array.from({ length: 31 }, (_, i) => i + 1).map((n) => (
              <span key={n} className={`rounded py-1 ${n === 22 ? "bg-teal-600 font-bold text-white" : [8, 15, 29].includes(n) ? "bg-teal-50 text-teal-700" : "text-slate-600"}`} style={n === 1 ? { gridColumnStart: 4 } : undefined}>{n}</span>
            ))}
          </div>
        </Card>
        <Card i={2} title="Waiting list" action={<Pill tone="amber">3</Pill>}>
          <ul className="mt-2 space-y-2 text-xs">
            {[["Peter Njoroge", "Nephrology · urgent"], ["Lucy Adams", "Cardiology"], ["Sam Otieno", "Any GP"]].map(([n, s]) => (
              <li key={n} className="flex items-center justify-between rounded-lg bg-slate-50 px-2.5 py-2"><span><b className="text-slate-900">{n}</b><br /><span className="text-slate-500">{s}</span></span><span className="text-[11px] font-semibold text-teal-600">Book</span></li>
            ))}
          </ul>
        </Card>
        <div className="app-pick rounded-lg bg-teal-600 py-2.5 text-center text-xs font-semibold text-white">+ New appointment</div>
      </div>
    </div>
  );
}

function HospitalPatients() {
  return (
    <div className="grid grid-cols-[280px_1fr] gap-4">
      <div className="app-pop space-y-2 rounded-xl border border-slate-200 bg-white p-3" style={stagger(0)}>
        <SearchBox placeholder="Search patients…" />
        {[["Ahmed Khan", "HC-004218 · 54 y", true], ["Fatima Ali", "HC-004219 · 61 y"], ["Grace Mwangi", "HC-004220 · 38 y"], ["John Doe", "HC-004221 · 47 y"], ["Amina Yusuf", "HC-004222 · 29 y"], ["Omar Said", "HC-004223 · 66 y"]].map(([n, s, on]) => (
          <div key={n as string} className={`flex items-center gap-2.5 rounded-lg p-2 ${on ? "bg-teal-50 ring-1 ring-teal-200" : ""}`}>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-[10px] font-bold text-slate-700">{(n as string).split(" ").map((x) => x[0]).join("")}</span>
            <div><p className="text-xs font-semibold text-slate-900">{n}</p><p className="text-[10px] text-slate-500">{s}</p></div>
          </div>
        ))}
      </div>
      <div className="space-y-4">
        <div className="app-pop flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4" style={stagger(1)}>
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-600 text-sm font-bold text-white">AK</span>
            <div><p className="text-base font-bold text-slate-900">Ahmed Khan</p><p className="text-xs text-slate-500">Male · 54 y · B+ · CKD stage 3a · Dr. Sarah Lee</p></div>
          </div>
          <div className="flex gap-2"><Pill tone="red">Allergy: Penicillin</Pill><Pill tone="green">Insured</Pill></div>
        </div>
        <div className="grid grid-cols-4 gap-4">
          <Kpi i={2} label="Blood pressure" value="128/82" delta="▼ improving" />
          <Kpi i={3} label="eGFR" value="58" delta="▲ +3 since Jul" />
          <Kpi i={4} label="Creatinine" value="1.3" delta="mg/dL · watch" up={false} />
          <Kpi i={5} label="Weight" value="78 kg" delta="▼ 2 kg" />
        </div>
        <Card i={6} title="Visit history">
          <ol className="mt-3 space-y-3 border-l-2 border-teal-100 pl-4 text-xs">
            {[["Oct 08", "Follow-up · BP controlled, labs ordered", "Dr. Lee"], ["Sep 10", "Lab review · eGFR 55, diet plan updated", "Dr. Lee"], ["Jul 14", "Consultation · referred by GP", "Dr. Okoro"]].map(([d, t, by], i) => (
              <li key={d} className="app-pop relative" style={stagger(i + 7)}>
                <span className="absolute -left-[22px] top-1 h-2.5 w-2.5 rounded-full bg-teal-500 ring-4 ring-white" />
                <p className="font-semibold text-slate-900">{d} · {t}</p><p className="text-slate-500">{by}</p>
              </li>
            ))}
          </ol>
        </Card>
      </div>
    </div>
  );
}

function HospitalDashboard() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-4">
        <Kpi i={0} label="Appointments today" value="128" delta="▲ 12 vs avg" />
        <Kpi i={1} label="No-show rate" value="6.2%" delta="▼ 2.1% with reminders" />
        <Kpi i={2} label="Avg. waiting time" value="14 min" delta="▼ 5 min" />
        <Kpi i={3} label="Room utilization" value="82%" delta="▲ 7%" />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <Card i={4} title="Appointments per day" className="col-span-2">
          <svg viewBox="0 0 400 140" className="mt-4 h-40 w-full" aria-hidden="true">
            {[30, 65, 100].map((y) => <line key={y} x1="0" x2="400" y1={y} y2={y} stroke="#f1f5f9" />)}
            <path d="M0 110 L57 90 L114 96 L171 62 L228 70 L285 40 L342 52 L400 30 L400 140 L0 140Z" fill="#14b8a6" opacity="0.12" />
            <path d="M0 110 L57 90 L114 96 L171 62 L228 70 L285 40 L342 52 L400 30" fill="none" stroke="#0d9488" strokeWidth="2.5" pathLength={1} className="app-draw" />
            <path d="M0 125 L57 118 L114 120 L171 108 L228 112 L285 100 L342 104 L400 96" fill="none" stroke="#f43f5e" strokeWidth="2" strokeDasharray="4 4" />
          </svg>
          <div className="mt-1 flex gap-4 text-[11px] text-slate-500"><span className="flex items-center gap-1.5"><span className="h-2 w-3 rounded bg-teal-600" />Booked</span><span className="flex items-center gap-1.5"><span className="h-0.5 w-3 bg-rose-500" />Walk-ins</span></div>
        </Card>
        <Card i={5} title="Utilization by doctor">
          <ul className="mt-4 space-y-3.5 text-xs">
            {doctors.map((d, i) => {
              const v = [92, 78, 85, 64][i];
              return (
                <li key={d.n}>
                  <div className="flex justify-between text-slate-600"><span>{d.n}</span><b className="text-slate-900">{v}%</b></div>
                  <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-100"><div className={`app-grow-x h-full rounded-full ${d.c}`} style={{ width: `${v}%`, ...stagger(i) }} /></div>
                </li>
              );
            })}
          </ul>
        </Card>
      </div>
    </div>
  );
}

function HospitalLab() {
  const cols: { t: string; tone: Tone; cards: [string, string, string][] }[] = [
    { t: "Requested", tone: "slate", cards: [["LR-3381", "Ahmed Khan", "Renal panel, CBC"], ["LR-3382", "Lucy Adams", "Lipid profile"]] },
    { t: "Sample collected", tone: "amber", cards: [["LR-3377", "Fatima Ali", "Electrolytes"], ["LR-3379", "Omar Said", "Troponin"], ["LR-3380", "Leo Brown", "Urinalysis"]] },
    { t: "Results ready", tone: "green", cards: [["LR-3371", "Grace Mwangi", "HbA1c 6.1%"], ["LR-3374", "John Doe", "Creatinine 1.1"]] },
  ];
  return (
    <div className="grid grid-cols-3 gap-4">
      {cols.map((c, ci) => (
        <div key={c.t} className="app-pop rounded-xl bg-slate-100/80 p-3" style={stagger(ci)}>
          <div className="mb-3 flex items-center justify-between"><span className="text-sm font-semibold text-slate-800">{c.t}</span><Pill tone={c.tone}>{c.cards.length}</Pill></div>
          <div className="space-y-2.5">
            {c.cards.map(([id, n, t], i) => (
              <div key={id} className={`app-pop rounded-lg border border-slate-200 bg-white p-3 shadow-sm ${ci === 1 && i === 0 ? "app-slide" : ""}`} style={stagger(ci + i + 1)}>
                <div className="flex justify-between text-[11px]"><b className="text-slate-900">{id}</b><span className="text-slate-400">Central Lab</span></div>
                <p className="mt-1 text-xs font-semibold text-slate-800">{n}</p>
                <p className="text-[11px] text-slate-500">{t}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------- Transport views ---------- */

const R1 = "M60 300 C140 260 180 200 260 190 S400 120 520 90";
const R2 = "M80 120 C160 140 220 220 320 240 S460 300 560 280";
const R3 = "M40 220 C120 200 200 120 300 110 S420 60 480 40";

function TransportDispatch() {
  const trips: [string, string, string, Tone, string][] = [
    ["TR-5582", "TX-4821 · J. Carter", "Dallas → Atlanta", "blue", "In transit"],
    ["TR-5583", "TX-3307 · M. Gomez", "Houston → Memphis", "amber", "Delayed 25m"],
    ["TR-5584", "TX-5120 · K. Wu", "Austin → Denver", "blue", "In transit"],
    ["TR-5585", "TX-1045 · L. Hart", "El Paso → Phoenix", "green", "Delivered"],
    ["TR-5586", "TX-2290 · R. Bell", "Dallas → Chicago", "slate", "Loading"],
  ];
  return (
    <div className="grid grid-cols-[1fr_330px] gap-4">
      <div className="app-pop relative h-[520px] overflow-hidden rounded-xl border border-slate-200 bg-[#e9eff6]" style={stagger(0)}>
        <svg viewBox="0 0 600 400" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden="true">
          <path d="M0 80 L600 50 M0 260 L600 300 M150 0 L180 400 M420 0 L400 400 M0 170 C200 160 400 200 600 180" stroke="white" strokeWidth="10" fill="none" />
          <rect x="200" y="300" width="90" height="60" rx="8" fill="#d1fae5" /><rect x="440" y="140" width="70" height="50" rx="8" fill="#dbeafe" />
          {[[R1, "#1d5fe0", "0s"], [R2, "#f59e0b", "-3s"], [R3, "#1d5fe0", "-6s"]].map(([d, c, delay]) => (
            <g key={d}>
              <path d={d} stroke={c} strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.85" pathLength={1} className="app-draw" />
              <g className="app-follow" style={{ offsetPath: `path('${d}')`, animationDelay: delay, animationDuration: "14s" } as React.CSSProperties}>
                <circle r="13" fill="white" /><circle r="8" fill={c} />
              </g>
            </g>
          ))}
        </svg>
        <div className="absolute left-4 top-4 rounded-xl bg-white/95 p-3 shadow-lg">
          <p className="text-[11px] font-semibold text-slate-500">Live fleet</p>
          <div className="mt-1 flex gap-4 text-xs"><span><b className="text-lg text-slate-900">67</b> in transit</span><span><b className="text-lg text-amber-600">3</b> delayed</span><span><b className="text-lg text-emerald-600">21</b> delivered</span></div>
        </div>
        <div className="app-toast absolute bottom-4 left-4 flex items-center gap-2 rounded-xl bg-slate-900 p-3 text-white shadow-xl">
          <Icon name="alert" className="h-4 w-4 text-amber-400" /><span className="text-xs"><b>TR-5583</b> unscheduled stop · 18 min · I-30 E</span>
        </div>
      </div>
      <div className="space-y-2.5">
        <div className="flex items-center justify-between"><p className="text-sm font-semibold text-slate-900">Today&apos;s trips</p><PrimaryBtn>+ New trip</PrimaryBtn></div>
        {trips.map(([id, truck, route, tone, st], i) => (
          <div key={id} className={`app-pop rounded-xl border bg-white p-3 ${i === 0 ? "border-brand-300 ring-2 ring-brand-100" : "border-slate-200"}`} style={stagger(i + 1)}>
            <div className="flex items-center justify-between"><b className="text-xs text-slate-900">{id}</b><Pill tone={tone}>{st}</Pill></div>
            <p className="mt-1 text-xs font-semibold text-slate-700">{route}</p>
            <p className="text-[11px] text-slate-500">{truck}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function TransportTrips() {
  const [tab, setTab] = useState(1);
  const sets: [string, string, string, number, string][][] = [
    [["TR-5590", "Fort Worth → Tulsa", "Nov 18 · 06:00", 0, "$2,140"], ["TR-5591", "Dallas → Little Rock", "Nov 18 · 08:30", 0, "$1,980"], ["TR-5592", "Houston → New Orleans", "Nov 19 · 05:00", 0, "$2,450"]],
    [["TR-5582", "Dallas → Atlanta", "ETA 18:20", 58, "$3,860"], ["TR-5583", "Houston → Memphis", "ETA 16:05", 71, "$2,920"], ["TR-5584", "Austin → Denver", "ETA Nov 18", 33, "$4,410"], ["TR-5587", "San Antonio → Laredo", "ETA 12:40", 86, "$1,120"]],
    [["TR-5585", "El Paso → Phoenix", "Delivered 09:12", 100, "$2,760"], ["TR-5579", "Dallas → Kansas City", "Delivered 07:45", 100, "$3,140"]],
    [["TR-5570", "Houston → Dallas", "Closed · invoiced", 100, "$1,690"], ["TR-5568", "Austin → Houston", "Closed · invoiced", 100, "$1,240"]],
  ];
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Tabs items={["Planned", "In transit", "Delivered", "Closed"]} active={tab} onChange={setTab} />
        <div className="flex gap-2"><SearchBox placeholder="Search trip, truck, customer…" /><PrimaryBtn>+ Plan trip</PrimaryBtn></div>
      </div>
      <div key={tab}>
        <Table
          widths="0.8fr 1.6fr 1.1fr 1.6fr 0.8fr"
          cols={["Trip", "Route", "Schedule", "Progress", "Revenue"]}
          rows={sets[tab].map(([id, r, s, p, rev], i) => [
            <b key="i" className="text-slate-900">{id}</b>, r, s,
            <span key="p" className="flex items-center gap-2"><span className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100"><span className={`app-grow-x block h-full rounded-full ${p === 100 ? "bg-emerald-500" : "bg-brand-500"}`} style={{ width: `${p}%`, ...stagger(i) }} /></span><span className="w-8 text-right">{p}%</span></span>,
            <b key="r" className="text-slate-900">{rev}</b>,
          ])}
        />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <Kpi i={5} label="Loaded miles today" value="18,420" delta="▲ 6%" />
        <Kpi i={6} label="Empty miles" value="9.8%" delta="▼ 1.4%" />
        <Kpi i={7} label="On-time delivery" value="94%" delta="▲ 2%" />
      </div>
    </div>
  );
}

function TransportProfit() {
  const trucks: [string, number][] = [["TX-4821", 82], ["TX-3307", 64], ["TX-5120", 71], ["TX-1045", -18], ["TX-2290", 48], ["TK-0218", 30], ["TX-0907", -8], ["TX-6612", 56]];
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-4">
        <Kpi i={0} label="Revenue (MTD)" value="$1.24M" delta="▲ 12%" />
        <Kpi i={1} label="Operating cost" value="$0.97M" delta="▲ 5%" up={false} />
        <Kpi i={2} label="Net margin" value="21.8%" delta="▲ 3.1 pts" />
        <Kpi i={3} label="Cost per mile" value="$1.62" delta="▼ $0.07" />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <Card i={4} title="Profit per truck (MTD, $k)" className="col-span-2">
          <div className="relative mt-4 flex h-44 items-center gap-3">
            <span className="absolute inset-x-0 top-[70%] h-px bg-slate-200" />
            {trucks.map(([t, v], i) => (
              <div key={t} className="relative flex h-full flex-1 flex-col items-center">
                <div className="relative h-full w-full">
                  <div
                    className={`absolute inset-x-1 rounded-md ${v >= 0 ? "app-grow-y bg-gradient-to-t from-emerald-600 to-emerald-400" : "app-grow-down bg-gradient-to-b from-red-600 to-red-400"}`}
                    style={v >= 0 ? { bottom: "30%", height: `${(v / 100) * 70}%`, ...stagger(i) } : { top: "70%", height: `${(-v / 100) * 70}%`, ...stagger(i) }}
                  />
                </div>
                <span className="mt-1 text-[10px] text-slate-400">{t}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card i={5} title="Where the money goes">
          <div className="mt-4 flex h-4 overflow-hidden rounded-full">
            {[[38, "bg-brand-600"], [22, "bg-amber-500"], [16, "bg-violet-500"], [12, "bg-teal-500"], [12, "bg-slate-300"]].map(([v, c], i) => (
              <span key={i} className={`app-grow-x h-full ${c}`} style={{ width: `${v}%`, ...stagger(i) }} />
            ))}
          </div>
          <ul className="mt-4 space-y-2 text-xs text-slate-600">
            {[["Fuel", "38%", "bg-brand-600"], ["Driver pay", "22%", "bg-amber-500"], ["Maintenance", "16%", "bg-violet-500"], ["Tires", "12%", "bg-teal-500"], ["Overheads", "12%", "bg-slate-300"]].map(([l, v, c]) => (
              <li key={l} className="flex items-center justify-between"><span className="flex items-center gap-2"><span className={`h-2 w-2 rounded-full ${c}`} />{l}</span><b className="text-slate-900">{v}</b></li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}

function TransportInvoice() {
  return (
    <div className="grid grid-cols-[1fr_1.15fr] gap-4">
      <div className="space-y-2.5">
        <div className="flex items-center justify-between"><p className="text-sm font-semibold text-slate-900">Closed trips ready to invoice</p><Pill tone="blue">6</Pill></div>
        {[["TR-5585", "Acme Foods", "$2,760"], ["TR-5579", "Lone Star Steel", "$3,140"], ["TR-5576", "Acme Foods", "$1,980"], ["TR-5574", "GreenGrow Co-op", "$2,220"]].map(([id, c, a], i) => (
          <div key={id} className={`app-pop flex items-center justify-between rounded-xl border bg-white p-3 ${i === 0 ? "border-brand-300 ring-2 ring-brand-100" : "border-slate-200"}`} style={stagger(i)}>
            <div className="flex items-center gap-3">
              <span className={`flex h-5 w-5 items-center justify-center rounded ${i < 2 ? "bg-brand-600 text-white" : "border border-slate-300"}`}>{i < 2 && <Icon name="check" className="h-3 w-3" />}</span>
              <div><p className="text-xs font-bold text-slate-900">{id}</p><p className="text-[11px] text-slate-500">{c}</p></div>
            </div>
            <b className="text-sm text-slate-900">{a}</b>
          </div>
        ))}
        <div className="app-pick mt-2 rounded-lg bg-brand-600 py-2.5 text-center text-xs font-semibold text-white">Generate 2 invoices</div>
      </div>
      <div className="app-pop rounded-xl border border-slate-200 bg-white p-6 shadow-sm" style={stagger(2)}>
        <div className="flex items-start justify-between">
          <div><p className="text-lg font-extrabold text-slate-900">INVOICE</p><p className="text-xs text-slate-500">INV-2026-1048 · Oct 22, 2026</p></div>
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-600 text-sm font-black text-white">T</span>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4 text-xs">
          <div><p className="font-semibold text-slate-400">Bill to</p><p className="font-semibold text-slate-900">Acme Foods Inc.</p><p className="text-slate-500">1200 Commerce St, Dallas TX</p></div>
          <div className="text-right"><p className="font-semibold text-slate-400">Format</p><p className="font-semibold text-slate-900">Per trip · PO matched</p><p className="text-slate-500">Net 30</p></div>
        </div>
        <div className="mt-4 divide-y divide-slate-100 border-y border-slate-100 text-xs">
          {[["Line haul · TR-5585 El Paso → Phoenix", "$2,380.00"], ["Fuel surcharge (12%)", "$285.60"], ["Detention 2 h", "$94.40"]].map(([l, v], i) => (
            <div key={l} className="app-pop flex justify-between py-2.5" style={stagger(i + 3)}><span className="text-slate-600">{l}</span><b className="text-slate-900">{v}</b></div>
          ))}
        </div>
        <div className="mt-3 flex justify-between text-sm"><span className="font-semibold text-slate-600">Total due</span><span className="text-xl font-extrabold text-slate-900">$2,760.00</span></div>
        <div className="mt-4 flex gap-2 text-[11px] font-semibold"><span className="rounded-md bg-emerald-50 px-2 py-1 text-emerald-700">POD attached</span><span className="rounded-md bg-brand-50 px-2 py-1 text-brand-700">Posted to ledger</span></div>
      </div>
    </div>
  );
}

/* ---------- Food delivery views ---------- */

function FoodOrders() {
  const cols: { t: string; tone: Tone; cards: { id: string; who: string; items: string; mins: number; total: string }[] }[] = [
    { t: "New", tone: "red", cards: [{ id: "ZS-1047", who: "Aisha M.", items: "6 × Classic Cinnamon", mins: 1, total: "$21.00" }, { id: "ZS-1046", who: "Brian K.", items: "Party box (12)", mins: 3, total: "$38.00" }] },
    { t: "Baking", tone: "amber", cards: [{ id: "ZS-1045", who: "Wanjiru N.", items: "2 × Choco Swirl, 2 × Classic", mins: 9, total: "$15.40" }, { id: "ZS-1044", who: "Tom R.", items: "4 × Pecan Caramel", mins: 12, total: "$18.80" }] },
    { t: "Out for delivery", tone: "blue", cards: [{ id: "ZS-1042", who: "Ahmed K.", items: "2 × Classic, 1 × Choco", mins: 6, total: "$7.70" }, { id: "ZS-1041", who: "Lina S.", items: "Brunch box (6)", mins: 14, total: "$22.00" }] },
    { t: "Delivered", tone: "green", cards: [{ id: "ZS-1039", who: "Mark O.", items: "3 × Classic", mins: 0, total: "$10.50" }] },
  ];
  return (
    <div className="grid grid-cols-4 gap-3">
      {cols.map((c, ci) => (
        <div key={c.t} className="app-pop rounded-xl bg-slate-100/80 p-3" style={stagger(ci)}>
          <div className="mb-3 flex items-center justify-between"><span className="text-sm font-semibold text-slate-800">{c.t}</span><Pill tone={c.tone}>{c.cards.length}</Pill></div>
          <div className="space-y-2.5">
            {c.cards.map((o, i) => (
              <div key={o.id} className={`app-pop rounded-lg border border-slate-200 bg-white p-3 shadow-sm ${ci === 0 && i === 0 ? "app-drop ring-2 ring-rose-200" : ""}`} style={stagger(ci + i + 1)}>
                <div className="flex justify-between text-[11px]"><b className="text-slate-900">{o.id}</b><b className="text-slate-900">{o.total}</b></div>
                <p className="mt-1 text-xs font-semibold text-slate-800">{o.who}</p>
                <p className="truncate text-[11px] text-slate-500">{o.items}</p>
                <div className="mt-2 flex items-center justify-between text-[10px]">
                  <span className="text-slate-400">{c.t === "Delivered" ? "Delivered 10:42" : `${o.mins} min`}</span>
                  {c.t === "New" && <span className="rounded bg-rose-500 px-2 py-0.5 font-semibold text-white">Accept</span>}
                  {c.t === "Baking" && <span className="rounded bg-amber-100 px-2 py-0.5 font-semibold text-amber-700">Mark ready</span>}
                  {c.t === "Out for delivery" && <span className="font-semibold text-brand-600">Track →</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function FoodMenu() {
  const items: [string, string, string, boolean, boolean][] = [
    ["Classic Cinnamon", "Rolls", "$3.50", true, true],
    ["Choco Swirl", "Rolls", "$4.20", false, true],
    ["Pecan Caramel", "Rolls", "$4.70", true, true],
    ["Cream Cheese Glaze", "Rolls", "$3.90", true, false],
    ["Party Box (12)", "Boxes", "$38.00", true, true],
    ["Brunch Box (6)", "Boxes", "$22.00", false, true],
  ];
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Tabs items={["All items 24", "Rolls", "Boxes", "Drinks"]} active={0} onChange={() => {}} />
        <div className="flex gap-2"><SearchBox placeholder="Search menu…" /><PrimaryBtn>+ Add item</PrimaryBtn></div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {items.map(([n, cat, price, glaze, live], i) => (
          <div key={n} className="app-pop flex gap-3 rounded-xl border border-slate-200 bg-white p-3" style={stagger(i)}>
            <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-orange-50"><Roll glaze={glaze} className="h-14 w-14" /></span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-900">{n}</p>
              <p className="text-[11px] text-slate-500">{cat}</p>
              <p className="mt-1 text-sm font-bold text-slate-900">{price}</p>
              <div className="mt-1.5 flex items-center gap-2 text-[11px]">
                <span className={`relative h-4 w-7 rounded-full transition ${live ? "bg-emerald-500" : "bg-slate-300"}`}><span className={`absolute top-0.5 h-3 w-3 rounded-full bg-white shadow ${live ? "left-3.5" : "left-0.5"}`} /></span>
                <span className={live ? "text-emerald-700" : "text-slate-500"}>{live ? "Available" : "Sold out"}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FoodSales() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-4">
        <Kpi i={0} label="Orders today" value="186" delta="▲ 22% vs last Sat" />
        <Kpi i={1} label="Revenue today" value="$2,940" delta="▲ 18%" />
        <Kpi i={2} label="Avg. delivery time" value="27 min" delta="▼ 4 min" />
        <Kpi i={3} label="Repeat customers" value="64%" delta="▲ 6%" />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <Card i={4} title="Orders by hour" className="col-span-2" action={<span className="text-[11px] text-slate-400">Today</span>}>
          <Bars values={[18, 34, 62, 88, 70, 46, 52, 80, 66, 30]} labels={["7a", "8a", "9a", "10a", "11a", "12p", "1p", "2p", "3p", "4p"]} color="from-rose-500 to-orange-300" />
        </Card>
        <Card i={5} title="Top sellers">
          <ul className="mt-3 space-y-3">
            {[["Classic Cinnamon", 92, true], ["Party Box (12)", 64, true], ["Choco Swirl", 51, false], ["Pecan Caramel", 38, true]].map(([n, v, g], i) => (
              <li key={n as string} className="flex items-center gap-3">
                <Roll glaze={g as boolean} className="h-8 w-8 shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="flex justify-between text-xs"><span className="truncate text-slate-700">{n}</span><b className="text-slate-900">{v}</b></div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-100"><div className="app-grow-x h-full rounded-full bg-rose-500" style={{ width: `${v}%`, ...stagger(i) }} /></div>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}

const F1 = "M300 200 C260 150 200 130 120 90";
const F2 = "M300 200 C360 240 420 250 500 300";
const F3 = "M300 200 C330 140 400 110 470 70";

function FoodDeliveryMap() {
  const riders: [string, string, string, Tone, string][] = [
    ["Kevin O.", "ZS-1042 · Westlands", "6 min", "blue", "On the way"],
    ["Mary W.", "ZS-1041 · Kilimani", "14 min", "blue", "On the way"],
    ["Sam T.", "ZS-1045 · Parklands", "At bakery", "amber", "Waiting"],
    ["Joy A.", "Available", "-", "green", "Idle"],
  ];
  return (
    <div className="grid grid-cols-[1fr_300px] gap-4">
      <div className="app-pop relative h-[520px] overflow-hidden rounded-xl border border-slate-200 bg-[#f3efe9]" style={stagger(0)}>
        <svg viewBox="0 0 600 400" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden="true">
          <path d="M0 100 L600 70 M0 300 L600 320 M120 0 L160 400 M450 0 L430 400 M0 200 C200 190 400 220 600 200" stroke="white" strokeWidth="12" fill="none" />
          <circle cx="300" cy="200" r="70" fill="#fb7185" opacity="0.08" /><circle cx="300" cy="200" r="140" fill="none" stroke="#fb7185" strokeDasharray="6 6" opacity="0.4" />
          {[[F1, "0s"], [F2, "-4s"], [F3, "-8s"]].map(([d, delay]) => (
            <g key={d}>
              <path d={d} stroke="#f43f5e" strokeWidth="4" strokeLinecap="round" fill="none" pathLength={1} className="app-draw" />
              <g className="app-follow" style={{ offsetPath: `path('${d}')`, animationDelay: delay, animationDuration: "12s" } as React.CSSProperties}>
                <circle r="12" fill="white" /><circle r="7" fill="#f43f5e" />
              </g>
            </g>
          ))}
          <rect x="284" y="184" width="32" height="32" rx="9" fill="#0f172a" />
        </svg>
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] font-bold text-white">ZS</span>
        <div className="absolute left-4 top-4 rounded-xl bg-white/95 p-3 shadow-lg">
          <p className="text-[11px] font-semibold text-slate-500">Delivery zone · 5 km</p>
          <div className="mt-1 flex gap-4 text-xs"><span><b className="text-lg text-slate-900">4</b> riders</span><span><b className="text-lg text-rose-600">3</b> on the way</span></div>
        </div>
      </div>
      <div className="space-y-2.5">
        <p className="text-sm font-semibold text-slate-900">Riders</p>
        {riders.map(([n, o, eta, tone, st], i) => (
          <div key={n} className="app-pop flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3" style={stagger(i + 1)}>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-100 text-[11px] font-bold text-rose-700">{n.split(" ").map((x) => x[0]).join("")}</span>
            <div className="min-w-0 flex-1"><p className="text-xs font-bold text-slate-900">{n}</p><p className="truncate text-[11px] text-slate-500">{o}</p></div>
            <div className="text-right"><Pill tone={tone}>{st}</Pill><p className="mt-1 text-[10px] text-slate-400">{eta}</p></div>
          </div>
        ))}
        <div className="app-pick rounded-lg bg-rose-500 py-2.5 text-center text-xs font-semibold text-white">Assign next order</div>
      </div>
    </div>
  );
}

/* ---------- Payments views ---------- */

function PayTransactions() {
  const [tab, setTab] = useState(0);
  const all: [string, string, string, string, Tone, string, string][] = [
    ["PAY-88213", "Acme Foods Inc.", "INV-1048", "Mobile money", "green", "Settled", "$2,760.00"],
    ["PAY-88212", "Lone Star Steel", "INV-1045", "Card •• 4242", "green", "Settled", "$3,140.00"],
    ["PAY-88211", "GreenGrow Co-op", "INV-1043", "Bank transfer", "amber", "Pending", "$2,220.00"],
    ["PAY-88210", "Delta Retail", "INV-1040", "Card •• 1881", "red", "Failed", "$940.00"],
    ["PAY-88209", "Acme Foods Inc.", "INV-1039", "Card •• 4242", "green", "Settled", "$1,980.00"],
    ["PAY-88208", "Prairie Mills", "INV-1036", "Bank transfer", "violet", "Refunded", "$310.00"],
  ];
  const filters = ["All", "Settled", "Pending", "Failed", "Refunded"];
  const rows = tab === 0 ? all : all.filter((r) => r[5] === filters[tab]);
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-4">
        <Kpi i={0} label="Collected today" value="$18,420" delta="▲ 14%" />
        <Kpi i={1} label="Pending settlement" value="$6,980" delta="3 payments" up={false} />
        <Kpi i={2} label="Success rate" value="97.8%" delta="▲ 0.6%" />
        <Kpi i={3} label="Avg. days to pay" value="11.2" delta="▼ 6 days" />
      </div>
      <div className="flex items-center justify-between">
        <Tabs items={filters} active={tab} onChange={setTab} />
        <div className="flex gap-2"><SearchBox placeholder="Search payment, customer, invoice…" /><PrimaryBtn>Send payment link</PrimaryBtn></div>
      </div>
      <div key={tab}>
        <Table
          widths="0.9fr 1.4fr 0.8fr 1.1fr 0.8fr 0.9fr"
          cols={["Payment", "Customer", "Invoice", "Method", "Status", "Amount"]}
          rows={rows.map((r) => [<b key="a" className="text-slate-900">{r[0]}</b>, r[1], r[2], r[3], <Pill key="p" tone={r[4]}>{r[5]}</Pill>, <b key="c" className="text-slate-900">{r[6]}</b>])}
        />
      </div>
    </div>
  );
}

function PayReceivables() {
  const buckets: [string, string, number, string][] = [["Current", "$42,300", 56, "bg-emerald-500"], ["1–30 days", "$18,900", 25, "bg-brand-500"], ["31–60 days", "$9,400", 12, "bg-amber-500"], ["60+ days", "$5,200", 7, "bg-red-500"]];
  return (
    <div className="space-y-4">
      <Card i={0} title="Receivables aging" action={<span className="text-xs font-semibold text-slate-500">Total $75,800</span>}>
        <div className="mt-4 flex h-5 overflow-hidden rounded-full">
          {buckets.map(([, , v, c], i) => <span key={i} className={`app-grow-x h-full ${c}`} style={{ width: `${v}%`, ...stagger(i) }} />)}
        </div>
        <div className="mt-4 grid grid-cols-4 gap-3">
          {buckets.map(([l, a, v, c]) => (
            <div key={l} className="rounded-lg border border-slate-100 bg-slate-50 p-3">
              <p className="flex items-center gap-2 text-xs text-slate-500"><span className={`h-2 w-2 rounded-full ${c}`} />{l}</p>
              <p className="mt-1 text-lg font-bold text-slate-900">{a}</p>
              <p className="text-[11px] text-slate-400">{v}% of total</p>
            </div>
          ))}
        </div>
      </Card>
      <Table
        widths="1.4fr 0.9fr 0.9fr 0.9fr 1.2fr"
        cols={["Customer", "Open invoices", "Overdue", "Balance", "Next action"]}
        rows={[
          ["Delta Retail", "4", <Pill key="o" tone="red">$5,200</Pill>, <b key="b" className="text-slate-900">$9,880</b>, <span key="n" className="font-semibold text-brand-600">Reminder #3 · WhatsApp</span>],
          ["GreenGrow Co-op", "3", <Pill key="o" tone="amber">$2,220</Pill>, <b key="b" className="text-slate-900">$6,640</b>, <span key="n" className="font-semibold text-brand-600">Payment link sent</span>],
          ["Acme Foods Inc.", "2", <Pill key="o" tone="green">$0</Pill>, <b key="b" className="text-slate-900">$4,120</b>, <span key="n" className="text-slate-500">Auto-pay on file</span>],
          ["Prairie Mills", "5", <Pill key="o" tone="amber">$1,860</Pill>, <b key="b" className="text-slate-900">$7,310</b>, <span key="n" className="font-semibold text-brand-600">Reminder #1 · Email</span>],
        ]}
      />
    </div>
  );
}

function PayReconcile() {
  const pairs: [string, string, string, boolean][] = [
    ["MM ref QK7H2… · $2,760.00", "INV-1048 · Acme Foods", "Exact match", true],
    ["Card batch 1022 · $3,140.00", "INV-1045 · Lone Star Steel", "Exact match", true],
    ["Bank credit · $2,000.00", "INV-1043 · GreenGrow ($2,220)", "Partial · $220 open", false],
    ["Bank credit · $455.00", "No invoice found", "Needs review", false],
  ];
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <Kpi i={0} label="Auto-matched" value="94%" delta="412 of 438 lines" />
        <Kpi i={1} label="Partial matches" value="18" delta="Suggested allocations" up={false} />
        <Kpi i={2} label="Unmatched" value="8" delta="▼ 12 vs last week" />
      </div>
      <Card i={3} title="Bank & gateway lines → invoices" action={<PrimaryBtn>Post 2 matches</PrimaryBtn>}>
        <div className="mt-4 space-y-2.5">
          {pairs.map(([left, right, st, ok], i) => (
            <div key={left} className="app-pop grid grid-cols-[1fr_40px_1fr_150px] items-center gap-3" style={stagger(i + 4)}>
              <span className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-medium text-slate-700">{left}</span>
              <span className={`flex h-7 w-7 items-center justify-center justify-self-center rounded-full ${ok ? "bg-emerald-500 text-white" : "bg-amber-100 text-amber-700"}`}>{ok ? <Icon name="check" className="h-3.5 w-3.5" /> : <Icon name="link" className="h-3.5 w-3.5" />}</span>
              <span className={`rounded-lg border px-3 py-2.5 text-xs font-medium ${right.startsWith("No") ? "border-dashed border-red-300 text-red-600" : "border-slate-200 text-slate-700"}`}>{right}</span>
              <Pill tone={ok ? "green" : right.startsWith("No") ? "red" : "amber"}>{st}</Pill>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function PayAnalytics() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-4">
        <Kpi i={0} label="Collected (MTD)" value="$412k" delta="▲ 19%" />
        <Kpi i={1} label="DSO" value="24 days" delta="▼ 9 days" />
        <Kpi i={2} label="Failed payments" value="2.2%" delta="▼ 0.8%" />
        <Kpi i={3} label="Gateway fees" value="1.4%" delta="▼ 0.2%" />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <Card i={4} title="Collections per week ($k)" className="col-span-2">
          <Bars values={[52, 64, 58, 76, 70, 88, 82, 94]} labels={["W36", "W37", "W38", "W39", "W40", "W41", "W42", "W43"]} color="from-violet-600 to-indigo-400" />
        </Card>
        <Card i={5} title="By payment method">
          <div className="mt-3 flex items-center gap-4">
            <Donut center="438" sub="payments" parts={[{ v: 46, c: "#7c3aed" }, { v: 32, c: "#1d5fe0" }, { v: 22, c: "#14b8a6" }]} />
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-violet-600" />Mobile money 46%</li>
              <li className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-brand-600" />Card 32%</li>
              <li className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-teal-500" />Bank 22%</li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ---------- Apps ---------- */

const webApps: WebApp[] = [
  {
    id: "workshop",
    icon: "wrench",
    name: "Tech23 Workshop",
    category: "Workshop management",
    host: "workshop.tech23.app",
    tagline: "The whole shop, from job card to cost ledger",
    text: "Supervisors and stores see every bay, job card, PM schedule and part in one place, with analytics on downtime and repair cost per vehicle.",
    accent: "from-amber-500 to-orange-600",
    theme: { sidebar: "bg-slate-900", text: "text-slate-200", muted: "text-slate-500", active: "bg-amber-500 text-slate-900", hover: "hover:bg-white/5", logo: "bg-amber-500 text-slate-900" },
    nav: [
      { label: "Dashboard", icon: "chart", view: "ws-dash" },
      { label: "Workshop", icon: "wrench", children: [{ label: "Job cards", view: "ws-jobs", badge: "42" }, { label: "Inspections" }, { label: "PM schedules", view: "ws-pm" }] },
      { label: "Stores", icon: "box", children: [{ label: "Parts & stock", view: "ws-parts" }, { label: "Purchase requests" }, { label: "Goods received" }] },
      { label: "Reports", icon: "clipboard", children: [{ label: "Downtime" }, { label: "Repair cost" }] },
    ],
    views: [
      { id: "ws-dash", icon: "chart", title: "Workshop analytics", path: "dashboard", text: "Open jobs, repair time, downtime and cost against budget, with job status and PM due this week.", Render: WorkshopDashboard },
      { id: "ws-jobs", icon: "clipboard", title: "Job cards", path: "workshop/job-cards", text: "Filter job cards by status, search by vehicle or technician, and open a new card in one click.", Render: WorkshopJobs },
      { id: "ws-pm", icon: "calendar", title: "PM schedules", path: "workshop/pm-schedules", text: "A weekly plan of preventive maintenance by vehicle, triggered by mileage, engine hours or date.", Render: WorkshopPM },
      { id: "ws-parts", icon: "box", title: "Parts & stock", path: "stores/parts", text: "Live stock levels, reorder alerts, and parts issued straight to a job card and charged to the truck.", Render: WorkshopParts },
    ],
  },
  {
    id: "hospital",
    icon: "calendar",
    name: "Tech23 Care",
    category: "Hospital scheduling",
    host: "care.tech23.app",
    tagline: "Every doctor, room and patient on one schedule",
    text: "Front desks book appointments across doctors and rooms, clinicians open the full patient record, and labs post results back to the patient's file.",
    accent: "from-teal-500 to-emerald-600",
    theme: { sidebar: "bg-white border-r border-slate-200", text: "text-slate-700", muted: "text-slate-400", active: "bg-teal-600 text-white", hover: "hover:bg-slate-100", logo: "bg-teal-600 text-white" },
    nav: [
      { label: "Dashboard", icon: "chart", view: "hs-dash" },
      { label: "Scheduling", icon: "calendar", children: [{ label: "Calendar", view: "hs-cal" }, { label: "Waiting list", badge: "3" }, { label: "Rooms & resources" }] },
      { label: "Patients", icon: "users", children: [{ label: "Patient records", view: "hs-patients" }, { label: "Visits" }] },
      { label: "Laboratory", icon: "clipboard", children: [{ label: "Lab requests", view: "hs-lab", badge: "7" }, { label: "Results" }] },
    ],
    views: [
      { id: "hs-cal", icon: "calendar", title: "Appointment scheduling", path: "scheduling/calendar", text: "Doctor-by-doctor day view with color-coded visit types, blocked time, a live time line and a waiting list to fill gaps.", Render: HospitalCalendar },
      { id: "hs-patients", icon: "users", title: "Patient records", path: "patients/ahmed-khan", text: "Vitals, allergies, insurance and the full visit timeline on one screen.", Render: HospitalPatients },
      { id: "hs-dash", icon: "chart", title: "Clinic analytics", path: "dashboard", text: "Appointments, no-shows, waiting time and utilization per doctor and room.", Render: HospitalDashboard },
      { id: "hs-lab", icon: "clipboard", title: "Lab requests", path: "laboratory/requests", text: "Track each request from ordered to sample collected to results ready.", Render: HospitalLab },
    ],
  },
  {
    id: "food",
    icon: "bag",
    name: "Zahra Sweet Rolls",
    category: "Food delivery admin",
    host: "admin.zahrasweetrolls.com",
    tagline: "Orders, menu, riders and sales for a delivery bakery",
    text: "The kitchen accepts and bakes orders on a live board, the team manages the menu and stock, riders are assigned and tracked, and the owner sees sales by the hour.",
    accent: "from-rose-500 to-orange-500",
    theme: { sidebar: "bg-[#2a1216]", text: "text-rose-50", muted: "text-rose-300/60", active: "bg-rose-500 text-white", hover: "hover:bg-white/5", logo: "bg-gradient-to-br from-rose-500 to-orange-400 text-white" },
    nav: [
      { label: "Live orders", icon: "bag", view: "fd-orders" },
      { label: "Catalog", icon: "star", children: [{ label: "Menu & products", view: "fd-menu" }, { label: "Product images" }, { label: "Coupons" }] },
      { label: "Delivery", icon: "pin", children: [{ label: "Riders & tracking", view: "fd-delivery", badge: "3" }, { label: "Delivery zones" }] },
      { label: "Reports", icon: "chart", children: [{ label: "Sales analytics", view: "fd-sales" }, { label: "Customers" }] },
    ],
    views: [
      { id: "fd-orders", icon: "bag", title: "Live order board", path: "orders", text: "New orders pop in at the top. Accept, bake, mark ready and hand to a rider, with timers on every card.", Render: FoodOrders },
      { id: "fd-menu", icon: "star", title: "Menu & products", path: "catalog/menu", text: "Prices, categories and photos, with one switch to mark an item sold out on the app instantly.", Render: FoodMenu },
      { id: "fd-delivery", icon: "pin", title: "Riders & tracking", path: "delivery/riders", text: "Every rider on the map inside the delivery zone, with ETAs and one-click assignment.", Render: FoodDeliveryMap },
      { id: "fd-sales", icon: "chart", title: "Sales analytics", path: "reports/sales", text: "Orders by hour, revenue, delivery time, repeat customers and top sellers.", Render: FoodSales },
    ],
  },
  {
    id: "payments",
    icon: "dollar",
    name: "Tech23 Pay",
    category: "Payments & billing",
    host: "pay.tech23.app",
    tagline: "Collect, reconcile and report every payment",
    text: "Finance teams send payment links, take card, mobile money and bank payments, chase overdue invoices automatically and let reconciliation match money to invoices on its own.",
    accent: "from-violet-500 to-indigo-600",
    theme: { sidebar: "bg-[#1b1340]", text: "text-violet-50", muted: "text-violet-300/60", active: "bg-violet-500 text-white", hover: "hover:bg-white/5", logo: "bg-gradient-to-br from-violet-500 to-indigo-500 text-white" },
    nav: [
      { label: "Transactions", icon: "dollar", view: "py-tx" },
      { label: "Receivables", icon: "invoice", children: [{ label: "Aging & reminders", view: "py-ar", badge: "4" }, { label: "Payment links" }, { label: "Customers" }] },
      { label: "Banking", icon: "building", children: [{ label: "Reconciliation", view: "py-rec", badge: "8" }, { label: "Payouts" }] },
      { label: "Reports", icon: "chart", children: [{ label: "Collections", view: "py-an" }, { label: "Gateway fees" }] },
    ],
    views: [
      { id: "py-tx", icon: "dollar", title: "Transactions", path: "transactions", text: "Every card, mobile money and bank payment with its status, filterable in one click.", Render: PayTransactions },
      { id: "py-ar", icon: "invoice", title: "Receivables & reminders", path: "receivables/aging", text: "Aging buckets per customer, with automatic reminders by email and WhatsApp until it's paid.", Render: PayReceivables },
      { id: "py-rec", icon: "link", title: "Auto reconciliation", path: "banking/reconciliation", text: "Bank and gateway lines matched to invoices automatically; partials and unknowns queued for review.", Render: PayReconcile },
      { id: "py-an", icon: "chart", title: "Collections analytics", path: "reports/collections", text: "Weekly collections, days sales outstanding, failure rate and the split by payment method.", Render: PayAnalytics },
    ],
  },
  {
    id: "transport",
    icon: "truck",
    name: "Tech23 TMS",
    category: "Transport management",
    host: "tms.tech23.app",
    tagline: "Dispatch, trips, profit and invoicing in one web app",
    text: "Dispatchers watch the fleet live, planners schedule trips, finance sees profit per truck and closed trips turn into invoices automatically.",
    accent: "from-brand-500 to-brand-700",
    theme: { sidebar: "bg-brand-950", text: "text-brand-100", muted: "text-brand-400", active: "bg-brand-600 text-white", hover: "hover:bg-white/5", logo: "bg-brand-500 text-white" },
    nav: [
      { label: "Dispatch board", icon: "pin", view: "tr-dispatch" },
      { label: "Operations", icon: "route", children: [{ label: "Trip planning", view: "tr-trips" }, { label: "Fuel" }, { label: "Drivers" }] },
      { label: "Finance", icon: "dollar", children: [{ label: "Profitability", view: "tr-profit" }, { label: "Invoicing", view: "tr-invoice", badge: "6" }, { label: "Payables" }] },
      { label: "Fleet", icon: "truck", children: [{ label: "Vehicles" }, { label: "Documents" }] },
    ],
    views: [
      { id: "tr-dispatch", icon: "pin", title: "Live dispatch", path: "dispatch", text: "Every truck on the map with live status, delay and stop alerts, and today's trips beside it.", Render: TransportDispatch },
      { id: "tr-trips", icon: "route", title: "Trip planning", path: "operations/trips", text: "Planned, in-transit, delivered and closed trips with progress and revenue per trip.", Render: TransportTrips },
      { id: "tr-profit", icon: "chart", title: "Profitability", path: "finance/profitability", text: "Profit and loss per truck and where every dollar of cost goes.", Render: TransportProfit },
      { id: "tr-invoice", icon: "invoice", title: "Auto invoicing", path: "finance/invoicing", text: "Pick closed trips and generate invoices in each customer's format, with POD attached.", Render: TransportInvoice },
    ],
  },
];

/* ---------- Browser frame ---------- */

function Sidebar({ app, view, open, onToggle, onNav }: { app: WebApp; view: string; open: Set<string>; onToggle: (g: string) => void; onNav: (v: string) => void }) {
  const t = app.theme;
  return (
    <aside className={`flex w-[220px] shrink-0 flex-col ${t.sidebar}`}>
      <div className="flex items-center gap-2.5 px-4 py-4">
        <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${t.logo}`}><Icon name={app.icon} className="h-4 w-4" /></span>
        <span className={`text-sm font-bold ${t.text}`}>{app.name}</span>
      </div>
      <nav className="flex-1 space-y-0.5 px-2.5 text-[13px]">
        <p className={`px-2.5 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wider ${t.muted}`}>Menu</p>
        {app.nav.map((g) => {
          const isOpen = open.has(g.label);
          const activeTop = g.view === view;
          const childActive = g.children?.some((c) => c.view === view);
          return (
            <div key={g.label}>
              <button
                type="button"
                data-nav={g.view}
                onClick={() => (g.view ? onNav(g.view) : onToggle(g.label))}
                className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left font-medium transition ${activeTop ? t.active : `${t.text} ${t.hover}`} ${childActive ? "font-semibold" : ""}`}
              >
                <Icon name={g.icon} className="h-4 w-4 shrink-0" />
                <span className="flex-1">{g.label}</span>
                {g.children && <span className={`text-[10px] transition ${isOpen ? "rotate-90" : ""}`}>▶</span>}
              </button>
              {g.children && (
                <div className={`grid transition-[grid-template-rows] duration-300 ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                  <div className="overflow-hidden">
                    <div className={`my-0.5 ml-[18px] space-y-0.5 border-l pl-2.5 ${t.sidebar.includes("white") ? "border-slate-200" : "border-white/10"}`}>
                      {g.children.map((c) => (
                        <button
                          key={c.label}
                          type="button"
                          data-nav={c.view}
                          onClick={() => c.view && onNav(c.view)}
                          className={`flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-left text-[12px] transition ${c.view === view ? t.active : c.view ? `${t.text} ${t.hover}` : `${t.muted} cursor-default`}`}
                        >
                          {c.label}
                          {c.badge && <span className={`rounded-full px-1.5 text-[10px] font-bold ${c.view === view ? "bg-white/25" : "bg-red-500 text-white"}`}>{c.badge}</span>}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </nav>
      <div className={`m-3 flex items-center gap-2.5 rounded-xl p-2.5 ${t.sidebar.includes("white") ? "bg-slate-50" : "bg-white/5"}`}>
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-brand-700 text-[11px] font-bold text-white">JM</span>
        <div className="min-w-0"><p className={`truncate text-xs font-semibold ${t.text}`}>Jordan Miles</p><p className={`text-[10px] ${t.muted}`}>Administrator</p></div>
      </div>
    </aside>
  );
}

function BrowserFrame({ app, viewId, onNav, cursor }: { app: WebApp; viewId: string; onNav: (v: string) => void; cursor: { x: number; y: number; click: number } | null }) {
  const view = app.views.find((v) => v.id === viewId) ?? app.views[0];
  const groupOf = useCallback((v: string) => app.nav.find((g) => g.children?.some((c) => c.view === v))?.label, [app]);
  const [open, setOpen] = useState<Set<string>>(() => new Set(app.nav.filter((g) => g.children?.some((c) => c.view)).map((g) => g.label)));
  const toggle = (g: string) => setOpen((s) => { const n = new Set(s); if (n.has(g)) n.delete(g); else n.add(g); return n; });
  const nav = (v: string) => {
    const g = groupOf(v);
    if (g && !open.has(g)) setOpen((s) => new Set(s).add(g));
    onNav(v);
  };
  const crumbGroup = groupOf(view.id);
  const { Render } = view;
  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-2xl shadow-brand-950/30 ring-1 ring-slate-900/10">
      <div className="flex h-11 shrink-0 items-center gap-3 border-b border-slate-200 bg-slate-100 px-4">
        <span className="flex gap-1.5"><span className="h-3 w-3 rounded-full bg-red-400" /><span className="h-3 w-3 rounded-full bg-amber-400" /><span className="h-3 w-3 rounded-full bg-emerald-400" /></span>
        <div className="mx-auto flex h-7 w-[440px] items-center gap-2 rounded-md bg-white px-3 text-[12px] text-slate-500 ring-1 ring-slate-200">
          <svg viewBox="0 0 24 24" className="h-3 w-3 text-emerald-600" fill="currentColor" aria-hidden="true"><path d="M6 10V8a6 6 0 1 1 12 0v2h1v12H5V10zm2 0h8V8a4 4 0 1 0-8 0z" /></svg>
          <span className="truncate"><span className="text-slate-900">{app.host}</span>/{view.path}</span>
        </div>
        <span className="w-12" />
      </div>
      <div className="flex min-h-0 flex-1">
        <Sidebar app={app} view={view.id} open={open} onToggle={toggle} onNav={nav} />
        <div className="flex min-w-0 flex-1 flex-col bg-slate-50">
          <header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6">
            <div>
              <p className="text-[11px] text-slate-400">{app.name}{crumbGroup ? ` / ${crumbGroup}` : ""} / <span className="text-slate-600">{view.title}</span></p>
              <p className="text-base font-bold text-slate-900">{view.title}</p>
            </div>
            <div className="flex items-center gap-3">
              <SearchBox placeholder="Search…  ⌘K" />
              <span className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500"><Icon name="bell" className="h-4 w-4" /><span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-red-500" /></span>
            </div>
          </header>
          <main key={view.id} className="web-view min-h-0 flex-1 overflow-hidden p-6">
            <Render />
          </main>
        </div>
      </div>
      {cursor && (
        <div className="pointer-events-none absolute left-0 top-0 z-30 transition-transform duration-700 ease-[cubic-bezier(0.65,0,0.35,1)]" style={{ transform: `translate(${cursor.x}px, ${cursor.y}px)` }} aria-hidden="true">
          <span key={cursor.click} className="web-click absolute -left-3 -top-3 h-6 w-6 rounded-full bg-brand-400/50" />
          <svg viewBox="0 0 24 24" className="h-6 w-6 drop-shadow-md" aria-hidden="true"><path d="M4 2l16 9.5-7 1.5-3.5 7z" fill="#0f172a" stroke="white" strokeWidth="1.5" strokeLinejoin="round" /></svg>
        </div>
      )}
    </div>
  );
}

/* ---------- Showcase ---------- */

const MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const prefersReducedMotion = () => window.matchMedia(MOTION_QUERY).matches;
const subscribeMotion = (cb: () => void) => {
  const mq = window.matchMedia(MOTION_QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

export function WebShowcase() {
  const [appIdx, setAppIdx] = useState(0);
  const [viewId, setViewId] = useState(webApps[0].views[0].id);
  const [hovered, setHovered] = useState(false);
  const [scale, setScale] = useState(1);
  const [cursor, setCursor] = useState<{ x: number; y: number; click: number } | null>(null);
  const reduced = useSyncExternalStore(subscribeMotion, prefersReducedMotion, () => false);
  const fitRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const pillsRef = useRef<HTMLDivElement>(null);
  const app = webApps[appIdx];

  // Render the desktop UI at a fixed size and scale it down to fit, so phones see the real layout.
  useLayoutEffect(() => {
    const el = fitRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setScale(Math.min(1, e.contentRect.width / FRAME_W)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const pickApp = (i: number) => {
    setAppIdx(i);
    setViewId(webApps[i].views[0].id);
    setCursor(null);
  };

  // Autoplay: glide the cursor to the next menu item, "click" it, then move on to the next app.
  useEffect(() => {
    if (hovered || reduced) return;
    const idx = app.views.findIndex((v) => v.id === viewId);
    const next = app.views[idx + 1];
    let t2 = 0;
    const t1 = window.setTimeout(() => {
      if (!next) {
        const ni = (appIdx + 1) % webApps.length;
        setAppIdx(ni);
        setViewId(webApps[ni].views[0].id);
        setCursor(null);
        return;
      }
      const root = frameRef.current;
      const target = root?.querySelector<HTMLElement>(`[data-nav="${next.id}"]`);
      if (root && target) {
        const r = root.getBoundingClientRect();
        const b = target.getBoundingClientRect();
        const s = r.width / FRAME_W;
        setCursor((c) => ({ x: (b.left - r.left + b.width * 0.55) / s, y: (b.top - r.top + b.height * 0.55) / s, click: (c?.click ?? 0) + 1 }));
      }
      t2 = window.setTimeout(() => setViewId(next.id), 750);
    }, AUTOPLAY_MS);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [app, appIdx, viewId, hovered, reduced]);

  const view = app.views.find((v) => v.id === viewId) ?? app.views[0];

  // Mobile: keep the selected app card and feature pill centred in their sliders.
  useEffect(() => centerSelected(tabsRef.current, "[aria-selected=true]"), [appIdx]);
  useEffect(() => centerSelected(pillsRef.current, "[aria-pressed=true]"), [viewId]);

  return (
    <section className="relative overflow-hidden bg-white py-20 sm:py-24" id="web-apps" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div className="absolute inset-x-0 top-0 h-[28rem] bg-gradient-to-b from-brand-50 to-transparent" aria-hidden="true" />
      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">Web apps</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">And the web apps that run the office</h2>
          <p className="mt-4 text-lg leading-relaxed text-slate-600">
            Full browser apps with menus, dashboards and workflows. Click around: every menu, tab and screen below is live.
          </p>
        </div>

        {/* App switcher */}
        <div ref={tabsRef} className="-mx-4 mt-10 flex snap-x gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] lg:mx-0 lg:grid lg:grid-cols-5 lg:overflow-visible lg:px-0 lg:pb-0" role="tablist" aria-label="Choose a web app">
          {webApps.map((a, i) => (
            <button
              key={a.id}
              type="button"
              role="tab"
              aria-selected={i === appIdx}
              onClick={() => pickApp(i)}
              className={`group relative flex w-[230px] shrink-0 snap-center items-center gap-3 overflow-hidden rounded-2xl border p-4 text-left transition lg:w-auto ${
                i === appIdx ? "border-brand-300 bg-white shadow-xl shadow-brand-900/10" : "border-slate-200 bg-white/60 hover:border-slate-300 hover:bg-white"
              }`}
            >
              <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${a.accent} text-white shadow-md transition group-hover:scale-105`}>
                <Icon name={a.icon} className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-xs font-semibold uppercase tracking-wider text-slate-500">{a.category}</span>
                <span className="block font-bold text-slate-900">{a.name}</span>
              </span>
              {i === appIdx && <span className={`absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r ${a.accent}`} />}
            </button>
          ))}
        </div>

        {/* Browser deck */}
        <div ref={fitRef} className="relative mt-10" style={{ height: FRAME_H * scale + 24 * scale }}>
          {webApps.map((a, i) => {
            const off = (i - appIdx + webApps.length) % webApps.length;
            if (off === 0) return null;
            return (
              <div
                key={a.id}
                className={`absolute left-1/2 top-0 origin-top rounded-2xl bg-gradient-to-br ${a.accent} opacity-30 transition-all duration-700`}
                style={{ width: FRAME_W * scale, height: FRAME_H * scale, transform: `translateX(-50%) translateY(${off * 12 * scale}px) scale(${1 - off * 0.04})`, zIndex: 5 - off }}
                aria-hidden="true"
              />
            );
          })}
          <div key={app.id} className="web-in absolute left-1/2 top-0 z-10 origin-top-left" style={{ width: FRAME_W, height: FRAME_H, transform: `translateX(${-FRAME_W * scale / 2}px) scale(${scale})` }}>
            <div ref={frameRef} className="h-full w-full">
              <BrowserFrame app={app} viewId={viewId} onNav={(v) => { setCursor(null); setViewId(v); }} cursor={cursor} />
            </div>
          </div>
        </div>

        {/* Mobile: feature pills + info right under the browser */}
        <div className="mt-4 lg:hidden">
          <div ref={pillsRef} className="-mx-4 flex snap-x gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none]">
            {app.views.map((v) => {
              const on = v.id === view.id;
              return (
                <button
                  key={v.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => { setCursor(null); setViewId(v.id); }}
                  className={`flex shrink-0 snap-center items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${on ? "border-brand-600 bg-brand-600 text-white" : "border-slate-200 bg-white text-slate-700"}`}
                >
                  <Icon name={v.icon} className="h-3.5 w-3.5" />
                  {v.title}
                </button>
              );
            })}
          </div>
          <p key={view.id} className="hero-in mx-auto mt-2 min-h-[2.75rem] max-w-md text-center text-sm leading-snug text-slate-600 [animation-duration:0.4s]" aria-live="polite">
            {view.text}
          </p>
        </div>

        {/* Explore */}
        <div className="mt-8 grid gap-8 lg:mt-10 lg:grid-cols-12 lg:items-start">
          <div key={app.id} className="lg:col-span-4">
            <p className="hero-in text-sm font-semibold uppercase tracking-wider text-brand-600">{app.category}</p>
            <h3 style={{ "--d": "80ms" } as React.CSSProperties} className="hero-in mt-1 text-2xl font-bold tracking-tight">{app.tagline}</h3>
            <p style={{ "--d": "160ms" } as React.CSSProperties} className="hero-in mt-3 leading-relaxed text-slate-600">{app.text}</p>
            <div style={{ "--d": "240ms" } as React.CSSProperties} className="hero-in mt-6"><DemoButton label="Book a walkthrough" /></div>
          </div>
          <div className="hidden lg:col-span-8 lg:block">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Explore features</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {app.views.map((v) => {
                const on = v.id === view.id;
                return (
                  <button
                    key={v.id}
                    type="button"
                    aria-pressed={on}
                    onClick={() => { setCursor(null); setViewId(v.id); }}
                    className={`flex gap-3 rounded-2xl border p-4 text-left transition ${on ? "border-brand-300 bg-brand-50 shadow-md shadow-brand-900/5" : "border-slate-200 bg-white hover:border-brand-200 hover:bg-slate-50"}`}
                  >
                    <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition ${on ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-600"}`}>
                      <Icon name={v.icon} className="h-5 w-5" />
                    </span>
                    <span>
                      <span className="block font-semibold text-slate-900">{v.title}</span>
                      <span className="mt-0.5 block text-sm leading-relaxed text-slate-600">{v.text}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
