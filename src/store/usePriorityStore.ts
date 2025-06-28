import { create } from "zustand";

export type PrioritySettings = {
    priorityLevel: number;
    taskFulfillment: number;
    fairness: number;
  };
  
  export const usePriorityStore = create<{
    priorities: PrioritySettings;
    setPriority: (key: keyof PrioritySettings, value: number) => void;
  }>((set) => ({
    priorities: {
      priorityLevel: 5,
      taskFulfillment: 5,
      fairness: 5,
    },
    setPriority: (key, value) =>
      set((state) => ({
        priorities: { ...state.priorities, [key]: value },
      })),
  }));
  