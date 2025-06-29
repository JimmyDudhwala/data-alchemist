"use client"

import { useRuleStore } from "@/store/useRuleStore"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowUp, ArrowDown, Plus } from "lucide-react"

const ruleTypes = ["coRun", "slotRestriction", "loadLimit", "phaseWindow", "patternMatch"]

export default function PrecedenceOverrideForm() {
  const addRule = useRuleStore((s) => s.addRule)
  const [priorityList, setPriorityList] = useState<string[]>([])

  const allOptions = [...ruleTypes]

  const toggleAdd = (id: string) => {
    setPriorityList((prev) => (prev.includes(id) ? prev : [...prev, id]))
  }

  const moveUp = (index: number) => {
    if (index === 0) return
    const newList = [...priorityList]
    ;[newList[index - 1], newList[index]] = [newList[index], newList[index - 1]]
    setPriorityList(newList)
  }

  const moveDown = (index: number) => {
    if (index === priorityList.length - 1) return
    const newList = [...priorityList]
    ;[newList[index], newList[index + 1]] = [newList[index + 1], newList[index]]
    setPriorityList(newList)
  }

  const handleAddRule = () => {
    if (priorityList.length < 2) {
      alert("Add at least two items to define a precedence order.")
      return
    }

    addRule({
      type: "precedenceOverride",
      priorityList,
    })
    setPriorityList([])
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="block font-medium mb-2 text-gray-300">Available Rule Types:</label>
        <div className="flex flex-wrap gap-2">
          {allOptions.map((opt) => (
            <Button
              key={opt}
              variant={priorityList.includes(opt) ? "default" : "outline"}
              size="sm"
              onClick={() => toggleAdd(opt)}
              className={
                priorityList.includes(opt)
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "border-gray-600 text-gray-300 hover:bg-gray-700"
              }
            >
              {opt}
            </Button>
          ))}
        </div>
      </div>

      {priorityList.length > 0 && (
        <Card className="bg-gray-700/50 border-gray-600">
          <CardContent className="p-4">
            <label className="font-medium block mb-2 text-gray-300">Priority Order (High to Low):</label>
            <div className="space-y-2">
              {priorityList.map((item, idx) => (
                <div
                  key={item}
                  className="flex justify-between items-center px-3 py-2 bg-gray-800 rounded-lg border border-gray-600"
                >
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-red-600 text-white">
                      {idx + 1}
                    </Badge>
                    <span className="text-gray-300">{item}</span>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => moveUp(idx)}
                      disabled={idx === 0}
                      className="text-gray-400 hover:text-white"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => moveDown(idx)}
                      disabled={idx === priorityList.length - 1}
                      className="text-gray-400 hover:text-white"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Button
        onClick={handleAddRule}
        className="w-full bg-red-600 hover:bg-red-700 text-white"
        disabled={priorityList.length < 2}
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Precedence Rule
      </Button>
    </div>
  )
}
