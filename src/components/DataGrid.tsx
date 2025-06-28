import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

import { useDataStore, ValidationError } from "@/store/useDataStore";
import { validateClientRow } from "./errors/client";
import { validateTaskRow } from "./errors/tasks";
import { validateWorkerRow } from "./errors/workers";

interface DataTableProps {
  data: any[];
  tableType: "clients" | "tasks" | "workers";
  onChange?: (data: any[]) => void;
}

export default function DataTable({ data, tableType, onChange }: DataTableProps) {
  const [localData, setLocalData] = useState<any[]>(data);

  const setClientErrors = useDataStore((s) => s.setClientErrors);
  const setTaskErrors = useDataStore((s) => s.setTaskErrors);
  const setWorkErrors = useDataStore((s) => s.setWorkErrors);

  const clientsErrors = useDataStore((s) => s.clientsErrors);
  const tasksErrors = useDataStore((s) => s.tasksErrors);
  const workersErrors = useDataStore((s) => s.workersErrors);
  const tasks = useDataStore((s) => s.tasks);

  const headers = Object.keys(localData[0] || {});

  const handleEdit = (rowIdx: number, key: string, value: string) => {
    const updated = [...localData];
    updated[rowIdx][key] = value;
    setLocalData(updated);
    onChange?.(updated);

    let newErrors: ValidationError[] = [];

    if (tableType === "clients") {
      const allTaskIDs = new Set(tasks.map(t => t.TaskID));
      const seenClientIDs = new Set<string>(); // for one row
      newErrors = validateClientRow(updated[rowIdx], rowIdx, allTaskIDs, seenClientIDs);
    } else if (tableType === "tasks") {
      const seenTaskIDs = new Set<string>(); // optional enhancement
      newErrors = validateTaskRow(updated[rowIdx], rowIdx, seenTaskIDs);
    } else if (tableType === "workers") {
      const seenWorkerIDs = new Set<string>(); // optional enhancement
      newErrors = validateWorkerRow(updated[rowIdx], rowIdx, seenWorkerIDs);
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
  };

  const getCellError = (rowIdx: number, column: string): string | null => {
    let currentErrors: ValidationError[] = [];
    if (tableType === "clients") currentErrors = clientsErrors;
    if (tableType === "tasks") currentErrors = tasksErrors;
    if (tableType === "workers") currentErrors = workersErrors;

    const err = currentErrors.find(
      (e) => Number(e.rowIndex) === Number(rowIdx) && e.column === column
    );
    return err?.message || null;
  };

  const handleDeleteRow = (rowIdx: number) => {
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
  };
  

  useEffect(() => {
    setLocalData(data);

    if (tableType === "clients") {
      const allTaskIDs = new Set(tasks.map(t => t.TaskID));
      const seenClientIDs = new Set<string>();
      const allErrors = data.flatMap((row, idx) =>
        validateClientRow(row, idx, allTaskIDs, seenClientIDs)
      );
      setClientErrors(allErrors);
    }

    if (tableType === "tasks") {
      const seenTaskIDs = new Set<string>();
      const allErrors = data.flatMap((row, idx) =>
        validateTaskRow(row, idx, seenTaskIDs)
      );
      setTaskErrors(allErrors);
    }

    if (tableType === "workers") {
      const seenWorkerIDs = new Set<string>();
      const allErrors = data.flatMap((row, idx) =>
        validateWorkerRow(row, idx, seenWorkerIDs)
      );
      setWorkErrors(allErrors);
    }
  }, [data, tasks]); // ⬅️ tasks dependency here ensures revalidation when tasks load

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {headers.map((key) => (
            <TableHead key={key}>{key}</TableHead>
          ))}
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
  );
}
