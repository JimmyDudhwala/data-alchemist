"use client"

import { useState } from "react"
import { useRuleStore } from "@/store/useRuleStore"
import { useDataStore } from "@/store/useDataStore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {  Plus } from 'lucide-react'
import Select from "react-select"
import { StylesConfig } from "react-select";

export default function LoadLimitRuleForm() {
  const workers = useDataStore((s) => s.workers)
  const addRule = useRuleStore((s) => s.addRule)
  const [selected, setSelected] = useState<string[]>([])
  const [maxSlots, setMaxSlots] = useState("3")

  const options = workers.map((w) => ({
    value: w.WorkerID,
    label: w.WorkerID,
  }))

  const handleAdd = () => {
    const max = parseInt(maxSlots)
    if (selected.length < 1 || isNaN(max)) {
      alert("Select at least one WorkerID and a valid number.")
      return
    }

    addRule({
      type: "loadLimit",
      groupIDs: selected,
      maxSlotsPerPhase: max,
    })
    setSelected([])
    setMaxSlots("3")
  }

  interface WorkerOption {
    value: string;
    label: string;
  }

  const customSelectStyles: StylesConfig<WorkerOption, true> = {
    control: (provided) => ({
      ...provided,
      backgroundColor: '#374151',
      borderColor: '#4B5563',
      color: 'white',
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: '#374151',
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? '#4B5563' : '#374151',
      color: 'white',
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: '#1F2937',
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: 'white',
    }),
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-gray-300">Select Worker IDs:</Label>
        <Select
          isMulti
          options={options}
          value={options.filter((o) => selected.includes(o.value))}
          onChange={(vals) => setSelected(vals.map((v) => v.value))}
          styles={customSelectStyles}
          placeholder="Choose workers..."
        />
      </div>

      <div className="space-y-2">
        <Label className="text-gray-300">Max Slots Per Phase:</Label>
        <Input
          type="number"
          value={maxSlots}
          onChange={(e) => setMaxSlots(e.target.value)}
          placeholder="Max slots per phase"
          className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500"
        />
      </div>

      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selected.map((workerId) => (
            <Badge key={workerId} variant="secondary" className="bg-orange-600 text-white">
              {workerId}
            </Badge>
          ))}
        </div>
      )}

      <Button 
        onClick={handleAdd} 
        className="w-full bg-orange-600 hover:bg-orange-700 text-white"
        disabled={selected.length < 1 || !maxSlots}
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Load-Limit Rule
      </Button>
    </div>
  )
}
