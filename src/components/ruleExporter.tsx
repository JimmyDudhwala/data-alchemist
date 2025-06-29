"use client"

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { useRuleStore } from "@/store/useRuleStore"
import { usePriorityStore } from "@/store/usePriorityStore"

export default function RuleExporter() {
  const rules = useRuleStore((s) => s.rules)
  const priorities = usePriorityStore((s) => s.priorities)

  const handleExport = () => {
    const fullConfig = {
      rules,
      priorities,
      exportedAt: new Date().toISOString(),
      version: "1.0",
    }

    const dataStr = JSON.stringify(fullConfig, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = "rules-and-priorities.json"
    link.click()
    URL.revokeObjectURL(url)
  }

  const totalItems = rules.length + (Object.values(priorities).some((v) => v > 0) ? 1 : 0)

  return (
    <Button onClick={handleExport} className="bg-green-600 hover:bg-green-700 text-white" disabled={totalItems === 0}>
      <Download className="w-4 h-4 mr-2" />
      Export Configuration
    </Button>
  )
}
