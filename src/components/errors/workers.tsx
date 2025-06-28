import { ValidationError } from "@/store/useDataStore";


export function validateWorkerRow(row: any, rowIdx: number, seenWorkerIDs: Set<string>): ValidationError[] {
  const errors: ValidationError[] = [];

  // a. Parse AvailableSlots
  let slots: any[] = [];
  try {
    slots = JSON.parse(row.AvailableSlots);
    if (!Array.isArray(slots)) throw new Error();
  } catch {
    errors.push({ file: "workers", rowIndex: rowIdx, column: "AvailableSlots", message: "AvailableSlots must be a valid JSON array" });
  }

  // b. MaxLoadPerPhase > 0
  const maxLoad = Number(row.MaxLoadPerPhase);
  if (isNaN(maxLoad) || maxLoad <= 0) {
    errors.push({ file: "workers", rowIndex: rowIdx, column: "MaxLoadPerPhase", message: "MaxLoadPerPhase must be a positive number" });
  }

  // c. AvailableSlots must be all numeric (if parsed correctly)
  if (Array.isArray(slots)) {
    for (const slot of slots) {
      if (isNaN(Number(slot))) {
        errors.push({ file: "workers", rowIndex: rowIdx, column: "AvailableSlots", message: `Non-numeric value in AvailableSlots: ${slot}` });
        break;
      }
    }
  }

  // d. Duplicate WorkerID
  const id = row.WorkerID;
  if (seenWorkerIDs.has(id)) {
    errors.push({ file: "workers", rowIndex: rowIdx, column: "WorkerID", message: `Duplicate WorkerID: ${id}` });
  } else {
    seenWorkerIDs.add(id);
  }

  return errors;
}
