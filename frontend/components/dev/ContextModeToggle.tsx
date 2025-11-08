/**
 * @FeatureID F-15.1, F-15.2, F-15.3
 * @Purpose Dev-only component to toggle between context memory modes for localhost testing
 * @Spec /docs/features/context-memory-validation-plan.md
 * @Author Chat Bot Labs
 * @Note TEMPORARY - Delete this component after selecting winning solution
 */

"use client";

import { useState, useEffect } from "react";

const MODES = [
  { value: "none", label: "None (Baseline)", emoji: "🚫" },
  { value: "accordion", label: "Accordion Only", emoji: "📋" },
  { value: "preview", label: "Preview Sidebar", emoji: "👁️" },
  { value: "hybrid", label: "Hybrid (Both)", emoji: "🔀" },
] as const;

export const ContextModeToggle = () => {
  const [mode, setMode] = useState("hybrid");

  useEffect(() => {
    const saved = localStorage.getItem("context-mode");
    if (saved) setMode(saved);
  }, []);

  const handleChange = (newMode: string) => {
    setMode(newMode);
    localStorage.setItem("context-mode", newMode);
    window.location.reload();
  };

  return (
    <div className="fixed top-4 right-4 z-[100] bg-yellow-400 text-black p-3 rounded-lg shadow-2xl border-2 border-yellow-600">
      <div className="font-bold text-xs mb-2">🧪 TEST MODE</div>
      <select
        value={mode}
        onChange={(e) => handleChange(e.target.value)}
        className="w-full bg-white text-black px-2 py-1 rounded text-sm font-medium cursor-pointer"
      >
        {MODES.map(({ value, label, emoji }) => (
          <option key={value} value={value}>
            {emoji} {label}
          </option>
        ))}
      </select>
      <div className="text-xs mt-2 text-yellow-900">
        Or press: 1️⃣ 2️⃣ 3️⃣ 4️⃣
      </div>
    </div>
  );
};

