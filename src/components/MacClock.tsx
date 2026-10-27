"use client";

import { useSyncExternalStore } from "react";
import { useLocale } from "next-intl";

// Re-render every half minute so the menu-bar clock stays current.
function subscribe(callback: () => void) {
  const id = setInterval(callback, 30_000);
  return () => clearInterval(id);
}

function getSnapshot() {
  // Changes once per 30s bucket, keeping the snapshot stable between ticks.
  return Math.floor(Date.now() / 30_000);
}

function getServerSnapshot() {
  return null;
}

// Live date & time for the Mac mockup's menu bar. Rendered empty on the
// server and during hydration so the static export never shows a stale
// build-time date or causes a hydration mismatch.
export default function MacClock() {
  const locale = useLocale();
  const tick = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const now = tick === null ? null : new Date();
  const date = now
    ? now
        .toLocaleDateString(locale, {
          weekday: "short",
          month: "long",
          day: "2-digit",
        })
        .replace(",", "")
    : "";
  const time = now
    ? now.toLocaleTimeString(locale, { hour: "numeric", minute: "2-digit" })
    : "";

  // Both spans inherit the menu bar's font size and weight so the clock
  // matches the rest of the bar.
  return (
    <>
      <span className="hidden sm:block">{date}</span>
      <span>{time}</span>
    </>
  );
}
