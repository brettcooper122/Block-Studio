import { useEffect, useState } from "react";

/** The studio's wall clock, ticking each second: "09:42:05PM" and "Monday, October 12, 2026 (GMT -04)". */
export function useLocalTime(timeZone: string) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const time = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  })
    .format(now)
    .replace(/\s?([ap])\.?m\.?/i, (_, p: string) => `${p.toUpperCase()}M`);

  const date = new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(now);

  const offsetPart = new Intl.DateTimeFormat("en-US", { timeZone, timeZoneName: "shortOffset" })
    .formatToParts(now)
    .find((part) => part.type === "timeZoneName")?.value;
  // "GMT-4" becomes "GMT -04", "GMT+5:30" becomes "GMT +05:30"
  const offset = (offsetPart ?? "GMT").replace(
    /GMT([+-])(\d{1,2})(:\d{2})?/,
    (_, sign: string, hours: string, minutes = "") => `GMT ${sign}${hours.padStart(2, "0")}${minutes}`,
  );

  return { time, date, offset, iso: now.toISOString() };
}
