import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(request) {
  try {
    const body = await request.json();
    const { prompt } = body;
console.log(
  "API Key Loaded:",
  process.env.GEMINI_API_KEY
    ? process.env.GEMINI_API_KEY.slice(0, 10)
    : "NO KEY"
);
    const response = await ai.models.generateContent({
  model: "gemini-2.5-flash",
  contents: `
User Request:
${prompt}

Instructions:
- Generate a professional response.
- Keep response between 300 and 800 words.
- Use clean plain text.
- Do NOT use markdown.
- Do NOT use ## headings.
- Do NOT use ### headings.
- Do NOT use ** bold formatting.
- Do NOT use * markdown bullet points.
- Do NOT use backticks.
- Use normal numbering like 1. 2. 3.
- Use proper paragraphs and spacing.
- Avoid unnecessary repetition.
`,
});

    return NextResponse.json({
      result: response.text,
    });
 } catch (error) {
  console.error("Gemini Error:", error);
  console.log("Using Gemini Key:", process.env.GEMINI_API_KEY?.slice(0, 10));

  return NextResponse.json(
    {
      error: error?.message || "Unknown Gemini Error",
    },
    { status: 500 }
  );
}
}