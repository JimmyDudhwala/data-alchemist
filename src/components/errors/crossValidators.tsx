// lib/errors/crossValidators.ts

import { ClientData, TaskData, ValidationError, WorkerData } from "@/store/useDataStore";

// Define proper types for your data structures

export function validateCrossFile(
  clients: ClientData[], 
  tasks: TaskData[], 
  workers: WorkerData[]
): ValidationError[] {
  const errors: ValidationError[] = [];

  const taskIDs = new Set(tasks.map(t => t.TaskID));
  const workerSkills = new Set(workers.flatMap(w => (w.Skills || "").toString().split(",").map((s: string) => s.trim())));

  // 🔗 1. RequestedTaskIDs must exist in tasks
  for (const [i, client] of clients.entries()) {
    const requested = (client.RequestedTaskIDs || "").toString().split(",").map((id: string) => id.trim());
    for (const id of requested) {
      if (id && !taskIDs.has(id)) {
        errors.push({
          file: "clients",
          rowIndex: i,
          column: "RequestedTaskIDs",
          message: `Unknown TaskID referenced: ${id}`
        });
      }
    }
  }

  // 🧠 2. RequiredSkills must exist in worker pool
  for (const [i, task] of tasks.entries()) {
    const requiredSkills = (task.RequiredSkills || "").toString().split(",").map((s: string) => s.trim());
    for (const skill of requiredSkills) {
      if (skill && !workerSkills.has(skill)) {
        errors.push({
          file: "tasks",
          rowIndex: i,
          column: "RequiredSkills",
          message: `No worker has required skill: ${skill}`
        });
      }
    }
  }

  // 🧠 3. Overloaded workers
  for (const [i, worker] of workers.entries()) {
    try {
      const slots = JSON.parse(worker.AvailableSlots.toString());
      const maxLoad = Number(worker.MaxLoadPerPhase);
      if (Array.isArray(slots) && slots.length < maxLoad) {
        errors.push({
          file: "workers",
          rowIndex: i,
          column: "AvailableSlots",
          message: `AvailableSlots (${slots.length}) < MaxLoadPerPhase (${maxLoad})`
        });
      }
    } catch {
      // Skip malformed JSON — already caught in row validation
    }
  }

  // 🌀 4. Circular co-run detection (assume co-run via AttributesJSON → CoRunWith)
  const coRunGraph: Record<string, string[]> = {};
  for (const task of tasks) {
    try {
      const attr = JSON.parse(task.AttributesJSON?.toString() || "{}");
      const coRunWith = attr.CoRunWith || [];
      coRunGraph[task.TaskID] = coRunWith;
    } catch {
      // Skip malformed JSON
    }
  }

  const visited = new Set<string>();
  const inStack = new Set<string>();
  const hasCycle = (node: string): boolean => {
    if (!coRunGraph[node]) return false;
    if (inStack.has(node)) return true;
    if (visited.has(node)) return false;
    visited.add(node);
    inStack.add(node);
    for (const neighbor of coRunGraph[node]) {
      if (hasCycle(neighbor)) return true;
    }
    inStack.delete(node);
    return false;
  };

  for (const taskID of Object.keys(coRunGraph)) {
    visited.clear();
    inStack.clear();
    if (hasCycle(taskID)) {
      const rowIndex = tasks.findIndex(t => t.TaskID === taskID);
      errors.push({
        file: "tasks",
        rowIndex,
        column: "AttributesJSON",
        message: `Circular co-run detected starting at TaskID: ${taskID}`
      });
    }
  }

  // 📊 5. Phase-slot saturation
  const phaseDemand: Record<number, number> = {};
  for (const task of tasks) {
    const duration = Number(task.Duration);
    let phases: number[] = [];
    try {
      const preferredPhases = task.PreferredPhases.toString();
      if (/^\[.*\]$/.test(preferredPhases)) {
        phases = JSON.parse(preferredPhases);
      } else if (/^\d+-\d+$/.test(preferredPhases)) {
        const [start, end] = preferredPhases.split("-").map(Number);
        phases = Array.from({ length: end - start + 1 }, (_, i) => start + i);
      }
    } catch {
      // Skip malformed phases
    }
    for (const p of phases) {
      phaseDemand[p] = (phaseDemand[p] || 0) + duration;
    }
  }

  const phaseSupply: Record<number, number> = {};
  for (const worker of workers) {
    try {
      const slots = JSON.parse(worker.AvailableSlots.toString());
      for (const p of slots) {
        phaseSupply[p] = (phaseSupply[p] || 0) + 1;
      }
    } catch {
      // Skip malformed slots
    }
  }

  for (const phase of Object.keys(phaseDemand)) {
    const p = Number(phase);
    if ((phaseDemand[p] || 0) > (phaseSupply[p] || 0)) {
      errors.push({
        file: "tasks",
        rowIndex: -1,
        message: `Phase ${p} over-saturated: demand ${phaseDemand[p]} > supply ${phaseSupply[p] || 0}`
      });
    }
  }

  // 🚦 6. MaxConcurrent ≤ available qualified workers
  for (const [i, task] of tasks.entries()) {
    const requiredSkills = (task.RequiredSkills || "").toString().split(",").map((s: string) => s.trim());
    const qualified = workers.filter((w: WorkerData) => 
      requiredSkills.every((rs: string) => (w.Skills || "").toString().includes(rs))
    );
    const maxConcurrent = Number(task.MaxConcurrent);
    if (maxConcurrent > qualified.length) {
      errors.push({
        file: "tasks",
        rowIndex: i,
        column: "MaxConcurrent",
        message: `MaxConcurrent (${maxConcurrent}) > available qualified workers (${qualified.length})`
      });
    }
  }

  return errors;
}