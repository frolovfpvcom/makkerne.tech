"use client";

import { useSyncExternalStore } from "react";

/*
 * How far the visitor has come: 0 looking at the site, 1 started the price card, 2 seen the price,
 * 3 opened the draft mail. Shared by the price card and the timeline on "Sådan foregår det", and
 * kept for the visit, so the timeline remembers it on another page. It only ever moves forward.
 */
const KEY = "makkerne-progress";
let current = 0;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded) return;
  loaded = true;
  try {
    current = Math.min(3, Math.max(0, Number(sessionStorage.getItem(KEY)) || 0));
  } catch {}
}

export function reachStage(n: number) {
  load();
  if (n <= current) return;
  current = n;
  try {
    sessionStorage.setItem(KEY, String(n));
  } catch {}
  listeners.forEach((l) => l());
}

export function useStage() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => {
      load();
      return current;
    },
    () => 0,
  );
}
