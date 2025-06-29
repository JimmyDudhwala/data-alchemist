"use client"

import { useEffect, useState } from "react";
import DataTable from "@/components/DataGrid";
import ExportButton from "@/components/ExportButton";
import FileUploader from "@/components/FileUploader";
import LLMSearchBar from "@/components/LLMSearchBar";
import { ClientData, TaskData, useDataStore, WorkerData } from "@/store/useDataStore";
import { validateCrossFile } from "@/components/errors/crossValidators";
import NLModifyForm from "@/components/NLModifyForm";

// Define proper types for your data

export default function Home() {
  const clients = useDataStore((state) => state.clients);
  const setClients = useDataStore((state) => state.setClients);
  const tasks = useDataStore((store) => store.tasks);
  const setTasks = useDataStore((store) => store.setTasks);
  const workers = useDataStore((store) => store.workers);
  const setWorkers = useDataStore((store) => store.setWorkers);
  const setCrossFileErrors = useDataStore((s) => s.setCrossFileErrors);
  const crossFileErrors = useDataStore((s) => s.crossFileErrors);

  const [filteredClients, setFilteredClients] = useState<ClientData[]>(clients);
  const [filteredTasks, setFilteredTasks] = useState<TaskData[]>(tasks);
  const [filteredWorkers, setFilteredWorkers] = useState<WorkerData[]>(workers);

  useEffect(() => {
    if (clients.length && tasks.length && workers.length) {
      const errors = validateCrossFile(clients, tasks, workers);
      setCrossFileErrors(errors);
    }

    setFilteredClients(clients);
    setFilteredTasks(tasks);
    setFilteredWorkers(workers);
  }, [clients, tasks, workers, setCrossFileErrors]); // ✅ Fixed dependencies

  const handleParsed = (data: ClientData[] | TaskData[] | WorkerData[], name: string) => {
    if (name === "clients") setClients(data as ClientData[]);
    else if (name === "tasks") setTasks(data as TaskData[]);
    else if (name === "workers") setWorkers(data as WorkerData[]);
  };

  return (
    <div className="p-6 space-y-6">
      <FileUploader onDataParsed={handleParsed} />

      {clients.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-2">Clients</h2>
          <LLMSearchBar
            data={clients}
            tableType="clients"
            onFiltered={setFilteredClients}
          />
          <NLModifyForm tableType="clients" data={clients} />
          <button
            onClick={() => setFilteredClients(clients)}
            className="bg-green-200 text-black px-4 py-2 rounded hover:bg-green-700 mt-4"
          >
            Reset
          </button>
          <DataTable
            tableType="clients"
            data={filteredClients}
            onChange={setClients}
          />
          <ExportButton data={filteredClients} filename="clients_updated.csv" />
        </div>
      )}

      {tasks.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-2">Tasks</h2>
          <LLMSearchBar
            data={tasks}
            tableType="tasks"
            onFiltered={setFilteredTasks}
          />
           <NLModifyForm tableType="tasks" data={tasks} />
          <button
            onClick={() => setFilteredTasks(tasks)}
            className="bg-green-200 text-black px-4 py-2 rounded hover:bg-green-700 mt-4"
          >
            Reset
          </button>
          <DataTable
            tableType="tasks"
            data={filteredTasks}
            onChange={setTasks}
          />
          <ExportButton data={filteredTasks} filename="tasks_updated.csv" />
        </div>
      )}

      {workers.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-2">Workers</h2>
          <LLMSearchBar
            data={workers}
            tableType="workers"
            onFiltered={setFilteredWorkers}
          />
           <NLModifyForm tableType="workers" data={workers} />
          <button
            onClick={() => setFilteredWorkers(workers)}
            className="bg-green-200 text-black px-4 py-2 rounded hover:bg-green-700 mt-4"
          >
            Reset
          </button>
          <DataTable
            tableType="workers"
            data={filteredWorkers}
            onChange={setWorkers}
          />
          <ExportButton data={filteredWorkers} filename="workers_updated.csv" />
        </div>
      )}

      {crossFileErrors.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-400 p-4 mt-4 rounded">
          <h2 className="text-lg font-semibold text-yellow-800 mb-2">
            ⚠️ Cross-File Validation Errors
          </h2>
          <ul className="list-disc list-inside text-sm text-yellow-900">
            {crossFileErrors.map((err, idx) => (
              <li key={idx}>
                <strong>{err.file}</strong>{" "}
                {err.rowIndex >= 0 ? `(Row ${err.rowIndex + 1})` : ""}:{" "}
                {err.message}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}