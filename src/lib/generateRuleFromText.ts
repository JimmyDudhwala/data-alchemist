import { ClientData, TaskData, WorkerData } from "@/store/useDataStore";
import { Rule } from "@/store/useRuleStore";

export async function generateRuleFromText(
  description: string,
  context: { clients: ClientData[]; tasks: TaskData[]; workers: WorkerData[] }
): Promise<Rule | null> {
  const res = await fetch("/api/generate-rule", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ description, context }),
  });

  const json = await res.json();
  if (json.rule && json.rule.type) {
    return json.rule as Rule;
  }
  
  return null;
}