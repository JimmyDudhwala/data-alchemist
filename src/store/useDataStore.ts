// store/useDataStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ValidationError = {
  file: string;
  rowIndex: number;
  column?: string;
  message: string;
};

// Define proper types for your data
export type DataRow = Record<string, string | number>;
export type ClientData = {
  ClientID: string;
  RequestedTaskIDs: string;
  PriorityLevel: string | number;
  AttributesJSON: string;
  [key: string]: string | number;
};

export type TaskData = {
  TaskID: string;
  Duration: string | number;
  PreferredPhases: string;
  RequiredSkills: string;
  MaxConcurrent: string | number;
  AttributesJSON: string;
  [key: string]: string | number;
};

export type WorkerData = {
  WorkerID: string;
  Skills: string;
  AvailableSlots: string;
  MaxLoadPerPhase: string | number;
  [key: string]: string | number;
};


type DataState = {
  clients: ClientData[];
  tasks: TaskData[];
  workers: WorkerData[];
  setClients: (data: ClientData[]) => void;
  setTasks: (data: TaskData[]) => void;
  setWorkers: (data: WorkerData[]) => void;

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
      setClients: (data: ClientData[]) => set({ clients: data }),
      setTasks: (data: TaskData[]) => set({ tasks: data }),
      setWorkers: (data: WorkerData[]) => set({ workers: data }),

      clientsErrors: [],
      setClientErrors: (errors: ValidationError[]) => set({ clientsErrors: errors }),
      tasksErrors: [],
      setTaskErrors: (errors: ValidationError[]) => set({ tasksErrors: errors }),
      workersErrors: [],
      setWorkErrors: (errors: ValidationError[]) => set({ workersErrors: errors }),

      crossFileErrors: [],
      setCrossFileErrors: (errors: ValidationError[]) => set({ crossFileErrors: errors }),
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