"use client";

import { useSyncExternalStore } from "react";

/*
 * Where the visitor is in the draft guide: the step and the trade. Shared by the trade list in the
 * hero and the guide below it, so picking a trade at the top carries on in the guide.
 */
type Draft = { step: number; trade: number | null };
let current: Draft = { step: 0, trade: null };
const listeners = new Set<() => void>();
const SERVER: Draft = { step: 0, trade: null };

export function setDraft(next: Partial<Draft>) {
  current = { ...current, ...next };
  listeners.forEach((l) => l());
}

export function useDraft() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => current,
    () => SERVER,
  );
}
