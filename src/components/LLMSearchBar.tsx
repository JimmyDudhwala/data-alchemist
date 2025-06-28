"use client";

import { generateFilterFunction } from "@/lib/filterWithLLM";
import { useState } from "react";
import { ClientData, TaskData, WorkerData } from "@/store/useDataStore";

// Generic interface that can work with any of the data types
interface LLMSearchBarProps<T extends ClientData | TaskData | WorkerData> {
  data: T[];
  tableType: "clients" | "tasks" | "workers";
  onFiltered: (filtered: T[]) => void;
}

export default function LLMSearchBar<T extends ClientData | TaskData | WorkerData>({ 
  data, 
  tableType, 
  onFiltered 
}: LLMSearchBarProps<T>) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    // Early return if no data
    if (data.length === 0) {
      onFiltered([]);
      return;
    }
    
    setLoading(true);   

    try {
      const fn = await generateFilterFunction({
        query,
        tableType,
        sampleRow: data[0], // Pass the first row as a sample
      });

      const filtered = data.filter((row) => fn(row));
      onFiltered(filtered);
    } catch (error) {
      console.error("Error during search:", error);
      // Fallback to original data or empty array
      onFiltered(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2 mb-2">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="border border-gray-300 px-3 py-2 w-full rounded"
        placeholder="Search in natural language..."
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSearch();
          }
        }}
      />
      <button
        onClick={handleSearch}
        disabled={loading || data.length === 0}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {loading ? "Searching..." : "Search"}
      </button>
    </div>
  );
}