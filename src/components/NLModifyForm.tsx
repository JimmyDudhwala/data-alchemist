"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Wand2, Loader2 } from "lucide-react"
import { useDataStore, type ClientData, type TaskData, type WorkerData } from "@/store/useDataStore"

type TargetRow = ClientData | TaskData | WorkerData

type Patch = {
  modification?: {
    where: Record<string, unknown>
    set: Partial<TargetRow>
  }[]
  deletion?: {
    where: Record<string, unknown>
  }[]
}

interface NLModifyFormProps {
  tableType: "clients" | "tasks" | "workers"
  data: TargetRow[]
}

export default function NLModifyForm({ tableType, data }: NLModifyFormProps) {
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)

  const setClients = useDataStore((s) => s.setClients)
  const setTasks = useDataStore((s) => s.setTasks)
  const setWorkers = useDataStore((s) => s.setWorkers)

  const handleSubmit = async () => {
    if (!input.trim()) return
    setLoading(true)

    try {
      const res = await fetch("/api/modify-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tableType, description: input, data }),
      })

      const json = await res.json()
      const patch: Patch = json.patch

      if (!patch) {
        alert("❌ Failed to apply patch.")
        return
      }

      const updated = applyPatch(data, patch)

      if (tableType === "clients") setClients(updated as ClientData[])
      if (tableType === "tasks") setTasks(updated as TaskData[])
      if (tableType === "workers") setWorkers(updated as WorkerData[])

      setInput("")
    } catch (error) {
      console.error("Error applying modification:", error)
      alert("❌ Failed to apply modification.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="bg-gradient-to-r from-orange-900/20 to-red-900/20 border-orange-600/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-orange-400 flex items-center text-lg">
          <Wand2 className="w-5 h-5 mr-2" />
          AI-Powered Data Modification
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g., Delete all workers in group B, or Update all high priority tasks to completed"
          className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSubmit()
            }
          }}
        />
        <Button
          onClick={handleSubmit}
          disabled={loading || !input.trim()}
          className="bg-orange-600 hover:bg-orange-700 text-white w-full"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Applying Changes...
            </>
          ) : (
            <>
              <Wand2 className="w-4 h-4 mr-2" />
              Apply Modification
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}

// Utility types to improve clarity
type JSONObject = Record<string, unknown>

function applyPatch<T extends TargetRow>(data: T[], patch: Patch): T[] {
  let modified = [...data]

  const evaluateCondition = (key: string, row: T, expected: unknown): boolean => {
    const match = key.match(/(.*?)\s*(==|!=|>=|<=|>|<)$/)
    let actualValue

    if (match) {
      const [, path, op] = match
      actualValue = resolveValue(row, path)
      return compareValues(actualValue, expected, op)
    } else {
      actualValue = resolveValue(row, key)
      return String(actualValue) === String(expected)
    }
  }

  const resolveValue = (obj: JSONObject, path: string): unknown => {
    const parts = path.split(".")
    return parts.reduce<unknown>((val, part) => {
      if (val && typeof val === "object" && part in val) {
        return (val as JSONObject)[part]
      }
      return undefined
    }, obj)
  }

  const compareValues = (a: unknown, b: unknown, op: string): boolean => {
    const aNum = Number(a)
    const bNum = Number(b)
    switch (op) {
      case "==":
        return a == b
      case "!=":
        return a != b
      case ">":
        return aNum > bNum
      case "<":
        return aNum < bNum
      case ">=":
        return aNum >= bNum
      case "<=":
        return aNum <= bNum
      default:
        return false
    }
  }

  // Apply modification
  if (patch.modification) {
    modified = modified.map((row) => {
      for (const rule of patch.modification!) {
        const matches = Object.entries(rule.where).every(([k, v]) => evaluateCondition(k, row, v))
        if (matches) return { ...row, ...rule.set }
      }
      return row
    })
  }

  // Apply deletion
  if (patch.deletion) {
    for (const rule of patch.deletion!) {
      modified = modified.filter((row) => !Object.entries(rule.where).every(([k, v]) => evaluateCondition(k, row, v)))
    }
  }

  return modified
}
