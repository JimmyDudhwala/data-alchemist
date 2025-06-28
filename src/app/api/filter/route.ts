// // src/app/api/filter/route.ts

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { query, tableType, sampleRow } = await req.json();

  const prompt = `
  You are a coding assistant. The user uploaded a CSV table for "${tableType}".
  
  Here is an example row:
  ${JSON.stringify(sampleRow, null, 2)}
  
  The user wants to filter rows using this request:
  "${query}"
  
  Return only a valid JavaScript function like:
  (row) => row.PriorityLevel === 5
  
  Do not explain. Do not include comments. Do not wrap in code blocks.
  Just return the JavaScript expression.
  `;
  

  try {
    const res = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key="+process.env.NEXT_PUBLIC_OPENAI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const result = await res.json();

    // Extract text from Gemini response
    const text =
  result?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
  result?.candidates?.[0]?.content?.text?.trim() || "";

if (!text) {
  console.warn("❌ Gemini returned empty text!", result);
  return NextResponse.json({ code: "row => true" });
}


    // Cleanup: strip code block wrappers like ```js ... ```
    const clean = text.replace(/```(js)?/g, "").trim();

    return NextResponse.json({ code: clean });
  } catch (err) {
    console.error("Gemini API Error", err);
    return NextResponse.json({ error: "Gemini request failed" }, { status: 500 });
  }
}
