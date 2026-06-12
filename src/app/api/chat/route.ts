import { streamText } from "ai";
import { google } from "@ai-sdk/google";

// Allow Vercel Edge functions to run longer for streaming
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const result = streamText({
      model: google("gemini-1.5-flash"),
      messages,
      system: "You are an expert AI content creation assistant. Your goal is to help the user brainstorm, outline, draft, and refine high-quality content. Be concise, highly professional, and format your responses using Markdown.",
    });

    return result.toTextStreamResponse();
    
  } catch (error) {
    console.error("Chat API Error:", error);
    return new Response("An error occurred during chat generation.", { status: 500 });
  }
}