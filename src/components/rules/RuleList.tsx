// components/RuleList.tsx
"use client";

import { useRuleStore } from "@/store/useRuleStore";

export function RuleList() {
  const rules = useRuleStore((s) => s.rules);
  const removeRule = useRuleStore((s) => s.removeRule);

  const renderSummary = (rule: any) => {
    switch (rule.type) {
      case "coRun":
        return `Co-run → [${rule.tasks.join(", ")}]`;
      case "slotRestriction":
        return `${rule.groupType === "clients" ? "Client Group" : "Worker Group"}: [${rule.groupIDs.join(", ")}], minCommonSlots: ${rule.minCommonSlots}`;
      default:
        return JSON.stringify(rule);
    }
  };

  return (
    <div className="mt-4">
      <h3 className="text-md font-semibold mb-2">📋 Current Rules</h3>
      {rules.length === 0 && (
        <p className="text-sm text-gray-600">No rules added yet.</p>
      )}
      <ul className="space-y-2">
        {rules.map((rule, idx) => (
          <li
            key={idx}
            className="bg-white border rounded px-3 py-2 flex justify-between items-start"
          >
            <div className="text-sm text-gray-800 whitespace-pre-wrap">
              {renderSummary(rule)}
            </div>
            <button
              className="text-red-500 text-sm ml-4"
              onClick={() => removeRule(idx)}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
