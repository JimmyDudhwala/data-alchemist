import { TaskData, ValidationError } from "@/store/useDataStore";


export function validateTaskRow(row: TaskData, rowIdx: number, seenTaskIDs: Set<string>): ValidationError[] {
  const errors: ValidationError[] = [];

  // a. Duration ≥ 1
  const duration = Number(row.Duration);
  if (isNaN(duration) || duration < 1) {
    errors.push({ file: "tasks", rowIndex: rowIdx, column: "Duration", message: "Duration must be at least 1" });
  }

  // b. PreferredPhases must be valid list or range (e.g., "1-3" or "[1,2,3]")
  const preferred = row.PreferredPhases || "";
  const isValidRange = /^\d+-\d+$/.test(preferred);
  const isValidArray = /^\[.*\]$/.test(preferred);
  if (!isValidRange && !isValidArray) {
    errors.push({ file: "tasks", rowIndex: rowIdx, column: "PreferredPhases", message: "PreferredPhases must be a range (1-3) or array [1,2,3]" });
  }

  // c. Skill tag format
  if (!row.RequiredSkills || typeof row.RequiredSkills !== "string") {
    errors.push({ file: "tasks", rowIndex: rowIdx, column: "RequiredSkills", message: "RequiredSkills must be a comma-separated string" });
  }

  // d. Duplicate TaskID
  const id = row.TaskID;
  if (seenTaskIDs.has(id)) {
    errors.push({ file: "tasks", rowIndex: rowIdx, column: "TaskID", message: `Duplicate TaskID: ${id}` });
  } else {
    seenTaskIDs.add(id);
  }

  if (typeof row.PreferredPhases === "string") {
    const val = row.PreferredPhases.trim();
  
    // Check for redundant range like "4-4"
    const singleRangeMatch = val.match(/^(\d+)-\1$/);
    if (singleRangeMatch) {
      errors.push({
        file: "tasks",
        rowIndex:rowIdx,
        column: "PreferredPhases",
        message: `Redundant single-value range "${val}". Use [${val.split("-")[0]}] instead.`,
      });
    }
  
    // Ensure it's a valid list OR valid range
    const isValid = /^\[.*\]$/.test(val) || /^\d+-\d+$/.test(val);
    if (!isValid) {
      errors.push({
        file: "tasks",
        rowIndex:rowIdx,
        column: "PreferredPhases",
        message: `PreferredPhases must be a list [1,2] or range 1-3.`,
      });
    }
  }
  
  
  

  return errors;
}
