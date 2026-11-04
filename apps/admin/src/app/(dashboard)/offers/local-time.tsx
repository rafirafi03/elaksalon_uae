"use client";

import { useSyncExternalStore } from "react";

const noop = () => () => {};

/** Formats an ISO date in the viewer's own timezone (server render shows UTC until hydrated). */
export default function LocalTime({ iso }: { iso: string }) {
  const text = useSyncExternalStore(
    noop,
    () => new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }),
    () => new Date(iso).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "UTC" }) + " UTC",
  );
  return <time dateTime={iso}>{text}</time>;
}
