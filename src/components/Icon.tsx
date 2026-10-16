// Lightweight inline stroke icons (24x24 grid) so pages ship zero icon JS.
const paths = {
  route: "M6 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM18 9a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM6 15V9a4 4 0 0 1 4-4h6M18 9v6a4 4 0 0 1-4 4H8",
  dispatch: "M3 5h18M3 12h18M3 19h18M7 3v4M14 10v4M10 17v4",
  check: "M20 6 9 17l-5-5",
  invoice: "M6 2h9l5 5v15H6zM14 2v6h6M9 13h6M9 17h6",
  alert: "M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z",
  portal: "M3 4h18v12H3zM8 20h8M12 16v4",
  truck: "M1 4h14v12H1zM15 9h4l4 4v3h-8zM5.5 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM18.5 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z",
  gauge: "M12 14l4-4M3.3 19a10 10 0 1 1 17.4 0",
  bell: "M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.9 1.9 0 0 0 3.4 0",
  tire: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20ZM12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM12 2v6M12 16v6M2 12h6M16 12h6",
  pin: "M12 22s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12ZM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
  chart: "M3 3v18h18M7 15l4-4 3 3 5-6",
  wrench: "M14.7 6.3a4 4 0 0 0 5.4 5.4l-9.8 9.8a2.1 2.1 0 0 1-3-3l9.8-9.8a4 4 0 0 0-5.4-5.4l2.8 2.8Z",
  calendar: "M3 5h18v16H3zM16 3v4M8 3v4M3 10h18",
  clipboard: "M9 3h6v4H9zM16 5h3v16H5V5h3M9 12h6M9 16h4",
  box: "M21 8 12 3 3 8v8l9 5 9-5zM3 8l9 5 9-5M12 13v8",
  clock: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20ZM12 6v6l4 2",
  fuel: "M3 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18M2 22h14M6 7h6M15 10h2a2 2 0 0 1 2 2v4a1.5 1.5 0 0 0 3 0V8l-3-3",
  tank: "M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3v12c0 1.7-3.6 3-8 3s-8-1.3-8-3zM4 6c0 1.7 3.6 3 8 3s8-1.3 8-3M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3",
  link: "M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7",
  transfer: "M7 4 3 8l4 4M3 8h14M17 12l4 4-4 4M21 16H7",
  refresh: "M21 12a9 9 0 0 1-15.5 6.3L3 16M3 12a9 9 0 0 1 15.5-6.3L21 8M21 3v5h-5M3 21v-5h5",
  cart: "M9 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM20 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6",
  compare: "M3 4h7v16H3zM14 4h7v16h-7M17.5 8v8M6.5 8v8",
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10ZM9 12l2 2 4-4",
  eye: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8ZM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
  driver: "M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 21v-2a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v2",
  star: "m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z",
  moon: "M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z",
  phone: "M7 2h10a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1ZM11 18h2",
  dollar: "M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",
  users: "M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM1 21v-2a5 5 0 0 1 5-5h6a5 5 0 0 1 5 5v2M16 3.1a4 4 0 0 1 0 7.8M23 21v-2a5 5 0 0 0-4-4.9",
  download: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3",
  arrow: "M5 12h14M12 5l7 7-7 7",
  menu: "M3 6h18M3 12h18M3 18h18",
  close: "M18 6 6 18M6 6l12 12",
  mail: "M2 4h20v16H2zM22 6l-10 7L2 6",
  building: "M4 22V2h12v20M16 8h4v14M2 22h20M8 6h4M8 10h4M8 14h4M8 18h4",
  globe: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20ZM2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20",
  warehouse: "M2 21V8l10-5 10 5v13M6 21v-8h12v8M6 17h12",
  layers: "m12 2 10 5-10 5L2 7zM2 17l10 5 10-5M2 12l10 5 10-5",
  bag: "M5 7h14l-1 14H6zM9 10V6a3 3 0 0 1 6 0v4",
} as const;

export type IconName = keyof typeof paths;

export function Icon({ name, className = "h-6 w-6" }: { name: IconName; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d={paths[name]} />
    </svg>
  );
}
