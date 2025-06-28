"use client";

import { useState } from "react";
import { useRuleStore } from "@/store/useRuleStore";
import { useDataStore } from "@/store/useDataStore";
import Select from "react-select";

export default function LoadLimitRuleForm() {
  const workers = useDataStore((s) => s.workers);
  const addRule = useRuleStore((s) => s.addRule);

  const [selected, setSelected] = useState<string[]>([]);
  const [maxSlots, setMaxSlots] = useState("3");

  const options = workers.map((w) => ({
    value: w.WorkerID,
    label: w.WorkerID,
  }));

  const handleAdd = () => {
    const max = parseInt(maxSlots);
    if (selected.length < 1 || isNaN(max)) {
      alert("Select at least one WorkerID and a valid number.");
      return;
    }

    addRule({
      type: "loadLimit",
      groupIDs: selected,
      maxSlotsPerPhase: max,
    });

    setSelected([]);
    setMaxSlots("3");
  };

  return (
    <div className="border p-4 rounded mb-4 bg-gray-50">
      <h3 className="text-md font-semibold mb-2">➕ Load-Limit Rule</h3>

      <label className="block font-medium mb-1">Select Worker IDs:</label>
      <Select
        isMulti
        options={options}
        value={options.filter((o) => selected.includes(o.value))}
        onChange={(vals) => setSelected(vals.map((v) => v.value))}
        className="mb-2"
      />

      <input
        type="number"
        value={maxSlots}
        onChange={(e) => setMaxSlots(e.target.value)}
        placeholder="Max slots per phase"
        className="border px-2 py-1 rounded w-full mb-2"
      />

      <button
        onClick={handleAdd}
        className="bg-blue-600 text-white px-4 py-1 rounded"
      >
        Add Load-Limit Rule
      </button>
    </div>
  );
}
