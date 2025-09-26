// components/ambient/LightningBoot.tsx
"use client";
import { useEffect, useState } from "react";

export default function LightningBoot({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let started = false;
    try {
      const po = new PerformanceObserver((list) => {
        for (const e of list.getEntries() as any) {
          if (e.entryType === "largest-contentful-paint" && !started) {
            started = true;
            setTimeout(() => setReady(true), 250);
          }
        }
      });
      // @ts-ignore
      po.observe({ type: "largest-contentful-paint", buffered: true });
      return () => po.disconnect();
    } catch {
      (window as any).requestIdleCallback?.(() => setReady(true), { timeout: 1500 });
      setTimeout(() => setReady(true), 1800);
    }
  }, []);
  return ready ? <>{children}</> : null;
}