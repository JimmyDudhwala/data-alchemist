"use client"

import { generateFilterFunction } from "@/lib/filterWithLLM"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Loader2, RotateCcw } from "lucide-react"
import type { ClientData, TaskData, WorkerData } from "@/store/useDataStore"

interface LLMSearchBarProps<T extends ClientData | TaskData | WorkerData> {
  data: T[]
  tableType: "clients" | "tasks" | "workers"
  onFiltered: (filtered: T[]) => void
}

export default function LLMSearchBar<T extends ClientData | TaskData | WorkerData>({
  data,
  tableType,
  onFiltered,
}: LLMSearchBarProps<T>) {
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSearch = async () => {
    if (!query.trim()) return
    if (data.length === 0) {
      onFiltered([])
      return
    }
    setLoading(true)

    try {
      const fn = await generateFilterFunction({
        query,
        tableType,
        sampleRow: data[0],
      })

      const filtered = data.filter((row) => fn(row))
      onFiltered(filtered)
    } catch (error) {
      console.error("Error during search:", error)
      onFiltered(data)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setQuery("")
    onFiltered(data)
  }

  return (
    <div className="flex items-center gap-2 p-4 bg-gray-900/50 rounded-lg border border-gray-700">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
          placeholder="Search in natural language... (e.g., 'clients with high priority tasks')"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch()
            }
          }}
        />
      </div>
      <Button
        onClick={handleSearch}
        disabled={loading || data.length === 0 || !query.trim()}
        className="bg-blue-600 hover:bg-blue-700 text-white"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
        {loading ? "Searching..." : "Search"}
      </Button>
      {query && (
        <Button
          onClick={handleReset}
          variant="outline"
          className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
      )}
    </div>
  )
}
