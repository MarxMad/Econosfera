"use client";

import { Suspense } from "react";
import SimuladorApp from "@/components/SimuladorApp";

export default function SimuladorPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-100 dark:bg-slate-950 animate-pulse" />}>
      <SimuladorApp />
    </Suspense>
  );
}
