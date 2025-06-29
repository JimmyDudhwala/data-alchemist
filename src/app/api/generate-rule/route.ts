import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { description, context } = await req.json();

  const prompt = `
  You are an assistant that converts natural language instructions into JSON rule objects for scheduling.
  
  Available rule types include:
  - coRun
  - slotRestriction
  - loadLimit
  - phaseWindow
  - patternMatch
  - precedenceOverride
  - TaskPriority
  
  Data context:
  Clients: ${JSON.stringify(context.clients.slice(0, 5))}
  Tasks: ${JSON.stringify(context.tasks.slice(0, 5))}
  Workers: ${JSON.stringify(context.workers.slice(0, 5))}
  
  Now convert this user instruction into a valid rule object:
  "${description}"
  
  Return ONLY a JSON object.
    
Here are some examples of valid outputs:

// CoRun Rule
{
  "type": "coRun",
  "tasks": ["T001", "T002"]
}

// SlotRestriction Rule
{
  "type": "slotRestriction",
  "groupType": "clients",
  "groupIDs": ["C001", "C002"],
  "minCommonSlots": 3
}

// LoadLimit Rule
{
  "type": "loadLimit",
  "groupIDs": ["W005"],
  "maxSlotsPerPhase": 2
}

// PhaseWindow Rule
{
  "type": "phaseWindow",
  "taskId": "T001",
  "allowedPhases": [1, 3, 5]
}

// PatternMatch Rule
{
  "type": "patternMatch",
  "regex": ".*urgent.*",
  "ruleTemplate": "highlight",
  "params": { "label": "Important" }
}

// PrecedenceOverride Rule
{
  "type": "precedenceOverride",
  "priorityList": ["T001", "T003", "T002"]
}

// TaskPriority Rule
{
  "type": "TaskPriority",
  "priorityList": ["T005", "T001", "T004"]
}

`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const result = await response.json();
    const raw =
      result?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";

    const cleaned = raw.replace(/```json|```/g, "").trim();

    const json = JSON.parse(cleaned);

    // 🛠 Fix common field inconsistencies
    if (json.type === "coRun" && json.taskIDs && !json.tasks) {
      json.tasks = json.taskIDs;
      delete json.taskIDs;
    }

    return NextResponse.json({ rule: json });
  } catch (err) {
    console.error("❌ Failed to parse rule:", err);
    return NextResponse.json({ rule: null }, { status: 200 });
  }
}
