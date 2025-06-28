"use client";

import { useState } from "react";
import { useRuleStore } from "@/store/useRuleStore";

const ruleTemplates = [
  { label: "Highlight Matching Rows", value: "highlight" },
  { label: "Exclude Matching Rows", value: "exclude" },
  { label: "Custom Tag", value: "tag" },
];

export default function PatternMatchForm() {
  const [regex, setRegex] = useState("");
  const [template, setTemplate] = useState("highlight");
  const [paramKey, setParamKey] = useState("label");
  const [paramValue, setParamValue] = useState("Important");

  const addRule = useRuleStore((s) => s.addRule);

  const handleAdd = () => {
    try {
      new RegExp(regex); // validate regex
    } catch {
      alert("Invalid regex pattern.");
      return;
    }

    if (!regex || !template) {
      alert("Enter a regex and select a rule template.");
      return;
    }

    addRule({
      type: "patternMatch",
      regex,
      ruleTemplate: template,
      params: {
        [paramKey]: paramValue,
      },
    });

    setRegex("");
    setParamKey("label");
    setParamValue("Important");
  };

  return (
    <div className="border p-4 rounded mb-4 bg-gray-50">
      <h3 className="text-md font-semibold mb-2">➕ Pattern-Match Rule</h3>

      <input
        value={regex}
        onChange={(e) => setRegex(e.target.value)}
        placeholder="Enter regex pattern"
        className="border px-2 py-1 rounded w-full mb-2"
      />

      <select
        value={template}
        onChange={(e) => setTemplate(e.target.value)}
        className="border px-2 py-1 rounded w-full mb-2"
      >
        {ruleTemplates.map((t) => (
          <option key={t.value} value={t.value}>
            {t.label}
          </option>
        ))}
      </select>

      <div className="flex gap-2 mb-2">
        <input
          value={paramKey}
          onChange={(e) => setParamKey(e.target.value)}
          placeholder="Param Key"
          className="border px-2 py-1 rounded w-full"
        />
        <input
          value={paramValue}
          onChange={(e) => setParamValue(e.target.value)}
          placeholder="Param Value"
          className="border px-2 py-1 rounded w-full"
        />
      </div>

      <button
        onClick={handleAdd}
        className="bg-blue-600 text-white px-4 py-1 rounded"
      >
        Add Pattern-Match Rule
      </button>
    </div>
  );
}
