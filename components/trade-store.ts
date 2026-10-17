"use client";

import { useSyncExternalStore } from "react";

/*
 * Which trade's example is on show. Shared by the hero's trade buttons, the phone and the
 * carousel, so picking "Maler" anywhere shows the painter's site everywhere.
 */
let current = 0;
const listeners = new Set<() => void>();

export function setTrade(i: number) {
  current = i;
  listeners.forEach((l) => l());
}

export function useTrade() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => current,
    () => 0,
  );
}
