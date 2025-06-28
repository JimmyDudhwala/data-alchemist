"use client";

import { useRuleStore } from "@/store/useRuleStore";
import { usePriorityStore } from "@/store/usePriorityStore";

export default function RuleExporter() {
  const rules = useRuleStore((s) => s.rules);
  const priorities = usePriorityStore((s) => s.priorities);

  const handleExport = () => {
    const fullConfig = {
      rules,
      priorities,
    };

    const blob = new Blob([JSON.stringify(fullConfig, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "rules.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleExport}
      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
    >
      📤 Export Rules + Priorities
    </button>
  );
}
