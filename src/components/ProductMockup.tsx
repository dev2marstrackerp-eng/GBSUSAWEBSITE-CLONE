// Illustrative product UI rendered in HTML/CSS. Swap for real Tech23 screenshots
// (drop PNGs in /public/screenshots and pass `screenshot`) as they become available.
import Image from "next/image";
import { CountUp } from "@/components/CountUp";
import { Reveal } from "@/components/Reveal";

export type MockupVariant =
  | "overview"
  | "dispatch"
  | "fleet"
  | "workshop"
  | "fuel"
  | "inventory"
  | "procurement"
  | "drivers"
  | "costing"
  | "finance";

const titles: Record<MockupVariant, string> = {
  overview: "Operations Dashboard",
  dispatch: "Dispatch Board",
  fleet: "Fleet Register",
  workshop: "Workshop · Job Cards",
  fuel: "Fuel Control",
  inventory: "Spare Parts Stock",
  procurement: "Purchase Requests",
  drivers: "Driver Performance",
  costing: "Vehicle Profit & Loss",
  finance: "Finance Analytics",
};

const statusStyles = {
  green: "bg-emerald-50 text-emerald-700",
  blue: "bg-brand-50 text-brand-700",
  amber: "bg-amber-50 text-amber-700",
  red: "bg-red-50 text-red-700",
  slate: "bg-slate-100 text-slate-600",
} as const;

function Pill({ tone, children }: { tone: keyof typeof statusStyles; children: React.ReactNode }) {
  return <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusStyles[tone]}`}>{children}</span>;
}

function Kpi({ label, value, delta }: { label: string; value: string; delta?: string }) {
  return (
    <div className="rounded-lg border border-slate-100 bg-white p-2.5">
      <p className="text-[10px] font-medium text-slate-500">{label}</p>
      <p className="mt-0.5 text-sm font-bold text-slate-900 sm:text-base"><CountUp value={value} /></p>
      {delta && <p className="text-[10px] font-semibold text-emerald-600">{delta}</p>}
    </div>
  );
}

function Bars({ values, highlight }: { values: number[]; highlight?: number }) {
  return (
    <div className="flex h-24 items-end gap-1.5">
      {values.map((v, i) => (
        <div
          key={i}
          className={`anim-bar flex-1 rounded-t ${i === highlight ? "bg-brand-600" : "bg-brand-200"}`}
          style={{ height: `${v}%`, "--i": i } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

function Line({ points }: { points: number[] }) {
  const step = 100 / (points.length - 1);
  const d = points.map((p, i) => `${i === 0 ? "M" : "L"}${i * step},${100 - p}`).join(" ");
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-24 w-full" aria-hidden="true">
      <path d={`${d} L100,100 L0,100 Z`} className="anim-area fill-brand-100" />
      <path d={d} pathLength={1} className="anim-line stroke-brand-600" fill="none" strokeWidth={2} vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

function Table({ head, rows }: { head: string[]; rows: React.ReactNode[][] }) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-100 bg-white">
      <table className="w-full text-left text-[10px] sm:text-[11px]">
        <thead className="bg-slate-50 text-slate-500">
          <tr>{head.map((h) => <th key={h} className="px-2 py-1.5 font-semibold">{h}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-slate-700">
          {rows.map((r, i) => (
            <tr key={i}>{r.map((c, j) => <td key={j} className="whitespace-nowrap px-2 py-1.5">{c}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Body({ variant }: { variant: MockupVariant }) {
  switch (variant) {
    case "dispatch":
      return (
        <>
          <div className="grid grid-cols-3 gap-2">
            <Kpi label="Planned" value="42" />
            <Kpi label="In transit" value="67" />
            <Kpi label="Delivered today" value="38" delta="94% on time" />
          </div>
          <Table
            head={["Trip", "Route", "Truck", "Status"]}
            rows={[
              ["TR-10482", "Dallas → Houston", "TX-214", <Pill key="a" tone="blue">In transit</Pill>],
              ["TR-10483", "Atlanta → Charlotte", "GA-118", <Pill key="b" tone="green">Delivered</Pill>],
              ["TR-10484", "Chicago → Detroit", "IL-077", <Pill key="c" tone="amber">Delayed</Pill>],
              ["TR-10485", "Phoenix → Las Vegas", "AZ-305", <Pill key="d" tone="slate">Planned</Pill>],
            ]}
          />
        </>
      );
    case "fleet":
      return (
        <>
          <div className="grid grid-cols-3 gap-2">
            <Kpi label="Active units" value="128" />
            <Kpi label="Utilization" value="87%" delta="+6% MoM" />
            <Kpi label="Docs expiring" value="5" />
          </div>
          <div className="space-y-2 rounded-lg border border-slate-100 bg-white p-3">
            {[["TX-214 · Freightliner Cascadia", 92], ["GA-118 · Volvo VNL 760", 81], ["IL-077 · Kenworth T680", 64], ["AZ-305 · Peterbilt 579", 88]].map(([n, v], i) => (
              <div key={n as string}>
                <div className="flex justify-between text-[10px] text-slate-600"><span>{n}</span><span className="font-semibold">{v}%</span></div>
                <div className="mt-1 h-1.5 rounded-full bg-slate-100"><div className="anim-fill h-1.5 rounded-full bg-brand-600" style={{ width: `${v}%`, "--i": i } as React.CSSProperties} /></div>
              </div>
            ))}
          </div>
        </>
      );
    case "workshop":
      return (
        <div className="grid grid-cols-3 gap-2">
          {[
            ["Open", "blue", ["JC-2201 · Brake service", "JC-2203 · PM-B 30k mi"]],
            ["In progress", "amber", ["JC-2196 · Clutch repair", "JC-2199 · Tire rotation", "JC-2200 · DPF clean"]],
            ["Closed", "green", ["JC-2190 · Oil & filters", "JC-2192 · Inspection"]],
          ].map(([col, tone, cards]) => (
            <div key={col as string} className="rounded-lg bg-white p-2">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-[10px] font-semibold text-slate-700">{col as string}</p>
                <Pill tone={tone as keyof typeof statusStyles}>{(cards as string[]).length}</Pill>
              </div>
              <div className="space-y-1.5">
                {(cards as string[]).map((c) => (
                  <div key={c} className="rounded-md border border-slate-100 bg-slate-50 p-1.5 text-[10px] text-slate-600">{c}</div>
                ))}
              </div>
            </div>
          ))}
        </div>
      );
    case "fuel":
      return (
        <>
          <div className="grid grid-cols-3 gap-2">
            <Kpi label="Gallons this month" value="48,210" />
            <Kpi label="Avg MPG" value="6.9" delta="+0.4 vs target" />
            <Kpi label="Exceptions" value="3" />
          </div>
          <div className="rounded-lg border border-slate-100 bg-white p-3">
            <p className="mb-1 text-[10px] font-semibold text-slate-600">Fuel cost per mile</p>
            <Line points={[70, 64, 66, 58, 55, 52, 49, 46, 44]} />
          </div>
        </>
      );
    case "inventory":
      return (
        <Table
          head={["Part", "Store", "On hand", "Status"]}
          rows={[
            ["Brake pad set", "Main yard", "46", <Pill key="a" tone="green">OK</Pill>],
            ["Oil filter", "Main yard", "12", <Pill key="b" tone="amber">Reorder</Pill>],
            ["Air dryer cartridge", "East depot", "3", <Pill key="c" tone="red">Low</Pill>],
            ["295/75R22.5 tire", "Tire bay", "28", <Pill key="d" tone="green">OK</Pill>],
            ["Wiper blade", "East depot", "60", <Pill key="e" tone="green">OK</Pill>],
          ]}
        />
      );
    case "procurement":
      return (
        <>
          <div className="flex items-center gap-1.5 text-[10px]">
            {["Request", "Quotations", "Approval", "PO issued", "Received"].map((s, i) => (
              <div key={s} className="flex flex-1 items-center gap-1.5">
                <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full font-bold ${i < 3 ? "bg-brand-600 text-white" : "bg-slate-200 text-slate-500"}`}>{i + 1}</span>
                <span className="hidden truncate text-slate-600 sm:inline">{s}</span>
              </div>
            ))}
          </div>
          <Table
            head={["PR", "Item", "Supplier", "Status"]}
            rows={[
              ["PR-881", "Brake drums ×8", "3 quotes", <Pill key="a" tone="amber">Approval L2</Pill>],
              ["PR-882", "Engine oil 55gal", "Selected", <Pill key="b" tone="blue">PO issued</Pill>],
              ["PR-883", "Tires ×12", "2 quotes", <Pill key="c" tone="slate">Quoting</Pill>],
            ]}
          />
        </>
      );
    case "drivers":
      return (
        <Table
          head={["Driver", "Trips", "On time", "Score"]}
          rows={[
            ["M. Johnson", "24", "98%", <Pill key="a" tone="green">96</Pill>],
            ["R. Garcia", "21", "95%", <Pill key="b" tone="green">92</Pill>],
            ["T. Williams", "19", "89%", <Pill key="c" tone="amber">81</Pill>],
            ["K. Brown", "22", "97%", <Pill key="d" tone="green">94</Pill>],
            ["D. Miller", "17", "84%", <Pill key="e" tone="red">72</Pill>],
          ]}
        />
      );
    case "costing":
      return (
        <>
          <div className="grid grid-cols-3 gap-2">
            <Kpi label="Revenue / mile" value="$2.84" />
            <Kpi label="Cost / mile" value="$2.11" />
            <Kpi label="Margin" value="25.7%" delta="+2.1 pts" />
          </div>
          <div className="rounded-lg border border-slate-100 bg-white p-3">
            <p className="mb-2 text-[10px] font-semibold text-slate-600">Profit by vehicle</p>
            <Bars values={[72, 58, 90, 44, 66, 80, 35, 62]} highlight={2} />
          </div>
        </>
      );
    case "finance":
      return (
        <>
          <div className="grid grid-cols-3 gap-2">
            <Kpi label="Receivables" value="$1.24M" />
            <Kpi label="Payables" value="$612K" />
            <Kpi label="Cash" value="$894K" delta="+8.2%" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-lg border border-slate-100 bg-white p-3"><Line points={[30, 42, 38, 55, 60, 58, 72, 78]} /></div>
            <div className="rounded-lg border border-slate-100 bg-white p-3"><Bars values={[50, 65, 45, 80, 70, 90]} highlight={5} /></div>
          </div>
        </>
      );
    default:
      return (
        <>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <Kpi label="Trips in transit" value="67" />
            <Kpi label="Fleet utilization" value="87%" delta="+6%" />
            <Kpi label="Fuel $/mile" value="$0.61" delta="−4.3%" />
            <Kpi label="Trucks in shop" value="6" />
          </div>
          <div className="grid grid-cols-5 gap-2">
            <div className="col-span-3 rounded-lg border border-slate-100 bg-white p-3">
              <p className="mb-1 text-[10px] font-semibold text-slate-600">Revenue vs. cost</p>
              <Line points={[35, 40, 38, 52, 58, 55, 66, 74, 78]} />
            </div>
            <div className="col-span-2 space-y-1.5 rounded-lg border border-slate-100 bg-white p-3 text-[10px]">
              <p className="font-semibold text-slate-600">Alerts</p>
              <p className="flex justify-between"><span className="text-slate-600">TR-10484 delayed</span><Pill tone="amber">Trip</Pill></p>
              <p className="flex justify-between"><span className="text-slate-600">PM due · TX-214</span><Pill tone="blue">Shop</Pill></p>
              <p className="flex justify-between"><span className="text-slate-600">Permit expiring</span><Pill tone="red">Doc</Pill></p>
            </div>
          </div>
        </>
      );
  }
}

export function ProductMockup({
  variant = "overview",
  screenshot,
  className = "",
}: {
  variant?: MockupVariant;
  screenshot?: string;
  className?: string;
}) {
  return (
    <Reveal from="zoom" className={`overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-brand-900/15 ${className}`}>
      <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
        <span className="ml-3 truncate text-xs font-medium text-slate-500">Tech23 TMS · {titles[variant]}</span>
      </div>
      {screenshot ? (
        <Image src={screenshot} alt={`Tech23 TMS ${titles[variant]} screen`} width={1280} height={800} className="h-auto w-full" />
      ) : (
        <div className="flex">
          <div className="hidden w-12 shrink-0 flex-col items-center gap-3 bg-brand-900 py-4 sm:flex" aria-hidden="true">
            <span className="h-6 w-6 rounded-md bg-brand-500" />
            {[0, 1, 2, 3, 4].map((i) => <span key={i} className={`h-1.5 w-5 rounded-full ${i === 0 ? "bg-white" : "bg-brand-700"}`} />)}
          </div>
          <div className="min-w-0 flex-1 space-y-2.5 bg-slate-50/60 p-3 sm:p-4" role="img" aria-label={`Illustration of the Tech23 TMS ${titles[variant]} screen`}>
            <Body variant={variant} />
          </div>
        </div>
      )}
    </Reveal>
  );
}
