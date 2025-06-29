"use client";

import { useState } from "react";
import { useRuleStore } from "@/store/useRuleStore";
import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";

// Predefined templates with internal rule types
const ruleTemplates = [
  { label: "Highlight Matching Rows", value: "highlight" },
  { label: "Exclude Matching Rows", value: "exclude" },
  { label: "Custom Tag", value: "tag" },
];

// Define the PatternMatchRule type
type PatternMatchRule = {
  type: "patternMatch";
  regex: string;
  ruleTemplate: string;
  params: Record<string, string>;
};

export default function PatternMatchForm() {
  const [regex, setRegex] = useState("");
  const [ruleTemplate, setRuleTemplate] = useState("highlight");
  const [paramKey, setParamKey] = useState("label");
  const [paramValue, setParamValue] = useState("Important");

  const addRule = useRuleStore((s) => s.addRule);

  const handleAdd = () => {
    try {
      new RegExp(regex); // Validate regex syntax
    } catch {
      alert("Invalid regex pattern.");
      return;
    }

    if (!regex.trim()) {
      alert("Please enter a regex pattern.");
      return;
    }

    const rule: PatternMatchRule = {
      type: "patternMatch",
      regex,
      ruleTemplate,
      params: {
        [paramKey]: paramValue,
      },
    };

    addRule(rule);
    setRegex("");
    setParamKey("label");
    setParamValue("Important");
  };

  return (
    <div className="space-y-4  p-4 rounded bg-[#1F2937]">
      <h3 className="text-md font-semibold text-white mb-2">➕ Pattern-Match Rule</h3>

      <div className="space-y-2">
        <Label className="text-gray-300">Regex Pattern:</Label>
        <Input
          value={regex}
          onChange={(e) => setRegex(e.target.value)}
          placeholder="e.g. ^Task-\\d+$"
          className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-pink-500"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-gray-300">Rule Template:</Label>
        <select
          value={ruleTemplate}
          onChange={(e) => setRuleTemplate(e.target.value)}
          className="w-full bg-gray-800 border-gray-600 text-white px-2 py-2 rounded"
        >
          {ruleTemplates.map((tpl) => (
            <option key={tpl.value} value={tpl.value}>
              {tpl.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-2">
        <div className="flex-1 space-y-1">
          <Label className="text-gray-300">Param Key:</Label>
          <Input
            value={paramKey}
            onChange={(e) => setParamKey(e.target.value)}
            placeholder="e.g. label"
            className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
          />
        </div>

        <div className="flex-1 space-y-1">
          <Label className="text-gray-300">Param Value:</Label>
          <Input
            value={paramValue}
            onChange={(e) => setParamValue(e.target.value)}
            placeholder="e.g. Important"
            className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
          />
        </div>
      </div>

      <Button
        onClick={handleAdd}
        className="w-full bg-pink-600 hover:bg-pink-700 text-white"
        disabled={!regex.trim()}
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Pattern-Match Rule
      </Button>
    </div>
  );
}
