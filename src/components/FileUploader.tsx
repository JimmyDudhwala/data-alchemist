"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, FileText, CheckCircle } from "lucide-react"
import { parseCSV } from "@/lib/parser"
import type { ClientData, TaskData, WorkerData } from "@/store/useDataStore"

interface FileUploaderProps {
  onDataParsed: (data: ClientData[] | TaskData[] | WorkerData[], name: string) => void
}

export default function FileUploader({ onDataParsed }: FileUploaderProps) {
  const [dragActive, setDragActive] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const handleFileChange = async (file: File) => {
    setLoading(true)
    try {
      const data = await parseCSV(file)
      const name = file.name.toLowerCase().includes("client")
        ? "clients"
        : file.name.toLowerCase().includes("task")
          ? "tasks"
          : "workers"

      onDataParsed(data as ClientData[] | TaskData[] | WorkerData[], name)
      setUploadedFiles((prev) => [...prev, `${name}: ${file.name}`])
    } catch (error) {
      console.error("Error parsing file:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const file = e.dataTransfer.files?.[0]
    if (file && file.type === "text/csv") {
      handleFileChange(file)
    }
  }

  return (
    <div className="space-y-4">
      <Card
        className={`border-2 border-dashed transition-all duration-200 ${
          dragActive ? "border-blue-400 bg-blue-900/20" : "border-gray-600 bg-gray-900/50 hover:border-gray-500"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <CardContent className="p-8 text-center">
          <div className="flex flex-col items-center space-y-4">
            <div className={`p-4 rounded-full ${dragActive ? "bg-blue-600" : "bg-gray-700"}`}>
              <Upload className={`w-8 h-8 ${dragActive ? "text-white" : "text-gray-400"}`} />
            </div>
            <div>
              <p className="text-lg font-medium text-white mb-2">
                {loading ? "Processing file..." : "Drop your CSV files here"}
              </p>
              <p className="text-gray-400 text-sm mb-4">or click to browse files</p>
              <Button
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                disabled={loading}
                onClick={() => document.getElementById("file-input")?.click()}
              >
                <FileText className="w-4 h-4 mr-2" />
                Choose File
              </Button>
              <input
                id="file-input"
                type="file"
                accept=".csv"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleFileChange(file)
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {uploadedFiles.length > 0 && (
        <Card className="bg-green-900/20 border-green-600">
          <CardContent className="p-4">
            <h3 className="text-green-400 font-medium mb-2 flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              Successfully Uploaded
            </h3>
            <ul className="space-y-1">
              {uploadedFiles.map((file, idx) => (
                <li key={idx} className="text-green-300 text-sm">
                  • {file}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
