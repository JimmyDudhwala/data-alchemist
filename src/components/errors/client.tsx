// lib/errors/clients.ts

import { ClientData, ValidationError } from "@/store/useDataStore";


export function validateClientRow(row: ClientData, rowIdx: number, allTaskIDs: Set<string>, seenClientIDs: Set<string>): ValidationError[] {
  const errors: ValidationError[] = [];

  // a. PriorityLevel (1–5)
  const level = Number(row.PriorityLevel);
  if (isNaN(level) || level < 1 || level > 5) {
    errors.push({ file: "clients", rowIndex: rowIdx, column: "PriorityLevel", message: "PriorityLevel must be between 1–5" });
  }

  // b. AttributesJSON
  try {
    JSON.parse(row.AttributesJSON);
  } catch {
    errors.push({ file: "clients", rowIndex: rowIdx, column: "AttributesJSON", message: "Malformed JSON" });
  }

  // c. RequestedTaskIDs must exist in tasks
  const requested = (row.RequestedTaskIDs || "").split(",").map((id: string) => id.trim());
  for (const taskID of requested) {
    if (taskID && !allTaskIDs.has(taskID)) {
      errors.push({ file: "clients", rowIndex: rowIdx, column: "RequestedTaskIDs", message: `Unknown TaskID: ${taskID}` });
    }
  }

  // d. Duplicate ClientID
  const id = row.ClientID;
  if (seenClientIDs.has(id)) {
    errors.push({ file: "clients", rowIndex: rowIdx, column: "ClientID", message: `Duplicate ClientID: ${id}` });
  } else {
    seenClientIDs.add(id);
  }

  return errors;
}
