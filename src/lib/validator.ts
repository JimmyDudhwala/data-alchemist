// lib/validator.ts

import { ClientData, ValidationError } from "@/store/useDataStore";

  
  // Example validation function
  export function validateClients(clients: ClientData[], taskIds: string[]): ValidationError[] {
    const errors: ValidationError[] = [];
  
    clients.forEach((client, idx) => {
      // PriorityLevel check
      const priority = Number(client.PriorityLevel);
      if (isNaN(priority) || priority < 1 || priority > 5) {
        errors.push({
          file: "clients",
          rowIndex: idx,
          column: "PriorityLevel",
          message: `Invalid PriorityLevel (${priority})`,
        });
      }
  
      // Requested tasks check
      const requested = client.RequestedTaskIDs.split(",");
      requested.forEach((taskId:string) => {
        if (!taskIds.includes(taskId.trim())) {
          errors.push({
            file: "clients",
            rowIndex: idx,
            column: "RequestedTaskIDs",
            message: `Task ID ${taskId} not found in tasks.csv`,
          });
        }
      });
  
      // JSON check
      try {
        JSON.parse(client.AttributesJSON);
      } catch {
        errors.push({
          file: "clients",
          rowIndex: idx,
          column: "AttributesJSON",
          message: "Malformed JSON",
        });
      }
    });
  
    return errors;
  }
  