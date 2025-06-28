"use client";

import { useState, useMemo } from "react";
import { useRuleStore } from "@/store/useRuleStore";
import { useDataStore } from "@/store/useDataStore";
import Select from "react-select";

export default function SlotRestrictionForm() {
  const [groupType, setGroupType] = useState<"clients" | "workers">("clients");
  const [selected, setSelected] = useState<string[]>([]);
  const [minSlots, setMinSlots] = useState("2");

  const addRule = useRuleStore((s) => s.addRule);
  const clients = useDataStore((s) => s.clients);
  const workers = useDataStore((s) => s.workers);

  const options = useMemo(() => {
    const items = groupType === "clients" ? clients : workers;
    return items.map((item) => ({
      value: groupType === "clients" ? item.ClientID : item.WorkerID,
      label: groupType === "clients" ? item.ClientID : item.WorkerID,
    }));
  }, [groupType, clients, workers]);

  const handleAdd = () => {
    const min = parseInt(minSlots);
    if (selected.length < 2 || isNaN(min)) {
      alert("Select at least two IDs and enter a valid number.");
      return;
    }

    addRule({
      type: "slotRestriction",
      groupType,
      groupIDs: selected,
      minCommonSlots: min,
    });

    setSelected([]);
    setMinSlots("2");
  };

  return (
    <div className="border p-4 rounded mb-4 bg-gray-50">
      <h3 className="text-md font-semibold mb-2">➕ Slot-Restriction Rule</h3>

      <div className="mb-2">
        <label className="mr-2 font-medium">Group Type:</label>
        <select
          value={groupType}
          onChange={(e) => setGroupType(e.target.value as "clients" | "workers")}
          className="border px-2 py-1 rounded"
        >
          <option value="clients">Client Group</option>
          <option value="workers">Worker Group</option>
        </select>
      </div>

      <Select
        isMulti
        options={options}
        value={options.filter((o) => selected.includes(o.value))}
        onChange={(vals) => setSelected(vals.map((v) => v.value))}
        className="mb-2"
      />

      <input
        type="number"
        value={minSlots}
        onChange={(e) => setMinSlots(e.target.value)}
        placeholder="Min Common Slots"
        className="border px-2 py-1 rounded w-full mb-2"
      />

      <button
        onClick={handleAdd}
        className="bg-blue-600 text-white px-4 py-1 rounded"
      >
        Add Slot-Restriction Rule
      </button>
    </div>
  );
}
