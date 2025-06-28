"use client";

import { useState } from "react";
import { useRuleStore } from "@/store/useRuleStore";
import { useDataStore } from "@/store/useDataStore";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label"; // ← You'll need to create or import this component
import Select from "react-select";

export default function CoRunRuleForm() {
  const addRule = useRuleStore((s) => s.addRule);
  const tasks = useDataStore((s) => s.tasks);
  const [selected, setSelected] = useState<string[]>([]);


  const taskOptions = tasks.map((t) => ({
    label: t.TaskID,
    value: t.TaskID,
  }));

  const handleAdd = () => {
    if (selected.length < 2) {
      alert("Please select at least two TaskIDs.");
      return;
    }

    addRule({
      type: "coRun",
      tasks: selected,
    });

    setSelected([]);
  };

  return (
    <div className="border p-4 rounded mb-4 bg-gray-50">
      <h3 className="text-md font-semibold mb-2">➕ Co-Run Rule</h3>

      <Label className="mb-1 block">Select TaskIDs:</Label>
      <Select
  isMulti
  options={taskOptions}
  value={taskOptions.filter(o => selected.includes(o.value))}
  onChange={(vals) => setSelected(vals.map((v) => v.value))}
  className="react-select-container"
  classNamePrefix="react-select"
/>

      <Button onClick={handleAdd} className="mt-3">
        Add Co-Run Rule
      </Button>
    </div>
  );
}
