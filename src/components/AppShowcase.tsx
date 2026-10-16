"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import { Icon, type IconName } from "@/components/Icon";
import { DemoButton } from "@/components/ui";

// Mobile app "ad" showcase. Every phone and screen is drawn in HTML/CSS (no screenshots),
// shuffled as a fanned deck that auto-advances. "Explore features" spotlights the matching
// part of the live screen (elements tagged with data-spot) as a small guided tour.

type Feature = { spot: string; icon: IconName; title: string; text: string };

type App = {
  id: string;
  icon: IconName;
  name: string;
  category: string;
  tagline: string;
  text: string;
  explore: Feature[];
  users: string;
  accent: string; // tailwind gradient stops for the app icon + glow
  Screen: () => React.ReactElement;
};

/* ---------- Shared phone pieces ---------- */

function StatusBar({ dark = false }: { dark?: boolean }) {
  return (
    <div className={`flex items-center justify-between px-6 pt-3 text-[10px] font-semibold ${dark ? "text-white" : "text-slate-900"}`}>
      <span>9:41</span>
      <span className="flex items-center gap-1">
        <span className="flex items-end gap-px">
          {[3, 5, 7, 9].map((h) => (
            <span key={h} className="w-[3px] rounded-sm bg-current" style={{ height: h }} />
          ))}
        </span>
        <span className="ml-1 flex h-[9px] w-[18px] items-center rounded-[3px] border border-current p-px">
          <span className="h-full w-3/4 rounded-[1px] bg-current" />
        </span>
      </span>
    </div>
  );
}

function BottomNav({ items, dark = false }: { items: IconName[]; dark?: boolean }) {
  return (
    <div className={`absolute inset-x-0 bottom-0 flex items-center justify-around border-t px-4 pb-5 pt-2.5 ${dark ? "border-white/10 bg-brand-950/95" : "border-slate-100 bg-white/95"}`}>
      {items.map((n, i) => (
        <span key={n} className={`flex h-8 w-8 items-center justify-center rounded-xl ${i === 0 ? "bg-brand-600 text-white" : dark ? "text-brand-300" : "text-slate-400"}`}>
          <Icon name={n} className="h-4 w-4" />
        </span>
      ))}
    </div>
  );
}

const stagger = (i: number) => ({ "--i": i } as React.CSSProperties);
const ROUTE = "M30 130 C50 110 60 90 90 85 S140 70 165 50 S190 25 200 20";

/* ---------- Screens ---------- */

function DriverScreen() {
  const steps = [
    { t: "Delivery note scanned", s: "06:48 · DN-20931", done: true },
    { t: "Checkpoint · Shreveport, LA", s: "In transit", now: true },
    { t: "Arrive at offloading point", s: "ETA 18:20 · Atlanta, GA" },
  ];
  return (
    <div className="relative h-full bg-slate-50">
      <div className="bg-gradient-to-br from-brand-600 to-brand-800 pb-3">
        <StatusBar dark />
        <div className="app-pop flex items-center justify-between px-5 pt-4" style={stagger(0)}>
          <div>
            <p className="text-[10px] text-brand-100">Trip #TR-5582 · TX-4821</p>
            <p className="text-sm font-bold text-white">Dallas → Atlanta</p>
          </div>
          <span data-spot="trip" className="rounded-full bg-emerald-400/20 px-2.5 py-1 text-[10px] font-semibold text-emerald-200">On time</span>
        </div>
      </div>
      <div data-spot="directions" className="app-pop relative mx-3 mt-3 h-[150px] overflow-hidden rounded-2xl bg-[#e8eef6] shadow-sm" style={stagger(1)}>
        <svg viewBox="0 0 220 150" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden="true">
          <path d="M-10 40 L230 20 M-10 110 L230 130 M60 -10 L80 160 M160 -10 L150 160" stroke="white" strokeWidth="7" fill="none" />
          <path d="M-10 75 C40 70 70 95 110 80 S180 50 230 60" stroke="#cbd5e1" strokeWidth="9" fill="none" />
          <rect x="95" y="100" width="40" height="28" rx="4" fill="#d1fae5" />
          <rect x="20" y="58" width="30" height="20" rx="4" fill="#dbeafe" />
          <path d={ROUTE} stroke="#1d5fe0" strokeWidth="4" strokeLinecap="round" fill="none" pathLength={1} className="app-draw" />
          <circle cx="200" cy="20" r="6" fill="#ef4444" stroke="white" strokeWidth="2" />
          <circle cx="30" cy="130" r="5" fill="#1d5fe0" stroke="white" strokeWidth="2" />
          <g className="app-follow" style={{ offsetPath: `path('${ROUTE}')` } as React.CSSProperties}>
            <circle r="9" fill="white" opacity="0.9" />
            <circle r="5" fill="#1d5fe0" />
          </g>
        </svg>
        <div className="absolute inset-x-2 bottom-2 flex items-center gap-2 rounded-xl bg-slate-900/90 p-2 text-white">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand-500">
            <Icon name="arrow" className="h-4 w-4 -rotate-45" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-[10px] font-bold">Keep right onto I-20 E</p>
            <p className="text-[9px] text-slate-300">in 0.4 mi · 325 mi to go · ETA 18:20</p>
          </div>
        </div>
      </div>
      <div data-spot="timeline" className="mx-3 mt-3 space-y-2 rounded-2xl bg-white p-3 shadow-sm">
        {steps.map((s, i) => (
          <div key={s.t} className="app-pop flex items-center gap-2.5" style={stagger(i + 2)}>
            <span className={`relative flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${s.done ? "bg-emerald-500 text-white" : s.now ? "bg-brand-600" : "border-2 border-slate-200 bg-white"}`}>
              {s.done && <Icon name="check" className="h-3 w-3" />}
              {s.now && <span className="absolute inset-0 animate-ping rounded-full bg-brand-400" />}
            </span>
            <div className="min-w-0">
              <p className={`truncate text-[11px] font-semibold ${s.done || s.now ? "text-slate-900" : "text-slate-400"}`}>{s.t}</p>
              <p className="text-[10px] text-slate-400">{s.s}</p>
            </div>
          </div>
        ))}
      </div>
      <div data-spot="actions" className="mx-3 mt-3 grid grid-cols-4 gap-2">
        {([["clipboard", "Scan"], ["fuel", "Fuel"], ["alert", "Breakdown"], ["eye", "Inspect"]] as [IconName, string][]).map(([n, l], i) => (
          <div key={l} className="app-pop flex flex-col items-center gap-1" style={stagger(i + 5)}>
            <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${n === "alert" ? "bg-red-50 text-red-600" : "bg-white text-brand-600 shadow-sm"}`}>
              <Icon name={n} className="h-4 w-4" />
            </span>
            <span className="text-[9px] font-medium text-slate-600">{l}</span>
          </div>
        ))}
      </div>
      <BottomNav items={["route", "clipboard", "bell", "driver"]} />
    </div>
  );
}

function WorkshopScreen() {
  const jobs = [
    { id: "JC-1186", unit: "TX-4821 · Brake overhaul", tech: "MR", pct: 72, tone: "bg-brand-500", status: "In progress", pill: "bg-brand-50 text-brand-700" },
    { id: "JC-1185", unit: "TX-3307 · 25k mi service", tech: "AS", pct: 100, tone: "bg-emerald-500", status: "Completed", pill: "bg-emerald-50 text-emerald-700" },
    { id: "JC-1184", unit: "TR-0912 · Tire rotation", tech: "DL", pct: 35, tone: "bg-amber-500", status: "Awaiting parts", pill: "bg-amber-50 text-amber-700" },
  ];
  return (
    <div className="relative h-full bg-slate-50">
      <StatusBar />
      <div className="app-pop flex items-center justify-between px-5 pt-4" style={stagger(0)}>
        <div>
          <p className="text-[10px] text-slate-500">Main workshop</p>
          <p className="text-base font-bold text-slate-900">Job Cards</p>
        </div>
        <span data-spot="new" className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-lg leading-none text-white">+</span>
      </div>
      <div data-spot="bays" className="mx-4 mt-3 grid grid-cols-3 gap-2">
        {[["12", "Open"], ["5", "In bay"], ["3", "PM due"]].map(([v, l], i) => (
          <div key={l} className="app-pop rounded-xl bg-white p-2 text-center shadow-sm" style={stagger(i + 1)}>
            <p className={`text-base font-bold ${l === "PM due" ? "text-amber-600" : "text-slate-900"}`}>{v}</p>
            <p className="text-[9px] text-slate-500">{l}</p>
          </div>
        ))}
      </div>
      <div data-spot="jobs" className="mx-4 mt-3 space-y-2">
        {jobs.map((j, i) => (
          <div key={j.id} className="app-pop rounded-xl bg-white p-3 shadow-sm" style={stagger(i + 4)}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-900">{j.id}</span>
              <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-semibold ${j.pill}`}>{j.status}</span>
            </div>
            <p className="mt-1 truncate text-[10px] text-slate-500">{j.unit}</p>
            <div className="mt-2 flex items-center gap-2">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                <div className={`app-grow-x h-full rounded-full ${j.tone}`} style={{ width: `${j.pct}%`, ...stagger(i + 4) }} />
              </div>
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-800 text-[8px] font-bold text-white">{j.tech}</span>
            </div>
          </div>
        ))}
      </div>
      <div data-spot="parts" className="app-toast absolute inset-x-4 bottom-20 flex items-center gap-2 rounded-xl bg-slate-900 p-2.5 text-white shadow-xl">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500"><Icon name="box" className="h-3.5 w-3.5" /></span>
        <div>
          <p className="text-[10px] font-semibold">Parts issued to JC-1186</p>
          <p className="text-[9px] text-slate-400">4 × brake pads · $312 charged</p>
        </div>
      </div>
      <BottomNav items={["wrench", "calendar", "box", "chart"]} />
    </div>
  );
}

function AnalyticsScreen() {
  const bars = [42, 58, 50, 71, 64, 82, 76];
  return (
    <div className="relative h-full bg-brand-950">
      <StatusBar dark />
      <div className="app-pop flex items-center justify-between px-5 pt-4" style={stagger(0)}>
        <div>
          <p className="text-[10px] text-brand-300">This month</p>
          <p className="text-base font-bold text-white">Fleet Insights</p>
        </div>
        <span data-spot="filter" className="rounded-full border border-white/15 px-2.5 py-1 text-[9px] font-semibold text-brand-100">All divisions ▾</span>
      </div>
      <div data-spot="kpis" className="mx-4 mt-3 grid grid-cols-2 gap-2">
        {[["$1.24M", "Revenue", "+12%"], ["$0.38", "Profit / mile", "+6%"], ["87%", "Utilization", "+4%"], ["94%", "On-time", "+2%"]].map(([v, l, d], i) => (
          <div key={l} className="app-pop rounded-xl border border-white/10 bg-white/5 p-2.5" style={stagger(i + 1)}>
            <p className="text-[9px] text-brand-200">{l}</p>
            <p className="text-sm font-bold text-white">{v}</p>
            <p className="text-[9px] font-semibold text-emerald-400">{d}</p>
          </div>
        ))}
      </div>
      <div data-spot="chart" className="app-pop mx-4 mt-3 rounded-xl border border-white/10 bg-white/5 p-3" style={stagger(5)}>
        <p className="text-[10px] font-semibold text-white">Revenue vs cost</p>
        <div className="relative mt-2 flex h-20 items-end gap-1.5">
          {bars.map((h, i) => (
            <div key={i} className="app-grow-y flex-1 rounded-t bg-gradient-to-t from-brand-600 to-brand-400" style={{ height: `${h}%`, ...stagger(i) }} />
          ))}
          <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true">
            <path d="M0 32 L16 28 L33 30 L50 22 L66 24 L83 16 L100 18" fill="none" stroke="#34d399" strokeWidth="1.5" pathLength={1} className="app-draw" vectorEffect="non-scaling-stroke" />
          </svg>
        </div>
        <div className="mt-1.5 flex justify-between text-[8px] text-brand-300">
          {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => <span key={i}>{d}</span>)}
        </div>
      </div>
      <div data-spot="utilization" className="app-pop mx-4 mt-3 flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3" style={stagger(6)}>
        <svg viewBox="0 0 36 36" className="h-12 w-12 -rotate-90" aria-hidden="true">
          <circle cx="18" cy="18" r="15" fill="none" stroke="rgb(255 255 255 / 0.1)" strokeWidth="4" />
          <circle cx="18" cy="18" r="15" fill="none" stroke="#60a5fa" strokeWidth="4" strokeLinecap="round" pathLength={100} strokeDasharray="100" strokeDashoffset="13" className="app-ring" />
        </svg>
        <div>
          <p className="text-[10px] font-semibold text-white">87 of 100 trucks earning</p>
          <p className="text-[9px] text-brand-300">9 in workshop · 4 idle</p>
        </div>
      </div>
      <BottomNav items={["chart", "truck", "dollar", "bell"]} dark />
    </div>
  );
}

function HealthCardScreen() {
  const days = [["Mon", "20"], ["Tue", "21"], ["Wed", "22"], ["Thu", "23"], ["Fri", "24"]];
  const slots = ["09:00", "10:30", "14:00", "16:30"];
  return (
    <div className="relative h-full bg-white">
      <StatusBar />
      <div className="app-pop flex items-center justify-between px-5 pt-4" style={stagger(0)}>
        <div>
          <p className="text-[10px] text-slate-500">Hello,</p>
          <p className="text-base font-bold text-slate-900">Ahmed Khan</p>
        </div>
        <span data-spot="reminders" className="relative flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-700">
          <Icon name="bell" className="h-4 w-4" />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        </span>
      </div>
      <div data-spot="card" className="app-pop relative mx-4 mt-3 overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 p-3.5 text-white" style={stagger(1)}>
        <span className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-white/10" />
        <div className="flex items-center justify-between text-[9px] font-semibold uppercase tracking-wider text-emerald-100">
          <span>Health card</span>
          <span>HC-004218</span>
        </div>
        <div className="mt-2.5 grid grid-cols-3 gap-2">
          {[["128/82", "BP"], ["74", "Pulse"], ["58", "eGFR"]].map(([v, l]) => (
            <div key={l}>
              <p className="text-sm font-extrabold">{v}</p>
              <p className="text-[9px] text-emerald-100">{l}</p>
            </div>
          ))}
        </div>
        <p className="mt-2 text-[9px] text-emerald-50">Blood type B+ · Dr. Sarah Lee</p>
      </div>
      <div data-spot="schedule" className="app-pop mx-4 mt-3 rounded-2xl border border-slate-100 p-3" style={stagger(2)}>
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-bold text-slate-900">Book a visit</p>
          <span className="text-[9px] font-semibold text-brand-600">October</span>
        </div>
        <div className="mt-2 grid grid-cols-5 gap-1.5">
          {days.map(([d, n], i) => (
            <span key={n} className={`flex flex-col items-center rounded-lg py-1.5 text-[9px] ${i === 2 ? "app-pick bg-brand-600 text-white" : "bg-slate-50 text-slate-600"}`}>
              {d}
              <span className="text-xs font-bold">{n}</span>
            </span>
          ))}
        </div>
        <div className="mt-2 grid grid-cols-4 gap-1.5">
          {slots.map((t, i) => (
            <span key={t} className={`rounded-md py-1 text-center text-[9px] font-semibold ${i === 1 ? "bg-brand-50 text-brand-700 ring-1 ring-brand-500" : i === 3 ? "bg-slate-50 text-slate-300 line-through" : "bg-slate-50 text-slate-600"}`}>{t}</span>
          ))}
        </div>
      </div>
      <div data-spot="labs" className="mx-4 mt-3 space-y-1.5">
        {[["Creatinine", "1.3 mg/dL", "text-amber-600"], ["Hemoglobin", "13.8 g/dL", "text-emerald-600"]].map(([l, v, tone], i) => (
          <div key={l} className="app-pop flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2" style={stagger(i + 3)}>
            <span className="flex items-center gap-2 text-[10px] font-medium text-slate-700">
              <Icon name="clipboard" className="h-3.5 w-3.5 text-slate-400" /> {l}
            </span>
            <span className={`text-[10px] font-bold ${tone}`}>{v}</span>
          </div>
        ))}
      </div>
      <BottomNav items={["users", "calendar", "clipboard", "bell"]} />
    </div>
  );
}

function ApprovalsScreen() {
  const queue = [
    { id: "PR-2291", t: "Tires · 6 × steer 295/75", a: "$2,880", by: "Stores" },
    { id: "EX-0418", t: "Fuel advance · Trip TR-5590", a: "$350", by: "Dispatch" },
  ];
  return (
    <div className="relative h-full bg-slate-50">
      <StatusBar />
      <div className="app-pop flex items-center justify-between px-5 pt-4" style={stagger(0)}>
        <div>
          <p className="text-[10px] text-slate-500">Waiting for you</p>
          <p className="text-base font-bold text-slate-900">Approvals</p>
        </div>
        <span data-spot="badge" className="rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white">3 new</span>
      </div>
      <div data-spot="swipe" className="relative mx-4 mt-4 h-44">
        <div className="absolute inset-x-3 top-4 h-40 rounded-2xl bg-white/70 shadow-sm" />
        <div className="absolute inset-x-1.5 top-2 h-40 rounded-2xl bg-white/90 shadow-sm" />
        <div className="app-swipe absolute inset-x-0 top-0 h-40 rounded-2xl bg-white p-4 shadow-lg shadow-brand-900/10">
          <div className="flex items-center justify-between text-[10px]">
            <span className="font-bold text-slate-900">PO-1042</span>
            <span className="text-slate-400">Workshop</span>
          </div>
          <p className="mt-2 text-xs font-semibold text-slate-800">Brake pads & rotors · 4 units</p>
          <p className="mt-1 text-xl font-extrabold text-slate-900">$1,240.00</p>
          <p data-spot="budget" className="mt-1 text-[10px] text-slate-500">Within budget · 2 of 3 approvers signed</p>
          <div className="mt-3 grid grid-cols-2 gap-2 text-[10px] font-semibold">
            <span className="rounded-lg border border-slate-200 py-1.5 text-center text-slate-600">Reject</span>
            <span className="rounded-lg bg-brand-600 py-1.5 text-center text-white">Approve</span>
          </div>
          <span className="app-stamp absolute right-3 top-9 rotate-[-12deg] rounded-md border-2 border-emerald-500 px-2 py-0.5 text-xs font-extrabold tracking-wider text-emerald-600">APPROVED</span>
        </div>
      </div>
      <p className="mx-5 mt-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Up next</p>
      <div data-spot="queue" className="mx-4 mt-2 space-y-2">
        {queue.map((q, i) => (
          <div key={q.id} className="app-pop flex items-center justify-between rounded-xl bg-white p-3 shadow-sm" style={stagger(i + 2)}>
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-slate-900">{q.id} <span className="font-normal text-slate-400">· {q.by}</span></p>
              <p className="truncate text-[10px] text-slate-500">{q.t}</p>
            </div>
            <span className="text-xs font-bold text-slate-900">{q.a}</span>
          </div>
        ))}
      </div>
      <BottomNav items={["shield", "invoice", "clock", "driver"]} />
    </div>
  );
}

// Cinnamon-roll swirl drawn with a repeating radial gradient.
export function Roll({ className = "", glaze = false }: { className?: string; glaze?: boolean }) {
  return (
    <span
      className={`block rounded-full shadow-inner ${className}`}
      style={{
        background: `${glaze ? "radial-gradient(circle at 35% 30%, rgb(255 255 255 / 0.55), transparent 45%), " : ""}repeating-radial-gradient(circle at 50% 50%, #f6c98a 0 3px, #b86a2c 3px 5px, #e9a961 5px 7px)`,
      }}
    />
  );
}

function FoodScreen() {
  const items = [
    { n: "Classic Cinnamon", p: "$3.50", glaze: true, tag: "Bestseller" },
    { n: "Choco Swirl", p: "$4.20", glaze: false, tag: "New" },
  ];
  return (
    <div className="relative h-full bg-[#fff8f3]">
      <StatusBar />
      <div className="app-pop flex items-center justify-between px-5 pt-3" style={stagger(0)}>
        <div data-spot="address">
          <p className="text-[9px] text-slate-500">Deliver to</p>
          <p className="text-xs font-bold text-slate-900">Home · Westlands ▾</p>
        </div>
        <span data-spot="cart" className="relative flex h-8 w-8 items-center justify-center rounded-full bg-white text-rose-600 shadow-sm">
          <Icon name="bag" className="h-4 w-4" />
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[8px] font-bold text-white">2</span>
        </span>
      </div>
      <div data-spot="coupons" className="app-pop relative mx-4 mt-3 overflow-hidden rounded-2xl bg-gradient-to-r from-rose-500 to-orange-400 p-3 text-white" style={stagger(1)}>
        <p className="text-[9px] font-semibold uppercase tracking-wider text-rose-100">Zahra Sweet Rolls</p>
        <p className="text-sm font-extrabold leading-tight">20% off your first box</p>
        <span className="mt-1.5 inline-block rounded-md border border-dashed border-white/70 px-1.5 py-0.5 text-[9px] font-bold">ZAHRA20</span>
        <Roll glaze className="app-spin absolute -right-3 -top-2 h-20 w-20" />
      </div>
      <div className="mx-4 mt-3 flex gap-1.5 text-[9px] font-semibold">
        {["All", "Cinnamon", "Chocolate", "Boxes"].map((c, i) => (
          <span key={c} className={`rounded-full px-2.5 py-1 ${i === 0 ? "bg-slate-900 text-white" : "bg-white text-slate-600 shadow-sm"}`}>{c}</span>
        ))}
      </div>
      <div data-spot="menu" className="mx-4 mt-3 grid grid-cols-2 gap-2">
        {items.map((it, i) => (
          <div key={it.n} className="app-pop rounded-2xl bg-white p-2 shadow-sm" style={stagger(i + 2)}>
            <div className="relative flex h-16 items-center justify-center rounded-xl bg-orange-50">
              <Roll glaze={it.glaze} className="h-12 w-12" />
              <span className="absolute left-1 top-1 rounded-full bg-white px-1.5 text-[8px] font-bold text-rose-600">{it.tag}</span>
            </div>
            <p className="mt-1.5 truncate text-[10px] font-bold text-slate-900">{it.n}</p>
            <div className="mt-0.5 flex items-center justify-between">
              <span className="text-[10px] font-semibold text-slate-600">{it.p}</span>
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-xs leading-none text-white">+</span>
            </div>
          </div>
        ))}
      </div>
      <div data-spot="track" className="app-pop mx-4 mt-3 rounded-xl bg-white p-2.5 shadow-sm" style={stagger(4)}>
        <div className="flex items-center justify-between text-[10px]">
          <span className="font-bold text-slate-900">Order #ZS-1042</span>
          <span className="font-semibold text-emerald-600">Rider 6 min away</span>
        </div>
        <div className="relative mt-2 h-1.5 rounded-full bg-slate-100">
          <div className="app-grow-x absolute inset-y-0 left-0 w-[78%] rounded-full bg-gradient-to-r from-rose-500 to-orange-400" />
          <span className="app-drive absolute -top-[7px] left-[78%] -ml-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-white ring-2 ring-white">
            <Icon name="pin" className="h-2.5 w-2.5" />
          </span>
        </div>
        <div className="mt-1.5 flex justify-between text-[8px] text-slate-400"><span>Baked</span><span>Picked up</span><span>On the way</span><span>Delivered</span></div>
      </div>
      <div className="app-pop absolute inset-x-4 bottom-[68px] flex items-center justify-between rounded-xl bg-slate-900 px-3 py-2 text-white shadow-lg" style={stagger(5)}>
        <span className="text-[10px]"><b>2 items</b> · $7.70</span>
        <span className="text-[10px] font-bold text-orange-300">View cart →</span>
      </div>
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-around border-t border-slate-100 bg-white/95 px-4 pb-5 pt-2.5">
        {(["star", "eye", "bag", "driver"] as IconName[]).map((n, i) => (
          <span key={n} className={`flex h-8 w-8 items-center justify-center rounded-xl ${i === 0 ? "bg-rose-500 text-white" : "text-slate-400"}`}>
            <Icon name={n} className="h-4 w-4" />
          </span>
        ))}
      </div>
    </div>
  );
}

function PaymentsScreen() {
  return (
    <div className="relative h-full bg-slate-50">
      <StatusBar />
      <div className="app-pop flex items-center justify-between px-5 pt-3" style={stagger(0)}>
        <div>
          <p className="text-[10px] text-slate-500">Acme Foods Inc.</p>
          <p className="text-base font-bold text-slate-900">Payments</p>
        </div>
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-700 shadow-sm"><Icon name="bell" className="h-4 w-4" /></span>
      </div>
      <div data-spot="balance" className="app-pop relative mx-4 mt-3 overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-800 p-3.5 text-white" style={stagger(1)}>
        <span className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/10" />
        <span className="absolute -bottom-10 right-6 h-20 w-20 rounded-full bg-white/10" />
        <p className="text-[9px] font-semibold uppercase tracking-wider text-violet-200">Outstanding balance</p>
        <p className="mt-0.5 text-2xl font-extrabold">$8,460.00</p>
        <div className="mt-2 flex gap-3 text-[9px] text-violet-100"><span>3 invoices due</span><span>·</span><span>Credit limit $25k</span></div>
      </div>
      <div data-spot="pay" className="app-pop relative mx-4 mt-3 rounded-2xl bg-white p-3 shadow-sm" style={stagger(2)}>
        <div className="flex items-center justify-between text-[10px]">
          <span className="font-bold text-slate-900">INV-2026-1048</span>
          <span className="rounded-full bg-amber-50 px-1.5 py-0.5 font-semibold text-amber-700">Due in 3 days</span>
        </div>
        <p className="mt-1 text-[10px] text-slate-500">Trip TR-5585 · El Paso → Phoenix</p>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-base font-extrabold text-slate-900">$2,760.00</span>
          <span className="app-pick rounded-lg bg-violet-600 px-3 py-1.5 text-[10px] font-bold text-white">Pay now</span>
        </div>
        <div className="app-paid absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-white">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500 text-white"><Icon name="check" className="h-5 w-5" /></span>
          <p className="mt-1 text-[11px] font-bold text-slate-900">Payment received</p>
          <p className="text-[9px] text-slate-500">Receipt sent by email</p>
        </div>
      </div>
      <div data-spot="methods" className="mx-4 mt-3 grid grid-cols-3 gap-2">
        {([["dollar", "Card"], ["phone", "Mobile money"], ["building", "Bank"]] as [IconName, string][]).map(([ic, l], i) => (
          <div key={l} className={`app-pop flex flex-col items-center gap-1 rounded-xl p-2 ${i === 1 ? "bg-violet-50 ring-1 ring-violet-400" : "bg-white shadow-sm"}`} style={stagger(i + 3)}>
            <Icon name={ic} className={`h-4 w-4 ${i === 1 ? "text-violet-600" : "text-slate-500"}`} />
            <span className="text-[9px] font-semibold text-slate-700">{l}</span>
          </div>
        ))}
      </div>
      <div data-spot="history" className="mx-4 mt-3 space-y-1.5">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Recent</p>
        {[["INV-1039", "Paid · Card •• 4242", "$1,980"], ["INV-1031", "Paid · Mobile money", "$3,140"]].map(([id, s, a], i) => (
          <div key={id} className="app-pop flex items-center justify-between rounded-xl bg-white px-3 py-2 shadow-sm" style={stagger(i + 6)}>
            <div><p className="text-[10px] font-bold text-slate-900">{id}</p><p className="text-[9px] text-emerald-600">{s}</p></div>
            <span className="text-[11px] font-bold text-slate-900">{a}</span>
          </div>
        ))}
      </div>
      <BottomNav items={["dollar", "invoice", "clock", "driver"]} />
    </div>
  );
}

/* ---------- Apps ---------- */

const apps: App[] = [
  {
    id: "driver",
    icon: "driver",
    name: "Tech23 Driver",
    category: "Driver app",
    tagline: "Every trip step, captured from the cab",
    text: "Drivers get turn-by-turn directions, scan delivery notes at loading and offloading points, log checkpoints, request fuel vouchers and report breakdowns in a couple of taps.",
    explore: [
      { spot: "directions", icon: "route", title: "Directions", text: "Turn-by-turn route to the next loading or offloading point, with miles to go and a live ETA." },
      { spot: "timeline", icon: "pin", title: "Trip timeline", text: "Every arrival, departure and checkpoint is time-stamped automatically, so dispatch always knows where the load is." },
      { spot: "actions", icon: "clipboard", title: "Scan, fuel & breakdowns", text: "Scan delivery-note barcodes, raise fuel vouchers, report a breakdown or run a pre-trip inspection with photos." },
      { spot: "trip", icon: "clock", title: "On-time status", text: "The app compares progress with the plan and flags delays to dispatch before the customer calls." },
    ],
    users: "Drivers",
    accent: "from-brand-500 to-brand-700",
    Screen: DriverScreen,
  },
  {
    id: "workshop",
    icon: "wrench",
    name: "Tech23 Workshop",
    category: "Workshop app",
    tagline: "Run the shop floor on digital job cards",
    text: "Technicians open job cards, log labor and issue parts straight from inventory. Supervisors see every bay, every unit and every dollar of repair cost as it happens.",
    explore: [
      { spot: "jobs", icon: "clipboard", title: "Digital job cards", text: "Each repair is a job card with a checklist, assigned technician and live progress, from bay-in to sign-off." },
      { spot: "bays", icon: "calendar", title: "Bays & PM due", text: "Open jobs, trucks in the bays and preventive maintenance falling due by mileage, hours or date." },
      { spot: "parts", icon: "box", title: "Parts from inventory", text: "Issue parts to a job card in a tap. Stock updates and the cost is charged to that truck." },
      { spot: "new", icon: "wrench", title: "Raise a job in seconds", text: "Open a job card from a driver defect, an inspection or a PM schedule, with the vehicle pre-filled." },
    ],
    users: "Technicians & supervisors",
    accent: "from-amber-500 to-orange-600",
    Screen: WorkshopScreen,
  },
  {
    id: "analytics",
    icon: "chart",
    name: "Tech23 Insights",
    category: "Mobile analytics",
    tagline: "The whole fleet's numbers in your pocket",
    text: "Revenue, cost per mile, utilization and on-time performance update live, with drill-down from fleet to truck to trip, so managers can act before the month closes.",
    explore: [
      { spot: "kpis", icon: "gauge", title: "Live KPIs", text: "Revenue, profit per mile, utilization and on-time delivery, with the change against last month." },
      { spot: "chart", icon: "chart", title: "Revenue vs cost", text: "Daily trends with drill-down from the whole fleet to a single truck, trip or lane." },
      { spot: "utilization", icon: "truck", title: "Fleet utilization", text: "See at a glance how many trucks are earning, in the workshop or standing idle." },
      { spot: "filter", icon: "layers", title: "Filter by division", text: "Slice every number by division, branch, customer or vehicle type." },
    ],
    users: "Owners & fleet managers",
    accent: "from-indigo-500 to-brand-700",
    Screen: AnalyticsScreen,
  },
  {
    id: "health",
    icon: "users",
    name: "HealthCard",
    category: "Hospital scheduling",
    tagline: "A patient's care, scheduled and in one card",
    text: "Patients carry a digital health card with their vitals and history, book visits in open slots, see lab results the moment the lab posts them and never miss a follow-up.",
    explore: [
      { spot: "schedule", icon: "calendar", title: "Appointment scheduling", text: "Pick a day and an open slot with your doctor. Booked slots are blocked automatically." },
      { spot: "card", icon: "shield", title: "Digital health card", text: "Vitals, blood type, treating doctor and the full visit history on one card." },
      { spot: "labs", icon: "clipboard", title: "Lab results", text: "Results flow back from the lab and are flagged when they fall outside the normal range." },
      { spot: "reminders", icon: "bell", title: "Reminders", text: "Visit, medication and lab reminders by push notification, email or WhatsApp." },
    ],
    users: "Clinics & patients",
    accent: "from-emerald-500 to-teal-600",
    Screen: HealthCardScreen,
  },
  {
    id: "food",
    icon: "bag",
    name: "Zahra Sweet Rolls",
    category: "Food delivery app",
    tagline: "Fresh rolls ordered, baked and tracked to the door",
    text: "Customers browse the menu, apply coupons, check out in seconds and follow their rider live, while the bakery sees every order the moment it lands.",
    explore: [
      { spot: "menu", icon: "star", title: "Menu & quick add", text: "Browse rolls and boxes by category, see bestsellers and add to the cart in one tap." },
      { spot: "coupons", icon: "dollar", title: "Coupons & offers", text: "Promo codes and first-order offers are applied automatically at checkout." },
      { spot: "track", icon: "pin", title: "Live order tracking", text: "From baked to picked up to delivered, with the rider's ETA updating live." },
      { spot: "address", icon: "building", title: "Saved addresses", text: "Home, work and other addresses saved, so repeat orders take seconds." },
    ],
    users: "Restaurants & customers",
    accent: "from-rose-500 to-orange-500",
    Screen: FoodScreen,
  },
  {
    id: "payments",
    icon: "dollar",
    name: "Tech23 Pay",
    category: "Payments app",
    tagline: "Get paid faster, from any phone",
    text: "Customers see what they owe, pay invoices by card, mobile money or bank transfer in a few taps, and get receipts instantly. Every payment reconciles itself in the books.",
    explore: [
      { spot: "pay", icon: "check", title: "Pay an invoice", text: "Open an invoice, tap Pay now and it is settled, with a receipt emailed straight away." },
      { spot: "methods", icon: "phone", title: "Card, mobile money, bank", text: "Customers pay the way they prefer: card, mobile money or bank transfer." },
      { spot: "balance", icon: "dollar", title: "Balance & credit", text: "Outstanding balance, invoices due and credit limit, always up to date." },
      { spot: "history", icon: "clock", title: "Payment history", text: "Every payment with its method and receipt, matched to the invoice automatically." },
    ],
    users: "Customers & finance",
    accent: "from-violet-500 to-indigo-600",
    Screen: PaymentsScreen,
  },
  {
    id: "approvals",
    icon: "invoice",
    name: "Tech23 Approvals",
    category: "Approvals app",
    tagline: "Sign off spend from anywhere",
    text: "Purchase requests, expenses and fuel advances arrive with the context approvers need. Approve or reject in a tap, with multi-level rules and a full audit trail.",
    explore: [
      { spot: "swipe", icon: "check", title: "Approve in a tap", text: "Each request shows what, who and how much. Approve or reject and it moves to the next approver." },
      { spot: "budget", icon: "dollar", title: "Budget check", text: "Every request is checked against budget and shows how many approvers have already signed." },
      { spot: "queue", icon: "dispatch", title: "Approval queue", text: "Purchase requests, expenses and fuel advances from every department in one queue." },
      { spot: "badge", icon: "bell", title: "Push notifications", text: "Approvers are notified the moment something needs them, so trucks aren't left waiting on parts." },
    ],
    users: "Managers & finance",
    accent: "from-sky-500 to-brand-600",
    Screen: ApprovalsScreen,
  },
];

const marquee = [
  "Turn-by-turn directions", "Delivery note scanning", "Fuel vouchers", "Breakdown reports", "Digital job cards", "Parts issue",
  "Preventive maintenance", "Live KPIs", "Profit per truck", "Appointment scheduling", "Lab results", "Food ordering", "Live order tracking", "Mobile payments", "Mobile approvals",
];

const AUTOPLAY_MS = 6000;
const TOUR_MS = 3200;

/* ---------- Showcase ---------- */

const MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const prefersReducedMotion = () => window.matchMedia(MOTION_QUERY).matches;
const subscribeMotion = (cb: () => void) => {
  const mq = window.matchMedia(MOTION_QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

function Phone({ app, live, play, spot }: { app: App; live: boolean; play: number; spot: string | null }) {
  const { Screen } = app;
  const screenRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState<{ top: number; left: number; width: number; height: number } | null>(null);

  // Spotlight position as percentages of the screen, so it stays correct while the phone is scaled.
  useLayoutEffect(() => {
    const root = screenRef.current;
    if (!live || !spot || !root) return setBox(null);
    const measure = () => {
      const el = root.querySelector<HTMLElement>(`[data-spot="${spot}"]`);
      if (!el) return setBox(null);
      const r = root.getBoundingClientRect();
      const e = el.getBoundingClientRect();
      const pad = 4;
      setBox({
        top: ((e.top - r.top - pad) / r.height) * 100,
        left: ((e.left - r.left - pad) / r.width) * 100,
        width: ((e.width + pad * 2) / r.width) * 100,
        height: ((e.height + pad * 2) / r.height) * 100,
      });
    };
    measure();
    const t = window.setTimeout(measure, 750); // re-measure after the deck transition settles
    return () => window.clearTimeout(t);
  }, [live, spot]);

  return (
    <div className="relative w-[264px] rounded-[2.6rem] bg-slate-900 p-2 shadow-2xl shadow-black/50 ring-1 ring-white/10">
      <span className="absolute -left-[3px] top-24 h-10 w-[3px] rounded-l bg-slate-700" />
      <span className="absolute -right-[3px] top-28 h-14 w-[3px] rounded-r bg-slate-700" />
      <div ref={screenRef} className="relative aspect-[9/19] overflow-hidden rounded-[2.1rem] bg-white text-left">
        <span className="absolute left-1/2 top-2 z-20 h-5 w-20 -translate-x-1/2 rounded-full bg-slate-900" />
        {/* Remounting on each activation replays the screen animations. */}
        <div key={live ? `live-${play}` : "idle"} className="absolute inset-0">
          <Screen />
        </div>
        <div
          className={`pointer-events-none absolute z-10 rounded-xl ring-2 ring-brand-400 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${box ? "opacity-100" : "opacity-0"}`}
          style={{
            top: `${box?.top ?? 40}%`,
            left: `${box?.left ?? 10}%`,
            width: `${box?.width ?? 80}%`,
            height: `${box?.height ?? 20}%`,
            boxShadow: "0 0 0 999px rgb(2 6 23 / 0.6), 0 0 24px 4px rgb(96 165 250 / 0.6)",
          }}
          aria-hidden="true"
        >
          <span className="absolute inset-0 animate-ping rounded-xl ring-2 ring-brand-300 [animation-duration:1.8s]" />
        </div>
      </div>
    </div>
  );
}

export function centerSelected(scroller: HTMLElement | null, selector: string) {
  const el = scroller?.querySelector<HTMLElement>(selector);
  if (!scroller || !el || scroller.scrollWidth <= scroller.clientWidth) return;
  const c = scroller.getBoundingClientRect();
  const b = el.getBoundingClientRect();
  scroller.scrollBy({ left: b.left + b.width / 2 - (c.left + c.width / 2), behavior: "smooth" });
}

export function AppShowcase() {
  const [active, setActive] = useState(0);
  const [plays, setPlays] = useState(0);
  const [hovered, setHovered] = useState(false);
  const reduced = useSyncExternalStore(subscribeMotion, prefersReducedMotion, () => false);
  const [spot, setSpot] = useState<string | null>(null);
  const [touring, setTouring] = useState(false);
  const touchX = useRef<number | null>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const pillsRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [deckScale, setDeckScale] = useState(1);
  const n = apps.length;
  const app = apps[active];
  const paused = hovered || spot !== null || touring;

  const go = useCallback((i: number) => {
    setActive(((i % n) + n) % n);
    setPlays((p) => p + 1);
    setSpot(null);
    setTouring(false);
  }, [n]);

  // Auto-shuffle the deck.
  useEffect(() => {
    if (paused || reduced) return;
    const t = window.setTimeout(() => go(active + 1), AUTOPLAY_MS);
    return () => window.clearTimeout(t);
  }, [active, paused, reduced, go]);

  // Guided tour: step through the app's features, then hand control back to the deck.
  useEffect(() => {
    if (!touring) return;
    const idx = app.explore.findIndex((f) => f.spot === spot);
    const t = window.setTimeout(() => {
      const next = app.explore[idx + 1];
      if (next) setSpot(next.spot);
      else {
        setTouring(false);
        setSpot(null);
      }
    }, TOUR_MS);
    return () => window.clearTimeout(t);
  }, [touring, spot, app]);

  // Keep the selected app tab / feature pill centred in their horizontal scrollers (mobile).
  useEffect(() => centerSelected(tabsRef.current, "[aria-selected=true]"), [active]);
  useEffect(() => centerSelected(pillsRef.current, "[aria-pressed=true]"), [spot, active]);

  // On small screens the stage is ~70dvh; shrink the phones to fit it.
  useLayoutEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setDeckScale(Math.min(1, e.contentRect.height / 600)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const startTour = () => {
    setTouring(true);
    setSpot(app.explore[0].spot);
  };

  const feature = app.explore.find((f) => f.spot === spot);

  return (
    <section
      className="relative overflow-hidden bg-brand-950 py-20 sm:py-24"
      id="apps"
      aria-roledescription="carousel"
      aria-label="Tech23 mobile apps"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        if (!touring) setSpot(null);
      }}
    >
      <div className="bg-grid absolute inset-0" aria-hidden="true" />
      <div className={`animate-glow absolute right-0 top-1/3 h-[30rem] w-[30rem] rounded-full bg-gradient-to-br ${app.accent} opacity-40 blur-3xl`} aria-hidden="true" />
      <div className="animate-glow absolute -left-32 bottom-0 h-80 w-80 rounded-full bg-brand-600/30 blur-3xl" aria-hidden="true" />

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-300">Our apps</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">Apps we&apos;ve built, in your pocket</h2>
          <p className="mt-4 text-lg leading-relaxed text-brand-100">
            Purpose-built mobile apps for drivers, workshops, managers, clinics, restaurants and finance teams. Tap a feature to see it on the screen.
          </p>
        </div>

        {/* App tabs */}
        <div ref={tabsRef} className="-mx-4 mt-10 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:px-0" role="tablist" aria-label="Choose an app">
          <div className="mx-auto flex w-max gap-2">
            {apps.map((a, i) => (
              <button
                key={a.id}
                type="button"
                role="tab"
                aria-selected={i === active}
                onClick={() => go(i)}
                className={`relative flex items-center gap-2 overflow-hidden rounded-full border px-3 py-2 text-sm font-semibold transition xl:px-3.5 ${
                  i === active ? "border-white/30 bg-white text-brand-900" : "border-white/10 bg-white/5 text-brand-100 hover:bg-white/10"
                }`}
              >
                <span className={`flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br ${a.accent} text-white`}>
                  <Icon name={a.icon} className="h-3.5 w-3.5" />
                </span>
                <span className="whitespace-nowrap">{a.category}</span>
                {i === active && !reduced && (
                  <span
                    key={plays}
                    className="app-timer absolute inset-x-0 bottom-0 h-0.5 origin-left bg-brand-500"
                    style={{ animationDuration: `${AUTOPLAY_MS}ms`, animationPlayState: paused ? "paused" : "running" }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 grid items-center gap-10 lg:mt-14 lg:grid-cols-12 lg:gap-6">
          {/* Ad copy + explore */}
          <div key={app.id} className="relative z-20 order-2 min-w-0 lg:order-1 lg:col-span-5">
            <div className="hero-in flex items-center gap-4">
              <span className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${app.accent} text-white shadow-lg ring-1 ring-white/20`}>
                <Icon name={app.icon} className="h-7 w-7" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-brand-300">{app.category}</p>
                <h3 className="text-2xl font-bold text-white">{app.name}</h3>
              </div>
            </div>
            <p style={{ "--d": "80ms" } as React.CSSProperties} className="hero-in mt-6 text-2xl font-bold leading-snug tracking-tight text-white sm:text-3xl">
              {app.tagline}
            </p>
            <p style={{ "--d": "160ms" } as React.CSSProperties} className="hero-in mt-4 leading-relaxed text-brand-100">{app.text}</p>

            <div style={{ "--d": "240ms" } as React.CSSProperties} className="hero-in mt-7 hidden lg:block">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-brand-300">Explore features</p>
                <button
                  type="button"
                  onClick={() => (touring ? (setTouring(false), setSpot(null)) : startTour())}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/20 px-3 py-1 text-xs font-semibold text-white transition hover:bg-white/10"
                >
                  {touring ? (
                    <><span className="h-2 w-2 rounded-sm bg-current" /> Stop tour</>
                  ) : (
                    <><span className="h-0 w-0 border-y-[5px] border-l-[8px] border-y-transparent border-l-current" /> Take the tour</>
                  )}
                </button>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {app.explore.map((f) => {
                  const on = f.spot === spot;
                  return (
                    <button
                      key={f.spot}
                      type="button"
                      aria-pressed={on}
                      onClick={() => {
                        setTouring(false);
                        setSpot(on ? null : f.spot);
                      }}
                      onMouseEnter={() => !touring && setSpot(f.spot)}
                      className={`flex items-center gap-2.5 rounded-xl border p-2.5 text-left text-sm font-semibold transition ${
                        on ? "border-brand-400 bg-brand-500/20 text-white" : "border-white/10 bg-white/5 text-brand-100 hover:border-white/25 hover:text-white"
                      }`}
                    >
                      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition ${on ? "bg-brand-500 text-white" : "bg-white/10 text-brand-200"}`}>
                        <Icon name={f.icon} className="h-4 w-4" />
                      </span>
                      <span className="leading-tight">{f.title}</span>
                    </button>
                  );
                })}
              </div>
              <div className="mt-3 min-h-[4.5rem] rounded-xl border border-white/10 bg-white/5 p-3.5 text-sm leading-relaxed text-brand-100" aria-live="polite">
                {feature ? (
                  <p key={feature.spot} className="hero-in [animation-duration:0.4s]">
                    <span className="font-semibold text-white">{feature.title}: </span>
                    {feature.text}
                  </p>
                ) : (
                  <p className="text-brand-300">Hover or tap a feature to highlight it on the phone, or take the tour.</p>
                )}
              </div>
            </div>

            <div style={{ "--d": "320ms" } as React.CSSProperties} className="hero-in mt-5 flex flex-wrap items-center gap-2 text-xs font-semibold text-brand-100">
              <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1">For {app.users}</span>
              {["Android", "iOS", "Web"].map((p) => (
                <span key={p} className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1">
                  <Icon name={p === "Web" ? "globe" : "phone"} className="h-3.5 w-3.5" /> {p}
                </span>
              ))}
            </div>
            <div style={{ "--d": "400ms" } as React.CSSProperties} className="hero-in mt-7 flex flex-wrap items-center gap-4">
              <DemoButton variant="light" label="See the apps live" />
              <div className="flex gap-2">
                <button type="button" onClick={() => go(active - 1)} aria-label="Previous app" className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white transition hover:bg-white/10">
                  <Icon name="arrow" className="h-4 w-4 rotate-180" />
                </button>
                <button type="button" onClick={() => go(active + 1)} aria-label="Next app" className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white transition hover:bg-white/10">
                  <Icon name="arrow" className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Phone deck */}
          <div className="order-1 min-w-0 lg:order-2 lg:col-span-7">
          <div
            ref={stageRef}
            className="relative h-[70dvh] max-h-[600px] min-h-[380px] touch-pan-y [--far:0] [--spread:84px] sm:h-[600px] sm:[--far:0.45] sm:[--spread:150px] lg:[--far:0.3] lg:[--spread:100px] xl:[--spread:125px]"
            onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
            onTouchEnd={(e) => {
              if (touchX.current === null) return;
              const dx = e.changedTouches[0].clientX - touchX.current;
              if (Math.abs(dx) > 40) go(active + (dx < 0 ? 1 : -1));
              touchX.current = null;
            }}
          >
            {apps.map((a, i) => {
              const off = (i - active + n) % n;
              const rel = off <= n / 2 ? off : off - n;
              const dist = Math.abs(rel);
              return (
                <div
                  key={a.id}
                  role={dist === 0 ? undefined : "button"}
                  tabIndex={dist === 0 ? undefined : dist >= 3 ? -1 : 0}
                  aria-label={dist === 0 ? undefined : `Show ${a.name}`}
                  onClick={() => dist !== 0 && go(i)}
                  onKeyDown={(e) => dist !== 0 && (e.key === "Enter" || e.key === " ") && (e.preventDefault(), go(i))}
                  className={`absolute left-1/2 top-1/2 transition-[transform,opacity,filter] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${dist === 0 ? "" : "cursor-pointer"}`}
                  style={{
                    transform: `translate(-50%, -50%) translateX(calc(var(--spread) * ${rel * deckScale})) rotate(${rel * 7}deg) scale(${(1 - dist * 0.13) * deckScale})`,
                    zIndex: 10 - dist,
                    opacity: dist === 0 ? 1 : dist === 1 ? 0.8 : dist === 2 ? "var(--far)" : 0,
                    pointerEvents: dist >= 3 ? "none" : undefined,
                    filter: dist === 0 ? "none" : `blur(${dist}px) saturate(0.7)`,
                  }}
                >
                  <Phone app={a} live={dist === 0} play={plays} spot={dist === 0 ? spot : null} />
                </div>
              );
            })}
          </div>

          {/* Mobile: feature pills + info right under the phone, so both fit on one screen */}
          <div className="mt-3 lg:hidden">
            <div ref={pillsRef} className="-mx-4 flex snap-x gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none]">
              <button
                type="button"
                onClick={() => (touring ? (setTouring(false), setSpot(null)) : startTour())}
                className="flex shrink-0 snap-center items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-brand-900"
              >
                {touring ? <span className="h-2 w-2 rounded-sm bg-current" /> : <span className="h-0 w-0 border-y-[4px] border-l-[7px] border-y-transparent border-l-current" />}
                {touring ? "Stop" : "Tour"}
              </button>
              {app.explore.map((f) => {
                const on = f.spot === spot;
                return (
                  <button
                    key={f.spot}
                    type="button"
                    aria-pressed={on}
                    onClick={() => {
                      setTouring(false);
                      setSpot(on ? null : f.spot);
                    }}
                    className={`flex shrink-0 snap-center items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                      on ? "border-brand-400 bg-brand-500 text-white" : "border-white/15 bg-white/5 text-brand-100"
                    }`}
                  >
                    <Icon name={f.icon} className="h-3.5 w-3.5" />
                    {f.title}
                  </button>
                );
              })}
            </div>
            <p key={feature?.spot ?? app.id} className="hero-in mx-auto mt-2 min-h-[2.75rem] max-w-md text-center text-sm leading-snug text-brand-100 [animation-duration:0.4s]" aria-live="polite">
              {feature ? feature.text : `${app.name}: tap a feature to see it on the phone.`}
            </p>
          </div>
          </div>
        </div>
      </div>

      {/* Seamless feature ticker */}
      <div className="relative mt-16 overflow-hidden border-y border-white/10 bg-white/5 py-4 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]" aria-hidden="true">
        <div className="app-marquee flex w-max gap-3">
          {[...marquee, ...marquee].map((m, i) => (
            <span key={i} className="flex items-center gap-2 whitespace-nowrap rounded-full border border-white/10 bg-brand-900/60 px-4 py-1.5 text-sm font-medium text-brand-100">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-400" />
              {m}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
