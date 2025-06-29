"use client"

import { saveAs } from "file-saver"
import { Parser } from "json2csv"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

interface ExportButtonProps {
  data: Record<string, unknown>[]
  filename: string
}

export default function ExportButton({ data, filename }: ExportButtonProps) {
  const handleExport = () => {
    const parser = new Parser()
    const csv = parser.parse(data)
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" })
    saveAs(blob, filename)
  }

  return (
    <Button onClick={handleExport} className="bg-green-600 hover:bg-green-700 text-white">
      <Download className="w-4 h-4 mr-2" />
      Export CSV
    </Button>
  )
}
