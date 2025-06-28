export async function generateRuleFromText(
    description: string,
    context: { clients: any[]; tasks: any[]; workers: any[] }
  ): Promise<any | null> {
    const res = await fetch("/api/generate-rule", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description, context }),
    });
  
    const json = await res.json();
    if (json.rule && json.rule.type) {
      return json.rule;
    }
    
    return null;
  }
  