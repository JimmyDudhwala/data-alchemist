// store/useDataStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ValidationError = {
  file: string;
  rowIndex: number;
  column?: string;
  message: string;
};

type DataState = {
  clients: any[];
  tasks: any[];
  workers: any[];
  setClients: (data: any[]) => void;
  setTasks: (data: any[]) => void;
  setWorkers: (data: any[]) => void;

  // error handling
  clientsErrors: ValidationError[];
  setClientErrors: (errors: ValidationError[]) => void;
  tasksErrors: ValidationError[];
  setTaskErrors: (errors: ValidationError[]) => void;
  workersErrors: ValidationError[];
  setWorkErrors: (errors: ValidationError[]) => void;
  crossFileErrors: ValidationError[];
  setCrossFileErrors: (errors: ValidationError[]) => void;
};

export const useDataStore = create<DataState>()(
  persist(
    (set) => ({
      clients: [],
      tasks: [],
      workers: [],
      setClients: (data) => set({ clients: data }),
      setTasks: (data) => set({ tasks: data }),
      setWorkers: (data) => set({ workers: data }),

      clientsErrors: [],
      setClientErrors: (errors) => set({ clientsErrors: errors }),
      tasksErrors: [],
      setTaskErrors: (errors) => set({ tasksErrors: errors }),
      workersErrors: [],
      setWorkErrors: (errors) => set({ workersErrors: errors }),

      crossFileErrors: [],
      setCrossFileErrors: (errors) => set({ crossFileErrors: errors }),
    }),
    {
      name: "csv-data-store", // ⚠️ unique localStorage key
      partialize: (state) => ({
        clients: state.clients,
        tasks: state.tasks,
        workers: state.workers,
      }),
    }
  )
);
