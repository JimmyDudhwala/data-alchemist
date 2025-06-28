"use client";

import { useRuleStore } from "@/store/useRuleStore";
import { useDataStore } from "@/store/useDataStore";
import { useState } from "react";

export default function TaskPriorityRuleForm() {
  const [priorityList, setPriorityList] = useState<string[]>([]);
  const tasks = useDataStore((s) => s.tasks);
  const addRule = useRuleStore((s) => s.addRule);

  const taskOptions = tasks.map((t) => t.TaskID);

  const toggleAdd = (id: string) => {
    setPriorityList((prev) =>
      prev.includes(id) ? prev : [...prev, id]
    );
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newList = [...priorityList];
    [newList[index - 1], newList[index]] = [
      newList[index],
      newList[index - 1],
    ];
    setPriorityList(newList);
  };

  const moveDown = (index: number) => {
    if (index === priorityList.length - 1) return;
    const newList = [...priorityList];
    [newList[index], newList[index + 1]] = [
      newList[index + 1],
      newList[index],
    ];
    setPriorityList(newList);
  };

  const handleAddRule = () => {
    if (priorityList.length < 2) {
      alert("Add at least two TaskIDs to define a priority order.");
      return;
    }

    addRule({
      type: "TaskPriority",
      priorityList,
    });

    setPriorityList([]);
  };

  return (
    <div className="border p-4 rounded mb-4 bg-gray-50">
      <h3 className="text-md font-semibold mb-2">🎯 Task Priority Rule</h3>

      <div className="mb-2">
        <label className="block font-medium mb-1">Select Tasks by Priority:</label>
        <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto border p-2 rounded bg-white">
          {taskOptions.map((id) => (
            <button
              key={id}
              type="button"
              className={`px-2 py-1 border rounded text-sm ${
                priorityList.includes(id)
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100"
              }`}
              onClick={() => toggleAdd(id)}
            >
              {id}
            </button>
          ))}
        </div>
      </div>

      {priorityList.length > 0 && (
        <div className="mb-2">
          <label className="font-medium block mb-1">Current Priority Order:</label>
          <ul className="border rounded p-2 bg-white space-y-1">
            {priorityList.map((item, idx) => (
              <li
                key={item}
                className="flex justify-between items-center px-2 py-1 border rounded"
              >
                <span>{item}</span>
                <div className="flex gap-1">
                  <button
                    onClick={() => moveUp(idx)}
                    className="text-xs text-blue-600"
                  >
                    ⬆️
                  </button>
                  <button
                    onClick={() => moveDown(idx)}
                    className="text-xs text-blue-600"
                  >
                    ⬇️
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={handleAddRule}
        className="bg-blue-600 text-white px-4 py-1 rounded"
      >
        Add Task Priority Rule
      </button>
    </div>
  );
}
