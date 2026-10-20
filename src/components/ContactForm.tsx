"use client";

import { useState } from "react";
import { site } from "@/lib/site";

// Static-site form: composes an email to the sales inbox via mailto.
// Swap the submit handler for an API route / form service when the site goes dynamic.
const fleetSizes = ["1–10 trucks", "11–50 trucks", "51–200 trucks", "200+ trucks"];
const interests = ["Transportation & dispatch", "Fleet management", "Workshop & maintenance", "Fuel management", "Inventory & procurement", "Costing & finance"];

const inputCls =
  "mt-1.5 block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20";

export function ContactForm({ demo = false }: { demo?: boolean }) {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const get = (k: string) => String(data.get(k) ?? "").trim();
    const subject = demo ? `Tech23 TMS demo request: ${get("company")}` : `Tech23 TMS enquiry: ${get("company")}`;
    const lines = [
      `Name: ${get("name")}`,
      `Company: ${get("company")}`,
      `Email: ${get("email")}`,
      `Phone: ${get("phone")}`,
      `State: ${get("state")}`,
      `Fleet size: ${get("fleet")}`,
      `Interested in: ${data.getAll("interest").join(", ")}`,
      "",
      get("message"),
    ];
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
    setSent(true);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          Full name *
          <input name="name" required autoComplete="name" className={inputCls} />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Company *
          <input name="company" required autoComplete="organization" className={inputCls} />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Work email *
          <input name="email" type="email" required autoComplete="email" className={inputCls} />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Phone
          <input name="phone" type="tel" autoComplete="tel" className={inputCls} />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          State
          <input name="state" autoComplete="address-level1" placeholder="e.g. Texas" className={inputCls} />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Fleet size
          <select name="fleet" className={inputCls} defaultValue="">
            <option value="" disabled>Select…</option>
            {fleetSizes.map((s) => <option key={s}>{s}</option>)}
          </select>
        </label>
      </div>

      {demo && (
        <fieldset>
          <legend className="text-sm font-medium text-slate-700">What would you like to see?</legend>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {interests.map((i) => (
              <label key={i} className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 has-[:checked]:border-brand-500 has-[:checked]:bg-brand-50">
                <input type="checkbox" name="interest" value={i} className="h-4 w-4 accent-brand-600" /> {i}
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <label className="block text-sm font-medium text-slate-700">
        {demo ? "Anything we should know?" : "Message *"}
        <textarea name="message" rows={4} required={!demo} className={inputCls} />
      </label>

      <button type="submit" className="w-full rounded-lg bg-brand-600 px-5 py-3.5 font-semibold text-white shadow-lg shadow-brand-600/25 hover:bg-brand-700 sm:w-auto">
        {demo ? "Request My Demo" : "Send Message"}
      </button>
      {sent && (
        <p className="text-sm text-slate-600" role="status">
          Your email app should open with the details filled in.
          {site.email && (
            <>
              {" "}If it doesn&apos;t, email us at{" "}
              <a href={`mailto:${site.email}`} className="font-semibold text-brand-700">{site.email}</a>.
            </>
          )}
        </p>
      )}
    </form>
  );
}
