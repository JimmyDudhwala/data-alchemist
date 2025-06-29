"use client"

import { useState, useMemo } from "react"
import { useRuleStore } from "@/store/useRuleStore"
import { useDataStore } from "@/store/useDataStore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Plus } from "lucide-react"
import Select from "react-select"
import { StylesConfig } from "react-select"

export default function SlotRestrictionForm() {
  const [groupType, setGroupType] = useState<"clients" | "workers">("clients")
  const [selected, setSelected] = useState<string[]>([])
  const [minSlots, setMinSlots] = useState("2")

  const addRule = useRuleStore((s) => s.addRule)
  const clients = useDataStore((s) => s.clients)
  const workers = useDataStore((s) => s.workers)

  const options = useMemo(() => {
    const items = groupType === "clients" ? clients : workers
    return items.map((item) => ({
      value: groupType === "clients" ? item.ClientID : item.WorkerID,
      label: groupType === "clients" ? item.ClientID : item.WorkerID,
    }))
  }, [groupType, clients, workers])

  const handleAdd = () => {
    const min = Number.parseInt(minSlots)
    if (selected.length < 2 || isNaN(min)) {
      alert("Select at least two IDs and enter a valid number.")
      return
    }

    addRule({
      type: "slotRestriction",
      groupType,
      groupIDs: selected,
      minCommonSlots: min,
    })
    setSelected([])
    setMinSlots("2")
  }


  const customSelectStyles: StylesConfig<{ value: string | number; label: string | number }, true> = {
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
        <Label className="text-gray-300">Group Type:</Label>
        <div className="flex gap-2">
          <Button
            variant={groupType === "clients" ? "default" : "outline"}
            onClick={() => setGroupType("clients")}
            className={
              groupType === "clients"
                ? "bg-green-600 hover:bg-green-700"
                : "border-gray-600 text-gray-300 hover:bg-gray-700"
            }
          >
            Clients
          </Button>
          <Button
            variant={groupType === "workers" ? "default" : "outline"}
            onClick={() => setGroupType("workers")}
            className={
              groupType === "workers"
                ? "bg-green-600 hover:bg-green-700"
                : "border-gray-600 text-gray-300 hover:bg-gray-700"
            }
          >
            Workers
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-gray-300">Select {groupType === "clients" ? "Clients" : "Workers"}:</Label>
        <Select
          isMulti
          options={options}
          value={options.filter((o) => selected.includes(String(o.value)))}
          onChange={(vals) => setSelected(vals.map((v) => String(v.value)))}
          styles={customSelectStyles}
          placeholder={`Choose ${groupType}...`}
        />
      </div>

      <div className="space-y-2">
        <Label className="text-gray-300">Minimum Common Slots:</Label>
        <Input
          type="number"
          value={minSlots}
          onChange={(e) => setMinSlots(e.target.value)}
          placeholder="Min Common Slots"
          className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-green-500"
        />
      </div>

      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selected.map((id) => (
            <Badge key={id} variant="secondary" className="bg-green-600 text-white">
              {id}
            </Badge>
          ))}
        </div>
      )}

      <Button
        onClick={handleAdd}
        className="w-full bg-green-600 hover:bg-green-700 text-white"
        disabled={selected.length < 2 || !minSlots}
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Slot-Restriction Rule
      </Button>
    </div>
  )
}
