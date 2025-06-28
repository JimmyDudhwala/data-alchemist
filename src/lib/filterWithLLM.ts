import { ClientData, TaskData, WorkerData } from "@/store/useDataStore";

export async function generateFilterFunction({
    query,
    tableType,
    sampleRow,
  }: {
    query: string;
    tableType: "clients" | "tasks" | "workers";
    sampleRow: ClientData | TaskData | WorkerData;
  }): Promise<(row: unknown) => boolean> {
    const res = await fetch("/api/filter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, tableType, sampleRow }),
    });
  
    const json = await res.json();
    console.log("🔍 LLM Returned JS Code:", json.code);
  
    if (!json.code) {
      console.warn("No code returned from LLM:", json);
      return () => true;
    }
  
    try {
      const fn = eval(json.code); // ✅ Safely evaluates the arrow function
      if (typeof fn !== "function") throw new Error("LLM did not return a function");
      return fn;
    } catch (e) {
      console.error("Failed to eval filter:", json.code, e);
      return () => true;
    }
  }
  