import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(request) {
  try {
    const body = await request.json();
    const { prompt } = body;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return NextResponse.json({
      result: response.text,
    });
  } catch (error) {
    console.error("Gemini Error:", error);

    return NextResponse.json(
      { error: "Failed to generate content" },
      { status: 500 }
    );
  }
}