"use client";

import { generateFilterFunction } from "@/lib/filterWithLLM";
import { useState } from "react";
interface LLMSearchBarProps {
  data: any[];
  tableType: "clients" | "tasks" | "workers";
  onFiltered: (filtered: any[]) => void;
}

export default function LLMSearchBar({ data, tableType, onFiltered }: LLMSearchBarProps) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);   

    const fn = await generateFilterFunction({
      query,
      tableType,
      sampleRow: data[0],
    });

    const filtered = data.filter(fn);
    onFiltered(filtered);
//   console.log("🔍 LLM Returned JS Code:", fn.toString());
//   console.log("✅ Filtered Rows:", filtered.length);
  setLoading(false);
};

  return (
    <div className="flex items-center gap-2 mb-2">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="border border-gray-300 px-3 py-2 w-full rounded"
        placeholder="Search in natural language..."
      />
      <button
        onClick={handleSearch}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Searching..." : "Search"}
      </button>
    </div>
  );
}
