"use client";

import { useEffect, useRef } from "react";

type From = "up" | "left" | "right" | "zoom";

// Scroll-triggered entrance. Content is server-rendered and fully visible without JS;
// the hidden start state only applies once `html.js` is set (see layout.tsx + globals.css).
export function Reveal({
  children,
  from = "up",
  delay = 0,
  className = "",
  as: Tag = "div",
  id,
}: {
  children: React.ReactNode;
  from?: From;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article";
  id?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-visible");
          io.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as React.Ref<never>}
      id={id}
      data-reveal={from}
      className={className}
      style={delay ? ({ "--reveal-delay": `${delay}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </Tag>
  );
}
