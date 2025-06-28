"use client"
import { PrioritySettings, usePriorityStore } from "@/store/usePriorityStore";

export default function PriorityWeightsForm() {
    const { priorities, setPriority } = usePriorityStore();
  
    const fields: { key: keyof PrioritySettings; label: string }[] = [
      { key: "priorityLevel", label: "Client Priority" },
      { key: "taskFulfillment", label: "Task Fulfillment" },
      { key: "fairness", label: "Fairness (Client Balance)" },
    ];
  
    return (
      <div className="space-y-4 p-4 border rounded bg-white">
        <h3 className="text-lg font-semibold">🎯 Prioritization Weights</h3>
        {fields.map(({ key, label }) => (
          <div key={key}>
            <label className="block font-medium mb-1">{label}</label>
            <input
              type="range"
              min={0}
              max={10}
              value={priorities[key]}
              onChange={(e) => setPriority(key, parseInt(e.target.value))}
              className="w-full"
            />
            <span className="text-sm text-gray-600">Value: {priorities[key]}</span>
          </div>
        ))}
      </div>
    );
  }
  