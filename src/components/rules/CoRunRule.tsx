"use client"

import { useState } from "react"
import { useRuleStore } from "@/store/useRuleStore"
import { useDataStore } from "@/store/useDataStore"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {  Plus } from 'lucide-react'
import Select from "react-select"
import { StylesConfig } from "react-select";


export default function CoRunRuleForm() {
  const addRule = useRuleStore((s) => s.addRule)
  const tasks = useDataStore((s) => s.tasks)
  const [selected, setSelected] = useState<string[]>([])

  const taskOptions = tasks.map((t) => ({
    label: t.TaskID,
    value: t.TaskID,
  }))

  const handleAdd = () => {
    if (selected.length < 2) {
      alert("Please select at least two TaskIDs.")
      return
    }

    addRule({
      type: "coRun",
      tasks: selected,
    })
    setSelected([])
  }

  const customSelectStyles: StylesConfig<{ label: string; value: string }, true> = {
    control: (base) => ({
      ...base,
      backgroundColor: '#374151',
      borderColor: '#4B5563',
      color: 'white',
      '&:hover': {
        borderColor: '#6B7280',
      },
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: '#374151',
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? '#4B5563' : '#374151',
      color: 'white',
      '&:hover': {
        backgroundColor: '#4B5563',
      },
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: '#1F2937',
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: 'white',
    }),
    multiValueRemove: (base) => ({
      ...base,
      color: '#9CA3AF',
      '&:hover': {
        backgroundColor: '#EF4444',
        color: 'white',
      },
    }),
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-gray-300">Select TaskIDs:</Label>
        <Select
          isMulti
          options={taskOptions}
          value={taskOptions.filter(o => selected.includes(o.value))}
          onChange={(vals) => setSelected(vals.map((v) => v.value))}
          styles={customSelectStyles}
          placeholder="Choose tasks to run together..."
        />
      </div>

      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selected.map((taskId) => (
            <Badge key={taskId} variant="secondary" className="bg-blue-600 text-white">
              {taskId}
            </Badge>
          ))}
        </div>
      )}

      <Button 
        onClick={handleAdd} 
        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        disabled={selected.length < 2}
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Co-Run Rule
      </Button>
    </div>
  )
}
