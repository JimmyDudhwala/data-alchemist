"use client";

import { useState } from "react";
import {
  useDataStore,
  ClientData,
  TaskData,
  WorkerData,
} from "@/store/useDataStore";

type TargetRow = ClientData | TaskData | WorkerData;

type Patch = {
  modification?: {
    where: Record<string, unknown>;
    set: Partial<TargetRow>;
  }[];
  deletion?: {
    where: Record<string, unknown>;
  }[];
};

interface NLModifyFormProps {
  tableType: "clients" | "tasks" | "workers";
  data: TargetRow[];
}

export default function NLModifyForm({ tableType, data }: NLModifyFormProps) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const setClients = useDataStore((s) => s.setClients);
  const setTasks = useDataStore((s) => s.setTasks);
  const setWorkers = useDataStore((s) => s.setWorkers);

  const handleSubmit = async () => {
    if (!input.trim()) return;
    setLoading(true);

    const res = await fetch("/api/modify-data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tableType, description: input, data }),
    });

    const json = await res.json();
    const patch: Patch = json.patch;

    if (!patch) {
      alert("❌ Failed to apply patch.");
      setLoading(false);
      return;
    }

    const updated = applyPatch(data, patch);

    if (tableType === "clients") setClients(updated as ClientData[]);
    if (tableType === "tasks") setTasks(updated as TaskData[]);
    if (tableType === "workers") setWorkers(updated as WorkerData[]);

    setInput("");
    setLoading(false);
  };

  return (
    <div className="border p-4 rounded mb-4 bg-orange-50">
      <h3 className="text-md font-semibold mb-2">🛠️ Natural Language Modify</h3>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="e.g. Delete all workers in group B"
        className="border px-2 py-1 rounded w-full mb-2"
      />
      <button
        onClick={handleSubmit}
        className="bg-orange-600 text-white px-4 py-1 rounded"
        disabled={loading}
      >
        {loading ? "Applying..." : "Apply Modification"}
      </button>
    </div>
  );
}

// Utility types to improve clarity
type JSONObject = Record<string, unknown>;

function applyPatch<T extends TargetRow>(data: T[], patch: Patch): T[] {
  let modified = [...data];

  const evaluateCondition = (key: string, row: T, expected: unknown): boolean => {
    const match = key.match(/(.*?)\s*(==|!=|>=|<=|>|<)$/);
    let actualValue;

    if (match) {
      const [, path, op] = match;
      actualValue = resolveValue(row, path);
      return compareValues(actualValue, expected, op);
    } else {
      actualValue = resolveValue(row, key);
      return String(actualValue) === String(expected);
    }
  };

  const resolveValue = (obj: JSONObject, path: string): unknown => {
    const parts = path.split(".");
    return parts.reduce<unknown>((val, part) => {
      if (val && typeof val === "object" && part in val) {
        return (val as JSONObject)[part];
      }
      return undefined;
    }, obj);
  };

  const compareValues = (a: unknown, b: unknown, op: string): boolean => {
    const aNum = Number(a);
    const bNum = Number(b);
    switch (op) {
      case "==": return a == b;
      case "!=": return a != b;
      case ">": return aNum > bNum;
      case "<": return aNum < bNum;
      case ">=": return aNum >= bNum;
      case "<=": return aNum <= bNum;
      default: return false;
    }
  };

  // Apply modification
  if (patch.modification) {
    modified = modified.map((row) => {
      for (const rule of patch.modification!) {
        const matches = Object.entries(rule.where).every(([k, v]) =>
          evaluateCondition(k, row, v)
        );
        if (matches) return { ...row, ...rule.set };
      }
      return row;
    });
  }

  // Apply deletion
  if (patch.deletion) {
    for (const rule of patch.deletion!) {
      modified = modified.filter(
        (row) =>
          !Object.entries(rule.where).every(([k, v]) =>
            evaluateCondition(k, row, v)
          )
      );
    }
  }

  return modified;
}
