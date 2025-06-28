"use client";

import { useState } from "react";
import Select from "react-select";
import { useRuleStore } from "@/store/useRuleStore";
import { useDataStore } from "@/store/useDataStore";

export default function PhaseWindowForm() {
  const tasks = useDataStore((s) => s.tasks);
  const addRule = useRuleStore((s) => s.addRule);

  const taskOptions = tasks.map((t) => ({
    label: t.TaskID,
    value: t.TaskID,
  }));

  const phaseOptions = Array.from({ length: 10 }, (_, i) => ({
    label: `Phase ${i + 1}`,
    value: i + 1,
  }));

  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [selectedPhases, setSelectedPhases] = useState<number[]>([]);

  const handleAdd = () => {
    if (!selectedTask || selectedPhases.length === 0) {
      alert("Please select a TaskID and at least one allowed phase.");
      return;
    }

    addRule({
      type: "phaseWindow",
      taskId: selectedTask,
      allowedPhases: selectedPhases,
    });

    setSelectedTask(null);
    setSelectedPhases([]);
  };

  return (
    <div className="border p-4 rounded mb-4 bg-gray-50">
      <h3 className="text-md font-semibold mb-2">➕ Phase-Window Rule</h3>

      <div className="mb-3">
        <label className="block mb-1 font-medium">Task ID:</label>
        <Select
          options={taskOptions}
          value={taskOptions.find((opt) => opt.value === selectedTask) || null}
          onChange={(val) => setSelectedTask(val?.value || null)}
          placeholder="Select a Task ID"
          className="react-select-container"
          classNamePrefix="react-select"
        />
      </div>

      <div className="mb-3">
        <label className="block mb-1 font-medium">Allowed Phases:</label>
        <Select
          options={phaseOptions}
          isMulti
          value={phaseOptions.filter((opt) =>
            selectedPhases.includes(opt.value)
          )}
          onChange={(vals) => setSelectedPhases(vals.map((v) => v.value))}
          placeholder="Select phases..."
          className="react-select-container"
          classNamePrefix="react-select"
        />
      </div>

      <button
        onClick={handleAdd}
        className="bg-blue-600 text-white px-4 py-1 rounded"
      >
        Add Phase-Window Rule
      </button>
    </div>
  );
}
