"use client";

import { useState } from "react";
import { useRuleStore } from "@/store/useRuleStore";
import { useDataStore } from "@/store/useDataStore";
import { generateRuleFromText } from "@/lib/generateRuleFromText";

export default function NLRuleInput() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const addRule = useRuleStore((s) => s.addRule);
  const clients = useDataStore((s) => s.clients);
  const tasks = useDataStore((s) => s.tasks);
  const workers = useDataStore((s) => s.workers);

  const handleGenerate = async () => {
    if (!text.trim()) return;
    setLoading(true);

    const rule = await generateRuleFromText(text, { clients, tasks, workers });

    if (rule) {
      addRule(rule);
      setText("");
    } else {
      alert("❌ Failed to generate a valid rule.");
    }

    setLoading(false);
  };

  return (
    <div className="border p-4 rounded mb-4 bg-yellow-50">
      <h3 className="text-md font-semibold mb-2">🧠 Natural Language Rule Input</h3>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="e.g., Tasks longer than 2 phases should only be assigned to W001 and W003"
        className="border px-2 py-1 rounded w-full h-24 mb-2"
      />
      <button
        onClick={handleGenerate}
        className="bg-blue-700 text-white px-4 py-1 rounded"
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate Rule"}
      </button>
    </div>
  );
}
