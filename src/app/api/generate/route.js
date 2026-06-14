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
      contents: prompt,
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