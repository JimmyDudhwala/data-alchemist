import { useEffect, useState, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

import { ClientData, DataRow, TaskData, useDataStore, ValidationError, WorkerData } from "@/store/useDataStore";
import { validateClientRow } from "./errors/client";
import { validateTaskRow } from "./errors/tasks";
import { validateWorkerRow } from "./errors/workers";

// Define proper types for your data

interface DataTableProps<T extends DataRow & Record<string, unknown>> {
  data: T[];
  tableType: "clients" | "tasks" | "workers";
  onChange?: (data: T[]) => void;
}

export default function DataTable<T extends DataRow>({
  data,
  tableType,
  onChange,
}: DataTableProps<T>) {
  const [localData, setLocalData] = useState<T[]>(data);

  const setClientErrors = useDataStore((s) => s.setClientErrors);
  const setTaskErrors = useDataStore((s) => s.setTaskErrors);
  const setWorkErrors = useDataStore((s) => s.setWorkErrors);

  const clientsErrors = useDataStore((s) => s.clientsErrors);
  const tasksErrors = useDataStore((s) => s.tasksErrors);
  const workersErrors = useDataStore((s) => s.workersErrors);
  const tasks = useDataStore((s) => s.tasks);

  const headers = Object.keys(localData[0] || {});

  const handleEdit = useCallback((rowIdx: number, key: string, value: string) => {
    const updated = [...localData];
    (updated[rowIdx] as Record<string, unknown>)[key] = value;
    setLocalData(updated);
    onChange?.(updated);

    let newErrors: ValidationError[] = [];

    if (tableType === "clients") {
      const allTaskIDs = new Set(tasks.map(t => String(t.TaskID)));
      const seenClientIDs = new Set<string>(); // for one row
      if (tableType === "clients") {
        newErrors = validateClientRow(updated[rowIdx] as unknown as ClientData, rowIdx, allTaskIDs, seenClientIDs);
      }
    } else if (tableType === "tasks") {
      const seenTaskIDs = new Set<string>(); // optional enhancement
      newErrors = validateTaskRow(updated[rowIdx] as unknown as TaskData, rowIdx, seenTaskIDs);
    } else if (tableType === "workers") {
      const seenWorkerIDs = new Set<string>(); // optional enhancement
      newErrors = validateWorkerRow(updated[rowIdx] as unknown as WorkerData, rowIdx, seenWorkerIDs);
    }

    let existingErrors: ValidationError[] = [];
    if (tableType === "clients") existingErrors = clientsErrors;
    if (tableType === "tasks") existingErrors = tasksErrors;
    if (tableType === "workers") existingErrors = workersErrors;

    const filteredErrors = existingErrors.filter(
      (e) => e.rowIndex !== rowIdx
    );

    if (tableType === "clients") setClientErrors([...filteredErrors, ...newErrors]);
    if (tableType === "tasks") setTaskErrors([...filteredErrors, ...newErrors]);
    if (tableType === "workers") setWorkErrors([...filteredErrors, ...newErrors]);
  }, [localData, onChange, tableType, tasks, clientsErrors, tasksErrors, workersErrors, setClientErrors, setTaskErrors, setWorkErrors]);

  const getCellError = useCallback((rowIdx: number, column: string): string | null => {
    let currentErrors: ValidationError[] = [];
    if (tableType === "clients") currentErrors = clientsErrors;
    if (tableType === "tasks") currentErrors = tasksErrors;
    if (tableType === "workers") currentErrors = workersErrors;

    const err = currentErrors.find(
      (e) => Number(e.rowIndex) === Number(rowIdx) && e.column === column
    );
    return err?.message || null;
  }, [tableType, clientsErrors, tasksErrors, workersErrors]);

  const handleDeleteRow = useCallback((rowIdx: number) => {
    const updated = localData.filter((_, idx) => idx !== rowIdx);
    setLocalData(updated);
    onChange?.(updated); // 🔁 Send updated data back to parent
  
    // Also clean up errors for this row
    let currentErrors: ValidationError[] = [];
    if (tableType === "clients") currentErrors = clientsErrors;
    if (tableType === "tasks") currentErrors = tasksErrors;
    if (tableType === "workers") currentErrors = workersErrors;
  
    const filteredErrors = currentErrors.filter((e) => e.rowIndex !== rowIdx);
  
    if (tableType === "clients") setClientErrors(filteredErrors);
    if (tableType === "tasks") setTaskErrors(filteredErrors);
    if (tableType === "workers") setWorkErrors(filteredErrors);
  }, [localData, onChange, tableType, clientsErrors, tasksErrors, workersErrors, setClientErrors, setTaskErrors, setWorkErrors]);

  useEffect(() => {
    setLocalData(data);

    if (tableType === "clients") {
      const allTaskIDs = new Set(tasks.map(t => String(t.TaskID)));
      const seenClientIDs = new Set<string>();
      const allErrors = data.flatMap((row, idx) =>
        validateClientRow(row as unknown as ClientData, idx, allTaskIDs, seenClientIDs)
      );
      setClientErrors(allErrors);
    }

    if (tableType === "tasks") {
      const seenTaskIDs = new Set<string>();
      const allErrors = data.flatMap((row, idx) =>
        validateTaskRow(row as unknown as TaskData, idx, seenTaskIDs)
      );
      setTaskErrors(allErrors);
    }

    if (tableType === "workers") {
      const seenWorkerIDs = new Set<string>();
      const allErrors = data.flatMap((row, idx) =>
        validateWorkerRow(row as unknown as WorkerData, idx, seenWorkerIDs)
      );
      setWorkErrors(allErrors);
    }
  }, [data, tasks, tableType, setClientErrors, setTaskErrors, setWorkErrors]); // ✅ Fixed dependencies

  return (
    <>
  
    <Table>
      <TableHeader>
        <TableRow>
          {headers.map((key) => (
            <TableHead key={key}>{key}</TableHead>
          ))}
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {localData.map((row, rowIdx) => (
          <TableRow key={rowIdx}>
            {headers.map((key) => {
              const error = getCellError(rowIdx, key);
              return (
                <TableCell
                  key={key}
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) =>
                    handleEdit(rowIdx, key, e.currentTarget.textContent || "")
                  }
                  className={`px-2 py-1 border transition-colors duration-150 ${
                    error ? "border-red-500 bg-red-100" : "border-gray-200"
                  }`}
                  title={error || ""}
                >
                  {row[key]}
                </TableCell>
              );
            })}
            <TableCell>
              <button
                className="text-red-600 hover:underline text-sm"
                onClick={() => handleDeleteRow(rowIdx)}
              >
                Delete
              </button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      </Table>

<div className="mt-2">
  <button
    onClick={() => {
      const newRow = Object.fromEntries(
        headers.map((h) => [h, ""])
      ) as T;
      const updated = [...localData, newRow];
      setLocalData(updated);
      onChange?.(updated);
    }}
    className="text-blue-600 hover:underline text-sm"
  >
    ➕ Add Data
  </button>
</div>

</>
  );
}

