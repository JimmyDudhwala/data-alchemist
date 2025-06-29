// ✅ BACKEND: /api/modify-data/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { description, data, tableType: _tableType } = await req.json();

  const prompt = `
  You are a data transformation assistant. Based on the natural language instruction below, return a JSON patch object.
  
  The patch MUST include:
  - A "modification" array to update rows, OR
  - A "deletion" array to remove rows
  
  Each item must include:
  ✅ "where": keys may include expression-like strings such as:
  - "Skills.length >": 2
  - "PriorityLevel >": 3
  - "GroupTag == ": "A"
  
  ✅ "set": key-value pairs to change
  
  Only return the JSON patch. DO NOT explain.
  
  Instruction:
  "${description}"
  
  Data Type: ${_tableType}
  
  Data Sample:
  ${JSON.stringify(data.slice(0, 3), null, 2)}
  
  Format:
  {
    "modification": [
      { "where": { "AvailableSlots.length >": 3 }, "set": { "WorkGroup": "Z" } }
    ],
    "deletion": [
      { "where": { "GroupTag == ": "B" } }
    ]
  }
  `;

  const response = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    }
  );

  const result = await response.json();
  let raw = result?.candidates?.[0]?.content?.parts?.[0]?.text || "";
  raw = raw.trim()
    .replace(/^```json/, "")
    .replace(/^```/, "")
    .replace(/```$/, "")
    .trim();

  try {
    const json = JSON.parse(raw);
    return NextResponse.json({ patch: json });
  } catch (err) {
    console.error("❌ Failed to parse patch:", raw, "\nError:", err);
    return NextResponse.json({ patch: null });
  }
}
