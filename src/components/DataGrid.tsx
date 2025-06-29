"use client"

import { useEffect, useState, useCallback } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trash2, Plus, Edit3 } from "lucide-react"

import {
  type ClientData,
  type DataRow,
  type TaskData,
  useDataStore,
  type ValidationError,
  type WorkerData,
} from "@/store/useDataStore"
import { validateClientRow } from "./errors/client"
import { validateTaskRow } from "./errors/tasks"
import { validateWorkerRow } from "./errors/workers"

interface DataTableProps<T extends DataRow & Record<string, unknown>> {
  data: T[]
  tableType: "clients" | "tasks" | "workers"
  onChange?: (data: T[]) => void
}

export default function DataTable<T extends DataRow>({ data, tableType, onChange }: DataTableProps<T>) {
  const [localData, setLocalData] = useState<T[]>(data)
  const [editingCell, setEditingCell] = useState<{ row: number; col: string } | null>(null)

  const setClientErrors = useDataStore((s) => s.setClientErrors)
  const setTaskErrors = useDataStore((s) => s.setTaskErrors)
  const setWorkErrors = useDataStore((s) => s.setWorkErrors)

  const clientsErrors = useDataStore((s) => s.clientsErrors)
  const tasksErrors = useDataStore((s) => s.tasksErrors)
  const workersErrors = useDataStore((s) => s.workersErrors)
  const tasks = useDataStore((s) => s.tasks)

  const headers = Object.keys(localData[0] || {})

  const handleEdit = useCallback(
    (rowIdx: number, key: string, value: string) => {
      const updated = [...localData]
      ;(updated[rowIdx] as Record<string, unknown>)[key] = value
      setLocalData(updated)
      onChange?.(updated)

      let newErrors: ValidationError[] = []

      if (tableType === "clients") {
        const allTaskIDs = new Set(tasks.map((t) => String(t.TaskID)))
        const seenClientIDs = new Set<string>()
        if (tableType === "clients") {
          newErrors = validateClientRow(updated[rowIdx] as unknown as ClientData, rowIdx, allTaskIDs, seenClientIDs)
        }
      } else if (tableType === "tasks") {
        const seenTaskIDs = new Set<string>()
        newErrors = validateTaskRow(updated[rowIdx] as unknown as TaskData, rowIdx, seenTaskIDs)
      } else if (tableType === "workers") {
        const seenWorkerIDs = new Set<string>()
        newErrors = validateWorkerRow(updated[rowIdx] as unknown as WorkerData, rowIdx, seenWorkerIDs)
      }

      let existingErrors: ValidationError[] = []
      if (tableType === "clients") existingErrors = clientsErrors
      if (tableType === "tasks") existingErrors = tasksErrors
      if (tableType === "workers") existingErrors = workersErrors

      const filteredErrors = existingErrors.filter((e) => e.rowIndex !== rowIdx)

      if (tableType === "clients") setClientErrors([...filteredErrors, ...newErrors])
      if (tableType === "tasks") setTaskErrors([...filteredErrors, ...newErrors])
      if (tableType === "workers") setWorkErrors([...filteredErrors, ...newErrors])
    },
    [
      localData,
      onChange,
      tableType,
      tasks,
      clientsErrors,
      tasksErrors,
      workersErrors,
      setClientErrors,
      setTaskErrors,
      setWorkErrors,
    ],
  )

  const getCellError = useCallback(
    (rowIdx: number, column: string): string | null => {
      let currentErrors: ValidationError[] = []
      if (tableType === "clients") currentErrors = clientsErrors
      if (tableType === "tasks") currentErrors = tasksErrors
      if (tableType === "workers") currentErrors = workersErrors

      const err = currentErrors.find((e) => Number(e.rowIndex) === Number(rowIdx) && e.column === column)
      return err?.message || null
    },
    [tableType, clientsErrors, tasksErrors, workersErrors],
  )

  const handleDeleteRow = useCallback(
    (rowIdx: number) => {
      const updated = localData.filter((_, idx) => idx !== rowIdx)
      setLocalData(updated)
      onChange?.(updated)

      let currentErrors: ValidationError[] = []
      if (tableType === "clients") currentErrors = clientsErrors
      if (tableType === "tasks") currentErrors = tasksErrors
      if (tableType === "workers") currentErrors = workersErrors

      const filteredErrors = currentErrors.filter((e) => e.rowIndex !== rowIdx)
      if (tableType === "clients") setClientErrors(filteredErrors)
      if (tableType === "tasks") setTaskErrors(filteredErrors)
      if (tableType === "workers") setWorkErrors(filteredErrors)
    },
    [
      localData,
      onChange,
      tableType,
      clientsErrors,
      tasksErrors,
      workersErrors,
      setClientErrors,
      setTaskErrors,
      setWorkErrors,
    ],
  )

  useEffect(() => {
    setLocalData(data)

    if (tableType === "clients") {
      const allTaskIDs = new Set(tasks.map((t) => String(t.TaskID)))
      const seenClientIDs = new Set<string>()
      const allErrors = data.flatMap((row, idx) =>
        validateClientRow(row as unknown as ClientData, idx, allTaskIDs, seenClientIDs),
      )
      setClientErrors(allErrors)
    }

    if (tableType === "tasks") {
      const seenTaskIDs = new Set<string>()
      const allErrors = data.flatMap((row, idx) => validateTaskRow(row as unknown as TaskData, idx, seenTaskIDs))
      setTaskErrors(allErrors)
    }

    if (tableType === "workers") {
      const seenWorkerIDs = new Set<string>()
      const allErrors = data.flatMap((row, idx) => validateWorkerRow(row as unknown as WorkerData, idx, seenWorkerIDs))
      setWorkErrors(allErrors)
    }
  }, [data, tasks, tableType, setClientErrors, setTaskErrors, setWorkErrors])

  if (localData.length === 0) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-8 text-center">
          <p className="text-gray-400">No data available</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700 hover:bg-gray-700/50">
                {headers.map((key) => (
                  <TableHead key={key} className="text-gray-300 font-semibold">
                    {key}
                  </TableHead>
                ))}
                <TableHead className="text-gray-300 font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {localData.map((row, rowIdx) => (
                <TableRow key={rowIdx} className="border-gray-700 hover:bg-gray-700/30">
                  {headers.map((key) => {
                    const error = getCellError(rowIdx, key)
                    const isEditing = editingCell?.row === rowIdx && editingCell?.col === key

                    return (
                      <TableCell
                        key={key}
                        className={`px-3 py-2 transition-colors duration-150 ${
                          error ? "border-l-2 border-red-500 bg-red-900/20 text-red-200" : "text-gray-300"
                        } ${isEditing ? "bg-blue-900/30" : ""}`}
                        title={error || ""}
                        onClick={() => setEditingCell({ row: rowIdx, col: key })}
                      >
                        <div className="flex items-center gap-2">
                          {isEditing ? (
                            <input
                              type="text"
                              defaultValue={String(row[key])}
                              className="bg-gray-700 text-white px-2 py-1 rounded text-sm w-full"
                              autoFocus
                              onBlur={(e) => {
                                handleEdit(rowIdx, key, e.target.value)
                                setEditingCell(null)
                              }}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  handleEdit(rowIdx, key, e.currentTarget.value)
                                  setEditingCell(null)
                                }
                                if (e.key === "Escape") {
                                  setEditingCell(null)
                                }
                              }}
                            />
                          ) : (
                            <>
                              <span className="flex-1">{String(row[key])}</span>
                              <Edit3 className="w-3 h-3 text-gray-500 opacity-0 group-hover:opacity-100" />
                            </>
                          )}
                          {error && (
                            <Badge variant="destructive" className="text-xs">
                              Error
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                    )
                  })}
                  <TableCell className="px-3 py-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteRow(rowIdx)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="p-4 border-t border-gray-700">
          <Button
            onClick={() => {
              const newRow = Object.fromEntries(headers.map((h) => [h, ""])) as T
              const updated = [...localData, newRow]
              setLocalData(updated)
              onChange?.(updated)
            }}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Row
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
