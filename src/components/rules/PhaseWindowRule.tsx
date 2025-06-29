"use client"

import { useState } from "react"
import { useRuleStore } from "@/store/useRuleStore"
import { useDataStore } from "@/store/useDataStore"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Plus } from "lucide-react"
import Select from "react-select"
import { StylesConfig } from "react-select"

export default function PhaseWindowForm() {
  const tasks = useDataStore((s) => s.tasks)
  const addRule = useRuleStore((s) => s.addRule)

  const taskOptions = tasks.map((t) => ({
    label: t.TaskID,
    value: t.TaskID,
  }))

  const phaseOptions = Array.from({ length: 10 }, (_, i) => ({
    label: `Phase ${i + 1}`,
    value: i + 1,
  }))

  const [selectedTask, setSelectedTask] = useState<string | null>(null)
  const [selectedPhases, setSelectedPhases] = useState<number[]>([])

  const handleAdd = () => {
    if (!selectedTask || selectedPhases.length === 0) {
      alert("Please select a TaskID and at least one allowed phase.")
      return
    }

    addRule({
      type: "phaseWindow",
      taskId: selectedTask,
      allowedPhases: selectedPhases,
    })
    setSelectedTask(null)
    setSelectedPhases([])
  }

  interface TaskOption {
    label: string
    value: string
  }

  interface PhaseOption {
    label: string
    value: number
  }

  const customSelectStyles: StylesConfig<TaskOption | PhaseOption, true | false> = {
    control: (provided) => ({
      ...provided,
      backgroundColor: "#374151",
      borderColor: "#4B5563",
      color: "white",
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "#374151",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#4B5563" : "#374151",
      color: "white",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "white",
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: "#1F2937",
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: "white",
    }),
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-gray-300">Task ID:</Label>
        <Select
          options={taskOptions}
          value={taskOptions.find((opt) => opt.value === selectedTask) || null}
          onChange={(val) => setSelectedTask((val as TaskOption | null)?.value || null)}
          placeholder="Select a Task ID"
          styles={customSelectStyles}
        />
      </div>

      <div className="space-y-2">
        <Label className="text-gray-300">Allowed Phases:</Label>
        <Select
          options={phaseOptions}
          isMulti
          value={phaseOptions.filter((opt) => selectedPhases.includes(opt.value))}
          onChange={(vals) => setSelectedPhases(vals.map((v) => Number(v.value)))}
          placeholder="Select phases..."
          styles={customSelectStyles}
        />
      </div>

      {selectedTask && (
        <Badge variant="secondary" className="bg-purple-600 text-white">
          Task: {selectedTask}
        </Badge>
      )}

      {selectedPhases.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedPhases.map((phase) => (
            <Badge key={phase} variant="secondary" className="bg-purple-600 text-white">
              Phase {phase}
            </Badge>
          ))}
        </div>
      )}

      <Button
        onClick={handleAdd}
        className="w-full bg-purple-600 hover:bg-purple-700 text-white"
        disabled={!selectedTask || selectedPhases.length === 0}
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Phase-Window Rule
      </Button>
    </div>
  )
}
